'use client';

import SagaCard from './SagaCard';
import type { SagaDetail } from '@/lib/types';

interface SagaFeedProps {
  sagas: SagaDetail[];
  className?: string;
}

export default function SagaFeed({ sagas, className = '' }: SagaFeedProps) {
  if (sagas.length === 0) {
    return null;
  }

  return (
    <section id="sagas" className={`py-12 px-4 md:px-6 ${className}`}>
      {/* Section header with ornamental dividers */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8C6B1F] to-transparent" />
          <div className="flex items-center gap-3">
            <FeatherIcon className="w-4 h-4 text-[#D4AF37]/50" />
            <h2 className="font-display text-sm tracking-[0.3em] text-[#D4AF37]/70 uppercase">
              Sagas
            </h2>
            <FeatherIcon className="w-4 h-4 text-[#D4AF37]/50 scale-x-[-1]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8C6B1F] to-transparent" />
        </div>
      </div>

      {/* Saga cards */}
      <div className="max-w-2xl mx-auto space-y-6">
        {sagas.map((saga, index) => (
          <div 
            key={saga.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <SagaCard
              id={saga.id}
              title={saga.title}
              slug={saga.slug}
              tagline={saga.description || undefined}
              coverImage={saga.coverImage}
              totalChapters={saga.totalChapters}
              isComplete={saga.isComplete}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// Decorative feather icon for section header
function FeatherIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C10 6 8 10 6 14C4 18 3 20 3 20C5 18 7 16 12 14C12 12 12 8 12 2Z" opacity="0.7" />
      <path d="M12 2C14 6 16 10 18 14C20 18 21 20 21 20C19 18 17 16 12 14" opacity="0.5" />
      <path d="M12 2V22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}
