import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase/server'
import { ensureProfile } from '../lib/supabase/profile'

// Editing happens on the portfolio itself, so this is only the door into it.
export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  let setupError: string | null = null
  try {
    await ensureProfile(supabase, user)
  } catch (err) {
    console.error('ensureProfile failed', { userId: user.id, err })
    setupError = 'We could not finish setting up your account. Reload this page to try again.'
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle()

  if (!setupError && profile?.username) redirect(`/${profile.username}`)

  return (
    <main className="min-h-screen flex items-center justify-center section-padding">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Portfolio App</h1>
        <p className="text-dark-400 text-sm mb-1">Signed in as {user.email}</p>
        <p className="text-red-400 text-sm mb-8">
          {setupError ?? 'Your portfolio is still being set up. Reload this page to try again.'}
        </p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="button-secondary w-full">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  )
}
