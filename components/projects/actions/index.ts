'use server'

import { Milestone } from '@/app/data/schema'
import createSupabaseClient from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

export async function createProject(
  name: string,
  notes: string,
  start_date: Date,
  end_date: Date,
  color: string
) {
  const supabase = await createSupabaseClient()
  const result = await supabase
    .from('projects')
    .insert({ name, notes, start_date, end_date, color })
    .select()
    .single()
  revalidatePath('/projects')
  return JSON.stringify(result)
}

export async function createProjectMilestonesBulk(milestones: Milestone[]) {
  const supabase = await createSupabaseClient()
  const result = await supabase.from('milestones').insert(milestones)

  revalidatePath('/projects')
  console.log(result)
  return JSON.stringify(result)
}

export async function readProjects() {
  noStore()
  const supabase = await createSupabaseClient()
  return await supabase.from('projects').select('*')
}

export async function deleteProjectById(id: string) {
  const supabase = await createSupabaseClient()

  try {
    // Execute both delete operations concurrently
    const [tasksResult, projectsResult] = await Promise.all([
      supabase.from('tasks').delete().eq('project_id', id),
      supabase.from('projects').delete().eq('id', id),
    ])

    // Revalidate the path
    revalidatePath('/projects')

    // Combine the results into one object and return as a JSON string
    return JSON.stringify({ tasksResult, projectsResult })
  } catch (error) {
    // Handle any errors that occur during the delete operations
    console.error('Error deleting project data:', error)
    throw error // rethrow the error if you want to handle it further up the call stack
  }
}

export async function updateProjectById(id: string, completed: boolean) {
  const supabase = await createSupabaseClient()
  await supabase.from('tasks').update({ completed }).eq('id', id)
  revalidatePath('/tasks')
}
