'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ASSET_PATHS, COLORS, LAYOUT_RULES, MOTION_LIMITS } from '@/config';

interface HeroSectionProps {
  onEnter?: () => void;
}

/**
 * HERO SECTION
 * 
 * Compliant with LAYOUT_RULES.hero:
 * - Single focal element (logo)
 * - Required layers: background, gradient-overlay, content
 * - Optional layers: smoke, embers, vignette
 * 
 * Motion budget: embers + smoke + glowPulse (3 animations, within limit)
 */
export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (onEnter) {
      onEnter();
    } else {
      window.scrollTo({ 
        top: window.innerHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Pull assets from canonical paths
  const heroBackground = `/images/${ASSET_PATHS.hero}`;
  const logoFull = `/images/${ASSET_PATHS.logoFull}`;
  const smokeOverlay = `/images/${ASSET_PATHS.smoke}`;

  return (
    <section 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: LAYOUT_RULES.hero.minHeight }}
    >
      {/* === LAYER 1: BACKGROUND (required) === */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackground}
          alt="Queen seated on throne in crimson darkness"
          fill
          priority
          className="object-cover object-center"
          style={{
            // Motion: glowPulse (within MOTION_LIMITS.motionBudget.hero)
            animation: `hero-glow-pulse ${MOTION_LIMITS.minDurations.glowPulse}ms ease-in-out infinite`,
          }}
        />
        {/* === LAYER 2: GRADIENT OVERLAY (required) === */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${COLORS.black.true} 0%, ${COLORS.black.true}99 40%, ${COLORS.black.true}66 100%)`,
          }}
        />
      </div>

      {/* === LAYER: SMOKE (optional) === */}
      <div 
        className="absolute inset-0 z-[1] opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${smokeOverlay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Motion: smokeDrift (within budget)
          animation: `smoke-drift ${MOTION_LIMITS.minDurations.smokeDrift}ms ease-in-out infinite alternate`,
        }}
      />

      {/* === LAYER: VIGNETTE (optional) === */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${COLORS.black.true}66 60%, ${COLORS.black.true}D9 100%)`,
        }}
      />

      {/* === LAYER: EMBERS (optional) === */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              bottom: '-10px',
              background: COLORS.ember.primary,
              boxShadow: `0 0 6px ${COLORS.ember.primary}, 0 0 12px ${COLORS.ember.light}`,
              // Motion: emberDrift (within budget)
              animation: `ember-float ${MOTION_LIMITS.minDurations.emberDrift + i * 2000}ms ease-in-out infinite`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* === LAYER 3: CONTENT (required) === */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* DOMINANT FOCAL ELEMENT: Logo */}
        <div 
          className={`transition-all duration-[1200ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Image
            src={logoFull}
            alt="BLACKFEATHER"
            width={280}
            height={180}
            priority
            className="drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 0 30px ${COLORS.gold.highlight}4D)`,
            }}
          />
        </div>

        {/* Tagline (supporting element) */}
        <p 
          className={`tagline text-xl md:text-2xl mt-6 transition-all duration-[1200ms] delay-300 ease-out ${
            isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ color: COLORS.white.text }}
        >
          Stories That Actually End
        </p>

        {/* Sub-tagline (supporting element) */}
        <p 
          className={`font-body text-sm md:text-base tracking-[0.25em] mt-3 transition-all duration-[1200ms] delay-500 ease-out ${
            isVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ color: COLORS.gold.highlight }}
        >
          Power. Betrayal. Rebirth.
        </p>

        {/* Decorative gold rule */}
        <div 
          className={`mt-10 mb-10 transition-all duration-[1000ms] delay-700 ease-out ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        >
          <div className="gold-rule w-40 md:w-56" />
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleEnter}
          className={`btn-throne transition-all duration-[1200ms] delay-900 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Enter the Throne
        </button>
      </div>

      {/* Scroll indicator (supporting element) */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-[1200ms] delay-[1200ms] ${
          isVisible ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <span 
          className="font-display text-xs tracking-[0.3em] uppercase"
          style={{ color: COLORS.gold.shadow }}
        >
          Scroll
        </span>
        <svg 
          className="w-4 h-4 animate-bounce" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke={COLORS.gold.shadow}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
