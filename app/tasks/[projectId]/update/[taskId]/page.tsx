import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { TaskUpdateForm } from '@/components/tasks/UpdateForm'
import { readTasks } from '@/app/tasks/actions/index'
import { z } from 'zod'
import { taskSchema } from '@/app/data/schema'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/Icons'
import Link from 'next/link'

export default async function page({
  params,
}: {
  params: { taskId: string; projectId: string }
}) {
  const response = await readTasks(params.projectId)
  const tasks = z.array(taskSchema).parse(response.data)

  return (
    <MaxWidthWrapper>
      <div className="hidden pt-10 pb-16 space-y-6 md:block">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/tasks/${params.projectId}`}>
            <Icons.chevronLeft className="w-4" />
            go back
          </Link>
        </Button>
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Update Task</h2>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1">
            <TaskUpdateForm
              task_id={params.taskId}
              project_id={params.projectId}
              data={tasks}
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
