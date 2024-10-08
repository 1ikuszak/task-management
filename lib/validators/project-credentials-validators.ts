import { z } from 'zod'

export const ProjectCredentialsValidator = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  deadline: z.date({
    required_error: 'A date of deadline is required.',
  }),
})

export type TProjectCredentialsValidator = z.infer<
  typeof ProjectCredentialsValidator
>
