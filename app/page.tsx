import Hero from './components/Hero'
import About from './components/About'
import ProjectTimeline from './components/ProjectTimeline'
import Skills from './components/Skills'
import Contact from './components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectTimeline />
      <Skills />
      <Contact />
    </main>
  )
}
