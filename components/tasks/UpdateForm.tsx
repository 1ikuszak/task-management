'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import * as dateFns from 'date-fns'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'
import { Task } from '@/app/data/schema'
import { project_members } from '@/app/data/data'
import { updateTask } from '@/app/tasks/actions'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '../Icons'
import Link from 'next/link'
import { Switch } from '../ui/switch'

const taskFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  notes: z.string().max(1000, {
    message: 'notes must not be longer than 160 characters.',
  }),
  deadline: z.date(),
  member: z.string({
    required_error: 'Please select a member.',
  }),
  blocked: z.boolean(),
  blocking_task: z.string().nullable(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFromProps {
  task_id: string
  project_id: string
  data: Task[]
}

export function TaskUpdateForm({ data, task_id, project_id }: TaskFromProps) {
  const [isPending, startTransition] = useTransition()
  const taskToUpdate = data.find((task) => task.id === task_id)
  const remainingTasks = data.filter((task) => task.id !== task_id)

  const defaultValues: Partial<TaskFormValues> = {
    name: taskToUpdate?.title,
    notes: taskToUpdate?.notes,
    deadline: taskToUpdate?.deadline
      ? new Date(taskToUpdate.deadline)
      : new Date(),
    member: taskToUpdate?.project_member,
    blocked: taskToUpdate?.blocked,
    blocking_task: taskToUpdate?.blocking_task,
  }

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  })

  function onSubmit(data: TaskFormValues) {
    startTransition(async () => {
      const taskData: Task = {
        id: task_id,
        title: data.name,
        project_member: data.member,
        notes: data.notes,
        deadline: data.deadline,
        blocked: data.blocked,
        project_id: project_id,
      }
      const result = await updateTask(taskData)
      const { error } = JSON.parse(result)

      if (error?.message) {
        toast.error(error.message)
      } else {
        const currentDateTime = new Date().toLocaleString()
        toast.info('task updated', {
          description: `${currentDateTime}`,
        }),
          redirect(`/tasks/${project_id}`)
      }
    })
  }

  const blockedStatus = form.watch('blocked')

  useEffect(() => {
    if (!blockedStatus) {
      form.setValue('blocking_task', null)
    }
  }, [blockedStatus, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[440px]"
                      placeholder="Your new task name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>end date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[200px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              dateFns.format(field.value, 'PPP')
                            ) : (
                              <span>Pick end date</span>
                            )}
                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(date || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="member"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Member</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? project_members.find(
                                (member) => member.value === field.value
                              )?.label
                            : 'Select member'}
                          <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search for members..." />
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                          {project_members.map((member) => (
                            <CommandItem
                              value={member.label}
                              key={member.value}
                              onSelect={() => {
                                form.setValue('member', member.value)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  member.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {member.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blocked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-[440px]">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Blocking</FormLabel>
                    <FormDescription>
                      set whether task is being blocked
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blocking_task"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Blocking task</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={!blockedStatus} // Disable this button based on blockedStatus
                        >
                          {field.value
                            ? remainingTasks.find(
                                (task) => task.id === field.value
                              )?.title
                            : 'Select blocking task'}
                          <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search for tasks..." />
                        <CommandEmpty>No task found.</CommandEmpty>
                        <CommandGroup>
                          {remainingTasks.map((task) => (
                            <CommandItem
                              value={task.title}
                              key={task.id}
                              onSelect={() => {
                                form.setValue('blocking_task', task.id)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  task.id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {task.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none h-[426px] w-full" // Adjusted height and width
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end w-full gap-2">
          <Button asChild variant="secondary" size="sm" className="gap-2">
            <Link href={`/tasks/${project_id}`}>
              <Icons.xCircleIcon className="w-4" />
              Cancel
            </Link>
          </Button>
          <Button type="submit" size="sm" className="flex gap-2">
            Update Task
            <AiOutlineLoading3Quarters
              className={cn('animate-spin', { hidden: !isPending })}
            />
          </Button>
        </div>
      </form>
    </Form>
  )
}
