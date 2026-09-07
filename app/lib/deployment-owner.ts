import type { SupabaseClient } from '@supabase/supabase-js'
import { defaultPortfolio } from './portfolio'

// Whose portfolio the root of this deployment serves. It stays at / so the URL
// already printed on Conrado's CV keeps working; everyone else lives at
// /[username].
export const ROOT_USERNAME = 'conrado-figari-vechio'

type MediaInsert = {
  portfolio_id: string
  kind: string
  target_id: string | null
  storage_path: string
  alt: string
  sort_order: number
}

/**
 * This site was one person's portfolio before it became a product, so his
 * photos, background videos and CV are files in /public rather than uploads.
 * The first time he opens his own portfolio, they are recorded as media rows
 * pointing at those paths — after that the database is the only source of
 * truth, and every one of them can be replaced through the editor like any
 * other upload.
 *
 * No-ops for everyone else, and once any media row exists.
 */
export async function adoptDeploymentMedia(
  supabase: SupabaseClient,
  { portfolioId, username }: { portfolioId: string; username: string }
): Promise<boolean> {
  if (username !== ROOT_USERNAME) return false

  const { count } = await supabase
    .from('portfolio_media')
    .select('id', { count: 'exact', head: true })
    .eq('portfolio_id', portfolioId)

  if (count && count > 0) return false

  const media = defaultPortfolio.media
  const rows: MediaInsert[] = []

  if (media.portrait) {
    rows.push({
      portfolio_id: portfolioId,
      kind: 'portrait',
      target_id: null,
      storage_path: media.portrait.src,
      alt: media.portrait.alt,
      sort_order: 0,
    })
  }

  // Only the first: a portfolio has at most one background going forward,
  // even though the legacy static fallback still cycles through two.
  if (media.backgroundVideos[0]) {
    rows.push({
      portfolio_id: portfolioId,
      kind: 'background_video',
      target_id: null,
      storage_path: media.backgroundVideos[0],
      alt: '',
      sort_order: 0,
    })
  }

  if (media.cv) {
    rows.push({
      portfolio_id: portfolioId,
      kind: 'cv',
      target_id: null,
      storage_path: media.cv,
      alt: '',
      sort_order: 0,
    })
  }

  for (const [projectId, images] of Object.entries(media.projectImages)) {
    images.forEach((image, index) => {
      rows.push({
        portfolio_id: portfolioId,
        kind: 'project',
        target_id: projectId,
        storage_path: image.src,
        alt: image.alt,
        sort_order: index,
      })
    })
  }

  for (const [chapterId, image] of Object.entries(media.chapterPhotos)) {
    rows.push({
      portfolio_id: portfolioId,
      kind: 'chapter',
      target_id: chapterId,
      storage_path: image.src,
      alt: image.alt,
      sort_order: 0,
    })
  }

  if (!rows.length) return false

  const { error } = await supabase.from('portfolio_media').insert(rows)
  if (error) {
    console.error('adoptDeploymentMedia failed', error)
    return false
  }
  return true
}
