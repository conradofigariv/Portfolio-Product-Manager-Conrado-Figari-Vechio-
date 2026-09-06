import { redirect } from 'next/navigation'
import { getUser } from '../lib/supabase/server'

export default async function AdminPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center section-padding">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Portfolio App</h1>
        <p className="text-dark-400 text-sm mb-1">Signed in as {user.email}</p>
        <p className="text-dark-500 text-sm mb-8">The editor is coming soon.</p>

        <form action="/auth/signout" method="post">
          <button type="submit" className="button-secondary w-full">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
