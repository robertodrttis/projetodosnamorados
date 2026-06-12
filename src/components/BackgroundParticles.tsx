import './BackgroundParticles.css'

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.2) % 90}%`,
  top: `${8 + (i * 7.3) % 85}%`,
  size: 6 + (i % 4) * 3,
  delay: `${(i * 0.4) % 3}s`,
  duration: `${2.5 + (i % 3)}s`,
}))

export function BackgroundParticles() {
  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}
