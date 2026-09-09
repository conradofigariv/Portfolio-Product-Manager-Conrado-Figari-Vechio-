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
Floating bottom bar. Shown only to the owner. Has: Preview link (`?preview=1`), Save button (calls `savePortfolio`). Registers a `beforeunload` guard when `dirty === true` to warn on navigation. Only reflects fields still on the plain draft/Save system below — a migrated rich text field autosaves on its own and never touches `dirty`.

## Rich text fields (Tiptap) — migration in progress
A field-by-field replacement of the plain-text system above with rich text (bold/italic/underline/strike, font size, color, highlight, link, alignment), landing in `portfolio_blocks` instead of `portfolios.content`. Migrated so far: the original 15 top-level scalar fields (a title, a tagline, a name — see 0005), project narrative lines (see 0006, the first list-shaped field), a scalar field but keyed by a *dynamic* parent id rather than a fixed path — chapter tag/heading/body (`journey.chapters.<chapterId>.tag`/`.heading`/`.body`) and project title (`projects.items.<projectId>.title`), see 0007 — two more plain string lists, project tags (`projects.items.<projectId>.tags.<tagId>`) and `contact.availableItems.<itemId>` (the latter not nested under any per-entity array at all — there's only one contact section per portfolio), see 0008 — and, see 0009: project metrics, which turned out NOT to be an owner-addable/removable list at all (the layout is a fixed 3-column grid, always exactly 3) — each is a fixed-index scalar block, `projects.items.<projectId>.metrics.<i>.label`/`.value` with `<i>` literally `0`/`1`/`2`, same family as the chapter/title fields, not sorted by `sort_order` — and certifications, the first *multi-field* list (`skills.certs.<certId>.title`/`.issuer`, see "Multi-field list-shaped fields" below). Also see 0010: skills categories — an addable/removable list of entities that each *also* own a nested addable/removable list (their skills), the last and trickiest of these migrations, since `SkillCategory` never had a stable id the way `Project`/`JourneyChapter` always have. 0010 assigns one (deterministic, `skillCategoryId(index)` = `"skillcat-<index>"`, matching `projectId()`/`chapterId()`'s own scheme) by rewriting `portfolios.content` directly — every migration before it only ever inserted into `portfolio_blocks`, never touched the JSONB column. The category entity's own structural existence (its id) still lives in `portfolios.content`, exactly like a chapter's or project's id — only its *fields* (`category` name, and its nested `skills` list) move to blocks. `normalizeContent` (portfolio-db.ts) and the save-path sanitizer (`portfolio-actions.ts`'s `list(skills.categories, ...)`) both independently backfill/preserve that id the same deterministic way, so a category never loses or lacks one. And, see 0011, the last two scalar-field stragglers: project `year`/`tag` (dynamic parent id, same family as project title) and hero `stats.<i>.value`/`.label` — like project metrics, NOT an owner-addable/removable list (fixed 3-column grid, always exactly 3), so fixed-index scalar blocks rather than list machinery; `stats` sits directly under `content` rather than nested per-project, so there's no parent id to interpolate into its block_key. This closes out the migration entirely except contact socials/email, kept on the old plain-text system for good: `contact.socials.url` was deliberately *not* migrated despite being a plain string field — `Contact.tsx` uses it as a real `<a href>`, not just to display text, the same reasoning that already excluded `contact.email`; `contact.socials.label` was left alongside it on the old system too, rather than half-migrating one field of a two-field item while the other stays behind.

A migrated field nested inside a clickable card (project title, inside the photo card that opens the photo manager on click) needs its own `onClick={(e) => { if (editing) e.stopPropagation() }}` on its wrapper — otherwise a click meant to focus the text bubbles up to the card's own handler and steals it into opening the photo modal instead (fixed in ProjectTimeline.tsx's "Year + title overlay" div). Only guarded behind `editing`, so a visitor's click still opens the lightbox/gallery exactly as before.

### List-shaped fields (narrative lines, and the pattern for the rest still to come)
Unlike a scalar field's single fixed `block_key`, a list's items share one **key prefix** — a narrative line is `"projects.items.<projectId>.narrative.<lineId>"`, where `<lineId>` is a fresh random id meaning nothing beyond uniqueness. Render order comes from the `sort_order` column (already on the table since 0001, unused by the scalar fields since they have no siblings), never from parsing the key or object insertion order.

- **`app/lib/editor/useBlockList.ts`** — reads `blocks` from context, filters to keys starting with `${prefix}.`, sorts by `sortOrder`. Exposes `add()`/`remove(blockKey)`, both immediate actions (not autosave) with a `busy` flag, matching the existing photo add/remove pattern rather than useBlockPersistence's debounce.
- **`app/lib/block-list-actions.ts`** — `addListItemBlock(prefix, section, lang)` inserts one new empty block at `max(sort_order) + 1` among that prefix+lang's existing rows. `removeListItemBlock(blockKey, lang)` just deletes the row — sibling sort_orders are left with gaps, which is fine since order only depends on relative value, not contiguity.
- Lists are **not** kept in sync across EN/ES — same as the plain-text system's `updateActive` (vs `updateBoth`, used only where structural identity like a project/chapter id must match across languages). A project can end up with a different number of narrative blocks per language.
- A list needing its own hook call (`useBlockList`) can't be inlined inside a parent's `.map()` over a dynamic-length array (projects, in this case) — that violates the Rules of Hooks, since the number of hook calls would vary between renders. `ProjectNarrative.tsx`, `ProjectTags.tsx`, and `SkillCategoryCard.tsx` (one per skills category, itself rendered from `Skills.tsx`'s categories `.map()`) exist as their own components for exactly this reason. `contact.availableItems` and `skills.certs`, by contrast, aren't nested under any per-project/per-category loop, so `Contact.tsx`/`Skills.tsx` call the hook directly with no wrapper needed.

### Multi-field list-shaped fields (certifications, and the pattern for skills categories still to come)
A list whose items carry more than one field each (a certification's title + issuer; a metric's label + value, if metrics were ever made addable) needs one more level of indirection than `useBlockList`'s single `block_key` per item: every field of one item shares a **key prefix plus item id**, `"<listPrefix>.<itemId>.<field>"` (e.g. `"skills.certs.<certId>.title"` / `"skills.certs.<certId>.issuer"`), and one `sort_order` between them, so the item — not the individual field block — is the add/remove unit.

- **`app/lib/editor/usePairedBlockList.ts`** — the multi-field counterpart to `useBlockList`. Groups `blocks` by item id (parsed off the tail of each matching key against the known `fields` list, not by insertion order), sorts groups by `sortOrder`, and returns `items: { itemId, blockKeys: Record<field, blockKey> }[]` — a caller renders one `RichText` per `blockKeys.<field>`.
- **`app/lib/block-list-actions.ts`** — `addPairedListItemBlock(prefix, fields, section, lang)` generates one fresh item id and inserts one row per field, all sharing that id and one `sort_order` (`max + 1`, read the same way as the single-field version). `removePairedListItemBlock(prefix, itemId, lang)` deletes by `like '<prefix>.<itemId>.%'` — every field of that item in one statement, rather than one delete per field.
- A backfill migration generating item ids per pre-existing item (0009's certs) must generate the id **before** cross-joining against the field list — doing it after would fan each item out into N rows (one per field) and give each field row of the *same* item a different random id, breaking the pairing. Generate it once in an inner subquery, then cross-join fields against that already-materialized result.
- Not every multi-field item's fields are equally safe to migrate: `contact.socials`' `url` is read as a real `<a href>`, not just displayed, so — like `contact.email` — it stays on the old plain-text system, and `label` was left there alongside it rather than split across two systems.

- **Tiptap v3**, not v2 — v2's entire version range has an unpatched XSS/prototype-pollution disclosure (GHSA-cp6q-959q-f8rh) in `mergeAttributes()`; the fix only landed in 3.30.4+.
- **`app/lib/editor/render-html.ts`** — turns a block's Tiptap JSON into HTML **without** Tiptap's own `generateHTML` (that needs a DOM/jsdom to run server-side, which this app doesn't otherwise depend on). Hand-rolled instead: `renderBlockHtml` walks the JSON directly and is whitelist-only by construction — it can only ever emit the tags in its `MARK_TAGS` map plus `<p>`, regardless of what the JSON claims, so there's no injection surface to sanitize against. `sanitizeDoc` strips a client-submitted doc to the same whitelist before it's ever stored (a server action can be called directly, bypassing the editor UI). `renderInlineHtml` renders without the outer `<p>` — used wherever a field is embedded inside a page element that already carries its own typography (a heading, an existing `<p>`), where a nested `<p>` would be invalid HTML.
- **`app/lib/block-actions.ts`** — `upsertBlock(blockKey, lang, section, json, expectedUpdatedAt)`. Conflict check: if the stored row's `updated_at` has moved past `expectedUpdatedAt`, the write is refused and the caller's `latest` value comes back instead of silently overwriting it.
- **`app/lib/editor/useBlockPersistence.ts`** — autosaves one Tiptap editor 800ms after the last keystroke, or immediately on blur/unmount so a quick navigation right after typing doesn't lose the debounce window.
- **`app/components/editor/EditableText.tsx`** — the migrated counterpart to the plain one, addressed by the same dot-path `block_key` (e.g. `"hero.name"`) content-path.ts already resolves. Not editing → renders `renderInlineHtml` via `dangerouslySetInnerHTML`. Editing → dynamically imports `RichEditableField.tsx` (`next/dynamic`, `ssr: false`) — **this is the boundary that keeps Tiptap out of a public visitor's bundle entirely.**
- **`app/components/editor/FloatingToolbar.tsx`** — `@floating-ui/react`, anchored to a *virtual* reference computed from `editor.view.coordsAtPos` (caret or selection bounding rect), not a real DOM node. Framer Motion `AnimatePresence`, spring on enter / 120ms ease-out on exit, opacity-only under `prefers-reduced-motion`. `useFloating({ transform: false })` — floating-ui defaults to positioning via `transform: translate(...)`, which Framer Motion's own `transform`-driven scale/y animation was silently overwriting (toolbar rendered pinned at its unpositioned top-left corner); `top`/`left` positioning avoids the collision. Subscribes to the editor's `transaction` event to force a re-render on every selection/formatting change — `editor.isActive()`/`getAttributes()` read live editor state at render time, which React has no way to know changed on its own when the toolbar was already open.
- **Font size** — `@tiptap/extension-text-style` ships an official `FontSize` extension (`editor.commands.setFontSize('16px')`, a raw CSS string, not the number spec'd originally). `app/lib/editor/extensions/fontSize.ts` holds the shared `FONT_SIZES` whitelist both the toolbar's stepper+dropdown (`toolbar/FontSizeControl.tsx`) and the server-side sanitizer check against. Mirrors Tailwind's own text-size scale (12–96px) rather than an arbitrary list — these fields sit inline among Tailwind-styled headings (the hero name renders at 60px via `text-6xl`), so the options cover what's already on the page. The toolbar's readout shows the *actual* computed size at the selection (`getComputedStyle`), not just an explicit mark — otherwise text with no mark at all (inheriting its size from a surrounding heading class) would show nothing despite being visibly huge. Real inline `font-size` on a real `<span>`, so surrounding layout reflows exactly like any other browser text resize, no special handling needed.
- **Strikethrough/color/highlight/link/alignment** — `@tiptap/extension-highlight`, `@tiptap/extension-link`, `@tiptap/extension-text-align`, plus `Color` (also bundled in `@tiptap/extension-text-style`, same package as `TextStyle`/`FontSize` — no separate `@tiptap/extension-color` install needed). `app/lib/editor/extensions/colors.ts` holds the `TEXT_COLORS` swatch whitelist (a curated palette, not a free-form picker) and the shared `HIGHLIGHT_STYLE` (single fixed color, used by both the Tiptap extension config and the serializer so edit and public-read views match). Link `href` goes through a strict `isSafeHref` whitelist (`http(s)://...` or a well-formed `mailto:` only) in **both** the editor's own normalizer (`LinkPopover.tsx`, prepends `https://` to a bare domain) and `render-html.ts`'s `sanitizeDoc`/`sanitizeMark` — verified directly: a raw `{href: 'javascript:alert(1)'}` payload calling `sanitizeDoc` straight (bypassing the editor UI) comes back with the mark dropped entirely. `LinkPopover`'s text input needs real DOM focus to type into (unlike every other control, which uses `onMouseDown+preventDefault` to never take focus from the editor) — `FloatingToolbar` tracks a `linkOpen` ref and skips its hide-on-blur while the popover is open, or the toolbar would vanish the moment the input gets focus. Opens via `Cmd/Ctrl+K` (window-level keydown, `preventDefault` to stop the browser's own address-bar shortcut).
- Each editable field disables **Enter** (`editorProps.handleKeyDown`) — these are short, single-paragraph fields (a name, a title), not multi-paragraph documents, and the inline renderer above assumes exactly one paragraph.
- Placeholder CSS: a Tiptap field is never truly `:empty` like the plain contentEditable span (it always contains a paragraph element), so it needs its own rule — `.ProseMirror p.is-editor-empty:first-child::before` in `globals.css`, alongside the existing `.editable-field:empty:before` rule the plain fields still use.

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
- `portfolio_blocks` — one row per migrated rich text field per language. Columns: `portfolio_id uuid`, `section text`, `block_key text` (the same dot-path content-path.ts uses, e.g. `"hero.name"`), `lang text` (`en`/`es`), `content_json jsonb`, `content_html text`, `sort_order int`, `updated_at timestamptz`. Unique on `(portfolio_id, block_key, lang)`. Keyed by `portfolio_id` rather than `user_id`, matching `portfolio_media`'s pattern.

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
