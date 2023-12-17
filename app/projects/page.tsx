import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProjectCard from '@/components/projects/Card'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }

  return (
    <div className="py-10">
      <MaxWidthWrapper>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 10 }, (_, index) => (
            <ProjectCard
              key={index}
              created_at="12.12.12"
              deadline="12.12.13"
              milestone="wysłka do jacka"
              name="projekt 1"
              progress={800}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
