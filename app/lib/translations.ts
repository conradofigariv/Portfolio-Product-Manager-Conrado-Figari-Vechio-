export type Lang = 'en' | 'es'

export const translations = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      downloadCV: 'Download CV',
    },
    hero: {
      greeting: "Hi, I'm",
      name: 'Conrado Figari',
      tagline: 'I build products that solve real problems.',
      description:
        'Product Manager specialized in digital strategy, user experience, and cross-functional team leadership. I turn ideas into products that create real value.',
      cta: 'See my projects',
      ctaSecondary: 'Contact me',
      stats: {
        years: { value: '5+', label: 'Years in PM' },
        users: { value: '500K+', label: 'Users impacted' },
        products: { value: '100%', label: 'Products launched' },
      },
    },
    about: {
      title: 'About me',
      bio1:
        "I'm a Product Manager with 5+ years of experience building digital products that impact millions of users.",
      bio2:
        'My approach combines deep user research, data analysis, and strategic thinking to identify high-impact opportunities. I have worked in agile startups and large organizations, always focused on solving real problems.',
      bio3: 'Currently working at',
      currentRole: '[Current Company]',
      currentRoleAs: "as Product Manager, leading feature development that improves our users' experience.",
      experience: 'Experience',
      jobs: [
        { role: 'Product Manager', company: '[Company]', period: '2023 – Present' },
        { role: 'Senior Product Manager', company: '[Company]', period: '2021 – 2023' },
        { role: 'Product Manager', company: '[Startup]', period: '2019 – 2021' },
      ],
      education: 'Education',
      degrees: [
        { title: 'Business Administration', institution: 'National University', years: '2015 – 2019' },
        { title: 'Product Management Certificate', institution: 'Product School', years: '2020' },
      ],
      location: 'Location',
      city: 'Buenos Aires, Argentina',
      remote: 'Available for remote work',
    },
    projects: {
      title: 'My Projects',
      subtitle:
        'Case studies where I led strategy and execution — and delivered real results.',
      readMore: 'Read full case study',
      cta: {
        title: 'Want to see more projects?',
        description:
          'These are some of my most impactful works. I have many more stories about transforming products and scaling businesses.',
        button: "Let's talk about your project",
      },
      items: [
        {
          year: '2023',
          title: 'Digital Payments Platform',
          narrative: [
            'We identified unnecessary friction in the checkout flow.',
            'We ran research with 100+ users to understand their pain points.',
            'We redesigned the experience, reducing steps from 8 to 3.',
            'Result: +45% conversion and users 3x happier.',
          ],
          metrics: [
            { label: 'Conversion', value: '+45%' },
            { label: 'Users', value: '500K+' },
            { label: 'Time saved', value: '-2.5s' },
          ],
          tags: ['Fintech', 'UX Design', 'Strategy'],
        },
        {
          year: '2022',
          title: 'Delivery Mobile App',
          narrative: [
            'We dreamed of revolutionizing delivery in LATAM.',
            'We validated the idea with 200 interviews in Buenos Aires and CDMX.',
            'We built the MVP in 3 months with a cross-functional team.',
            'Successful launch: 100K downloads in 6 months, 4.8⭐ rating.',
          ],
          metrics: [
            { label: 'Downloads', value: '100K' },
            { label: 'Rating', value: '4.8⭐' },
            { label: 'Active users', value: '50K/mo' },
          ],
          tags: ['Mobile', 'Startups', 'Growth'],
        },
        {
          year: '2021',
          title: 'ML Recommendations System',
          narrative: [
            'Users were not finding relevant products.',
            'We implemented ML algorithms to personalize every experience.',
            'The key was balancing novelty with relevance.',
            'Result: +60% engagement and 92% accuracy in recommendations.',
          ],
          metrics: [
            { label: 'Engagement', value: '+60%' },
            { label: 'Accuracy', value: '92%' },
            { label: 'Time to ship', value: '3 months' },
          ],
          tags: ['Machine Learning', 'Data', 'Personalization'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      subtitle: 'Core competencies I have developed as a Product Manager.',
      categories: [
        {
          category: 'Product Strategy',
          skills: ['Product Roadmap', 'Market Research', 'Competitive Analysis', 'OKRs & KPIs', 'Product Vision'],
        },
        {
          category: 'User Experience',
          skills: ['User Research', 'Wireframing', 'User Testing', 'User Journeys', 'Accessibility'],
        },
        {
          category: 'Data & Analytics',
          skills: ['Data Analysis', 'SQL', 'Analytics Tools', 'A/B Testing', 'Metrics Design'],
        },
        {
          category: 'Leadership',
          skills: ['Cross-functional Leadership', 'Stakeholder Management', 'Agile/Scrum', 'Team Building', 'Decision Making'],
        },
        {
          category: 'Technical',
          skills: ['Frontend Basics', 'Backend Basics', 'APIs & Integrations', 'Database Concepts', 'Product Analytics'],
        },
        {
          category: 'Tools',
          skills: ['Figma', 'Jira', 'Mixpanel', 'Google Analytics', 'Notion', 'Miro'],
        },
      ],
      certifications: 'Certifications',
      certs: [
        { title: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance' },
        { title: 'Product Management Certification', issuer: 'Product School' },
        { title: 'Google Analytics Certification', issuer: 'Google' },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: "Want to collaborate or have an interesting opportunity? I'd love to hear from you.",
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        message: 'Message',
        messagePlaceholder: 'Your message here...',
        submit: 'Send message',
        success: 'Message sent! I will get back to you soon.',
      },
      otherWays: 'Other ways to reach me',
      availability: 'Availability',
      availableFor: 'I am currently available for:',
      availableItems: [
        'Product Management consulting projects',
        'Mentoring aspiring Product Managers',
        'Collaborations on startups and innovative products',
        'Talks and workshops on Product Management',
      ],
    },
    footer: {
      tagline: 'Product Manager passionate about building impactful products.',
      quickLinks: 'Quick links',
      social: 'Social',
      rights: '© 2024 Conrado Figari. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },
  es: {
    nav: {
      about: 'Sobre mí',
      projects: 'Proyectos',
      skills: 'Habilidades',
      contact: 'Contacto',
      downloadCV: 'Descargar CV',
    },
    hero: {
      greeting: 'Hola, me llamo',
      name: 'Conrado Figari',
      tagline: 'Creo productos que resuelven problemas reales.',
      description:
        'Product Manager especializado en estrategia digital, experiencia de usuario y liderazgo de equipos cross-funcionales. Transformo ideas en productos que generan valor real.',
      cta: 'Ver mis proyectos',
      ctaSecondary: 'Contactarme',
      stats: {
        years: { value: '5+', label: 'Años en PM' },
        users: { value: '500K+', label: 'Usuarios impactados' },
        products: { value: '100%', label: 'Productos lanzados' },
      },
    },
    about: {
      title: 'Sobre mí',
      bio1:
        'Soy un Product Manager con más de 5 años de experiencia creando productos digitales que impactan a millones de usuarios.',
      bio2:
        'Mi enfoque combina research profundo de usuarios, análisis de datos y pensamiento estratégico para identificar oportunidades de impacto. He trabajado en startups ágiles y grandes organizaciones, siempre enfocado en resolver problemas reales.',
      bio3: 'Actualmente trabajo en',
      currentRole: '[Empresa Actual]',
      currentRoleAs: 'como Product Manager, liderando el desarrollo de features que mejoran la experiencia de nuestros usuarios.',
      experience: 'Experiencia',
      jobs: [
        { role: 'Product Manager', company: '[Empresa]', period: '2023 – Presente' },
        { role: 'Senior Product Manager', company: '[Empresa]', period: '2021 – 2023' },
        { role: 'Product Manager', company: '[Startup]', period: '2019 – 2021' },
      ],
      education: 'Educación',
      degrees: [
        { title: 'Licenciatura en Administración de Empresas', institution: 'Universidad Nacional', years: '2015 – 2019' },
        { title: 'Certificación en Product Management', institution: 'Product School', years: '2020' },
      ],
      location: 'Ubicación',
      city: 'Buenos Aires, Argentina',
      remote: 'Disponible para trabajo remoto',
    },
    projects: {
      title: 'Mis Proyectos',
      subtitle: 'Casos de estudio donde lideré la estrategia y la ejecución — con resultados reales.',
      readMore: 'Leer caso de estudio completo',
      cta: {
        title: '¿Querés ver más proyectos?',
        description:
          'Estos son algunos de mis trabajos más impactantes. Tengo muchas más historias sobre cómo transformé productos y escalé negocios.',
        button: 'Hablemos de tu proyecto',
      },
      items: [
        {
          year: '2023',
          title: 'Plataforma de Pagos Digital',
          narrative: [
            'Identificamos que el flujo de checkout tenía fricción innecesaria.',
            'Hicimos research con 100+ usuarios para entender sus pain points.',
            'Rediseñamos la experiencia, reduciendo pasos de 8 a 3.',
            'Resultado: +45% conversión y usuarios 3x más felices.',
          ],
          metrics: [
            { label: 'Conversión', value: '+45%' },
            { label: 'Usuarios', value: '500K+' },
            { label: 'Tiempo ganado', value: '-2.5s' },
          ],
          tags: ['Fintech', 'UX Design', 'Estrategia'],
        },
        {
          year: '2022',
          title: 'App Móvil de Delivery',
          narrative: [
            'Soñábamos con revolucionar el delivery en LATAM.',
            'Validamos la idea con 200 entrevistas en Buenos Aires y CDMX.',
            'Construimos el MVP en 3 meses con un equipo cross-funcional.',
            'Launch exitoso: 100K descargas en 6 meses, 4.8⭐ rating.',
          ],
          metrics: [
            { label: 'Descargas', value: '100K' },
            { label: 'Rating', value: '4.8⭐' },
            { label: 'Usuarios activos', value: '50K/mes' },
          ],
          tags: ['Mobile', 'Startups', 'Growth'],
        },
        {
          year: '2021',
          title: 'Sistema de Recomendaciones ML',
          narrative: [
            'Los usuarios no encontraban productos relevantes.',
            'Implementamos algoritmos de ML para personalizar cada experiencia.',
            'La clave fue balancear novedad con relevancia.',
            'Resultado: +60% engagement y 92% accuracy en recomendaciones.',
          ],
          metrics: [
            { label: 'Engagement', value: '+60%' },
            { label: 'Relevancia', value: '92%' },
            { label: 'Implementación', value: '3 meses' },
          ],
          tags: ['Machine Learning', 'Data', 'Personalización'],
        },
      ],
    },
    skills: {
      title: 'Habilidades',
      subtitle: 'Competencias clave que he desarrollado como Product Manager.',
      categories: [
        {
          category: 'Estrategia de Producto',
          skills: ['Product Roadmap', 'Market Research', 'Análisis Competitivo', 'OKRs & KPIs', 'Visión de Producto'],
        },
        {
          category: 'Experiencia de Usuario',
          skills: ['User Research', 'Wireframing', 'User Testing', 'User Journeys', 'Accesibilidad'],
        },
        {
          category: 'Data & Analytics',
          skills: ['Análisis de Datos', 'SQL', 'Herramientas Analytics', 'A/B Testing', 'Diseño de Métricas'],
        },
        {
          category: 'Liderazgo',
          skills: ['Liderazgo Cross-funcional', 'Gestión de Stakeholders', 'Agile/Scrum', 'Team Building', 'Toma de Decisiones'],
        },
        {
          category: 'Technical',
          skills: ['Frontend Básico', 'Backend Básico', 'APIs & Integraciones', 'Conceptos de Bases de Datos', 'Product Analytics'],
        },
        {
          category: 'Herramientas',
          skills: ['Figma', 'Jira', 'Mixpanel', 'Google Analytics', 'Notion', 'Miro'],
        },
      ],
      certifications: 'Certificaciones',
      certs: [
        { title: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance' },
        { title: 'Certificación en Product Management', issuer: 'Product School' },
        { title: 'Certificación Google Analytics', issuer: 'Google' },
      ],
    },
    contact: {
      title: 'Contacto',
      subtitle: '¿Querés colaborar o tenés una oportunidad interesante? Me encantaría escucharte.',
      form: {
        name: 'Nombre',
        namePlaceholder: 'Tu nombre',
        email: 'Email',
        emailPlaceholder: 'tu@email.com',
        message: 'Mensaje',
        messagePlaceholder: 'Tu mensaje aquí...',
        submit: 'Enviar mensaje',
        success: '¡Mensaje enviado! Te responderé pronto.',
      },
      otherWays: 'Otras formas de contactarme',
      availability: 'Disponibilidad',
      availableFor: 'Actualmente estoy disponible para:',
      availableItems: [
        'Proyectos de consultoría en Product Management',
        'Mentoría a Product Managers en crecimiento',
        'Colaboraciones en startups y productos innovadores',
        'Charlas y workshops sobre Product Management',
      ],
    },
    footer: {
      tagline: 'Product Manager apasionado por crear productos de impacto.',
      quickLinks: 'Enlaces rápidos',
      social: 'Redes sociales',
      rights: '© 2024 Conrado Figari. Todos los derechos reservados.',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
  },
}
