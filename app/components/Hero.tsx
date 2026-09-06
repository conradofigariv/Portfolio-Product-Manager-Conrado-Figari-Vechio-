'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const { content, media } = useLang()
  const videos = media.backgroundVideos

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center section-padding overflow-hidden">
      {/* Background video */}
      {videos.length > 0 && (
        <video
          key={videos[videoIndex % videos.length]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videos[videoIndex % videos.length]} type="video/mp4" />
        </video>
      )}

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90" />

      {/* Video toggle button */}
      {videos.length > 1 && (
        <button
          onClick={() => setVideoIndex((i) => (i + 1) % videos.length)}
          className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-lg border border-dark-400/40 bg-dark-900/40 backdrop-blur text-dark-200 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono"
        >
          Video {(videoIndex % videos.length) + 1} / {videos.length}
        </button>
      )}

      <div className="container-main w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* Left: Content */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-dark-400 font-mono tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-3">
              {content.hero.greeting}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-dark-50">
              {content.hero.name}
            </h1>
            <p className="text-xl md:text-3xl text-dark-200 mb-4 md:mb-6 leading-tight font-light">
              {content.hero.tagline}
            </p>
            <p className="text-sm md:text-base text-dark-400 max-w-xl mb-10 md:mb-16 leading-relaxed">
              {content.hero.description}
            </p>

            {/* Stats */}
            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-dark-700 grid grid-cols-3 gap-3 md:gap-6">
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl md:text-2xl font-bold text-dark-50">{stat.value}</p>
                  <p className="text-dark-400 text-xs md:text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real photo */}
          {media.portrait && (
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
                    src={media.portrait.src}
                    alt={media.portrait.alt}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark-900/60 to-transparent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
