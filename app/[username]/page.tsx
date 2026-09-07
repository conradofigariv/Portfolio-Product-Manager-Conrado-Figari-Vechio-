import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PortfolioShell from '../components/PortfolioShell'
import { createClient } from '../lib/supabase/server'
import { loadPortfolio } from '../lib/portfolio-db'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const portfolio = await loadPortfolio(supabase, username)

  if (!portfolio) return { title: 'Portfolio not found' }

  const { hero } = portfolio.content.en
  return {
    title: `${hero.name} — Portfolio`,
    description: hero.tagline,
  }
}

export default async function UserPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()
  const [{ data: auth }, portfolio] = await Promise.all([
    supabase.auth.getUser(),
    loadPortfolio(supabase, username),
  ])

  // Covers both an unknown username and a draft belonging to someone else:
  // row level security hides unpublished portfolios, so this cannot be used
  // to tell the two apart.
  if (!portfolio) notFound()

  return (
    <PortfolioShell
      portfolio={portfolio}
      editing={!!auth.user && auth.user.id === portfolio.ownerId}
      published={portfolio.published}
    />
  )
}
