import { z } from 'zod'

export const milestoneSchema = z.object({
  name: z.string(),
  deadline: z.string(),
  status: z.boolean(),
})

export type Milestone = z.infer<typeof milestoneSchema>
