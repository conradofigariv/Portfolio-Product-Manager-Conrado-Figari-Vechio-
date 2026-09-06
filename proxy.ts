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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|mp4|pdf)$).*)'],
}
