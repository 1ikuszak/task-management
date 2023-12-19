import { z } from 'zod'

export const milestoneSchema = z.object({
  name: z.string(),
  deadline: z.date().optional(),
  index: z.number(),
  checked: z.boolean(),
  project_id: z.string(),
})

export type Milestone = z.infer<typeof milestoneSchema>
