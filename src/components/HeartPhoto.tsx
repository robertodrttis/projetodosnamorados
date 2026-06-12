import './HeartPhoto.css'

interface HeartPhotoProps {
  src: string
  /** Menor = mais afastado (ex: 0.75 mostra mais da foto) */
  zoom?: number
  objectPosition?: string
}

export function HeartPhoto({ src, zoom = 1, objectPosition = 'center center' }: HeartPhotoProps) {
  return (
    <div className="heart-photo">
      <div className="heart-photo__glow" />
      <div className="heart-photo__wrapper">
        <svg className="heart-photo__border" viewBox="0 0 100 90" aria-hidden="true">
          <defs>
            <filter id="heartGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 82 C50 82 5 55 5 32 C5 15 18 5 32 5 C42 5 50 15 50 22 C50 15 58 5 68 5 C82 5 95 15 95 32 C95 55 50 82 50 82Z"
            fill="none"
            stroke="#ff1a1a"
            strokeWidth="2.5"
            filter="url(#heartGlow)"
          />
        </svg>
        <div
          className="heart-photo__frame"
          style={{ '--zoom': zoom, '--position': objectPosition } as React.CSSProperties}
        >
          <img src={src} alt="Nós dois" className="heart-photo__img" />
        </div>
      </div>
    </div>
  )
}
