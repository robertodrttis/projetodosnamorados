import { useSiteConfig } from '../context/SiteConfigContext'
import { HeartPhoto } from '../components/HeartPhoto'
import './screens.css'

interface EntryScreenProps {
  onStart: () => void
}

export function EntryScreen({ onStart }: EntryScreenProps) {
  const { config } = useSiteConfig()

  return (
    <section className="screen screen--fade entry">
      <HeartPhoto src={config.photos.entry} zoom={0.72} objectPosition="center 40%" />
      <h1 className="entry__name text-glow">Para {config.herName} ❤️</h1>
      <p className="entry__quote">&ldquo;{config.entryQuote}&rdquo;</p>
      <button className="screen__btn glow-red" onClick={onStart} type="button">
        ❤️ Começar
      </button>
    </section>
  )
}
