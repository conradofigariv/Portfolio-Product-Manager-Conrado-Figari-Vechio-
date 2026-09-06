import { headers } from 'next/headers'

// The origin the visitor actually reached us on, taken from the request rather
// than an env var. OAuth redirects have to come back to the same domain the
// user started from, and a stale NEXT_PUBLIC_SITE_URL silently sends them to
// the wrong host instead — which is invisible until sign-in stops working.
// Supabase still validates this against its Redirect URLs allow list, so a
// forged Host header cannot redirect anywhere that is not already permitted.
export async function getSiteOrigin(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  }

  const protocol =
    headersList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')

  return `${protocol}://${host}`
}
