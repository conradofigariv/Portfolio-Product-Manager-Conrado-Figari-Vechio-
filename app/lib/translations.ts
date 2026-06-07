export type Lang = 'en' | 'es'

export const translations = {
  en: {
    nav: {
      about: 'Story',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      downloadCV: 'Download CV',
    },
    hero: {
      greeting: "Hi, I'm",
      name: 'Conrado Figari Vechio',
      tagline: 'The intersection between developers, stakeholders, and product.',
      description: 'From raffle tickets to 6 SaaS tools at a 2,500+ employee energetic company.',
      cta: 'See my projects',
      ctaSecondary: 'Contact me',
      stats: {
        years: { value: '8y', label: 'Building businesses' },
        people: { value: '50+', label: 'People led' },
        tools: { value: '6 SaaS', label: 'Tools built at EPEC' },
      },
    },
    journey: {
      title: 'The Story',
      chapters: [
        {
          tag: 'University · 2014',
          heading: "I didn't start out planning to be a Product Manager.",
          body: "I started by selling raffle tickets. When I joined AVEIT in my first year of university, the pitch was simple: sell enough raffles during your degree and you get a months-long road trip in a motorhome when you graduate. That was enough to get me in the door. But once I was inside, I found something I wasn't expecting.",
        },
        {
          tag: 'AVEIT · HR & Sales',
          heading: 'I chose HR deliberately.',
          body: 'I was studying Electronic Engineering and knew I needed the opposite: soft skills, people, leadership. By the time I left, I was coordinating 50 people across HR and sales simultaneously, setting records in both membership recruitment and fundraising that year.',
        },
        {
          tag: '2016 – 2024 · 8 years',
          heading: 'Then I built a business.',
          body: 'For 8 years: suppliers in China, TikTok growth from zero to 4,500 followers in three months, an e-commerce operation, and eventually a bot that handled leads and customers on its own while I focused elsewhere. It was profitable every year through Argentina\'s inflation and instability. By most measures, it was working. But at some point I stopped feeling it.',
        },
        {
          tag: 'The turning point',
          heading: 'I asked myself two questions.',
          body: 'What would I do for free? And when was I happiest? The answer to both was the same: leading projects, building teams, and helping people become their best. That is when I decided to become a Product Manager. So I got PSPO I certified and started looking for a place to apply it.',
        },
        {
          tag: 'EPEC · 2024 – Present',
          heading: "I didn't find the role. I built it.",
          body: "I was hired at EPEC as an Electronic Engineer, not as a PM. My job was to help management visualize data. But when I started asking my managers how they actually wanted to see the information and what decisions they needed to make faster, the role changed. Those conversations turned into requirements, requirements turned into modules, and before long I had built six internal SaaS tools that replaced workflows nobody had questioned in years. Four months in, my managers use them every day and the difference is visible across the board.",
        },
        {
          tag: 'Today',
          heading: 'Find the real problem inside the noise.',
          body: "I still want to get my pilot license one day. But right now, I want to keep doing exactly this: finding the real problem inside the noise, and building something that solves it.",
        },
      ],
    },
    projects: {
      title: 'Projects',
      subtitle: 'Real cases. Real impact.',
      cta: {
        title: 'Want to know more?',
        description: "These are the projects I'm most proud of. Each one started with a real problem and ended with something people actually use.",
        button: "Let's talk",
      },
      items: [
        {
          year: '2024',
          tag: 'Internal tooling · EPEC',
          title: '6 SaaS Tools in 4 Months',
          narrative: [
            'Hired as an Electronic Engineer to help management visualize data.',
            'I started asking the right questions: how do you want to see this? What decisions do you need to make faster?',
            'Those questions turned into requirements, requirements into modules.',
            '6 internal SaaS tools built in 4 months. Every manager uses them daily.',
          ],
          metrics: [
            { label: 'Tools built', value: '6' },
            { label: 'Time to impact', value: '4 months' },
            { label: 'Teammates', value: '2 managers, 2 directors' },
          ],
          tags: ['Supabase', 'React', 'Next.js', 'Vercel', 'Claude Code'],
        },
        {
          year: '2023',
          tag: 'AI · Automation',
          title: 'AI-Powered CRM from Scratch',
          narrative: [
            'Managing 50 daily customer conversations manually was unsustainable.',
            'Built an automated CRM using N8n and ChatGPT API — from zero.',
            'The bot handled conversations, qualified leads, and updated records automatically.',
            'Response time dropped by 80%. I could focus on what actually mattered.',
          ],
          metrics: [
            { label: 'Conversations/day', value: '50' },
            { label: 'Response time', value: '−80%' },
            { label: 'Built with', value: 'N8n + GPT' },
          ],
          tags: ['AI', 'Automation', 'CRM', 'N8n', 'ChatGPT API'],
        },
        {
          year: '2022',
          tag: 'Growth · E-commerce',
          title: 'TikTok 0 → 4,500 in 3 Months',
          narrative: [
            'Needed to grow the brand without a marketing budget.',
            'Studied the platform, tested formats, doubled down on what worked.',
            '0 to 4,500 followers in 3 months — organic, no ads.',
            'Content became a consistent acquisition channel for the e-commerce.',
          ],
          metrics: [
            { label: 'Followers', value: '4,500' },
            { label: 'Time', value: '3 months' },
            { label: 'Budget', value: '$0 ads' },
          ],
          tags: ['Growth', 'Content', 'TikTok', 'E-commerce'],
        },
        {
          year: '2016–2024',
          tag: 'Entrepreneurship',
          title: '8 Years Running a Business',
          narrative: [
            'Built and ran a business through Argentina\'s toughest economic years.',
            'Managed suppliers in China, built a full e-commerce operation end-to-end.',
            'Kept it profitable through inflation, devaluation, and instability.',
            'Learned more about product, people, and decisions than any course could teach.',
          ],
          metrics: [
            { label: 'Years', value: '8' },
            { label: 'Market', value: 'Argentina' },
            { label: 'Supply chain', value: 'China' },
          ],
          tags: ['Entrepreneurship', 'Operations', 'E-commerce', 'Supply chain'],
        },
        {
          year: '2015',
          tag: 'Leadership · AVEIT',
          title: 'Leading 50 People to Record-Breaking Results',
          narrative: [
            'Took over leadership of 50 people across HR and sales at AVEIT.',
            'That year, we broke the organization\'s all-time record for advertising sales.',
            'We also set a new record for member sign-ups — the highest in the organization\'s history.',
            'On top of that, I led the full migration and loading of the entire member database, digitizing every record the organization had up to that point.',
          ],
          metrics: [
            { label: 'People led', value: '50' },
            { label: 'Sales record', value: 'All-time high' },
            { label: 'Sign-ups record', value: 'All-time high' },
          ],
          tags: ['Leadership', 'HR & Sales', 'AVEIT', 'Operations'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      subtitle: 'Built through real work, not just coursework.',
      categories: [
        {
          category: 'Product',
          skills: ['Product Discovery', 'User Research', 'Roadmapping', 'OKRs & KPIs', 'Agile / Scrum', 'PSPO I Certified'],
        },
        {
          category: 'Technical',
          skills: ['Electronic Engineering', 'No-code / Low-code', 'N8n Automations', 'ChatGPT API', 'Data Visualization', 'SaaS Architecture'],
        },
        {
          category: 'Business',
          skills: ['Operations', 'Supply Chain (China)', 'E-commerce', 'Financial Management', 'Team Leadership', 'Stakeholder Management'],
        },
        {
          category: 'Growth',
          skills: ['Content Strategy', 'TikTok Growth', 'CRM Automation', 'Lead Generation', 'A/B Testing', 'Funnel Optimization'],
        },
        {
          category: 'Leadership',
          skills: ['HR Coordination (50 people)', 'Cross-functional Teams', 'Project Management', 'Decision Making', 'Mentoring'],
        },
        {
          category: 'Tools',
          skills: ['Figma', 'Jira', 'N8n', 'Notion', 'ChatGPT API', 'Google Analytics'],
        },
      ],
      certifications: 'Certifications',
      certs: [
        { title: 'Professional Scrum Product Owner I (PSPO I)', issuer: 'Scrum.org' },
        { title: 'Electronic Engineering', issuer: 'Universidad Nacional de Córdoba' },
      ],
    },
    contact: {
      title: "Let's talk",
      subtitle: "If you have an interesting problem that needs solving, I'd love to hear about it.",
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        message: 'Message',
        messagePlaceholder: 'Tell me about your project or opportunity...',
        submit: 'Send message',
        success: "Message sent! I'll get back to you soon.",
      },
      otherWays: 'Other ways to reach me',
      availability: 'Open to',
      availableFor: "Right now I'm available for:",
      availableItems: [
        'Full-time Product Manager roles',
        'Product consulting and advisory',
        'Automation and internal tooling projects',
        'Conversations about interesting problems',
      ],
    },
    footer: {
      tagline: 'Finding the real problem inside the noise.',
      quickLinks: 'Quick links',
      social: 'Social',
      rights: '© 2024 Conrado Figari. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },

  es: {
    nav: {
      about: 'Historia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      contact: 'Contacto',
      downloadCV: 'Descargar CV',
    },
    hero: {
      greeting: 'Hola, soy',
      name: 'Conrado Figari Vechio',
      tagline: 'La intersección entre desarrolladores, stakeholders y producto.',
      description: 'De rifas a 6 herramientas SaaS en una empresa de 2,500+ personas llena de energía.',
      cta: 'Ver mis proyectos',
      ctaSecondary: 'Contactarme',
      stats: {
        years: { value: '8a', label: 'Construyendo negocios' },
        people: { value: '50+', label: 'Personas lideradas' },
        tools: { value: '6 SaaS', label: 'Herramientas en EPEC' },
      },
    },
    journey: {
      title: 'La Historia',
      chapters: [
        {
          tag: 'Universidad · 2014',
          heading: 'No empecé planificando ser Product Manager.',
          body: 'Empecé vendiendo rifas. Cuando me uní a AVEIT en mi primer año de universidad, la propuesta era simple: vender suficientes rifas durante la carrera y al terminar te ganabas un viaje de varios meses en motorhome. Con eso me engancharon. Pero una vez adentro, encontré algo que no esperaba.',
        },
        {
          tag: 'AVEIT · RRHH y Ventas',
          heading: 'Elegí Recursos Humanos a propósito.',
          body: 'Estudiaba Ingeniería Electrónica y sabía que necesitaba lo opuesto: habilidades blandas, personas, liderazgo. Cuando me fui, estaba coordinando 50 personas entre RRHH y ventas al mismo tiempo, y ese año rompimos records tanto en incorporación de socios como en recaudación publicitaria.',
        },
        {
          tag: '2016 – 2024 · 8 años',
          heading: 'Después construí un negocio.',
          body: 'Manejé proveedores en China, llevé una cuenta de TikTok de cero a 4.500 seguidores en tres meses, y mantuve el negocio rentable a pesar de la inflación y la inestabilidad de Argentina. En los últimos años armé el e-commerce y lo gestioné de punta a punta, y después construí un bot automático con N8n y la API de ChatGPT que automatizó 50 conversaciones diarias y redujo el tiempo de respuesta un 80%. Por cualquier métrica, funcionaba. Pero en algún momento dejó de llenarme.',
        },
        {
          tag: 'El punto de quiebre',
          heading: 'Me hice dos preguntas.',
          body: '¿Qué haría gratis? ¿Cuándo fui más feliz? La respuesta a las dos fue la misma: liderar proyectos, armar equipos, y ayudar a las personas a ser su mejor versión. Ahí decidí ser Product Manager. Me certifiqué como PSPO I y empecé a buscar dónde aplicarlo.',
        },
        {
          tag: 'EPEC · 2024 – Presente',
          heading: 'No encontré el rol. Lo construí.',
          body: 'Me contrataron en EPEC como Ingeniero Electrónico, no como PM. Mi trabajo era ayudar a la gerencia a visualizar datos. Pero cuando empecé a preguntarles cómo querían ver la información y qué decisiones necesitaban tomar más rápido, el rol cambió. Esas conversaciones se convirtieron en requerimientos, los requerimientos en módulos, y sin darme cuenta había construido seis herramientas SaaS internas que reemplazaron procesos que nadie había cuestionado en años. A cuatro meses de trabajo, mis jefes las usan todos los días y la diferencia se nota.',
        },
        {
          tag: 'Hoy',
          heading: 'Encontrar el problema real dentro del ruido.',
          body: 'Todavía quiero sacar mi licencia de piloto algún día. Pero por ahora, quiero seguir haciendo exactamente esto: encontrar el problema real dentro del ruido, y construir algo que lo resuelva.',
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      subtitle: 'Casos reales. Impacto real.',
      cta: {
        title: '¿Querés saber más?',
        description: 'Estos son los proyectos de los que más me enorgullezco. Cada uno empezó con un problema real y terminó con algo que la gente realmente usa.',
        button: 'Hablemos',
      },
      items: [
        {
          year: '2024',
          tag: 'Herramientas internas · EPEC',
          title: '6 Herramientas SaaS en 4 Meses',
          narrative: [
            'Me contrataron como Ingeniero Electrónico para ayudar a la gerencia a visualizar datos.',
            'Empecé a hacer las preguntas correctas: ¿cómo querés ver esto? ¿Qué decisiones necesitás tomar más rápido?',
            'Esas preguntas se convirtieron en requerimientos, los requerimientos en módulos.',
            '6 herramientas SaaS internas en 4 meses. Todos los gerentes las usan a diario.',
          ],
          metrics: [
            { label: 'Herramientas', value: '6' },
            { label: 'Tiempo', value: '4 meses' },
            { label: 'Usuarios diarios', value: 'Toda la gerencia' },
          ],
          tags: ['Herramientas internas', 'SaaS', 'Visualización de datos', 'EPEC'],
        },
        {
          year: '2023',
          tag: 'IA · Automatización',
          title: 'CRM con IA desde Cero',
          narrative: [
            'Gestionar 50 conversaciones diarias de clientes a mano era insostenible.',
            'Construí un CRM automatizado usando N8n y la API de ChatGPT — desde cero.',
            'El bot manejaba conversaciones, calificaba leads y actualizaba registros automáticamente.',
            'El tiempo de respuesta bajó un 80%. Yo me podía enfocar en lo que realmente importaba.',
          ],
          metrics: [
            { label: 'Conversaciones/día', value: '50' },
            { label: 'Tiempo de respuesta', value: '−80%' },
            { label: 'Construido con', value: 'N8n + GPT' },
          ],
          tags: ['IA', 'Automatización', 'CRM', 'N8n', 'ChatGPT API'],
        },
        {
          year: '2022',
          tag: 'Crecimiento · E-commerce',
          title: 'TikTok 0 → 4.500 en 3 Meses',
          narrative: [
            'Necesitaba hacer crecer la marca sin presupuesto de marketing.',
            'Estudié la plataforma, probé formatos, dupliqué lo que funcionaba.',
            'De 0 a 4.500 seguidores en 3 meses — orgánico, sin publicidad.',
            'El contenido se convirtió en un canal de adquisición constante para el e-commerce.',
          ],
          metrics: [
            { label: 'Seguidores', value: '4.500' },
            { label: 'Tiempo', value: '3 meses' },
            { label: 'Inversión en ads', value: '$0' },
          ],
          tags: ['Growth', 'Contenido', 'TikTok', 'E-commerce'],
        },
        {
          year: '2016–2024',
          tag: 'Emprendimiento',
          title: '8 Años Construyendo un Negocio',
          narrative: [
            'Construí y gestioné un negocio durante los años más difíciles de Argentina.',
            'Manejé proveedores en China, armé una operación de e-commerce de punta a punta.',
            'Lo mantuve rentable a través de inflación, devaluaciones e inestabilidad.',
            'Aprendí más sobre producto, personas y decisiones que cualquier curso.',
          ],
          metrics: [
            { label: 'Años', value: '8' },
            { label: 'Mercado', value: 'Argentina' },
            { label: 'Cadena de suministro', value: 'China' },
          ],
          tags: ['Emprendimiento', 'Operaciones', 'E-commerce', 'Supply chain'],
        },
        {
          year: '2015',
          tag: 'Liderazgo · AVEIT',
          title: 'Liderando 50 Personas hacia Récords Históricos',
          narrative: [
            'Asumí el liderazgo de 50 personas entre RRHH y ventas en AVEIT.',
            'Ese año, rompimos el récord histórico de venta de publicidad de la organización.',
            'También establecimos un nuevo récord de incorporación de socios — el más alto en la historia de la organización.',
            'Además, lideré la migración y carga completa de la base de datos de socios, digitalizando cada registro que la organización tenía hasta ese momento.',
          ],
          metrics: [
            { label: 'Personas lideradas', value: '50' },
            { label: 'Récord de ventas', value: 'Histórico' },
            { label: 'Récord de socios', value: 'Histórico' },
          ],
          tags: ['Liderazgo', 'RRHH y Ventas', 'AVEIT', 'Operaciones'],
        },
      ],
    },
    skills: {
      title: 'Habilidades',
      subtitle: 'Construidas con trabajo real, no solo con cursos.',
      categories: [
        {
          category: 'Producto',
          skills: ['Product Discovery', 'User Research', 'Roadmapping', 'OKRs & KPIs', 'Agile / Scrum', 'PSPO I Certificado'],
        },
        {
          category: 'Técnico',
          skills: ['Ingeniería Electrónica', 'No-code / Low-code', 'Automatizaciones N8n', 'API de ChatGPT', 'Visualización de datos', 'Arquitectura SaaS'],
        },
        {
          category: 'Negocio',
          skills: ['Operaciones', 'Supply Chain (China)', 'E-commerce', 'Gestión financiera', 'Liderazgo de equipos', 'Gestión de stakeholders'],
        },
        {
          category: 'Crecimiento',
          skills: ['Estrategia de contenido', 'Crecimiento en TikTok', 'Automatización de CRM', 'Generación de leads', 'A/B Testing', 'Optimización de funnels'],
        },
        {
          category: 'Liderazgo',
          skills: ['Coordinación de RRHH (50 personas)', 'Equipos cross-funcionales', 'Gestión de proyectos', 'Toma de decisiones', 'Mentoría'],
        },
        {
          category: 'Herramientas',
          skills: ['Figma', 'Jira', 'N8n', 'Notion', 'ChatGPT API', 'Google Analytics'],
        },
      ],
      certifications: 'Certificaciones',
      certs: [
        { title: 'Professional Scrum Product Owner I (PSPO I)', issuer: 'Scrum.org' },
        { title: 'Ingeniería Electrónica', issuer: 'Universidad Nacional de Córdoba' },
      ],
    },
    contact: {
      title: 'Hablemos',
      subtitle: 'Si tenés un problema interesante que necesita solución, me encantaría escucharlo.',
      form: {
        name: 'Nombre',
        namePlaceholder: 'Tu nombre',
        email: 'Email',
        emailPlaceholder: 'tu@email.com',
        message: 'Mensaje',
        messagePlaceholder: 'Contame tu proyecto u oportunidad...',
        submit: 'Enviar mensaje',
        success: '¡Mensaje enviado! Te respondo pronto.',
      },
      otherWays: 'Otras formas de contactarme',
      availability: 'Abierto a',
      availableFor: 'Por ahora estoy disponible para:',
      availableItems: [
        'Roles de Product Manager full-time',
        'Consultoría y advisory de producto',
        'Proyectos de automatización y herramientas internas',
        'Conversaciones sobre problemas interesantes',
      ],
    },
    footer: {
      tagline: 'Encontrando el problema real dentro del ruido.',
      quickLinks: 'Links rápidos',
      social: 'Redes',
      rights: '© 2024 Conrado Figari. Todos los derechos reservados.',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
  },
}
