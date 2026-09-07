import type { SupabaseClient } from '@supabase/supabase-js'
import type { Lang, MediaImage, Portfolio, PortfolioContent, PortfolioMedia } from './portfolio'

const BUCKET = 'portfolio-media'

type MediaRow = {
  kind: string
  target_id: string | null
  storage_path: string
  alt: string
  sort_order: number
}

// Content is stored as one JSONB document per portfolio, so a page render is a
// single row read rather than a join across a table per section.
function isContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== 'object') return false
  const c = value as Partial<PortfolioContent>
  return !!c.hero && !!c.projects && !!c.journey && !!c.skills
}

function buildMedia(rows: MediaRow[], publicUrl: (path: string) => string): PortfolioMedia {
  const media: PortfolioMedia = {
    portrait: null,
    backgroundVideos: [],
    cv: null,
    projectImages: {},
    chapterPhotos: {},
  }

  for (const row of [...rows].sort((a, b) => a.sort_order - b.sort_order)) {
    const url = publicUrl(row.storage_path)
    const image: MediaImage = { src: url, alt: row.alt }

    switch (row.kind) {
      case 'portrait':
        media.portrait = image
        break
      case 'background_video':
        media.backgroundVideos.push(url)
        break
      case 'cv':
        media.cv = url
        break
      case 'project':
        if (row.target_id) {
          media.projectImages[row.target_id] ??= []
          media.projectImages[row.target_id].push(image)
        }
        break
      case 'chapter':
        if (row.target_id) media.chapterPhotos[row.target_id] = image
        break
    }
  }

  return media
}

// Returns null when the username does not exist, or when the portfolio is still
// a draft and the viewer is not its owner — row level security decides that, so
// this cannot leak someone else's unpublished work.
export async function loadPortfolio(
  supabase: SupabaseClient,
  username: string
): Promise<(Portfolio & { published: boolean; ownerId: string }) | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .maybeSingle()

  if (!profile) return null

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id, content, published')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (!portfolio) return null

  const content = portfolio.content as Partial<Record<Lang, unknown>> | null
  if (!content || !isContent(content.en) || !isContent(content.es)) return null

  const { data: mediaRows } = await supabase
    .from('portfolio_media')
    .select('kind, target_id, storage_path, alt, sort_order')
    .eq('portfolio_id', portfolio.id)

  const publicUrl = (path: string) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl

  return {
    username: profile.username,
    media: buildMedia((mediaRows ?? []) as MediaRow[], publicUrl),
    content: { en: content.en, es: content.es },
    published: !!portfolio.published,
    ownerId: profile.id,
  }
}

export function hasAnyMedia(media: PortfolioMedia): boolean {
  return (
    !!media.portrait ||
    !!media.cv ||
    media.backgroundVideos.length > 0 ||
    Object.keys(media.projectImages).length > 0 ||
    Object.keys(media.chapterPhotos).length > 0
  )
}
