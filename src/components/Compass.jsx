const ANGLES = { home: -20, roadmap: 20, resume: 100, interview: -100 }

export default function Compass({ active = 'home', size = 56 }) {
  const angle = ANGLES[active] ?? 0
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" stroke="#1B2A4A" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="2" fill="#1B2A4A" />
      {[0, 90, 180, 270].map((d) => (
        <line
          key={d}
          x1="28"
          y1="4"
          x2="28"
          y2="8"
          stroke="#5B6472"
          strokeWidth="1.5"
          transform={`rotate(${d} 28 28)`}
        />
      ))}
      <g className="needle" style={{ transform: `rotate(${angle}deg)` }}>
        <polygon points="28,10 32,28 28,32 24,28" fill="#E8A33D" />
        <polygon points="28,46 32,28 28,24 24,28" fill="#1B2A4A" />
      </g>
    </svg>
  )
}
