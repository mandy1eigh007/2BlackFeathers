'use client';

export function FeedLoading() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-transparent">
      <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      <p className="text-white/40 text-sm mt-4 tracking-wide">Loading...</p>
    </div>
  );
}

export function FeedEmpty() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-transparent px-8 text-center">
      <p className="text-[#D4AF37] text-lg font-bold tracking-widest uppercase mb-2">
        No Stories Yet
      </p>
      <p className="text-white/40 text-sm leading-relaxed">
        New sagas are coming soon. Check back shortly.
      </p>
    </div>
  );
}

export function FeedError({ message }: { message: string }) {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-transparent px-8 text-center">
      <p className="text-[#8B0000] text-lg font-bold tracking-widest uppercase mb-2">
        Something Went Wrong
      </p>
      <p className="text-white/40 text-sm leading-relaxed mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#D4AF37] text-black px-5 py-2 rounded-sm text-sm font-semibold uppercase tracking-wide transition-all hover:opacity-90 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
