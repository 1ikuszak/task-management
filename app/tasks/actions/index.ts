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
    .order('created_at')
}

export async function createTask(task: CreationTask) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').insert(task).single()
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
