import { getSupabase } from './supabase';
import type { ApiResult, ChapterFeedItem, SagaDetail } from './types';

/**
 * Fetch chapters for the main feed.
 */
export async function getFeedChapters(): Promise<ApiResult<ChapterFeedItem[]>> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        id,
        chapter_number,
        title,
        video_url,
        is_free,
        duration_seconds,
        sagas!inner (
          title,
          slug
        )
      `)
      .eq('sagas.is_published', true)
      .is('sagas.deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return { data: null, error: error.message };
    }

    const chapters: ChapterFeedItem[] = (data || []).map((row: any) => ({
      id: row.id,
      sagaName: row.sagas.title,
      sagaSlug: row.sagas.slug,
      title: row.title,
      chapterNumber: row.chapter_number,
      videoUrl: row.video_url,
      isFree: row.is_free,
      durationSeconds: row.duration_seconds,
    }));

    return { data: chapters, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Fetch a single saga by slug with all chapters.
 */
export async function getSagaBySlug(slug: string): Promise<ApiResult<SagaDetail>> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
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
      .eq('slug', slug)
      .eq('is_published', true)
      .is('deleted_at', null)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: 'Saga not found' };
    }

    const saga: SagaDetail = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      coverImage: data.cover_image,
      isComplete: data.is_complete,
      totalChapters: data.total_chapters,
      price: data.price,
      chapters: (data.chapters || [])
        .sort((a: any, b: any) => a.chapter_number - b.chapter_number)
        .map((ch: any) => ({
          id: ch.id,
          chapterNumber: ch.chapter_number,
          title: ch.title,
          videoUrl: ch.video_url,
          isFree: ch.is_free,
          durationSeconds: ch.duration_seconds,
        })),
    };

    return { data: saga, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
