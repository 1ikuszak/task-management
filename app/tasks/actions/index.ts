'use server'

import createSupabaseClient from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { Task } from '@/app/data/schema'
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

export async function createTask(task: Task) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('tasks').insert(task).single()
  revalidatePath('tasks/[projectId]')
  return JSON.stringify(result)
}
