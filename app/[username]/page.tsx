import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PortfolioShell from '../components/PortfolioShell'
import { createClient } from '../lib/supabase/server'
import { loadPortfolio } from '../lib/portfolio-db'
import { adoptDeploymentMedia } from '../lib/deployment-owner'

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
  searchParams,
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { username } = await params
  const supabase = await createClient()
  const [{ data: auth }, loaded, { preview }] = await Promise.all([
    supabase.auth.getUser(),
    loadPortfolio(supabase, username),
    searchParams,
  ])

  // Covers both an unknown username and a draft belonging to someone else:
  // row level security hides unpublished portfolios, so this cannot be used
  // to tell the two apart.
  if (!loaded) notFound()

  const isOwner = !!auth.user && auth.user.id === loaded.ownerId
  // Lets the owner see exactly what a visitor sees — no edit affordances —
  // without having to sign out. Meaningless for anyone else.
  const previewing = isOwner && preview === '1'

  let portfolio = loaded
  if (isOwner) {
    const adopted = await adoptDeploymentMedia(supabase, {
      portfolioId: loaded.portfolioId,
      username: loaded.username,
    })
    if (adopted) portfolio = (await loadPortfolio(supabase, username)) ?? loaded
  }

  return (
    <PortfolioShell
      portfolio={portfolio}
      editing={isOwner && !previewing}
      previewing={previewing}
    />
  )
}
