'use client'

import { useEffect, useState } from 'react'

const PARTICLES = [
  { left: 10, top: 20, delay: 0.5, duration: 4.2 },
  { left: 25, top: 60, delay: 1.2, duration: 3.8 },
  { left: 45, top: 15, delay: 2.1, duration: 5.1 },
  { left: 65, top: 45, delay: 0.8, duration: 4.5 },
  { left: 85, top: 75, delay: 1.5, duration: 3.6 },
  { left: 15, top: 85, delay: 2.4, duration: 4.8 },
  { left: 35, top: 35, delay: 0.3, duration: 3.9 },
  { left: 55, top: 70, delay: 1.8, duration: 5.3 },
  { left: 75, top: 25, delay: 2.7, duration: 4.1 },
  { left: 90, top: 55, delay: 0.9, duration: 3.7 },
  { left: 5, top: 45, delay: 1.4, duration: 4.9 },
  { left: 30, top: 90, delay: 2.2, duration: 4.3 },
  { left: 50, top: 10, delay: 0.6, duration: 5.2 },
  { left: 70, top: 85, delay: 1.9, duration: 3.5 },
  { left: 95, top: 40, delay: 2.6, duration: 4.6 },
  { left: 20, top: 55, delay: 0.4, duration: 4.0 },
  { left: 60, top: 30, delay: 1.1, duration: 5.0 },
  { left: 40, top: 80, delay: 2.3, duration: 3.8 },
  { left: 80, top: 15, delay: 0.7, duration: 4.4 },
  { left: 55, top: 60, delay: 1.6, duration: 5.1 },
]

export default function IntroAnimation() {
  const [show, setShow] = useState(false)  // Start with false
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'exit'>('logo')

  useEffect(() => {
    // Only run on client
    const hasSeenIntro = sessionStorage.getItem('novamarket-intro-seen')
    
    if (hasSeenIntro) {
      return  // Don't show intro
    }

    // Show intro
    setShow(true)

    // Phase transitions
    const taglineTimer = setTimeout(() => setPhase('tagline'), 1200)
    const exitTimer = setTimeout(() => setPhase('exit'), 2800)
    const hideTimer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('novamarket-intro-seen', 'true')
    }, 3600)

    return () => {
      clearTimeout(taglineTimer)
      clearTimeout(exitTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        phase === 'exit' ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 50%, #2563eb 100%)',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div
          className={`transition-all duration-1000 ${
            phase === 'logo' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
            <span className="inline-block">Nova</span>
            <span className="inline-block text-yellow-300">Market</span>
          </h1>

          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-32 bg-white/30 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-700 ${
            phase === 'tagline' || phase === 'exit'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
            Buy & Sell Anything
          </p>
          <p className="text-sm md:text-base text-white/70 mt-2 tracking-widest uppercase">
            The Smarter Marketplace
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Corner Sparkles */}
      <div className="absolute top-8 left-8 text-4xl animate-pulse">✨</div>
      <div className="absolute top-8 right-8 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
      <div className="absolute bottom-8 left-8 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute bottom-8 right-8 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
