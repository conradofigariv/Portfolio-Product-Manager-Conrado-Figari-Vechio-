// Background videos that ship with the deployment. They are served from
// /public, so offering them to everyone costs no storage and no upload — a new
// account can have a moving background before it has uploaded anything.
export const PRESET_BACKGROUND_VIDEOS = [
  { src: '/videos/video-1.mp4', label: 'Sunset flight' },
  { src: '/videos/video-2.mp4', label: 'Studio session' },
] as const

export const MAX_BACKGROUND_VIDEOS = 2

export function isPresetVideo(path: string): boolean {
  return PRESET_BACKGROUND_VIDEOS.some((preset) => preset.src === path)
}
