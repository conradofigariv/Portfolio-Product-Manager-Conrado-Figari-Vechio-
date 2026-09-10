import type { JSONContent } from '@tiptap/core'
import type { Lang, Portfolio, PortfolioBlocks } from './portfolio'
import { defaultPortfolio } from './portfolio'
import { renderInlineHtml } from './editor/render-html'

// The throwaway portfolio behind the landing page's try-it-out skeleton
// (DemoStage.tsx). Deliberately *not* the real owner's content: a visitor is
// going to type over these fields, and typing over a stranger's real name and
// real metrics reads as vandalising someone's page rather than filling in your
// own. Neutral placeholders make it obvious the page is theirs to fill.
//
// Nothing here is ever written anywhere. There is no portfolio row, no
// portfolio_blocks row and no storage bucket behind it — LanguageProvider's
// `demo` flag routes every write into its own React state, which dies with
// the tab. See useBlockPersistence/useBlockList for the two branches.

export const DEMO_PROJECT_ID = 'demo-project'

function doc(text: string): JSONContent {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }],
  }
}

type Seed = {
  greeting: string
  name: string
  tagline: string
  description: string
  stats: [string, string][]
  year: string
  tag: string
  title: string
  narrative: string[]
  metrics: [string, string][]
  tags: string[]
}

const SEED: Record<Lang, Seed> = {
  es: {
    greeting: 'HOLA, SOY',
    name: 'Tu Nombre',
    tagline: 'Lo que hacés, en una línea',
    description:
      'Dos renglones sobre para quién trabajás y qué problemas resolvés. Este texto es tuyo: hacé click y escribí encima.',
    stats: [
      ['8', 'Años de experiencia'],
      ['+30', 'Proyectos entregados'],
      ['5', 'Equipos liderados'],
    ],
    year: '2024',
    tag: 'PRODUCTO · FINTECH',
    title: 'Rediseño del onboarding',
    narrative: [
      'El problema que encontraste y por qué importaba.',
      'Qué hiciste vos concretamente, no lo que hizo el equipo.',
      'El resultado, con un número si lo tenés.',
    ],
    metrics: [
      ['CONVERSIÓN', '+38%'],
      ['TIEMPO DE ALTA', '4 min'],
      ['USUARIOS', '12.000'],
    ],
    tags: ['Figma', 'SQL', 'Amplitude', 'Notion'],
  },
  en: {
    greeting: 'HI, I AM',
    name: 'Your Name',
    tagline: 'What you do, in one line',
    description:
      'Two lines about who you work for and what problems you solve. This text is yours — click it and type over it.',
    stats: [
      ['8', 'Years of experience'],
      ['30+', 'Projects shipped'],
      ['5', 'Teams led'],
    ],
    year: '2024',
    tag: 'PRODUCT · FINTECH',
    title: 'Onboarding redesign',
    narrative: [
      'The problem you found and why it mattered.',
      'What you personally did, not what the team did.',
      'The outcome, with a number if you have one.',
    ],
    metrics: [
      ['CONVERSION', '+38%'],
      ['TIME TO SIGN UP', '4 min'],
      ['USERS', '12,000'],
    ],
    tags: ['Figma', 'SQL', 'Amplitude', 'Notion'],
  },
}

// List items (narrative lines, tags) are addressed by a random id in the real
// schema, where it means nothing beyond uniqueness. Fixed ids here instead, so
// a re-seed on language toggle lands on the same keys rather than orphaning
// whatever the visitor had already reordered.
const listKey = (prefix: string, i: number) => `${prefix}.demo-${i}`

function blocksFor(lang: Lang): PortfolioBlocks {
  const seed = SEED[lang]
  const blocks: PortfolioBlocks = {}
  const put = (key: string, text: string, sortOrder = 0) => {
    const json = doc(text)
    blocks[key] ??= {}
    blocks[key][lang] = { json, html: renderInlineHtml(json), updatedAt: '', sortOrder }
  }

  put('hero.greeting', seed.greeting)
  put('hero.name', seed.name)
  put('hero.tagline', seed.tagline)
  put('hero.description', seed.description)
  seed.stats.forEach(([value, label], i) => {
    put(`stats.${i}.value`, value)
    put(`stats.${i}.label`, label)
  })

  const p = `projects.items.${DEMO_PROJECT_ID}`
  put(`${p}.year`, seed.year)
  put(`${p}.tag`, seed.tag)
  put(`${p}.title`, seed.title)
  seed.narrative.forEach((line, i) => put(listKey(`${p}.narrative`, i), line, i))
  seed.metrics.forEach(([label, value], i) => {
    put(`${p}.metrics.${i}.label`, label)
    put(`${p}.metrics.${i}.value`, value)
  })
  seed.tags.forEach((tag, i) => put(listKey(`${p}.tags`, i), tag, i))

  return blocks
}

// One portfolio per language rather than both languages in one document: the
// demo has no language toggle of its own (no Navbar), so it only ever needs
// the one the landing page is currently showing.
export function demoPortfolio(lang: Lang): Portfolio {
  return {
    username: 'demo',
    // No portrait, no background video, no project photos — the demo is
    // text-only on purpose, since an upload with no signed-in user has
    // nowhere to go.
    media: { portrait: null, backgroundVideos: [], cv: null, projectImages: {}, chapterPhotos: {} },
    // Never read by the demo (every field it renders has migrated to blocks),
    // but PortfolioContent is required by the type and a few components read
    // array *lengths* off it — stats and the project list, both fixed here.
    content: defaultPortfolio.content,
    blocks: blocksFor(lang),
  }
}
