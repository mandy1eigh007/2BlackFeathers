'use client';

import { COLORS, COMPONENT_RULES } from '@/config';

interface ChapterCardProps {
  id: string;
  title: string;
  chapterNumber: number;
  sagaName: string;
  sagaSlug: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  isFree?: boolean;
  onPlay?: () => void;
  className?: string;
}

/**
 * CHAPTER CARD — Row layout for chapter listings
 * 
 * Compliant with COMPONENT_RULES.card.chapter:
 * - Layout: row
 * - Max elements: 5 (thumb, saga-badge, title, meta, play)
 * - Thumbnail ratio: 16:9
 */
export default function ChapterCard({
  title,
  chapterNumber,
  sagaName,
  thumbnailUrl,
  durationSeconds,
  isFree = false,
  onPlay,
  className = '',
}: ChapterCardProps) {
  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const chapterRules = COMPONENT_RULES.card.chapter;

  return (
    <article 
      className={`chapter-row cursor-pointer ${className}`}
      style={{
        background: COLORS.black.panel,
        border: chapterRules.border,
      }}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay?.();
        }
      }}
    >
      {/* Element 1: Thumbnail */}
      <div className="chapter-thumb">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${COLORS.feather.base}, ${COLORS.black.true})`,
            }}
          >
            <PlayIconSmall 
              className="w-6 h-6" 
              style={{ color: `${COLORS.gold.highlight}4D` }}
            />
          </div>
        )}
        
        {/* Play overlay on thumbnail */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: `${COLORS.black.true}4D` }}
        >
          <PlayIconSmall 
            className="w-8 h-8" 
            style={{ color: COLORS.gold.highlight }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Element 2: Saga badge */}
        <div className="flex items-center gap-2 mb-1">
          <CrownIconTiny 
            className="w-3 h-3" 
            style={{ color: `${COLORS.gold.highlight}99` }}
          />
          <span 
            className="text-[10px] font-display tracking-[0.15em] uppercase truncate"
            style={{ color: `${COLORS.gold.highlight}B3` }}
          >
            {sagaName}
          </span>
        </div>

        {/* Element 3: Chapter title */}
        <h4 
          className="font-body text-base leading-tight truncate"
          style={{ color: COLORS.white.text }}
        >
          Chapter {chapterNumber}: {title}
        </h4>

        {/* Element 4: Meta info */}
        <div className="flex items-center gap-3 mt-1">
          {durationSeconds && (
            <span 
              className="text-[11px]"
              style={{ color: `${COLORS.white.text}66` }}
            >
              {formatDuration(durationSeconds)}
            </span>
          )}
          {isFree && (
            <span 
              className="text-[10px] font-display tracking-wider uppercase"
              style={{ color: `${COLORS.gold.highlight}B3` }}
            >
              Free
            </span>
          )}
        </div>
      </div>

      {/* Element 5: Play button */}
      <button 
        className="btn-play shrink-0"
        style={{
          background: `${COLORS.gold.highlight}1A`,
          border: `1px solid ${COLORS.gold.highlight}`,
          color: COLORS.gold.highlight,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.();
        }}
        aria-label={`Play ${title}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </article>
  );
}

// Mini play icon
function PlayIconSmall({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// Tiny crown for saga badge
function CrownIconTiny({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 2L9 9L2 7L5 14H19L22 7L15 9L12 2Z" opacity="0.8" />
      <path d="M5 16H19V18H5V16Z" />
    </svg>
  );
}
