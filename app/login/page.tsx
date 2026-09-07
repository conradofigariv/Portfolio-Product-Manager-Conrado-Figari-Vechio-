import { redirect } from 'next/navigation'

// The landing at / is now also the sign-in screen. This only exists so an
// old bookmark or link to /login still lands somewhere useful, carrying any
// error info along.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') params.set(key, value)
  }
  const query = params.toString()
  redirect(query ? `/?${query}` : '/')
}
