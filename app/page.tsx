import PortfolioShell from './components/PortfolioShell'
import { defaultPortfolio } from './lib/portfolio'
import { hasAnyMedia, loadPortfolio } from './lib/portfolio-db'
import { createClient } from './lib/supabase/server'

// Whose portfolio the root of this deployment serves. It stays at / so the URL
// already printed on Conrado's CV keeps working; everyone else lives at
// /[username].
const ROOT_USERNAME = 'conrado-figari-vechio'

export default async function Home() {
  const supabase = await createClient()
  const [{ data: auth }, stored] = await Promise.all([
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

  // Until that first save the content still lives in the codebase. Falling back
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
