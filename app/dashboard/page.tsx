import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p>dashboard</p>
    </div>
  )
}
