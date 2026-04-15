'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getSagaBySlug } from '@/lib/queries';
import type { SagaDetail } from '@/lib/types';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'not_found' }
  | { status: 'ready'; saga: SagaDetail };

export default function SagaPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const client = getSupabase();
    if (!client) {
      setState({ status: 'not_found' });
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const result = await getSagaBySlug(slug);
        if (cancelled) return;

        if (result.error) {
          if (
            result.error.includes('row') ||
            result.error.includes('PGRST116')
          ) {
            setState({ status: 'not_found' });
          } else {
            setState({ status: 'error', message: result.error });
          }
        } else if (result.data === null) {
          setState({ status: 'not_found' });
        } else {
          setState({ status: 'ready', saga: result.data });
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleUnlock = () => {
    if (!user) {
      // Not signed in — send to auth page
      router.push('/auth');
      return;
    }
    // Signed in but payments not live yet
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (state.status === 'not_found') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col justify-center items-center px-8 text-center">
        <p className="text-[#D4AF37] text-lg font-bold tracking-widest uppercase mb-2">
          Saga Not Found
        </p>
        <p className="text-white/40 text-sm mb-6">
          This story doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link
          href="/"
          className="text-[#D4AF37] text-sm underline underline-offset-4 hover:opacity-80"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col justify-center items-center px-8 text-center">
        <p className="text-[#8B0000] text-lg font-bold tracking-widest uppercase mb-2">
          Something Went Wrong
        </p>
        <p className="text-white/40 text-sm mb-4">{state.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#D4AF37] text-black px-5 py-2 rounded-sm text-sm font-semibold uppercase tracking-wide transition-all hover:opacity-90 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { saga } = state;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Cover image */}
      <div className="relative">
        {saga.coverImage && (
          <div className="w-full h-64 relative">
            <img
              src={saga.coverImage}
              alt={saga.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          </div>
        )}

        <div className="px-5 pt-4 pb-6">
          <Link
            href="/"
            className="text-[#D4AF37] text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            &larr; Back
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-wide mt-4">
            {saga.title}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            {saga.isComplete && (
              <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                Complete
              </span>
            )}
            <span className="text-white/40 text-sm">
              {saga.totalChapters} chapter
              {saga.totalChapters !== 1 ? 's' : ''}
            </span>
            <span className="text-white/40 text-sm">
              ${saga.price.toFixed(2)}
            </span>
          </div>

          {saga.description && (
            <p className="text-white/60 text-sm leading-relaxed mt-4">
              {saga.description}
            </p>
          )}

          <div className="relative">
            <button
              onClick={handleUnlock}
              className="w-full bg-[#D4AF37] text-black py-3 rounded-sm text-sm font-bold uppercase tracking-widest mt-6 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {user
                ? `Unlock Full Saga — $${saga.price.toFixed(2)}`
                : 'Sign In to Unlock'}
            </button>

            {showToast && (
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="bg-[#1A1A1D] border border-[#D4AF37]/20 text-white/70 text-xs px-3 py-1.5 rounded-sm shadow-lg animate-fade-in inline-block">
                  Payments coming soon
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="px-5 pb-10 mt-4">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
          Chapters
        </h2>

        <div className="space-y-1">
          {saga.chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="flex items-center justify-between py-3 px-3 rounded-sm hover:bg-[#1A1A1D]/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-white/30 text-sm font-bold w-6 text-right shrink-0">
                  {chapter.chapterNumber}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {chapter.title}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {chapter.durationSeconds != null
                      ? formatDuration(chapter.durationSeconds)
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 ml-3">
                {chapter.isFree ? (
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wide">
                    Free
                  </span>
                ) : (
                  <svg
                    className="w-4 h-4 text-white/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
