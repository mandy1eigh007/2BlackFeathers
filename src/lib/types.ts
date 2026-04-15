// === SAGA TYPES ===

export interface ChapterFeedItem {
  id: string;
  sagaName: string;
  sagaSlug: string;
  title: string;
  chapterNumber: number;
  videoUrl: string;
  isFree: boolean;
  durationSeconds: number | null;
}

export interface ChapterDetail {
  id: string;
  chapterNumber: number;
  title: string;
  videoUrl: string;
  isFree: boolean;
  durationSeconds: number | null;
}

export interface SagaDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isComplete: boolean;
  totalChapters: number;
  price: number;
  chapters: ChapterDetail[];
}

// === API RESPONSE TYPES ===

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}
