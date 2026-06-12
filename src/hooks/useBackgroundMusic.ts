import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from '../config'

export const MUSIC_SRC = encodeURI(config.music.src)

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    audio.volume = 0.45

    try {
      await audio.play()
      setPlaying(true)
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 150))
      try {
        await audio.play()
        setPlaying(true)
        return true
      } catch {
        return false
      }
    }
  }, [])

  useEffect(() => {
    if (!playing) return

    const audio = audioRef.current
    if (!audio) return

    const resume = () => {
      if (audio.paused) {
        audio.play().catch(() => {})
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resume()
    }

    document.addEventListener('visibilitychange', onVisibility)
    const interval = setInterval(resume, 3000)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
    }
  }, [playing])

  return { audioRef, play, playing }
}
