export default function Skills() {
  const skillCategories = [
    {
      category: 'Product Strategy',
      skills: [
        'Product Roadmap',
        'Market Research',
        'Competitive Analysis',
        'OKRs & KPIs',
        'Product Vision',
      ],
    },
    {
      category: 'User Experience',
      skills: [
        'User Research',
        'Wireframing',
        'User Testing',
        'User Journeys',
        'Accessibility',
      ],
    },
    {
      category: 'Data & Analytics',
      skills: [
        'Data Analysis',
        'SQL',
        'Analytics Tools',
        'A/B Testing',
        'Metrics Design',
      ],
    },
    {
      category: 'Liderazgo',
      skills: [
        'Cross-functional Leadership',
        'Stakeholder Management',
        'Agile/Scrum',
        'Team Building',
        'Decision Making',
      ],
    },
    {
      category: 'Technical',
      skills: [
        'Frontend Basics',
        'Backend Basics',
        'APIs & Integrations',
        'Database Concepts',
        'Product Analytics',
      ],
    },
    {
      category: 'Herramientas',
      skills: [
        'Figma',
        'Jira',
        'Mixpanel',
        'Google Analytics',
        'Notion',
        'Miro',
      ],
    },
  ]

  return (
    <section id="skills" className="bg-dark-800/50 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">Habilidades</h2>
        <p className="text-dark-400 text-lg mb-12 max-w-2xl">
          Competencias clave que he desarrollado como Product Manager.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div
              key={category.category}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-6 hover:border-dark-500 transition"
            >
              <h3 className="heading-sm mb-4 text-dark-50">
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-dark-300">
                    <span className="w-1.5 h-1.5 bg-dark-50 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-16 pt-16 border-t border-dark-700">
          <h3 className="heading-sm mb-8 text-dark-50">Certificaciones</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 bg-dark-900/50 p-6 rounded-lg border border-dark-700">
              <div className="text-2xl">📜</div>
              <div>
                <h4 className="font-semibold text-dark-50 mb-1">Certified Scrum Product Owner</h4>
                <p className="text-dark-400 text-sm">Scrum Alliance</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-dark-900/50 p-6 rounded-lg border border-dark-700">
              <div className="text-2xl">📜</div>
              <div>
                <h4 className="font-semibold text-dark-50 mb-1">Product Management Certification</h4>
                <p className="text-dark-400 text-sm">Product School</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-dark-900/50 p-6 rounded-lg border border-dark-700">
              <div className="text-2xl">📜</div>
              <div>
                <h4 className="font-semibold text-dark-50 mb-1">Google Analytics Certification</h4>
                <p className="text-dark-400 text-sm">Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
