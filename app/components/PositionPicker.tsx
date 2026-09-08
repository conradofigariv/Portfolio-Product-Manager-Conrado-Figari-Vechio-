'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMediaPosition } from '../lib/portfolio-actions'
import PhotoCropModal from './PhotoCropModal'

// The "Adjust position" affordance: a small trigger the caller places over the
// photo, which opens the crop modal. The modal is portalled to <body>, so this
// can sit anywhere in the tree without its overlay being clipped or trapped by
// a transformed ancestor.
export default function PositionPicker({
  storagePath,
  src,
  alt,
  aspect,
  position,
  onChange,
  triggerClassName = 'text-xs font-medium text-dark-50',
}: {
  storagePath: string
  src: string
  alt: string
  // Width / height of the box this photo is cropped into on the page.
  aspect: number
  position?: string
  onChange: (position: string) => void
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function done() {
    setSaving(true)
    const result = await saveMediaPosition(storagePath, position ?? '50% 50%')
    setSaving(false)
    setOpen(false)
    if (result.ok) router.refresh()
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        Adjust position
      </button>

      {open && (
        <PhotoCropModal
          src={src}
          alt={alt}
          aspect={aspect}
          position={position}
          onChange={onChange}
          onDone={done}
          saving={saving}
        />
      )}
    </>
  )
}
