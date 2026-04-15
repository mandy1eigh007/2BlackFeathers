import type { SagaDetail } from './types';

/**
 * Mock sagas for development when Supabase isn't connected.
 * Uses CANONICAL image paths from public/images/.
 */
export const MOCK_SAGAS: SagaDetail[] = [
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

/**
 * Look up a mock saga by its slug.
 * Returns undefined if no mock saga matches.
 */
export function getMockSagaBySlug(slug: string): SagaDetail | undefined {
  return MOCK_SAGAS.find((s) => s.slug === slug);
}
