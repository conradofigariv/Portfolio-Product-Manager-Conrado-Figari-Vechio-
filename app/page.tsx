import PortfolioShell from './components/PortfolioShell'
import { defaultPortfolio } from './lib/portfolio'
import { hasAnyMedia, loadPortfolio } from './lib/portfolio-db'
import { ROOT_USERNAME, adoptDeploymentMedia } from './lib/deployment-owner'
import { createClient } from './lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const [{ data: auth }, loaded] = await Promise.all([
    supabase.auth.getUser(),
    loadPortfolio(supabase, ROOT_USERNAME),
  ])

  // Ownership is resolved from the signed-in user's own profile rather than
  // from the loaded portfolio: the portfolio is still empty before the first
  // save, and the owner has to be able to edit precisely then.
  let isOwner = false
  if (auth.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', auth.user.id)
      .maybeSingle()
    isOwner = profile?.username === ROOT_USERNAME
  }

  let stored = loaded
  if (isOwner && stored) {
    const adopted = await adoptDeploymentMedia(supabase, {
      portfolioId: stored.portfolioId,
      username: stored.username,
    })
    if (adopted) stored = await loadPortfolio(supabase, ROOT_USERNAME)
  }

  // Until the first save the content still lives in the codebase. Falling back
  // to it means the page never regresses, and saving once migrates it across.
  const portfolio = stored
    ? { ...stored, media: hasAnyMedia(stored.media) ? stored.media : defaultPortfolio.media }
    : defaultPortfolio

  return (
    <PortfolioShell
      portfolio={portfolio}
      editing={isOwner}
      published={stored?.published ?? false}
    />
  )
}
