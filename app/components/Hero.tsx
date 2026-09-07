'use client'

import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import EditableText from './EditableText'
import EditablePortrait from './EditablePortrait'

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const { content, media, editing } = useLang()
  const videos = media.backgroundVideos

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section
      className="relative min-h-[70vh] flex items-start pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20 overflow-hidden"
      style={editing ? { paddingBottom: '6rem' } : undefined}
    >
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

      {videos.length > 1 && (
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={() => setVideoIndex((i) => (i + 1) % videos.length)}
            className="px-3 py-1.5 rounded-lg border border-dark-400/40 bg-dark-900/40 backdrop-blur text-dark-200 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono"
          >
            Video {(videoIndex % videos.length) + 1} / {videos.length}
          </button>
        </div>
      )}

      <div className="container-main w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch">

          {/* Left: Content. The portrait stretches to match this column's
              natural height (see the grid's items-stretch + EditablePortrait's
              h-full), so its bottom lines up with the stats no matter how
              long the name/tagline/description run. */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-dark-400 font-mono tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-3">
              <EditableText path="hero.greeting" placeholder="Greeting" />
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-dark-50">
              <EditableText path="hero.name" placeholder="Your name" />
            </h1>
            <p className="text-xl md:text-3xl text-dark-200 mb-4 md:mb-6 leading-tight font-light">
              <EditableText path="hero.tagline" placeholder="Headline" />
            </p>
            <p className="text-sm md:text-base text-dark-400 max-w-xl mb-6 md:mb-10 leading-relaxed">
              <EditableText path="hero.description" placeholder="Description" />
            </p>

            {/* Stats */}
            <div className="pt-4 md:pt-6 border-t border-dark-700 grid grid-cols-3 gap-3 md:gap-6">
              {content.stats.map((_, i) => (
                <div key={i}>
                  <p className="text-xl md:text-2xl font-bold text-dark-50">
                    <EditableText path={`stats.${i}.value`} placeholder="Value" />
                  </p>
                  <p className="text-dark-400 text-xs md:text-sm mt-1">
                    <EditableText path={`stats.${i}.label`} placeholder="Label" />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real photo */}
          {(media.portrait || editing) && (
            <div
              className={`hidden md:flex justify-center transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <EditablePortrait />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
