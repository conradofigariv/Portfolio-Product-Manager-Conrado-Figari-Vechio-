'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { savePortfolio } from '../lib/portfolio-actions'

// Floats above the portfolio while its owner is editing. Everyone else never
// renders this, and the page they see is unchanged.
export default function EditBar({ username }: { username: string }) {
  const { editing, dirty, draft, markSaved } = useLang()
  const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!editing) return null

  async function onSave() {
    setState('saving')
    setError(null)

    const result = await savePortfolio({ content: draft })
    if (result.ok) {
      markSaved()
      setState('idle')
      router.refresh()
    } else {
      setState('error')
      setError(result.error)
    }
  }

  return (
    <div className="fixed bottom-4 inset-x-4 z-[90] flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-full border border-dark-600 bg-dark-900/95 backdrop-blur px-4 py-2.5 shadow-xl">
        <span className="text-xs text-dark-400 hidden sm:inline">
          {dirty ? 'Unsaved changes' : 'Click any text to edit'}
        </span>

        <a
          href={`/${username}?preview=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-dark-300 hover:text-dark-50 transition"
        >
          Preview
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={state === 'saving' || !dirty}
          className="button-primary text-sm py-1.5 px-4 disabled:opacity-50"
        >
          {state === 'saving' ? 'Saving…' : dirty ? 'Save' : 'Saved'}
        </button>

        {error && <p className="w-full text-xs text-red-400">{error}</p>}
      </div>
    </div>
  )
}
