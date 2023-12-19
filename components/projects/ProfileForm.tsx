'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DemoTeamMembers } from './TeamMembers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'project name must be at least 2 characters.',
    })
    .max(30, {
      message: 'project name must not be longer than 30 characters.',
    }),
  notes: z.string().max(160).min(4),
  deadline: z.date(),
  milestones: z
    .array(
      z.object({
        value: z
          .string()
          .min(2, {
            message: 'milestone must be at least 2 characters.',
          })
          .max(30, {
            message: 'milestone must not be longer than 30 characters.',
          }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  milestones: [{ value: 'First milestone to achive' }],
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'milestones',
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast('project added')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-10">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="mark down some important information"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can make changes to notes after project creation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mielstones</CardTitle>
                <CardDescription>
                  Add milestones to make it easier to navigate{' '}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`milestones.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: '' })}
                >
                  Add Milestones
                </Button>
              </CardContent>
            </Card>
          </div>
          <div>
            <DemoTeamMembers />
          </div>
        </div>
        <Button type="submit">Create project</Button>
      </form>
    </Form>
  )
}
