import { Instrument_Sans } from 'next/font/google'
import { getUser } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from './components/LandingPage'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

// The product landing and the sign-in screen are the same page: there is
// nothing to pitch that isn't also the thing you sign in to try. A signed-in
// visitor has nothing to do here, so they go straight to their editor.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>
}) {
  const user = await getUser()
  if (user) redirect('/admin')

  const { error, reason } = await searchParams

  return (
    <div className={`${instrumentSans.className} bg-[#08080a] text-[#f4f4f5] antialiased overflow-x-hidden`}>
      <section className="relative min-h-[min(92vh,860px)] flex flex-col overflow-hidden bg-[#08080a]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        >
          <source src="/videos/video-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[2] pointer-events-none bg-[linear-gradient(100deg,rgba(8,8,10,0.94)_0%,rgba(8,8,10,0.82)_34%,rgba(8,8,10,0.35)_62%,rgba(8,8,10,0.55)_100%)]" />
        <div className="absolute left-0 right-0 bottom-0 h-[200px] z-[2] pointer-events-none bg-[linear-gradient(to_bottom,rgba(8,8,10,0)_0%,#08080a_96%)]" />

        <LandingPage error={error} reason={reason} />
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-5 px-5 sm:px-9 lg:px-[72px] py-7 pb-10 border-t border-white/[0.08] text-sm text-[#71717a]">
        <div className="flex items-center gap-2.5">
          <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d8ff3e] flex items-center justify-center text-[15px] font-semibold text-[#08080a] tracking-[-0.03em]">
            P
          </div>
          <span className="text-[15px] font-medium tracking-[-0.02em] text-[#a1a1aa]">Portfolio App</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
