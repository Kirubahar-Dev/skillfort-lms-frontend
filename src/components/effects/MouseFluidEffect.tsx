import React, { useEffect, useRef, useState } from 'react';

export function MouseFluidEffect() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: `
          radial-gradient(
            1500px at ${mousePos.x}px ${mousePos.y}px,
            rgba(147, 112, 219, 0.1) 0%,
            rgba(75, 0, 130, 0.05) 20%,
            transparent 100%
          ),
          linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.05) 0%,
            rgba(168, 85, 247, 0.03) 50%,
            rgba(236, 72, 153, 0.05) 100%
          )
        `,
        transition: 'background 0.05s ease-out'
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          top: `${mousePos.y - 200}px`,
          left: `${mousePos.x - 200}px`,
          transition: 'all 0.1s ease-out',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          top: `${mousePos.y - 150}px`,
          left: `${mousePos.x - 150}px`,
          transition: 'all 0.15s ease-out',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
