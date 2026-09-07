import { Instrument_Sans } from 'next/font/google'
import { getUser } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from './components/GoogleSignInButton'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const steps = [
  {
    title: 'Iniciá sesión con Google',
    body: 'Sin formularios ni tutoriales. Un click y ya tenés tu portfolio.',
  },
  {
    title: 'Editá todo en vivo',
    body: 'Texto y fotos se tocan directo sobre el diseño real, no en un panel aparte.',
  },
  {
    title: 'Publicá con un click',
    body: 'Activá "Public" y tu portfolio queda online en tu propio link.',
  },
]

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

        <header className="relative z-[3] flex items-center justify-between gap-8 px-5 sm:px-9 lg:px-[72px] py-6">
          <div className="flex items-center gap-9">
            <div className="flex items-center gap-2.5">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d8ff3e] flex items-center justify-center text-[15px] font-semibold text-[#08080a] tracking-[-0.03em]">
                P
              </div>
              <span className="text-[17px] font-semibold tracking-[-0.02em]">Portfolio App</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6 text-[14.5px] text-[#d4d4d8]">
              <a href="#como" className="hover:text-white transition-colors">
                Cómo funciona
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <GoogleSignInButton
              showIcon={false}
              label="Iniciar sesión"
              pendingLabel="Redirigiendo…"
              className="text-[14.5px] text-[#d4d4d8] hover:text-white transition-colors disabled:opacity-60"
            />
            <GoogleSignInButton
              showIcon={false}
              label="Empieza gratis"
              pendingLabel="Redirigiendo…"
              className="inline-flex items-center h-10 px-5 rounded-full bg-[#f4f4f5] text-[#08080a] text-[14.5px] font-semibold tracking-[-0.01em] transition-colors hover:bg-white disabled:opacity-60"
            />
          </div>
        </header>

        <div className="relative z-[3] flex-1 flex items-center px-5 sm:px-9 lg:px-[72px] py-12 sm:py-16 lg:py-24">
          <div className="max-w-[660px]">
            <h1 className="m-0 text-[40px] sm:text-[56px] lg:text-[84px] leading-[0.98] tracking-[-0.035em] font-medium [text-wrap:balance]">
              Tu trabajo merece
              <br />
              más que un PDF
            </h1>

            <div className="flex flex-wrap items-start gap-3 mt-9">
              <GoogleSignInButton
                showIcon={false}
                label="Empieza gratis"
                pendingLabel="Redirigiendo…"
                className="inline-flex items-center h-[52px] px-8 rounded-full bg-[#f4f4f5] text-[#08080a] text-base font-semibold tracking-[-0.01em] transition-colors hover:bg-white disabled:opacity-60"
              />
            </div>

            {error && (
              <div className="mt-4">
                <p className="text-sm text-red-400">Algo salió mal al iniciar sesión.</p>
                {reason && <p className="text-xs text-[#71717a] mt-1 break-words max-w-md">{reason}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="como" className="px-5 sm:px-9 lg:px-[72px] py-16 sm:py-24 lg:py-[140px] border-t border-white/[0.08]">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10 sm:mb-14 lg:mb-[72px]">
            <h2 className="m-0 max-w-[560px] text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.06] tracking-[-0.03em] font-medium">
              Tres pasos. Sin tutoriales.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {steps.map((step) => (
              <div key={step.title} className="bg-[#08080a] p-7 sm:p-8 lg:p-11">
                <h3 className="m-0 mb-2.5 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="m-0 text-[15.5px] leading-[1.55] text-[#a1a1aa]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-9 lg:px-[72px] py-16 sm:py-24 lg:py-[132px] border-t border-white/[0.08]">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="m-0 text-[32px] sm:text-[46px] lg:text-[60px] leading-[1.02] tracking-[-0.035em] font-medium [text-wrap:balance]">
            Tu portfolio en línea esta tarde
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <GoogleSignInButton
              showIcon={false}
              label="Crear mi portfolio"
              pendingLabel="Redirigiendo…"
              className="inline-flex items-center h-[52px] px-8 rounded-full bg-[#d8ff3e] text-[#08080a] text-base font-semibold tracking-[-0.01em] transition-[filter] hover:brightness-110 disabled:opacity-60"
            />
          </div>
        </div>
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
