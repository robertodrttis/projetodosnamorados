import { useEffect, useRef } from 'react'
import { config, getWhatsAppUrl } from '../config'
import { useTypewriter } from '../hooks/useTypewriter'
import './screens.css'

const TYPEWRITER_SPEED = 42

export function FinalScreen() {
  const { displayed, done } = useTypewriter(config.gift, TYPEWRITER_SPEED)
  const contentRef = useRef<HTMLDivElement>(null)
  const followScrollRef = useRef(true)

  const handleScroll = () => {
    const el = contentRef.current
    if (!el) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    followScrollRef.current = distanceFromBottom < 48
  }

  useEffect(() => {
    const el = contentRef.current
    if (!el || !followScrollRef.current) return

    el.scrollTop = el.scrollHeight
  }, [displayed])

  return (
    <section className="screen screen--fade final-screen gift-screen--darkening">
      <div className="final-screen__heart">❤️</div>

      <div
        ref={contentRef}
        className="final-screen__content letter-screen__content"
        onScroll={handleScroll}
      >
        {displayed}
        {!done && <span className="letter-screen__cursor" />}
      </div>

      {done && (
        <a
          className="final-screen__whatsapp fade-in"
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Quero receber meu presente
        </a>
      )}
    </section>
  )
}
