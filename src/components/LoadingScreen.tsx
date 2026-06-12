import './LoadingScreen.css'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Carregando presente...' }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <span className="loading-screen__heart">❤️</span>
      <p>{message}</p>
    </div>
  )
}
