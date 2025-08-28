import React, { useEffect, useRef } from 'react';

// Simple confetti burst using canvas
export default function Confetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const particles: any[] = [];
    const colors = ['#FDE68A', '#F472B6', '#6EE7B7', '#A7F3D0', '#C4B5FD', '#818CF8', '#FCA5A5'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: W/2,
        y: H/2,
        r: Math.random() * 6 + 4,
        d: Math.random() * 80,
        color: colors[Math.floor(Math.random()*colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.07) + .05,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 6 + 4
      });
    }
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + frame * 0.02;
        p.tiltAngle += p.tiltAngleIncremental;
        p.angle += 0.01;
        p.r *= 0.98;
      }
      frame++;
      if (frame < 60) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    }
    draw();
  }, [trigger]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{width:'100vw',height:'100vh'}} />
  );
}
