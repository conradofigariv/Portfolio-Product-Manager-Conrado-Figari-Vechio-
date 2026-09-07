import { getUser } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from './components/GoogleSignInButton'

// The product landing and the sign-in screen are the same page: there is
// nothing to pitch that isn't also the thing you sign in to try. A signed-in
// visitor has nothing to do here, so they go straight to their editor.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>
}) {
  const user = await getUser()
  if (user) redirect('/admin')

  const { error, reason } = await searchParams

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video-2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/85 via-dark-900/75 to-dark-900/90" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <p className="text-dark-400 font-mono tracking-widest uppercase text-xs mb-3">
          Portfolio App
        </p>
        <h1 className="text-3xl font-bold text-dark-50 mb-3">Your portfolio, live.</h1>
        <p className="text-dark-300 text-sm mb-8 leading-relaxed">
          Edit the real design in place — no forms, no builder. Sign in to start yours.
        </p>

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
