'use client';

import Link from 'next/link';
import Image from 'next/image';
import { COLORS, COMPONENT_RULES } from '@/config';

interface SagaCardProps {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string | null;
  coverImage?: string | null;
  totalChapters: number;
  isComplete?: boolean;
  className?: string;
}

/**
 * SAGA CARD — Horizontal cinematic layout
 * 
 * Compliant with COMPONENT_RULES.card.saga:
 * - Layout: horizontal (image left, content right)
 * - Max elements: 6 (badge, title, tagline, meta, cta, image)
 * - Border/background from COLORS constant
 */
export default function SagaCard({
  title,
  slug,
  tagline,
  description,
  coverImage,
  totalChapters,
  isComplete,
  className = '',
}: SagaCardProps) {
  const displayTagline = tagline || description?.slice(0, 60) || 'A tale of power and betrayal.';
  const cardRules = COMPONENT_RULES.card.saga;

  return (
    <Link 
      href={`/saga/${slug}`}
      className={`saga-card group block ${className}`}
      style={{
        background: COLORS.black.panel,
        border: `1px solid ${COLORS.gold.shadow}`,
      }}
    >
      {/* Image side with gradient bleed */}
      <div className="saga-card-image relative w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] md:w-[180px] md:h-[240px]">
        {coverImage ? (
          <>
            <Image 
              src={coverImage} 
              alt={title}
              fill
              className="object-cover object-top"
            />
            {/* Gradient bleed to darkness */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent 0%, transparent 50%, ${COLORS.black.panel} 100%)`,
              }}
            />
          </>
        ) : (
          /* Placeholder gradient if no image */
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(to bottom right, ${COLORS.crimson.deep}, ${COLORS.black.panel}, ${COLORS.black.true})`,
            }}
          />
        )}
      </div>

      {/* Content side */}
      <div className="saga-card-content min-w-0 flex-1">
        {/* Element 1: Status badge */}
        <div className="flex items-center gap-2 mb-3">
          {isComplete ? (
            <span 
              className="font-display text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border"
              style={{ 
                color: COLORS.gold.highlight,
                borderColor: `${COLORS.gold.highlight}4D`,
                background: `${COLORS.gold.highlight}0D`,
              }}
            >
              Complete
            </span>
          ) : (
            <span 
              className="font-display text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border"
              style={{ 
                color: COLORS.crimson.accent,
                borderColor: `${COLORS.crimson.accent}4D`,
                background: `${COLORS.crimson.accent}0D`,
              }}
            >
              Ongoing
            </span>
          )}
        </div>

        {/* Element 2: Title */}
        <h2 
          className="font-display text-lg sm:text-xl md:text-2xl leading-tight tracking-wide"
          style={{ color: COLORS.white.text }}
        >
          {title.toUpperCase()}
        </h2>

        {/* Element 3: Tagline */}
        <p 
          className="tagline text-sm sm:text-base mt-2 line-clamp-2"
          style={{ color: COLORS.white.dim }}
        >
          {displayTagline}
        </p>

        {/* Element 4: Chapter count (meta) */}
        <p 
          className="font-body text-xs mt-3 tracking-wide"
          style={{ color: `${COLORS.gold.highlight}80` }}
        >
          {totalChapters} Chapter{totalChapters !== 1 ? 's' : ''}
        </p>

        {/* Element 5: CTA Button */}
        <div className="mt-4">
          <span 
            className="btn-outline text-[10px] sm:text-[11px] px-4 py-2"
            style={{
              border: `1px solid ${COLORS.gold.highlight}`,
              color: COLORS.gold.highlight,
            }}
          >
            Begin the Story
          </span>
        </div>
      </div>
    </Link>
  );
}
