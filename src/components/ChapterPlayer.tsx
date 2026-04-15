'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ChapterPlayerProps {
  videoUrl: string;
  title: string;
  sagaName: string;
  sagaSlug: string;
  chapterNumber: number;
  isFree: boolean;
  durationSeconds?: number | null;
}

export default function ChapterPlayer({
  videoUrl,
  title,
  sagaName,
  sagaSlug,
  chapterNumber,
  isFree,
  durationSeconds,
}: ChapterPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(
    durationSeconds ?? null
  );

  // Pause video when scrolled out of view
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Track playback progress + resolve duration from metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration && isFinite(video.duration)) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setVideoDuration(Math.round(video.duration));
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasLoadError) return;

    if (video.paused) {
      // Clear previous play-blocked state on retry
      setPlayBlocked(false);
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // NotAllowedError = autoplay policy blocked, NOT a broken video
          if (err.name === 'NotAllowedError') {
            setPlayBlocked(true);
          } else {
            // AbortError, NotSupportedError, etc. = real problem
            setHasLoadError(true);
          }
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [hasLoadError]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        togglePlay();
      }
    },
    [togglePlay]
  );

  // Format seconds into M:SS
  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-[#1A1A1D] snap-start flex justify-center items-center cursor-pointer select-none"
      onClick={togglePlay}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${isPlaying ? 'Pause' : 'Play'} ${title}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        loop
        playsInline
        preload="metadata"
        onError={() => setHasLoadError(true)}
      />

      {/* Progress bar */}
      <div className="absolute bottom-20 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-[#D4AF37] transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chapter info overlay */}
      <div className="absolute bottom-24 left-4 right-16 text-white z-10 pointer-events-none">
        <Link
          href={`/saga/${sagaSlug}`}
          className="pointer-events-auto inline-block bg-[#1A1A1D]/60 backdrop-blur-sm border border-[#D4AF37]/30 px-3 py-1 rounded-sm text-xs font-display font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2 hover:bg-[#1A1A1D]/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {sagaName}
        </Link>
        <h2 className="font-display text-xl font-bold drop-shadow-lg tracking-wide leading-tight">
          {title}
        </h2>
        <p className="font-body text-xs text-white/50 mt-1 tracking-wide italic">
          Chapter {chapterNumber}
          {isFree ? ' · Free' : ''}
          {videoDuration != null ? ` · ${formatDuration(videoDuration)}` : ''}
        </p>
      </div>

      {/* Play button overlay — show when paused AND video is loadable */}
      {!isPlaying && !hasLoadError && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4 border border-[#D4AF37]/20 backdrop-blur-sm">
            <svg
              className="w-10 h-10 text-[#D4AF37] ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Tap-to-play hint when autoplay is blocked */}
          {playBlocked && (
            <p className="absolute bottom-32 text-white/40 text-xs tracking-wide">
              Tap to play
            </p>
          )}
        </div>
      )}

      {/* Load error state — only for genuinely broken videos */}
      {hasLoadError && (
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none bg-black/70">
          <p className="text-white/60 text-sm">Failed to load video</p>
          <p className="text-white/30 text-xs mt-1">Check your connection and try again</p>
        </div>
      )}
    </div>
  );
}
