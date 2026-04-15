'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import SagaFeed from '@/components/SagaFeed';
import { FeedLoading, FeedEmpty, FeedError } from '@/components/FeedStates';
import { getSupabase } from '@/lib/supabase';
import { MOCK_SAGAS } from '@/lib/mock-data';
import type { SagaDetail } from '@/lib/types';

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
