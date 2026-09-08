@AGENTS.md

# Portfolio App — Agent Context

## What this is
A multi-tenant SaaS where users sign in with Google and get an editable personal portfolio at `/<username>`. The portfolio is always public (no draft/private mode). The owner edits directly in the live design — no separate admin panel or forms. The root domain (`/`) shows a product landing page.

## Stack
- **Next.js 16 App Router** (Turbopack, `src/` not used — everything is under `app/`)
- **Supabase**: Auth (Google OAuth via PKCE), Postgres, Storage (bucket `portfolio-media`), Row Level Security
- **Tailwind CSS** (`dark-*` palette, `dark-50` = lightest, `dark-900` = darkest)
- **TypeScript** throughout

## URL structure
- `/` — Product landing page (`app/page.tsx`). Signed-in users get redirected to their portfolio.
- `/login` — Google sign-in (`app/login/page.tsx`)
- `/[username]` — Portfolio page (`app/[username]/page.tsx`). Owner sees edit affordances; add `?preview=1` to see visitor view.
- `/admin` — redirect to owner's portfolio
- `/auth/callback` — Supabase PKCE callback

## Key env vars
- `ROOT_USERNAME` — the portfolio username that maps to the root domain (set in Vercel, baked at build time for client components). Owner of that portfolio gets their page at both `/` and `/<username>`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection (public; fine to expose).

## In-place editing pattern
The core UX: the owner sees dashed outlines on every text field while in editing mode. Clicking focuses a `contentEditable` span. Changes are held in **draft state** (React context) until the owner clicks **Save** in the floating edit bar.

### LanguageContext (`app/context/LanguageContext.tsx`)
The single source of truth for all client-side state. Key fields:
- `editing: boolean` — true when the owner is in edit mode
- `dirty: boolean` — true when there are unsaved changes
- `draft` — the in-progress content object
- `setField(path, value)` — updates a single field in the draft (dot-notation path, e.g. `"projects.items.2.narrative.0"`)
- `updateActive(path, value)` — updates the active language only
- `updateBoth(path, value)` — updates both EN and ES
- `markSaved()` — clears `dirty`, copies draft → saved

Content paths are resolved by `app/lib/content-path.ts`.

### EditableText (`app/components/EditableText.tsx`)
A `contentEditable` span. Empty fields must have `data-placeholder` and the CSS class `editable-field` so they get a visible placeholder (see `app/globals.css`). Without this, empty `contentEditable` collapses to zero height and becomes unclickable.

### EditBar (`app/components/EditBar.tsx`)
Floating bottom bar. Shown only to the owner. Has: Preview link (`?preview=1`), Save button (calls `savePortfolio`). Registers a `beforeunload` guard when `dirty === true` to warn on navigation.

## Photo/media system

### Storage paths vs public URLs
Supabase gives back a public URL like:
`https://<project>.supabase.co/storage/v1/object/public/portfolio-media/<user-id>/portrait-xyz.webp`

Database operations (`removeProjectPhoto`, `saveMediaPosition`, `reorderProjectPhotos`) filter by **raw storage path** (`<user-id>/portrait-xyz.webp`), not the full URL.

Always use `storagePathFromPublicUrl(url)` from `app/lib/media-path.ts` to recover the path:
```ts
export function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/portfolio-media/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}
```

### Upload naming
Use `uniqueUploadName()` from `app/lib/image-upload.ts` → `${Date.now()}-${Math.random().toString(36).slice(2,8)}`. Prevents collisions if the user uploads the same filename twice.

### Compression (`app/lib/image-upload.ts`)
Canvas → WebP. Max edge 1920px. Target ≤ 1.5MB. Quality steps: `[0.92, 0.85, 0.78]`.

### Focal point / crop position
Stored as `"62% 35%"` string in `portfolio_media.position` column. Applied as CSS `objectPosition`. Edited via `PositionPicker` → `PhotoCropModal` (draggable crop frame over the full photo).

Frame math in `PhotoCropModal.tsx`:
- Frame size = percentage of photo (only the axis with slack shrinks to fit the target aspect ratio)
- `left = ((100 - frameW) * x) / 100` — maps directly to what CSS `object-position` does
- Uses `setPointerCapture` for smooth drag across browser boundaries
- Rendered via `createPortal(..., document.body)` to escape CSS `transform` containing-block traps

Rotation (optional `storagePath`/`onRotated` props on `PhotoCropModal`, threaded through `PositionPicker`): `rotateImage()` in `image-upload.ts` fetches the current photo, redraws it onto a canvas rotated 90°/180°/270° (swapping width/height for 90°/270°), and re-encodes to WebP. The caller's `onRotated(newStoragePath, newPublicUrl)` uploads-and-persists the replacement (`savePortrait`/`saveChapterPhoto` for portrait/chapter — they already delete-old-then-insert-new; `replaceProjectPhoto` for gallery photos, which updates the row in place to preserve `sort_order`). The crop position resets to center since the old frame no longer matches the rotated dimensions.

## Important components

| File | Role |
|------|------|
| `app/components/PortfolioShell.tsx` | Renders full portfolio; in `?preview=1` shows banner |
| `app/components/Navbar.tsx` | In editing mode adds BackgroundPicker + sign-out |
| `app/components/Hero.tsx` | Portrait + text column. Stats centered. `min-h-[70vh]` + `items-center` |
| `app/components/Journey.tsx` | Flat two-column layout (text stack | chapter photo). Tags `text-dark-50` |
| `app/components/ProjectTimeline.tsx` | Project cards. Category tag `text-dark-50`. Metrics centered. `quality={90}` |
| `app/components/EditablePortrait.tsx` | Portrait upload + focal point picker |
| `app/components/EditableChapterPhoto.tsx` | Chapter photo upload + separate mobile/desktop focal points |
| `app/components/EditableProjectGallery.tsx` | Photo panel: drag-to-upload, drag-to-reorder, PositionPicker per tile |
| `app/components/PositionPicker.tsx` | Trigger button → opens PhotoCropModal |
| `app/components/PhotoCropModal.tsx` | Full-photo view with draggable crop frame (portalled to body) |
| `app/components/BackgroundPicker.tsx` | Owner picks hero background video |

## Key server actions (`app/lib/portfolio-actions.ts`)
- `savePortfolio({ content })` — always writes `published: true`
- `saveMediaPosition(storagePath, position)` — updates `portfolio_media.position`
- `reorderProjectPhotos(projectId, storagePaths[])` — sets `sort_order` sequentially
- `removeProjectPhoto(projectId, storagePath)` — needs raw storage path (not public URL)
- `replaceProjectPhoto(projectId, oldStoragePath, newStoragePath, alt)` — points an existing gallery row at a new file in place (used by rotate), keeping `sort_order` and clearing `position`
- `addProjectPhoto(projectId, storagePath, title)` — inserts new media row
- `saveChapterPhoto(chapterId, storagePath, heading)` — upserts chapter photo
- `savePortrait(storagePath, altText)` — upserts portrait

## Database (Supabase Postgres)
Key tables:
- `portfolios` — one row per user. JSONB `content` column holds all text. `published boolean default true`.
- `portfolio_media` — one row per uploaded image. Columns: `storage_path text`, `public_url text`, `alt text`, `position text`, `type text` (portrait/chapter/project-photo), `entity_id text`, `sort_order int`.

Migrations are in `supabase/migrations/`. **The sandbox cannot reach Supabase** (network policy). All migrations must be run manually in the Supabase SQL Editor.

## Git workflow
This project uses squash-merges. After each merge, the branch history diverges from the base. Before every new push:
```bash
git fetch origin <base-branch>
git checkout -B claude/youthful-dijkstra-22hu3s origin/<base-branch>
# make changes, commit, push
git push -u origin claude/youthful-dijkstra-22hu3s
```
Never stack commits on already-merged history — always rebase the working branch onto the latest base.

## CSS conventions
- Color palette: `dark-50` (lightest near-white) → `dark-900` (darkest near-black). High numbers = darker.
- Accent: lime `#d8ff3e` (used for CTAs on landing page).
- Edit affordances: `outline-dashed outline-1 outline-offset-4 outline-transparent hover:outline-dark-400/50 focus:outline-dark-50/70`
- Empty editable field placeholder: `editable-field` class + `data-placeholder` attribute + CSS in `globals.css`
- `createPortal(..., document.body)` whenever a modal/overlay lives inside a card that uses CSS `transform` (would trap `position: fixed`)
- `quality={90}` on all Next.js `<Image>` components for sharp output

## Common pitfalls
- **Always use `storagePathFromPublicUrl()`** before passing a media src to any DB action that filters by `storage_path`.
- **`NEXT_PUBLIC_*` vars** are baked at build time — never use them for secrets.
- **Supabase unreachable from sandbox** — test migrations by reading the SQL file, never by running `supabase db push` or similar.
- **Empty `contentEditable`** — add `editable-field` class + `data-placeholder` or the field collapses to zero size and becomes unclickable.
- **`dirty` guard** — EditBar registers `beforeunload` when dirty; always call `markSaved()` after a successful save.
