'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import SagaFeed from '@/components/SagaFeed';
import { FeedLoading, FeedEmpty, FeedError } from '@/components/FeedStates';
import { getSupabase } from '@/lib/supabase';
import type { SagaDetail } from '@/lib/types';

// Mock sagas for development when Supabase isn't connected
// Using CANONICAL image paths from public/images/
const MOCK_SAGAS: SagaDetail[] = [
  {
    id: '1',
    title: 'The Fallen Queen',
    slug: 'the-fallen-queen',
    description: 'Betrayed. Executed. Reborn.',
    coverImage: '/images/saga-fallen-queen.jpg',
    isComplete: true,
    totalChapters: 8,
    price: 4.99,
    chapters: [
      { id: 'c1', chapterNumber: 1, title: 'The Betrayal', videoUrl: '', isFree: true, durationSeconds: 180 },
      { id: 'c2', chapterNumber: 2, title: 'The Fall', videoUrl: '', isFree: false, durationSeconds: 240 },
      { id: 'c3', chapterNumber: 3, title: 'The Pyre', videoUrl: '', isFree: false, durationSeconds: 200 },
      { id: 'c4', chapterNumber: 4, title: 'The Ashes', videoUrl: '', isFree: false, durationSeconds: 220 },
      { id: 'c5', chapterNumber: 5, title: 'The Rebirth', videoUrl: '', isFree: false, durationSeconds: 260 },
      { id: 'c6', chapterNumber: 6, title: 'The Hunt', videoUrl: '', isFree: false, durationSeconds: 240 },
      { id: 'c7', chapterNumber: 7, title: 'The Reckoning', videoUrl: '', isFree: false, durationSeconds: 280 },
      { id: 'c8', chapterNumber: 8, title: 'The Throne', videoUrl: '', isFree: false, durationSeconds: 300 },
    ],
  },
  {
    id: '2',
    title: 'The Ashen Blade',
    slug: 'the-ashen-blade',
    description: 'Forged in fire. Wielded by fate.',
    coverImage: '/images/saga-ashen-blade.jpg',
    isComplete: false,
    totalChapters: 6,
    price: 3.99,
    chapters: [
      { id: 'c9', chapterNumber: 1, title: 'The Forging', videoUrl: '', isFree: true, durationSeconds: 220 },
      { id: 'c10', chapterNumber: 2, title: 'The Trial', videoUrl: '', isFree: false, durationSeconds: 190 },
      { id: 'c11', chapterNumber: 3, title: 'The Ember', videoUrl: '', isFree: false, durationSeconds: 250 },
      { id: 'c12', chapterNumber: 4, title: 'The Shadow', videoUrl: '', isFree: false, durationSeconds: 230 },
      { id: 'c13', chapterNumber: 5, title: 'The Storm', videoUrl: '', isFree: false, durationSeconds: 260 },
      { id: 'c14', chapterNumber: 6, title: 'The Blade', videoUrl: '', isFree: false, durationSeconds: 280 },
    ],
  },
];

type FeedState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'ready'; sagas: SagaDetail[] };

export default function HomeContent() {
  const [state, setState] = useState<FeedState>({ status: 'loading' });

  useEffect(() => {
    const client = getSupabase();

    if (!client) {
      // No Supabase configured — use mock data
      setState({ status: 'ready', sagas: MOCK_SAGAS });
      return;
    }

    let cancelled = false;

    async function loadSagas() {
      try {
        const supabase = client!;
        
        const { data, error } = await supabase
          .from('sagas')
          .select(`
            id,
            title,
            slug,
            description,
            cover_image,
            is_complete,
            total_chapters,
            price,
            chapters (
              id,
              chapter_number,
              title,
              video_url,
              is_free,
              duration_seconds
            )
          `)
          .eq('is_published', true)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (cancelled) return;

        if (error) {
          setState({ status: 'error', message: error.message });
          return;
        }

        if (!data || data.length === 0) {
          setState({ status: 'empty' });
          return;
        }

        // Transform to SagaDetail format
        const sagas: SagaDetail[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          coverImage: row.cover_image,
          isComplete: row.is_complete,
          totalChapters: row.total_chapters,
          price: row.price,
          chapters: (row.chapters || [])
            .sort((a: any, b: any) => a.chapter_number - b.chapter_number)
            .map((ch: any) => ({
              id: ch.id,
              chapterNumber: ch.chapter_number,
              title: ch.title,
              videoUrl: ch.video_url,
              isFree: ch.is_free,
              durationSeconds: ch.duration_seconds,
            })),
        }));

        setState({ status: 'ready', sagas });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    loadSagas();
    return () => {
      cancelled = true;
    };
  }, []);

  // Loading state
  if (state.status === 'loading') {
    return (
      <>
        <HeroSection />
        <div className="py-20">
          <FeedLoading />
        </div>
      </>
    );
  }

  // Error state
  if (state.status === 'error') {
    return (
      <>
        <HeroSection />
        <div className="py-20">
          <FeedError message={state.message} />
        </div>
      </>
    );
  }

  // Empty state
  if (state.status === 'empty') {
    return (
      <>
        <HeroSection />
        <div className="py-20">
          <FeedEmpty />
        </div>
      </>
    );
  }

  // Ready state with sagas
  return (
    <>
      <HeroSection />
      <SagaFeed sagas={state.sagas} />
      
      {/* Footer spacer */}
      <div className="h-20" />
    </>
  );
}
