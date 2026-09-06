import { redirect } from 'next/navigation'
import { getUser } from '../lib/supabase/server'
import GoogleSignInButton from './GoogleSignInButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>
}) {
  const user = await getUser()
  if (user) redirect('/admin')

  const { error, reason } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center section-padding">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Portfolio App</h1>
        <p className="text-dark-400 text-sm mb-8">Build and edit your portfolio.</p>

        {error && (
          <div className="mb-4">
            <p className="text-sm text-red-400">Something went wrong signing you in.</p>
            {reason && <p className="text-xs text-dark-500 mt-1 break-words">{reason}</p>}
          </div>
        )}

        <GoogleSignInButton />
      </div>
    </main>
  )
}
