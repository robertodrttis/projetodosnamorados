import { useEffect, useState } from 'react'
import { useSiteConfig } from '../context/SiteConfigContext'
import './screens.css'

interface SpecialScreenProps {
  onContinue: () => void
}

export function SpecialScreen({ onContinue }: SpecialScreenProps) {
  const { config } = useSiteConfig()
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    config.reasons.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), (i + 1) * 700))
    })
    return () => timers.forEach(clearTimeout)
  }, [config.reasons])

  const allVisible = visibleCount >= config.reasons.length

  return (
    <section className="screen screen--fade">
      <h2 className="special__title text-glow">Por que você é especial</h2>
      <div className="special__cards">
        {config.reasons.map((reason, i) => (
          <div
            key={reason}
            className={`special__card ${i < visibleCount ? 'special__card--visible' : ''}`}
          >
            <span className="special__card-icon">❤️</span>
            {reason}
          </div>
        ))}
      </div>
      {allVisible && (
        <button className="screen__btn glow-red fade-in" onClick={onContinue} type="button">
          ❤️ Ainda não acabou
        </button>
      )}
    </section>
  )
}
