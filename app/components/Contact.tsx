'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de envío de formulario
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">Contacto</h2>
        <p className="text-dark-400 text-lg mb-12 max-w-2xl">
          ¿Quieres colaborar o tienes una oportunidad interesante? Me encantaría escuchar de ti.
        </p>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-dark-50 font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-dark-50 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-dark-50 font-semibold mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-50 focus:border-dark-500 focus:outline-none transition resize-none"
                  placeholder="Tu mensaje aquí..."
                ></textarea>
              </div>

              <button type="submit" className="button-primary w-full">
                Enviar mensaje
              </button>

              {submitted && (
                <p className="text-green-400 text-center font-semibold">
                  ¡Mensaje enviado correctamente! Te responderé pronto.
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-12">
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="heading-sm mb-6 text-dark-50">Otras formas de contactarme</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-dark-400 text-sm mb-2">Email</p>
                  <a
                    href="mailto:conradofigari.v@gmail.com"
                    className="text-dark-50 hover:text-dark-100 transition text-lg font-semibold break-all"
                  >
                    conradofigari.v@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-dark-400 text-sm mb-2">LinkedIn</p>
                  <a
                    href="https://linkedin.com/in/conradofigari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-semibold flex items-center gap-2"
                  >
                    linkedin.com/in/conradofigari
                    <span>↗</span>
                  </a>
                </div>

                <div>
                  <p className="text-dark-400 text-sm mb-2">Twitter</p>
                  <a
                    href="https://twitter.com/conradofigari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-semibold flex items-center gap-2"
                  >
                    @conradofigari
                    <span>↗</span>
                  </a>
                </div>

                <div>
                  <p className="text-dark-400 text-sm mb-2">Ubicación</p>
                  <p className="text-dark-50 font-semibold">Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="heading-sm mb-4 text-dark-50">Disponibilidad</h3>
              <p className="text-dark-300 leading-relaxed mb-4">
                Actualmente estoy disponible para:
              </p>
              <ul className="space-y-2 text-dark-300">
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">✓</span>
                  <span>Proyectos de consultoría en Product Management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">✓</span>
                  <span>Mentoría a Product Managers en crecimiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">✓</span>
                  <span>Colaboraciones en startups y productos innovadores</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">✓</span>
                  <span>Charlas y workshops sobre Product Management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
