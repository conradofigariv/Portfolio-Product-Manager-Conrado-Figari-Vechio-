import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'
import { ensureProfile } from '../../lib/supabase/profile'

// Google redirects here with a ?code= after the user approves sign-in.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await ensureProfile(supabase, user)
      }

      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
