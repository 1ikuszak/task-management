import { z } from 'zod'

import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/data-table'
import { taskSchema } from '@/app/data/schema'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { TaskSheet } from '@/components/tasks/TaskFormSheet'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import { readTasks } from '../actions'

async function getTasks() {
  return []
}

export default async function TaskPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth')
  }
  const response = await readTasks(params.projectId)
  const tasks = z.array(taskSchema).parse(response.data)

  return (
    <div className="my-10">
      <MaxWidthWrapper>
        <TaskSheet tasks={tasks} project_id={params.projectId} />
        <DataTable data={tasks} columns={columns} />
      </MaxWidthWrapper>
    </div>
  )
}
