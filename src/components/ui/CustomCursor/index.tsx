'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0;   // mouse position
    let rx = 0, ry = 0;   // ring position (lagged)
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    // Lerp ring toward mouse
    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    // Expand ring on hoverable elements
    const onEnter = () => ring.setAttribute('data-hover', 'true');
    const onLeave = () => ring.removeAttribute('data-hover');

    document.addEventListener('mousemove', onMove, { passive: true });
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot — tracks immediately */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)' as string,
          willChange: 'transform',
        }}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        data-hover=""
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,140,66,0.5)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)' as string,
          willChange: 'transform',
          transition: 'width 200ms var(--ease-out-strong), height 200ms var(--ease-out-strong), border-color 200ms ease',
        }}
        /* Expand on hover via CSS — avoid JS style thrashing */
      />
      <style>{`
        [data-hover="true"] {
          width: 56px !important;
          height: 56px !important;
          border-color: rgba(255,140,66,0.8) !important;
        }
      `}</style>
    </>
  );
}
