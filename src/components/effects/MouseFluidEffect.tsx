import React, { useEffect, useRef } from 'react';

export function MouseFluidEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl2') as any || canvas.getContext('webgl') as any;
    if (!gl) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Simple animated background effect
    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.01;

      gl.clearColor(
        Math.sin(time) * 0.1,
        Math.sin(time + 2) * 0.1,
        Math.sin(time + 4) * 0.1,
        1.0
      );
      gl.clear(gl.COLOR_BUFFER_BIT);

      animationId = requestAnimationFrame(render);
    };

    // Mouse event for interactive effect
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;

      gl.clearColor(
        Math.sin(time + mouseX) * 0.1 + 0.05,
        Math.sin(time + mouseY) * 0.1 + 0.05,
        Math.sin(time) * 0.1 + 0.05,
        1.0
      );
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
