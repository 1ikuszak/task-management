import { z } from 'zod'

// import { columns } from '@/components/ag_table/columns'
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/data-table'
import { Task, taskSchema } from '@/app/data/schema'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { TaskSheet } from '@/components/tasks/TaskFormSheet'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import { readTasks } from '../actions'

export default async function TaskPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }
  const response = await readTasks(params.projectId)
  const tasks = z.array(taskSchema).parse(response.data)
  console.log(tasks)
  return (
    <div className="my-10">
      <MaxWidthWrapper>
        <div className="mb-6">
          <TaskSheet tasks={tasks} project_id={params.projectId} />
        </div>
        <DataTable data={tasks} columns={columns} />
        {/* <DataTable columnDefs={columns} rowData={tasks} /> */}
      </MaxWidthWrapper>
    </div>
  )
}
