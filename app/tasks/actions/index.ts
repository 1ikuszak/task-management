'use server'

import createSupabaseClient from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { Task } from '@/app/data/schema'
import { json } from 'stream/consumers'

export async function findIndexByTaskId(taskId: string, tasks: Task[]) {
  return tasks.findIndex((task) => task.id === taskId)
}

export async function fetchTasksForProject(
  project_id: string
): Promise<Task[]> {
  const supabase = await createSupabaseClient()

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', project_id)
    .order('index', { ascending: true })

  if (error) {
    throw new Error('Error fetching tasks: ' + error.message)
  }

  return tasks || []
}

export async function getUniqueGroupIdsCount(project_id: string) {
  const supabase = await createSupabaseClient()

  const { count, error } = await supabase
    .from('distinct_group_id_per_project')
    .select('*', { count: 'exact' })
    .eq('project_id', project_id)

  if (error) {
    console.error('Error counting unique group ids:', error)
    return
  }
  return count
}

export async function createTask(
  title: string,
  project_id: string,
  start_date: Date,
  end_date: Date,
  project_member: string,
  notes: string,
  blocked: boolean,
  blocking_task: string | null
) {
  noStore()
  const supabase = await createSupabaseClient()
  let newIndex
  let newGroupId
  let tasksToUpdate: string | any[] = []

  if (blocking_task) {
    const allTasks = await fetchTasksForProject(project_id)
    const blockingIndex = await findIndexByTaskId(blocking_task, allTasks)
    newIndex = allTasks[blockingIndex].index + 1
    tasksToUpdate = allTasks.slice(blockingIndex + 1).map((task) => ({
      ...task,
      index: task.index + 1,
    }))

    const { data: blockingTaskData } = await supabase
      .from('tasks')
      .select('group_id')
      .eq('id', blocking_task)
      .single()

    if (blockingTaskData && typeof blockingTaskData.group_id === 'number') {
      newGroupId = blockingTaskData.group_id
    } else {
      const count = await getUniqueGroupIdsCount(project_id)

      await supabase
        .from('tasks')
        .update({ group_id: count })
        .eq('id', blocking_task)
        .single()

      newGroupId = count
    }
  } else {
    const { count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('project_id', project_id)

    newIndex = count === null ? 0 : count
  }

  const result = await supabase
    .from('tasks')
    .insert({
      title,
      project_id,
      start_date,
      end_date,
      project_member,
      notes,
      index: newIndex,
      blocked,
      blocking_task,
      group_id: newGroupId,
    })
    .single()

  if (tasksToUpdate.length > 0) {
    await updateTasksIndices(tasksToUpdate)
  }

  revalidatePath('/tasks/[projectId]/tree', 'page')
  return JSON.stringify(result)
}

async function updateTasksIndices(tasks: Task[]) {
  const supabase = await createSupabaseClient()
  await Promise.all(
    tasks.map((task) =>
      supabase.from('tasks').update({ index: task.index }).eq('id', task.id)
    )
  )
}

export async function readTasks(project_id: string) {
  const supabase = await createSupabaseClient()
  return supabase
    .from('tasks')
    .select('*')
    .eq('project_id', project_id)
    .order('index', { ascending: true })
}

export async function readTaskById(task_id: string) {
  const supabase = await createSupabaseClient()
  return supabase.from('tasks').select('*').eq('id', task_id)
}

export async function deleteTaskById(task_id: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').delete().eq('id', task_id)
  revalidatePath('/tasks/[projectId]', 'page')
  return JSON.stringify({ result })
}

export async function updateTaskById(
  id: string,
  project_id: string,
  title: string,
  start_date: Date,
  end_date: Date,
  project_member: string,
  notes: string,
  blocked: boolean,
  blocking_task: string | null
) {
  const supabase = await createSupabaseClient()
  const allTasks = await fetchTasksForProject(project_id)
  let tasksToUpdate: Task[] = []
  let newGroupId
  const currentIndex = allTasks.findIndex((task) => task.id === id)
  let newIndex

  if (blocking_task) {
    const blockingIndex = allTasks.findIndex(
      (task) => task.id === blocking_task
    )
    newIndex = currentIndex > blockingIndex ? blockingIndex + 1 : blockingIndex

    tasksToUpdate = allTasks
      .filter(
        (task) =>
          task.id !== id &&
          ((currentIndex > blockingIndex &&
            task.index > blockingIndex &&
            task.index < currentIndex) ||
            (currentIndex <= blockingIndex &&
              task.index <= blockingIndex &&
              task.index > currentIndex))
      )
      .map((task) => ({
        ...task,
        index: currentIndex > blockingIndex ? task.index + 1 : task.index - 1,
      }))

    const { data: blockingTaskData } = await supabase
      .from('tasks')
      .select('group_id')
      .eq('id', blocking_task)
      .single()

    if (blockingTaskData && typeof blockingTaskData.group_id === 'number') {
      newGroupId = blockingTaskData.group_id

      const { data: currentTaskData } = await supabase
        .from('tasks')
        .select('group_id')
        .eq('id', id)
        .single()

      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('project_id', project_id)
        .eq('group_id', currentTaskData?.group_id)

      // if the updated task changed blocking task and the previous blocking task is not blocking any tasks
      if (
        currentTaskData?.group_id !== blockingTaskData.group_id &&
        count === 2
      ) {
        // set blocking task group to null
        await supabase
          .from('tasks')
          .update({ group_id: null })
          .eq('group_id', currentTaskData?.group_id)
      }
    } else {
      const count = await getUniqueGroupIdsCount(project_id)

      // Update the blocking task with new group_id
      await supabase
        .from('tasks')
        .update({ group_id: count })
        .eq('id', blocking_task)
        .single()
      newGroupId = count
    }
  } else {
    const { data: currentTaskData } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (currentTaskData.blocked) {
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('project_id', project_id)
        .eq('group_id', currentTaskData?.group_id)

      if (count === 2) {
        await supabase
          .from('tasks')
          .update({ group_id: null })
          .eq('group_id', currentTaskData?.group_id)
      }

      newGroupId = null
    }
  }

  const result = await supabase
    .from('tasks')
    .update({
      title,
      start_date,
      end_date,
      project_member,
      notes,
      index: newIndex,
      blocked,
      blocking_task,
      group_id: newGroupId,
    })
    .eq('id', id)

  if (tasksToUpdate.length > 0) {
    await updateTasksIndices(tasksToUpdate)
  }

  revalidatePath('/tasks/[projectId]', 'page')
  return JSON.stringify({ result })
}

export async function updateTaskNotesById(id: string, notes: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase
    .from('tasks')
    .update({
      notes,
    })
    .eq('id', id)

  revalidatePath('/tasks/[projectId]', 'page')
  return JSON.stringify({ result })
}

export async function updateIndices(tasks: Task[]) {
  const supabase = await createSupabaseClient()
  await Promise.all(
    tasks.map((task, index) =>
      supabase.from('tasks').update({ index: index }).eq('id', task.id)
    )
  )
  // revalidatePath('/tasks/[projectId]', 'page')
}

export async function updateStatus(id: string, status: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase
    .from('tasks')
    .update({ status: status })
    .eq('id', id)

  return JSON.stringify({ result })
}
