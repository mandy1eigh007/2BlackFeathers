'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { CrestIcon } from '@/components/BlackfeatherLogo';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError('Authentication is not configured');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('Check your email to confirm your account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <CrestIcon size={32} className="text-[#D4AF37] group-hover:opacity-80 transition-opacity" />
        <span className="font-display text-[#D4AF37] font-bold tracking-[0.25em] text-lg">
          BLACKFEATHER
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-sm bg-[#111111] border border-[#D4AF37]/10 rounded-sm p-6">
        <h1 className="font-display text-xl text-center text-[#EAEAEA] tracking-wide mb-6">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-sm px-3 py-2 text-[#EAEAEA] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-sm px-3 py-2 text-[#EAEAEA] text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#8B0000] text-xs text-center">{error}</p>
          )}

          {success && (
            <p className="text-[#D4AF37] text-xs text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
              setSuccess(null);
            }}
            className="text-[#D4AF37]/70 text-xs hover:text-[#D4AF37] transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="mt-8 text-white/30 text-xs hover:text-white/50 transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
