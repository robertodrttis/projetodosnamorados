import { useState } from 'react'
import { FinalScreen } from './FinalScreen'
import './screens.css'

interface GiftScreenProps {
  onReveal: () => void
}

export function GiftScreen({ onReveal }: GiftScreenProps) {
  const [opening, setOpening] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const handleOpen = () => {
    setOpening(true)
    setTimeout(() => {
      setRevealed(true)
      onReveal()
    }, 1400)
  }

  if (revealed) {
    return <FinalScreen />
  }

  return (
    <section className={`screen screen--fade gift-screen ${opening ? 'gift-screen--darkening' : ''}`}>
      <div className={`gift-screen__box ${opening ? 'gift-screen__box--opening' : ''}`}>🎁</div>
      {!opening && (
        <>
          <h2 className="gift-screen__title text-glow">O Presente</h2>
          <button className="screen__btn glow-red" onClick={handleOpen} type="button">
            🎁 Receber presente de não-namorados
          </button>
        </>
      )}
    </section>
  )
}
