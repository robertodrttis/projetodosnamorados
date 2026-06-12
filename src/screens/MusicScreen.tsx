import { useSiteConfig } from '../context/SiteConfigContext'
import './screens.css'

interface MusicScreenProps {
  onContinue: () => void
}

export function MusicScreen({ onContinue }: MusicScreenProps) {
  const { config } = useSiteConfig()

  return (
    <section className="screen screen--fade music-screen">
      <div className="music-screen__photo">
        <img src={config.photos.music} alt="Nós dois" loading="eager" />
      </div>

      <div className="music-screen__player glow-red">
        <span className="music-screen__note">🎵</span>
        <span className="music-screen__track">
          {config.music.title} — {config.music.artist}
        </span>
      </div>

      <div className="music-screen__message">
        {config.musicScreen.message.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <button className="screen__btn glow-red" onClick={onContinue} type="button">
        ❤️ Continuar
      </button>
    </section>
  )
}
