'use server'

import createSupabaseClient from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { CreationTask, Task } from '@/app/data/schema'
import { string } from 'zod'

export async function readTasks(project_id: string) {
  noStore()
  const supabase = await createSupabaseClient()
  return await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', project_id)
    .order('index')
}

export async function createTask(task: CreationTask) {
  const supabase = await createSupabaseClient()

  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact' })
    .eq('project_id', task.project_id)

  const newIndex = count === null ? 0 : count
  const taskWithIndex = {
    ...task,
    index: newIndex,
  }
  const result = await supabase.from('tasks').insert(taskWithIndex).single()

  revalidatePath(`tasks/${task.project_id}`)
  return JSON.stringify(result)
}

export async function updateStatus(id: string, status: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').update({ status }).eq('id', id)
  return JSON.stringify(result)
}

export async function updateTask(task: Task) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').update(task).eq('id', task.id)

  console.log(task.deadline)
  revalidatePath(`/tasks/${task.project_id}`)
  return JSON.stringify(result)
}

export async function deleteTask(project_id: string, id: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').delete().eq('id', id)

  revalidatePath(`/tasks/${project_id}`)
  return JSON.stringify(result)
}

export async function updateNotes(id: string, notes: string) {
  const supabase = await createSupabaseClient()
  const result = await supabase
    .from('tasks')
    .update({
      notes,
    })
    .eq('id', id)

  revalidatePath('/tasks/[projectId]', 'page')
  return JSON.stringify(result)
}

export async function updateIndices(tasks: Task[]) {
  const supabase = await createSupabaseClient()
  const updates = tasks.map((task, index) => ({
    id: task.id,
    index: index,
  }))
  const result = await supabase.from('tasks').upsert(updates)
  return JSON.stringify(result)
}
