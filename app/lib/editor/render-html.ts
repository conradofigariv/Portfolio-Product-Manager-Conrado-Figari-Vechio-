import type { JSONContent } from '@tiptap/core'

/**
 * Turns a Tiptap document into HTML without touching Tiptap's own
 * generateHTML — that needs a DOM (jsdom) to run server-side, which this app
 * doesn't otherwise depend on. This walks the JSON directly instead.
 *
 * Deliberately whitelist-only: it can only ever emit the tags listed in
 * MARK_TAGS plus <p>, regardless of what a node/mark type in the JSON says —
 * an unrecognized node just renders its children with no wrapping tag, and
 * an unrecognized mark is skipped. A block's content_json reaches here from
 * a server action that already accepted it from the client, so this is the
 * layer that actually decides what can end up in HTML served to visitors.
 *
 * Extend MARK_TAGS/NODE_RENDERERS here as more marks/nodes are supported —
 * currently just what Step 2 (bold/italic/underline) needs.
 */
const MARK_TAGS: Record<string, string> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarks(text: string, marks: JSONContent['marks']): string {
  let html = escapeHtml(text)
  for (const mark of marks ?? []) {
    const tag = MARK_TAGS[mark.type]
    if (!tag) continue
    html = `<${tag}>${html}</${tag}>`
  }
  return html
}

function renderNode(node: JSONContent): string {
  if (node.type === 'text') return renderMarks(node.text ?? '', node.marks)

  const inner = (node.content ?? []).map(renderNode).join('')

  switch (node.type) {
    case 'paragraph':
      return `<p>${inner}</p>`
    case 'doc':
    default:
      return inner
  }
}

export function renderBlockHtml(doc: JSONContent): string {
  if (!doc || typeof doc !== 'object') return ''
  return renderNode(doc)
}

/**
 * Same content, without the wrapping <p> — for embedding inline inside a
 * page element that already carries its own typography (a heading, an
 * existing <p>), where a nested block-level <p> would be invalid HTML and
 * could shift layout. Editable fields disable Enter, so in practice this is
 * always exactly one paragraph; multiple ever getting through (e.g. pasted
 * content) just lose the paragraph break rather than nesting invalidly.
 */
export function renderInlineHtml(doc: JSONContent): string {
  if (!doc?.content?.length) return ''
  return doc.content
    .filter((node) => node.type === 'paragraph')
    .map((paragraph) =>
      (paragraph.content ?? [])
        .filter((node) => node.type === 'text')
        .map((node) => renderMarks(node.text ?? '', node.marks))
        .join('')
    )
    .join(' ')
}

const ALLOWED_NODES = new Set(['doc', 'paragraph', 'text'])
const ALLOWED_MARKS = new Set(Object.keys(MARK_TAGS))

/**
 * Strips a client-submitted document down to only what this app's schema
 * actually supports, before it's ever stored — belt-and-suspenders on top of
 * renderBlockHtml's own whitelist, since a request can call the server
 * action directly without going through the editor UI at all. Also caps
 * total text length against an unbounded payload.
 */
export function sanitizeDoc(input: unknown, maxLength: number): JSONContent {
  let remaining = maxLength

  function walk(node: unknown): JSONContent | null {
    if (!node || typeof node !== 'object') return null
    const n = node as JSONContent
    if (typeof n.type !== 'string' || !ALLOWED_NODES.has(n.type)) return null

    if (n.type === 'text') {
      if (remaining <= 0) return null
      const text = typeof n.text === 'string' ? n.text.slice(0, remaining) : ''
      if (!text) return null
      remaining -= text.length
      const marks = Array.isArray(n.marks)
        ? n.marks.filter(
            (m): m is { type: string } => !!m && typeof m.type === 'string' && ALLOWED_MARKS.has(m.type)
          )
        : undefined
      return marks?.length ? { type: 'text', text, marks } : { type: 'text', text }
    }

    const content = Array.isArray(n.content)
      ? n.content.map(walk).filter((c): c is JSONContent => c !== null)
      : []
    return { type: n.type, ...(content.length ? { content } : {}) }
  }

  const result = walk(input)
  return result && result.type === 'doc' ? result : EMPTY_DOC
}

// A block with no text yet — what a freshly-inserted row and a cleared
// field both look like.
export const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

export function isEmptyDoc(doc: JSONContent | null | undefined): boolean {
  if (!doc) return true
  return renderBlockHtml(doc).replace(/<p><\/p>/g, '').trim() === ''
}
