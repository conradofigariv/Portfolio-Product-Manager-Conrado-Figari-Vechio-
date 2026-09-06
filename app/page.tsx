import PortfolioShell from './components/PortfolioShell'
import { defaultPortfolio } from './lib/portfolio'

// Conrado's portfolio stays at the root so the URL already shared on his CV
// keeps working; other people's live at /[username].
export default function Home() {
  return <PortfolioShell portfolio={defaultPortfolio} />
}
