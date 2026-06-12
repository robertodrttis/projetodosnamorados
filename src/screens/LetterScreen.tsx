import { config } from '../config'
import { useTypewriter } from '../hooks/useTypewriter'
import './screens.css'

interface LetterScreenProps {
  onContinue: () => void
}

export function LetterScreen({ onContinue }: LetterScreenProps) {
  const { displayed, done } = useTypewriter(config.letter, 24)

  return (
    <section className="screen screen--fade letter-screen">
      <div className="letter-screen__content">
        {displayed}
        {!done && <span className="letter-screen__cursor" />}
      </div>

      {done && (
        <>
          <p className="letter-screen__signature fade-in">
            Com carinho,
            <br />
            {config.yourName} ❤️
          </p>
          <button className="screen__btn glow-red fade-in" onClick={onContinue} type="button">
            ➡️ Continuar
          </button>
        </>
      )}
    </section>
  )
}
