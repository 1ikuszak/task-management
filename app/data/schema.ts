import { z } from 'zod'

export const milestoneSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  deadline: z.date().optional(),
  index: z.number(),
  checked: z.boolean(),
  project_id: z.string(),
})

export type Milestone = z.infer<typeof milestoneSchema>

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string(),
  color: z.union([
    z.literal('default'),
    z.literal('blue'),
    z.literal('rose'),
    z.literal('green'),
    z.literal('orange'),
    z.undefined(),
  ]),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
})

export type Project = z.infer<typeof projectSchema>

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  project_member: z.string(),
  notes: z.string(),
  deadline: z.string(),
  blocked: z.boolean(),
  project_id: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
