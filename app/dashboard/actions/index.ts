'use server'
import createSupabaseClient from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select(`full_name, username, avatar_url`)
      .eq('id', user.id)
      .single()

    return {
      email: user.email,
      ...profile,
    }
  }
}
