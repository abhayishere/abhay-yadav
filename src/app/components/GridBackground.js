'use client'
import { useState, useEffect } from 'react'

export default function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Base grid */}
      <div className="fixed inset-0 bg-grid-pattern [background-size:40px_40px] -z-10" />
      
      {/* Cursor following dense grid */}
      <div 
        className="fixed inset-0 bg-grid-pattern-dense [background-size:20px_20px] pointer-events-none -z-10"
        style={{
          maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />
    </>
  )
} 