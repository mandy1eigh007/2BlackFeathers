'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { ASSET_PATHS, COLORS, COMPONENT_RULES } from '@/config';

/**
 * Navbar Component
 * 
 * Uses ASSET_PATHS.crest (NOT logo-full — that's for hero only)
 * Colors pulled from locked COLORS constant
 */
export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  // Pull from brand system
  const logoSrc = `/images/${ASSET_PATHS.crest}`;
  const navRules = COMPONENT_RULES.navbar;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: `linear-gradient(180deg, ${COLORS.black.true}F2 0%, ${COLORS.black.true}B3 60%, transparent 100%)`,
      }}
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
      >
        {/* Crest logo - size from COMPONENT_RULES.navbar */}
        <Image
          src={logoSrc}
          alt="BLACKFEATHER crest"
          width={36}
          height={36}
          className="object-contain"
          style={{
            filter: `drop-shadow(0 0 8px ${COLORS.gold.highlight}33)`,
          }}
        />
        <span 
          className="font-display font-semibold tracking-[0.2em] text-sm sm:text-base"
          style={{ color: COLORS.gold.highlight }}
        >
          BLACKFEATHER
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {loading ? (
          <div className="w-16" />
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold uppercase tracking-wider transition-all"
              style={{
                background: `${COLORS.gold.highlight}1A`,
                border: `1px solid ${COLORS.gold.highlight}4D`,
                color: COLORS.gold.highlight,
              }}
              aria-label="Account menu"
            >
              {user.email?.charAt(0) ?? '?'}
            </button>

            {showMenu && (
              <div 
                className="absolute top-10 right-0 backdrop-blur-md rounded-sm shadow-2xl py-1 min-w-[180px] animate-fade-in"
                style={{
                  background: `${COLORS.black.panel}F2`,
                  border: `1px solid ${COLORS.gold.highlight}1A`,
                }}
              >
                <p 
                  className="px-3 py-2 text-xs font-body truncate"
                  style={{ 
                    color: `${COLORS.white.text}4D`,
                    borderBottom: `1px solid ${COLORS.white.text}0D`,
                  }}
                >
                  {user.email}
                </p>
                <button
                  onClick={async () => {
                    setShowMenu(false);
                    await signOut();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-body transition-colors hover:bg-white/5"
                  style={{ color: `${COLORS.white.text}99` }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="font-display px-4 py-1.5 rounded-sm text-xs font-semibold shadow-lg transition-all active:scale-95 uppercase tracking-[0.15em]"
            style={{
              background: COLORS.crimson.button,
              color: COLORS.gold.highlight,
              border: `1px solid ${COLORS.gold.shadow}`,
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
