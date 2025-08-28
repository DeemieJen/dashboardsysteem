import React, { useEffect, useRef } from 'react';

// Simpele parallax shapes (cirkels)
const SHAPES = [
  { size: 180, color: 'rgba(0, 200, 255, 0.18)', x: 10, y: 20, speed: 0.04 },
  { size: 120, color: 'rgba(255, 0, 200, 0.13)', x: 70, y: 60, speed: 0.07 },
  { size: 90, color: 'rgba(0, 255, 180, 0.10)', x: 50, y: 80, speed: 0.09 },
  { size: 140, color: 'rgba(255, 200, 0, 0.10)', x: 80, y: 30, speed: 0.06 },
];

const ParallaxBackground: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouse.current = {
        x: e.clientX / w,
        y: e.clientY / h,
      };
      if (ref.current) {
        ref.current.style.setProperty('--mouse-x', mouse.current.x.toString());
        ref.current.style.setProperty('--mouse-y', mouse.current.y.toString());
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="parallax-bg fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      {SHAPES.map((shape, i) => (
        <div
          key={i}
          className="parallax-shape absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            background: shape.color,
            left: `calc(${shape.x}% + (var(--mouse-x, 0.5) - 0.5) * ${shape.speed * 100}vw)` ,
            top: `calc(${shape.y}% + (var(--mouse-y, 0.5) - 0.5) * ${shape.speed * 100}vh)` ,
            filter: 'blur(2px)',
            transition: 'left 0.2s cubic-bezier(.4,0,.2,1), top 0.2s cubic-bezier(.4,0,.2,1)',
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxBackground;
