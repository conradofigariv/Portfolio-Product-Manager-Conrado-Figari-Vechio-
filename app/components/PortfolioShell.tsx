import { LanguageProvider } from '../context/LanguageContext'
import type { Portfolio } from '../lib/portfolio'
import Navbar from './Navbar'
import Hero from './Hero'
import Journey from './Journey'
import ProjectTimeline from './ProjectTimeline'
import Skills from './Skills'
import Contact from './Contact'
import Footer from './Footer'
import EditBar from './EditBar'

// A whole portfolio, rendered from one person's data. The same components serve
// the public page and the editor — editing happens in place, so there is no
// second copy of the layout that could drift from this one.
export default function PortfolioShell({
  portfolio,
  editing = false,
  previewing = false,
}: {
  portfolio: Portfolio
  editing?: boolean
  previewing?: boolean
}) {
  return (
    <LanguageProvider portfolio={portfolio} editing={editing}>
      {previewing && (
        <div className="sticky top-0 z-[95] flex items-center justify-center gap-3 bg-dark-50 text-dark-900 text-xs font-medium py-2 px-4 text-center">
          <span>Vista previa — así se ve tu portfolio para cualquiera.</span>
          <a href={`/${portfolio.username}`} className="underline hover:no-underline">
            Volver a editar
          </a>
        </div>
      )}
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <ProjectTimeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <EditBar username={portfolio.username} />
    </LanguageProvider>
  )
}
