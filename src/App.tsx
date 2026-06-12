import { useCallback, useEffect, useState } from 'react'
import { BackgroundParticles } from './components/BackgroundParticles'
import { LoadingScreen } from './components/LoadingScreen'
import { useSiteConfig } from './context/SiteConfigContext'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { BuilderScreen } from './screens/BuilderScreen'
import { EntryScreen } from './screens/EntryScreen'
import { GiftScreen } from './screens/GiftScreen'
import { LetterScreen } from './screens/LetterScreen'
import { MusicScreen } from './screens/MusicScreen'
import { SpecialScreen } from './screens/SpecialScreen'
import './App.css'

export type Screen = 'entry' | 'letter' | 'special' | 'music' | 'gift'

const FLOW: Screen[] = ['entry', 'letter', 'special', 'music', 'gift']

export default function App() {
  const { config, isShared, loading, loadError } = useSiteConfig()
  const [mode, setMode] = useState<'builder' | 'experience'>(isShared ? 'experience' : 'builder')
  const [screen, setScreen] = useState<Screen>('entry')
  const [fading, setFading] = useState(false)
  const { audioRef, play, musicSrc } = useBackgroundMusic(config.music.src)

  useEffect(() => {
    if (isShared) setMode('experience')
  }, [isShared])

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

  const handleBuilderStart = useCallback(() => {
    setMode('experience')
    setScreen('entry')
  }, [])

  useEffect(() => {
    document.title = mode === 'builder' ? 'Crie seu presente ❤️' : `Para ${config.herName} ❤️`
  }, [mode, config.herName])

  if (loading) {
    return (
      <div className="app">
        <BackgroundParticles />
        <LoadingScreen />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="app">
        <BackgroundParticles />
        <section className="screen">
          <p className="screen__text">{loadError}</p>
          <a className="screen__btn glow-red" href="/">
            Criar um presente
          </a>
        </section>
      </div>
    )
  }

  if (mode === 'builder') {
    return (
      <div className="app">
        <BackgroundParticles />
        <BuilderScreen onStart={handleBuilderStart} />
      </div>
    )
  }

  return (
    <div className={`app ${fading ? 'app--fading' : ''}`}>
      <BackgroundParticles />
      <audio ref={audioRef} src={musicSrc} loop preload="auto" playsInline />

      {screen === 'entry' && <EntryScreen onStart={startExperience} />}
      {screen === 'letter' && <LetterScreen onContinue={nextScreen} />}
      {screen === 'special' && <SpecialScreen onContinue={nextScreen} />}
      {screen === 'music' && <MusicScreen onContinue={nextScreen} />}
      {screen === 'gift' && <GiftScreen onReveal={() => {}} />}
    </div>
  )
}
