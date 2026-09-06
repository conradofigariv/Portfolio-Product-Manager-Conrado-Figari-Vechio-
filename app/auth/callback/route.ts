import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'
import { getSiteOrigin } from '../../lib/site-url'

// Google redirects here with a ?code= after the user approves sign-in.
// Profile creation happens on /admin instead of here, so a transient failure
// there can self-heal on the next visit rather than needing a fresh login.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const origin = await getSiteOrigin()

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/admin`)
    }

    console.error('exchangeCodeForSession failed', error)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
