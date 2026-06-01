'use client'

import { useEffect, useRef } from 'react'
import { useOcean } from './OceanSystem'

export default function FishingThread() {
  const { hookY } = useOcean()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Opacity 0 → 1 after mount to prevent SSR layout shift
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = '1'
    }
  }, [])

  const threadLength = 60 + hookY  // thread grows as hook descends

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      data-fishing-thread=""
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--thread-left-desktop)',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Thread SVG */}
      <svg
        width="3"
        height="100vh"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2={threadLength}
          stroke="var(--thread-color)"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
      </svg>

      {/* Hook icon */}
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        style={{
          position: 'absolute',
          left: '50%',
          top: threadLength,
          transform: 'translateX(-50%)',
          willChange: 'transform',
        }}
        fill="none"
      >
        {/* Hook shaft */}
        <line x1="8" y1="0" x2="8" y2="10" stroke="var(--thread-color)" strokeWidth="2" strokeLinecap="round" />
        {/* Hook curve */}
        <path
          d="M8 10 Q8 18 12 18 Q16 18 16 14"
          stroke="var(--thread-color)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hook barb */}
        <line x1="16" y1="14" x2="13" y2="12" stroke="var(--thread-color)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <style>{`
        @media (max-width: 767px) {
          [data-fishing-thread] {
            left: var(--thread-left-mobile) !important;
          }
          [data-fishing-thread] line,
          [data-fishing-thread] path {
            stroke-width: 3px;
          }
        }
      `}</style>
    </div>
  )
}
