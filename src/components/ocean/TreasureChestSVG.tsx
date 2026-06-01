export default function TreasureChestSVG({ width = 180 }: { width?: number }) {
  const h = Math.round(width * 0.85)
  return (
    <svg
      viewBox="0 0 200 170"
      width={width}
      height={h}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="chest-glow" cx="50%" cy="70%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,50,180,0.5)" />
          <stop offset="50%"  stopColor="rgba(180,50,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,229,200,0)" />
        </radialGradient>
        <radialGradient id="interior-light" cx="50%" cy="100%" r="70%">
          <stop offset="0%"   stopColor="rgba(255,100,200,0.9)" />
          <stop offset="100%" stopColor="rgba(255,50,150,0.1)" />
        </radialGradient>
        <filter id="chest-bloom">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground glow */}
      <ellipse cx="100" cy="158" rx="75" ry="14" fill="rgba(255,50,180,0.2)" filter="url(#chest-bloom)" />

      {/* Chest body */}
      <rect x="20" y="90" width="160" height="70" rx="6"
        fill="rgba(45,28,14,0.95)"
        stroke="rgba(180,130,40,0.7)" strokeWidth="2" />

      {/* Chest body planks */}
      <line x1="20" y1="110" x2="180" y2="110" stroke="rgba(35,20,8,0.8)" strokeWidth="1.5" />
      <line x1="20" y1="130" x2="180" y2="130" stroke="rgba(35,20,8,0.8)" strokeWidth="1.5" />

      {/* Metal bands on body */}
      <rect x="55"  y="90" width="10" height="70" rx="2" fill="rgba(160,110,30,0.6)" />
      <rect x="135" y="90" width="10" height="70" rx="2" fill="rgba(160,110,30,0.6)" />

      {/* Corner metal reinforcements */}
      <rect x="20" y="90"  width="12" height="12" rx="2" fill="rgba(180,130,40,0.8)" />
      <rect x="168" y="90" width="12" height="12" rx="2" fill="rgba(180,130,40,0.8)" />
      <rect x="20" y="148" width="12" height="12" rx="2" fill="rgba(180,130,40,0.8)" />
      <rect x="168" y="148" width="12" height="12" rx="2" fill="rgba(180,130,40,0.8)" />

      {/* Interior light escaping from crack */}
      <rect x="20" y="88" width="160" height="6" rx="3" fill="url(#interior-light)" />
      <ellipse cx="100" cy="88" rx="80" ry="8" fill="rgba(255,80,180,0.3)" filter="url(#chest-bloom)" />

      {/* Chest lid — slightly open */}
      <path d="M20 90 Q20 45 100 42 Q180 45 180 90 Z"
        fill="rgba(50,30,12,0.95)"
        stroke="rgba(180,130,40,0.7)" strokeWidth="2" />

      {/* Lid planks */}
      <path d="M20 90 Q100 70 180 90" stroke="rgba(35,20,8,0.6)" strokeWidth="1.5" fill="none" />
      <path d="M25 82 Q100 63 175 82" stroke="rgba(35,20,8,0.5)" strokeWidth="1.5" fill="none" />

      {/* Lid metal bands */}
      <path d="M55 90 Q55 50 100 48 Q145 50 145 90"
        stroke="rgba(160,110,30,0.6)" strokeWidth="8" fill="none" />

      {/* Front lock */}
      <rect x="84" y="84" width="32" height="20" rx="4" fill="rgba(150,100,25,0.9)" />
      <circle cx="100" cy="94" r="7" fill="rgba(200,150,40,0.95)" />
      <circle cx="100" cy="94" r="4" fill="rgba(100,65,10,0.9)" />

      {/* Ambient glow around chest */}
      <ellipse cx="100" cy="120" rx="90" ry="60" fill="url(#chest-glow)" />

      {/* Bioluminescent particles */}
      <circle cx="40"  cy="80"  r="3" fill="rgba(0,229,200,0.7)" />
      <circle cx="160" cy="75"  r="2" fill="rgba(255,50,180,0.8)" />
      <circle cx="25"  cy="120" r="2" fill="rgba(180,50,255,0.6)" />
      <circle cx="175" cy="115" r="3" fill="rgba(0,229,200,0.6)" />
      <circle cx="90"  cy="60"  r="2" fill="rgba(255,50,180,0.5)" />
      <circle cx="115" cy="58"  r="2" fill="rgba(0,229,200,0.5)" />
    </svg>
  )
}
