import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransition } from 'react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '../Icons'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { updateNotes } from '@/app/tasks/actions'

const taskFormSchema = z.object({
  notes: z.string().max(1000, {
    message: 'notes must not be longer than 1000 characters.',
  }),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface EditNotesFormProps {
  task_id: string
  task_name: string
  notes: string
}

export function EditNotesForm({
  task_id,
  task_name,
  notes,
}: EditNotesFormProps) {
  const [isPending, startTransition] = useTransition()

  const defaultValues: Partial<TaskFormValues> = {
    notes: notes,
  }

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  })

  function onSubmit(data: TaskFormValues) {
    startTransition(async () => {
      const result = await updateNotes(task_id, data.notes)
      const { error } = JSON.parse(result)

      if (error?.message) {
        toast.error(error.message)
      } else {
        toast('notes successfully updated')
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button>
          <Badge variant={'outline'}>Notes</Badge>
        </button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className="sm:max-w-none w-[640px] overflow-auto"
      >
        <SheetHeader>
          <SheetTitle>{task_name}</SheetTitle>
          <SheetDescription>Edit notes</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="h-full py-10 space-y-10">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="w-full border-none outline-none resize-none focus:outline-none"
                        rows={16}
                        {...field}
                      />

                      {/* <Textarea
                        className="resize-none h-[24rem] w-full border-none focus:ring-0 focus:border-none" // Adjusted height and width, removed border, and focus styles
                        {...field}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="flex gap-2">
                  Save changes
                  <AiOutlineLoading3Quarters
                    className={cn('animate-spin', { hidden: !isPending })}
                  />
                </Button>{' '}
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
