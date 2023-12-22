import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ProjectUpdateForm } from '@/components/projects/ProjectUpdateForm'
import { Separator } from '@/components/ui/separator'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import { readProjectWithMilestonesById } from '../../actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Icons } from '@/components/Icons'

async function getProjectWithMilestones(project_id: string) {
  return await readProjectWithMilestonesById(project_id)
}

export default async function page({
  params,
}: {
  params: { projectId: string }
}) {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }
  const projectData = readProjectWithMilestonesById(params.projectId)
  const { project, milestones } = await projectData

  return (
    <div className="my-6">
      <MaxWidthWrapper>
        <Button size={'sm'} variant={'outline'} asChild>
          <Link href={'/projects'}>
            <Icons.chevron_left className="w-4 h-4 mr-2" /> go back
          </Link>
        </Button>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">New Project</h3>
            <p className="text-sm text-muted-foreground">
              Fill the form with necessary information
            </p>
          </div>
          <Separator />
          <ProjectUpdateForm project={project} milestones={milestones} />
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
