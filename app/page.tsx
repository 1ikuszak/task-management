import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data } = await readUserSession()
  if (!data.session) {
    return redirect('/auth/login')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>home</p>
    </div>
  )
}
