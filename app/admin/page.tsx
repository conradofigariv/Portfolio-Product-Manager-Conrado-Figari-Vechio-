import { redirect } from 'next/navigation'
import type { Lang, PortfolioContent } from '../lib/portfolio'
import { createClient } from '../lib/supabase/server'
import { ensureProfile } from '../lib/supabase/profile'
import { starterContent } from '../lib/starter-content'
import PortfolioEditor from './PortfolioEditor'

function hasSections(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== 'object') return false
  const c = value as Partial<PortfolioContent>
  return !!c.hero && !!c.projects && !!c.journey && !!c.skills && !!c.contact && !!c.footer
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let setupError: string | null = null
  try {
    await ensureProfile(supabase, user)
  } catch (err) {
    console.error('ensureProfile failed', { userId: user.id, err })
    setupError = 'We could not finish setting up your account. Reload this page to try again.'
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .maybeSingle()

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('content, published')
    .eq('user_id', user.id)
    .maybeSingle()

  if (setupError || !portfolio) {
    return (
      <main className="min-h-screen flex items-center justify-center section-padding">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Portfolio App</h1>
          <p className="text-dark-400 text-sm mb-1">Signed in as {user.email}</p>
          <p className="text-red-400 text-sm mb-8">
            {setupError ?? 'Your portfolio is still being set up. Reload this page to try again.'}
          </p>
          <form action="/auth/signout" method="post">
            <button type="submit" className="button-secondary w-full">
              Sign out
            </button>
          </form>
        </div>
      </main>
    )
  }

  // A portfolio created before the starter template existed, or one whose
  // document is somehow incomplete, opens on the template rather than a
  // half-empty form.
  const stored = (portfolio.content ?? {}) as Partial<Record<Lang, unknown>>
  const fallback = starterContent(profile?.display_name || user.email || 'Your name')
  const content: Record<Lang, PortfolioContent> = {
    en: hasSections(stored.en) ? stored.en : fallback.en,
    es: hasSections(stored.es) ? stored.es : fallback.es,
  }

  return (
    <PortfolioEditor
      username={profile?.username ?? null}
      initialContent={content}
      initialPublished={!!portfolio.published}
    />
  )
}
