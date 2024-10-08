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
import { ProjectMembers } from './ProjectMembers'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { CalendarIcon } from '@radix-ui/react-icons'
import * as dateFns from 'date-fns'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Icons } from '../Icons'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useEffect } from 'react'
import { useTransition } from 'react'
import { Milestone, Project } from '@/app/data/schema'
import {
  UpdateMilestones,
  UpdateProject,
  createProjectMilestonesBulk,
  deleteMilestones,
} from '@/app/projects/actions'

const ProjectFormSchema = z.object({
  name: z.string().min(1).max(30),
  notes: z.string().max(160),
  start_date: z.date(),
  end_date: z.date(),
  custom_color: z.boolean(),
  color: z.enum(['default', 'rose', 'blue', 'green', 'orange']),
  milestones: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z
          .string()
          .min(1, {
            message: 'Milestone name must be at least 2 characters long.',
          })
          .max(48, {
            message: 'Milestone name must be no more than 30 characters long.',
          }),
        deadline: z.date().optional(),
        index: z.number(),
        checked: z.boolean(),
        project_id: z.string(),
      })
    )
    .optional(),
})

interface ProjectUpdateFormProps {
  project: Project
  milestones: Milestone[]
}

export function ProjectUpdateForm({
  project,
  milestones,
}: ProjectUpdateFormProps) {
  type ProjectFormValues = z.infer<typeof ProjectFormSchema>

  const defaultValues: Partial<ProjectFormValues> = {
    name: project.name,
    notes: project.notes,
    start_date: project?.start_date ? new Date(project.start_date) : new Date(),
    end_date: project?.end_date ? new Date(project.end_date) : new Date(),
    color: project?.color ? project.color : 'default',
    custom_color: project?.color && project.color !== 'default',
    milestones: milestones.map((milestone) => ({
      ...milestone,
      deadline: milestone.deadline ? new Date(milestone.deadline) : undefined,
    })),
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    name: 'milestones',
    control: form.control,
  })

  const customColor = form.watch('custom_color')
  useEffect(() => {
    if (!customColor) {
      form.setValue('color', 'default')
    }
  }, [customColor, form])

  const addMilestone = () => {
    append({
      name: '',
      deadline: new Date(),
      index: fields.length,
      checked: false,
      project_id: project.id,
    })
  }

  const [isLoading, setIsLoading] = useTransition()

  // update project info
  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(async () => {
      const updateProjectResult = await UpdateProject({
        id: project.id,
        name: data.name,
        notes: data.notes,
        start_date: data.start_date,
        end_date: data.end_date,
        color: data.color,
      })
      const { updateProjectError } = JSON.parse(updateProjectResult)
      if (updateProjectError) {
        toast.error(updateProjectError.message)
        return
      }

      // Handle milestones if they exist
      if (data.milestones) {
        // Step 2: Identify and update existing milestones
        const updatedMilestones = data.milestones.filter(
          (milestone) => milestone.id
        )
        if (updatedMilestones.length > 0) {
          const updateMilestoneResult =
            await UpdateMilestones(updatedMilestones)
          const { updateMilestoneError } = JSON.parse(updateMilestoneResult)

          if (updateMilestoneError) {
            toast.error(updateMilestoneError.message)
            return
          }
        }

        // Step 3: Identify and add new milestones
        const newMilestones = data.milestones.filter(
          (milestone) => !milestone.id
        )
        if (newMilestones.length > 0) {
          const createMilestoneResult = await createProjectMilestonesBulk(
            newMilestones.map((milestone) => ({
              ...milestone,
              project_id: project.id,
            }))
          )
          const { createMilestoneError } = JSON.parse(createMilestoneResult)
          if (createMilestoneError) {
            toast.error(createMilestoneError.message)
            return
          }
        }

        // Step 3: Identify and delete removed milestones
        const currentMilestones = data.milestones || []
        const deletedMilestoneIds = milestones
          .filter((m) => !currentMilestones.find((dm) => dm.id === m.id))
          .map((m) => m.id)
          .filter((id) => id !== undefined)

        if (deletedMilestoneIds.length > 0) {
          const deleteMilestoneResult = await deleteMilestones(
            deletedMilestoneIds as number[]
          )
          const { deleteMilestoneError } = JSON.parse(deleteMilestoneResult)
          if (deleteMilestoneError) {
            toast.error(deleteMilestoneError.message)
            return
          }
        }
      }

      toast('project updated successfully')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                </FormItem>
              )}
            />
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>start date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[236px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              dateFns.format(field.value, 'PPP')
                            ) : (
                              <span>Pick start date</span>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>end date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[236px] pl-3 text-left font-normal',
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
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="custom_color"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>
                      <span className="flex items-center">
                        <Icons.colors className="w-4 h-4 mr-2" /> Custom Colors
                      </span>
                    </FormLabel>
                    <FormDescription>
                      set custom color to make your project differ
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
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose custom color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      disabled={!customColor}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row items-center"
                    >
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            className="border-none text-slate-900 bg-slate-300"
                            value="default"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            className="border-none text-rose-600 bg-rose-300"
                            value="rose"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            className="text-blue-600 bg-blue-300 border-none "
                            value="blue"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            className="text-green-600 bg-green-300 border-none"
                            value="green"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            className="text-orange-600 bg-orange-300 border-none"
                            value="orange"
                          />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end w-full gap-2 pt-[68px]">
              <Button asChild variant="secondary" size="sm" className="gap-2">
                <Link href={`/projects`}>
                  <Icons.xCircleIcon className="w-4" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit" size="sm" className="flex gap-2">
                {isLoading && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                Update project
              </Button>
            </div>
          </div>
          <ScrollArea className="border-l h-[600px] col-span-3">
            <div className="px-8 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <span className="flex items-center gap-2">
                      <Icons.milestone />
                      Mielstones
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Add milestones to make it easier to navigate{' '}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fields.map((field, index) => (
                    <div className="flex items-start gap-2" key={index}>
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`milestones.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                placeholder={`milestone ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`milestones.${index}.deadline`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-[240px] pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      dateFns.format(field.value, 'PPP')
                                    ) : (
                                      <span>Set a deadline</span>
                                    )}
                                    <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant={'ghost'}
                        onClick={() => remove(index)}
                      >
                        <Icons.trash className="w-4 h-4 text-rose-600" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addMilestone}
                  >
                    <Icons.add_milestone className="w-4 h-4 mr-2" /> Add
                    Milestone
                  </Button>
                </CardFooter>
              </Card>
              <ProjectMembers />
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  )
}
