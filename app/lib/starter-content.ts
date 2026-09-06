import type { Lang, PortfolioContent } from './portfolio'

// What a new account starts with. Placeholder copy rather than an empty shell,
// so the first visit to the editor shows the shape of a finished portfolio
// instead of a blank form.
function starter(lang: Lang, displayName: string): PortfolioContent {
  const es = lang === 'es'

  return {
    hero: {
      greeting: es ? 'Hola, soy' : "Hi, I'm",
      name: displayName,
      tagline: es ? 'Tu titular va acá.' : 'Your headline goes here.',
      description: es
        ? 'Una línea sobre lo que hacés y para quién.'
        : 'One line about what you do and who you do it for.',
    },
    stats: [
      { value: '0', label: es ? 'Años de experiencia' : 'Years of experience' },
      { value: '0', label: es ? 'Proyectos' : 'Projects' },
      { value: '0', label: es ? 'Personas lideradas' : 'People led' },
    ],
    journey: {
      title: es ? 'La Historia' : 'The Story',
      chapters: [
        {
          id: 'chapter-0',
          tag: es ? 'El principio' : 'The beginning',
          heading: es ? 'Dónde empezó todo.' : 'Where it started.',
          body: es
            ? 'Contá cómo llegaste hasta acá: qué te trajo, qué aprendiste en el camino.'
            : 'Tell people how you got here: what brought you in, what you learned along the way.',
        },
      ],
    },
    projects: {
      title: es ? 'Proyectos' : 'Projects',
      subtitle: es ? 'Casos reales. Impacto real.' : 'Real cases. Real impact.',
      ctaTitle: es ? '¿Querés saber más?' : 'Want to know more?',
      ctaDescription: es
        ? 'Contá por qué estos proyectos te representan.'
        : 'Say why these projects represent you.',
      items: [
        {
          id: 'project-0',
          year: new Date().getFullYear().toString(),
          tag: es ? 'Tu categoría' : 'Your category',
          title: es ? 'Tu primer proyecto' : 'Your first project',
          narrative: [
            es ? 'Cuál era el problema.' : 'What the problem was.',
            es ? 'Qué hiciste al respecto.' : 'What you did about it.',
            es ? 'Cómo lo resolviste.' : 'How you solved it.',
            es ? 'Qué resultado tuvo.' : 'What came out of it.',
          ],
          metrics: [
            { label: es ? 'Métrica' : 'Metric', value: '—' },
            { label: es ? 'Métrica' : 'Metric', value: '—' },
            { label: es ? 'Métrica' : 'Metric', value: '—' },
          ],
          tags: [es ? 'Herramienta' : 'Tool'],
        },
      ],
    },
    skills: {
      title: es ? 'Habilidades' : 'Skills',
      subtitle: es ? 'Construidas con trabajo real.' : 'Built through real work.',
      categories: [
        {
          category: es ? 'Tu categoría' : 'Your category',
          skills: [es ? 'Tu habilidad' : 'Your skill'],
        },
      ],
      certs: [],
    },
    contact: {
      title: es ? 'Hablemos' : "Let's talk",
      subtitle: es
        ? 'Si tenés un problema interesante para resolver, me encantaría escucharlo.'
        : "If you have an interesting problem to solve, I'd love to hear about it.",
      availableItems: [es ? 'Contá qué estás buscando' : 'Say what you are looking for'],
    },
    footer: {
      tagline: es ? 'Tu frase de cierre.' : 'Your closing line.',
      rights: `© ${new Date().getFullYear()} ${displayName}`,
    },
  }
}

export function starterContent(displayName: string): Record<Lang, PortfolioContent> {
  const name = displayName.trim() || 'Your name'
  return { en: starter('en', name), es: starter('es', name) }
}
