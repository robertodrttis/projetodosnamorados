import { useCallback, useEffect, useState } from 'react'
import { BackgroundParticles } from './components/BackgroundParticles'
import { MUSIC_SRC, useBackgroundMusic } from './hooks/useBackgroundMusic'
import { EntryScreen } from './screens/EntryScreen'
import { GiftScreen } from './screens/GiftScreen'
import { LetterScreen } from './screens/LetterScreen'
import { MusicScreen } from './screens/MusicScreen'
import { SpecialScreen } from './screens/SpecialScreen'
import './App.css'

export type Screen = 'entry' | 'letter' | 'special' | 'music' | 'gift'

const FLOW: Screen[] = ['entry', 'letter', 'special', 'music', 'gift']

export default function App() {
  const [screen, setScreen] = useState<Screen>('entry')
  const [fading, setFading] = useState(false)
  const { audioRef, play } = useBackgroundMusic()

  const navigate = useCallback((target: Screen) => {
    setFading(true)
    setTimeout(() => {
      setScreen(target)
      setFading(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }, [])

  const nextScreen = useCallback(() => {
    const idx = FLOW.indexOf(screen)
    if (idx < FLOW.length - 1) {
      navigate(FLOW[idx + 1])
    }
  }, [screen, navigate])

  const startExperience = useCallback(async () => {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    await play()
    navigate('letter')
  }, [navigate, play])

  useEffect(() => {
    document.title = 'Para Clara ❤️'
  }, [])

  return (
    <div className={`app ${fading ? 'app--fading' : ''}`}>
      <BackgroundParticles />
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" playsInline />

      {screen === 'entry' && <EntryScreen onStart={startExperience} />}
      {screen === 'letter' && <LetterScreen onContinue={nextScreen} />}
      {screen === 'special' && <SpecialScreen onContinue={nextScreen} />}
      {screen === 'music' && <MusicScreen onContinue={nextScreen} />}
      {screen === 'gift' && <GiftScreen onReveal={() => {}} />}
    </div>
  )
}
