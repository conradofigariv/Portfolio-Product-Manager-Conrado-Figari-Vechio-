import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase/server'
import { ensureProfile } from '../lib/supabase/profile'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let profileError: string | null = null
  let username: string | null = null

  try {
    await ensureProfile(supabase, user)
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()
    username = profile?.username ?? null
  } catch (err) {
    console.error('ensureProfile failed', { userId: user.id, err })
    profileError = 'We could not finish setting up your account. Reload this page to try again.'
  }

  return (
    <main className="min-h-screen flex items-center justify-center section-padding">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Portfolio App</h1>
        <p className="text-dark-400 text-sm mb-1">Signed in as {user.email}</p>
        {username && (
          <p className="text-dark-500 text-sm mb-1">
            Your portfolio:{' '}
            <a href={`/${username}`} className="text-dark-300 underline hover:text-dark-50">
              /{username}
            </a>
          </p>
        )}

        {profileError ? (
          <p className="text-red-400 text-sm mb-8">{profileError}</p>
        ) : (
          <p className="text-dark-500 text-sm mb-8">The editor is coming soon.</p>
        )}

        <form action="/auth/signout" method="post">
          <button type="submit" className="button-secondary w-full">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
