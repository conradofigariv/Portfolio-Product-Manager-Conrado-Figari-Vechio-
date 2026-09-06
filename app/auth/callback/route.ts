import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'

// Google redirects here with a ?code= after the user approves sign-in.
// Profile creation happens on /admin instead of here, so a transient failure
// there can self-heal on the next visit rather than needing a fresh login.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
