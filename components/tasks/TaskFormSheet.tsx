import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { TaskForm } from './TaskForm'
import { Task } from '@/app/data/schema'

interface TaskSheetProps {
  project_id: string
  tasks: Task[]
}

export function TaskSheet({ project_id, tasks }: TaskSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">New Task</Button>
      </SheetTrigger>
      <SheetContent className="w-screen sm:w-[640px] sm:max-w-none overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Task</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center mt-10 sm:justify-start">
          <TaskForm data={tasks} project_id={project_id} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
