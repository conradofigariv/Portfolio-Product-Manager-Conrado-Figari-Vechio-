'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

// Sign-in runs in the browser so Supabase writes the PKCE code verifier as a
// normal browser cookie. Starting the flow from a Server Action instead leaves
// that verifier behind, and the callback then has nothing to exchange the code
// against.
export default function GoogleSignInButton() {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function signIn() {
    setPending(true)

    // Vercel renders secret values as bullet characters, and saving that masked
    // display stores literal bullets. NEXT_PUBLIC_* values are also baked in at
    // build time, so a redeploy that reuses the build cache can keep serving an
    // old one. Both only surface as an opaque ByteString error otherwise, so
    // report what the bundle actually contains.
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    const isPrintableAscii = /^[\x20-\x7E]*$/.test(anonKey)
    const looksLikeKey = anonKey.startsWith('eyJ') || anonKey.startsWith('sb_')

    if (!isPrintableAscii || !looksLikeKey) {
      setPending(false)
      const shape = anonKey
        ? `${anonKey.length} chars, starts with "${anonKey.slice(0, 6)}"${
            isPrintableAscii ? '' : ', contains non-ASCII characters'
          }`
        : 'not set'
      router.push(
        `/?error=bad_key&reason=${encodeURIComponent(
          `NEXT_PUBLIC_SUPABASE_ANON_KEY is not a valid key (${shape}). A real key starts with "eyJ". Re-enter it in the hosting environment and redeploy WITHOUT the build cache — this value is baked in at build time.`
        )}`
      )
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setPending(false)
      router.push(`/?error=oauth_start&reason=${encodeURIComponent(error.message)}`)
    }
  }

  return (
    <button
      onClick={signIn}
      disabled={pending}
      className="button-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {pending ? 'Redirecting…' : 'Sign in with Google'}
    </button>
  )
}
