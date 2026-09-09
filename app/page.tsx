import { Instrument_Sans } from 'next/font/google'
import { getUser } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from './components/GoogleSignInButton'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

// Step 3 used to describe a "Public" toggle the app has never had — the
// portfolio is live the moment you sign in, published:true from creation,
// with no separate publish action to pitch (see CLAUDE.md: "always public,
// no draft/private mode"). Reframed around what's actually true instead:
// there's nothing left to do after step 2.
const steps = [
  {
    title: 'Iniciá sesión con Google',
    body: 'Sin formularios ni tutoriales. Un click y ya tenés tu portfolio.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l4-4m0 0l-4-4m4 4H3m8-8h6a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
      </svg>
    ),
  },
  {
    title: 'Editá todo en vivo',
    body: 'Texto y fotos se tocan directo sobre el diseño real, no en un panel aparte.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: 'Ya está online',
    body: 'No hay botón de "publicar" — tu portfolio queda en vivo apenas iniciás sesión, en tu propio link.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.5 14.5l5-5m-4-3.5l.7-.7a3.5 3.5 0 015 5l-.7.7m-6 6l-.7.7a3.5 3.5 0 01-5-5l.7-.7"
        />
      </svg>
    ),
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

        <div className="relative z-[3] flex-1 flex items-start px-5 sm:px-9 lg:px-[72px] pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24">
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
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative bg-[#08080a] hover:bg-white/[0.03] transition-colors p-7 sm:p-8 lg:p-11"
              >
                <span className="absolute top-7 right-7 sm:top-8 sm:right-8 lg:top-11 lg:right-11 text-[13px] font-mono text-white/20 group-hover:text-white/35 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#d8ff3e] text-[#08080a] flex items-center justify-center mb-5">
                  {step.icon}
                </div>
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
