'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'

const VIDEOS = ['/videos/video-1.mp4', '/videos/video-2.mp4']

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const { t } = useLang()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center section-padding overflow-hidden">
      {/* Background video */}
      <video
        key={VIDEOS[videoIndex]}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEOS[videoIndex]} type="video/mp4" />
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90" />

      {/* Video toggle button */}
      <button
        onClick={() => setVideoIndex((i) => (i + 1) % VIDEOS.length)}
        className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-lg border border-dark-400/40 bg-dark-900/40 backdrop-blur text-dark-200 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono"
      >
        Video {videoIndex + 1} / {VIDEOS.length}
      </button>

      <div className="container-main w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-dark-400 text-base mb-3 font-mono tracking-widest uppercase text-sm">
              {t.hero.greeting}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-dark-50">
              {t.hero.name}
            </h1>
            <p className="text-2xl md:text-3xl text-dark-200 mb-6 leading-tight font-light">
              {t.hero.tagline}
            </p>
            <p className="text-base text-dark-400 max-w-xl mb-16 leading-relaxed">
              {t.hero.description}
            </p>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-dark-700 grid grid-cols-3 gap-6">
              {Object.values(t.hero.stats).map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-dark-50">{stat.value}</p>
                  <p className="text-dark-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real photo */}
          <div
            className={`hidden md:flex items-center justify-center transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="relative">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-dark-50/5 rounded-2xl blur-2xl scale-110" />

              {/* Photo */}
              <div className="relative w-72 h-96 rounded-2xl overflow-hidden border border-dark-600">
                <Image
                  src="/conrado.jpg"
                  alt="Conrado Figari"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark-900/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
