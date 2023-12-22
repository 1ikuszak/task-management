import { Icons } from '@/components/Icons'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProjectCard from '@/components/projects/ProjectCard'
import {
  readProjectMilestones,
  readProjects,
  readProjectsAndMilestones,
} from '@/app/projects/actions'
import { Button } from '@/components/ui/button'
import readUserSession from '@/lib/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }

  const combined = await readProjectsAndMilestones()

  return (
    <div className="py-10">
      <MaxWidthWrapper>
        <Button asChild>
          <Link href={'projects/add'}>
            <Icons.project className="mr-2" /> New Project
          </Link>
        </Button>
        <div className="grid gap-4 mt-4 gird-cols-1 lg:grid-cols-2">
          {combined?.map((project, index) => (
            <ProjectCard
              key={index}
              milestones={project.milestones}
              name={project.name}
              project_id={project.id}
              color={project.color}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
