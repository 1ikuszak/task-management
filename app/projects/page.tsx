import { Icons } from '@/components/Icons'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProjectCard from '@/components/projects/Card'
import { Button } from '@/components/ui/button'
import readUserSession from '@/lib/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }

  return (
    <div className="py-10">
      <MaxWidthWrapper>
        <Button asChild>
          <Link href={'projects/add'}>
            <Icons.project className="mr-2" /> New Project
          </Link>
        </Button>
        <div className="grid gap-2 mt-4 gird-cols-1 lg:grid-cols-2">
          {Array.from({ length: 1 }, (_, index) => (
            <ProjectCard
              key={index}
              created_at="12.12.12"
              deadline="12.12.13"
              milestone="wysłka produktu"
              name="projekt 1"
              progress={800}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
