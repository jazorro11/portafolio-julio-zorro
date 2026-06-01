export default function AstronautSVG({ width = 280 }: { width?: number }) {
  const h = Math.round(width * 1.2)
  return (
    <svg
      viewBox="0 0 200 240"
      width={width}
      height={h}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="astronaut-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(0,229,200,0.25)" />
          <stop offset="100%" stopColor="rgba(0,229,200,0)" />
        </radialGradient>
        <radialGradient id="visor-reflect" cx="35%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="rgba(0,200,255,0.4)" />
          <stop offset="100%" stopColor="rgba(5,5,30,0.95)" />
        </radialGradient>
        <filter id="lantern-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient bioluminescent glow */}
      <ellipse cx="100" cy="120" rx="90" ry="100" fill="url(#astronaut-glow)" />

      {/* Suit — torso */}
      <ellipse cx="100" cy="145" rx="42" ry="52" fill="rgba(230,235,245,0.95)" />

      {/* Suit — shoulders */}
      <ellipse cx="58"  cy="128" rx="22" ry="16" fill="rgba(220,228,242,0.95)" />
      <ellipse cx="142" cy="128" rx="22" ry="16" fill="rgba(220,228,242,0.95)" />

      {/* Left arm */}
      <path d="M58 128 Q38 148 42 172" stroke="rgba(215,225,240,0.95)" strokeWidth="20" fill="none" strokeLinecap="round" />
      {/* Left glove */}
      <ellipse cx="41" cy="176" rx="11" ry="9" fill="rgba(180,195,215,0.9)" />

      {/* Right arm — holding lantern */}
      <path d="M142 128 Q162 148 158 172" stroke="rgba(215,225,240,0.95)" strokeWidth="20" fill="none" strokeLinecap="round" />
      {/* Right glove */}
      <ellipse cx="158" cy="176" rx="11" ry="9" fill="rgba(180,195,215,0.9)" />

      {/* Lantern / flashlight */}
      <rect x="155" y="180" width="14" height="22" rx="4" fill="rgba(200,200,210,0.9)" />
      <ellipse cx="162" cy="182" rx="8" ry="5" fill="rgba(255,230,100,0.9)" filter="url(#lantern-glow)" />
      {/* Lantern light cone */}
      <path d="M154 185 Q130 210 140 230 Q162 240 184 230 Q194 210 170 185 Z"
        fill="rgba(255,220,50,0.08)" />

      {/* Legs */}
      <rect x="74"  y="192" width="22" height="38" rx="10" fill="rgba(215,225,240,0.9)" />
      <rect x="104" y="192" width="22" height="38" rx="10" fill="rgba(215,225,240,0.9)" />
      {/* Boots */}
      <ellipse cx="85"  cy="230" rx="14" ry="9" fill="rgba(160,175,200,0.9)" />
      <ellipse cx="115" cy="230" rx="14" ry="9" fill="rgba(160,175,200,0.9)" />

      {/* Helmet */}
      <ellipse cx="100" cy="95" rx="44" ry="48" fill="rgba(225,232,245,0.95)" />

      {/* Visor — dark tinted with cyan reflection */}
      <ellipse cx="100" cy="95" rx="30" ry="32" fill="url(#visor-reflect)" />
      <ellipse cx="100" cy="95" rx="30" ry="32"
        stroke="rgba(0,200,255,0.3)" strokeWidth="1.5" fill="none" />

      {/* Visor highlight */}
      <ellipse cx="88" cy="82" rx="8" ry="5" fill="rgba(0,220,255,0.2)" transform="rotate(-20 88 82)" />

      {/* Helmet detail ring */}
      <ellipse cx="100" cy="95" rx="44" ry="48"
        stroke="rgba(180,195,220,0.6)" strokeWidth="2" fill="none" />

      {/* Suit chest badge */}
      <rect x="88" y="138" width="24" height="16" rx="3" fill="rgba(200,210,230,0.7)" />
      <line x1="92" y1="143" x2="108" y2="143" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5" />
      <line x1="92" y1="148" x2="104" y2="148" stroke="rgba(0,200,255,0.3)" strokeWidth="1" />

      {/* Purple bioluminescent particles */}
      <circle cx="60"  cy="70"  r="3" fill="rgba(180,80,255,0.6)" />
      <circle cx="150" cy="55"  r="2" fill="rgba(0,229,200,0.7)" />
      <circle cx="40"  cy="160" r="2" fill="rgba(180,80,255,0.5)" />
      <circle cx="165" cy="145" r="3" fill="rgba(0,229,200,0.5)" />
      <circle cx="75"  cy="225" r="2" fill="rgba(180,80,255,0.4)" />
    </svg>
  )
}
