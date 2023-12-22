import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import Image from 'next/image'
import { z } from 'zod'

import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/data-table'
import { taskSchema } from '@/app/data/schema'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'app/data/tasks.json')
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()

  return (
    <div className="my-10">
      <MaxWidthWrapper>
        <DataTable data={tasks} columns={columns} />
      </MaxWidthWrapper>
    </div>
  )
}
