import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Next 16 renamed middleware.ts to proxy.ts. This only refreshes the Supabase
// session cookie on the way in (an optimistic check) — it is NOT where
// authorization happens. Per the Next 16 docs, a matcher change or a
// refactor can silently drop proxy coverage from a route, so every
// protected page and Server Function re-verifies the user itself via
// getUser() in lib/supabase/server.ts.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // This runs on nearly every route, including the public portfolio. Missing
  // env vars must degrade to "auth is unavailable", never take the whole
  // site down — a page that needs a session will still catch that itself.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Touches the session so an expired access token gets refreshed before it
  // reaches a Server Component that would otherwise see a stale cookie.
  await supabase.auth.getUser()

  return response
}

export const config = {
  // /auth is excluded on purpose: refreshing the session mid sign-in can clear
  // the PKCE cookies the callback still needs to exchange the code.
  matcher: [
    '/((?!auth/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|mp4|pdf)$).*)',
  ],
}
