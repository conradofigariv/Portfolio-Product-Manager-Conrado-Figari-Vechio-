'use client'

import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLang()
  const c = t.contact

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">{c.title}</h2>
        <p className="text-dark-400 text-lg mb-16 max-w-2xl">{c.subtitle}</p>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-dark-200 font-medium mb-2 text-sm">{c.form.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition text-sm"
                placeholder={c.form.namePlaceholder}
              />
            </div>
            <div>
              <label className="block text-dark-200 font-medium mb-2 text-sm">{c.form.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition text-sm"
                placeholder={c.form.emailPlaceholder}
              />
            </div>
            <div>
              <label className="block text-dark-200 font-medium mb-2 text-sm">{c.form.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition resize-none text-sm"
                placeholder={c.form.messagePlaceholder}
              />
            </div>
            <button type="submit" className="button-primary w-full">
              {c.form.submit}
            </button>
            {submitted && (
              <p className="text-green-400 text-center text-sm font-medium">{c.form.success}</p>
            )}
          </form>

          {/* Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="font-semibold text-dark-50 mb-6">{c.otherWays}</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Email</p>
                  <a
                    href="mailto:conradofigari.v@gmail.com"
                    className="text-dark-50 hover:text-dark-100 transition font-medium break-all"
                  >
                    conradofigari.v@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">LinkedIn</p>
                  <a
                    href="https://linkedin.com/in/conradofigari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-medium flex items-center gap-1"
                  >
                    linkedin.com/in/conradofigari ↗
                  </a>
                </div>
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Twitter / X</p>
                  <a
                    href="https://twitter.com/conradofigari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-medium flex items-center gap-1"
                  >
                    @conradofigari ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="font-semibold text-dark-50 mb-4">{c.availability}</h3>
              <p className="text-dark-400 text-sm mb-4">{c.availableFor}</p>
              <ul className="space-y-2">
                {c.availableItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-dark-300 text-sm">
                    <span className="text-dark-50 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
