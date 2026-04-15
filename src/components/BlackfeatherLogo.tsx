/**
 * BLACKFEATHER Hero Logo
 * 
 * Composition (top → bottom):
 * 1. Crown — ornate, thin spikes, gold gradient
 * 2. Feather — realistic, heavy, controlled
 * 3. Filigree frame — curling gold vines, mirrored
 * 4. Text: BLACKFEATHER (separate component)
 * 
 * The feather should feel: Heavy, not airy. Controlled, not floating.
 */

interface BlackfeatherLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function BlackfeatherLogo({ 
  className = '', 
  size = 180,
  showText = true 
}: BlackfeatherLogoProps) {
  const textSize = size * 0.12;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BLACKFEATHER crest logo"
      >
        <defs>
          {/* Gold gradient - highlight to shadow */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#B8962E" />
            <stop offset="100%" stopColor="#8C6B1F" />
          </linearGradient>
          
          {/* Feather gradient - controlled darkness */}
          <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="40%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>
          
          {/* Subtle glow filter */}
          <filter id="crownGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* === CROWN === */}
        <g transform="translate(100, 35)" filter="url(#crownGlow)">
          {/* Crown base band */}
          <path
            d="M-35 15 L35 15 L32 22 L-32 22 Z"
            fill="url(#goldGradient)"
          />
          {/* Crown points */}
          <path
            d="M-35 15 L-40 -8 L-28 5 L-20 -15 L-10 8 L0 -25 L10 8 L20 -15 L28 5 L40 -8 L35 15 Z"
            fill="url(#goldGradient)"
          />
          {/* Crown jewels/dots */}
          <circle cx="-20" cy="8" r="2" fill="#5A0A0A" opacity="0.7" />
          <circle cx="0" cy="5" r="3" fill="#5A0A0A" opacity="0.8" />
          <circle cx="20" cy="8" r="2" fill="#5A0A0A" opacity="0.7" />
        </g>

        {/* === FILIGREE FRAME (wrapping feather) === */}
        <g transform="translate(100, 125)">
          {/* Left side filigree */}
          <path
            d="M-55 -40 
               C-60 -20, -65 10, -55 40
               C-50 55, -40 65, -25 72
               C-35 60, -45 45, -48 25
               C-52 5, -50 -15, -45 -30
               C-50 -25, -55 -15, -55 -40"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          {/* Left vine decorations */}
          <circle cx="-52" cy="-30" r="2" fill="url(#goldGradient)" opacity="0.6" />
          <circle cx="-56" cy="0" r="2.5" fill="url(#goldGradient)" opacity="0.6" />
          <circle cx="-52" cy="30" r="2" fill="url(#goldGradient)" opacity="0.6" />
          
          {/* Right side filigree (mirrored) */}
          <path
            d="M55 -40 
               C60 -20, 65 10, 55 40
               C50 55, 40 65, 25 72
               C35 60, 45 45, 48 25
               C52 5, 50 -15, 45 -30
               C50 -25, 55 -15, 55 -40"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          {/* Right vine decorations */}
          <circle cx="52" cy="-30" r="2" fill="url(#goldGradient)" opacity="0.6" />
          <circle cx="56" cy="0" r="2.5" fill="url(#goldGradient)" opacity="0.6" />
          <circle cx="52" cy="30" r="2" fill="url(#goldGradient)" opacity="0.6" />
          
          {/* Bottom connection */}
          <path
            d="M-25 72 C-10 78, 10 78, 25 72"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {/* === FEATHER (Centerpiece) === */}
        <g transform="translate(100, 125)">
          {/* Feather main body - heavy, controlled */}
          <path
            d="M0 -65 
               C-3 -55, -8 -40, -12 -20
               C-15 0, -16 25, -14 45
               C-12 60, -8 70, 0 78
               C8 70, 12 60, 14 45
               C16 25, 15 0, 12 -20
               C8 -40, 3 -55, 0 -65"
            fill="url(#featherGradient)"
          />
          
          {/* Feather center spine */}
          <path
            d="M0 -60 C0 -30, 0 10, 0 75"
            stroke="#0B0B0B"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Left barbs */}
          <g opacity="0.5">
            <path d="M-2 -50 C-8 -48, -14 -44, -16 -40" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M-2 -40 C-10 -36, -16 -30, -18 -24" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M-2 -28 C-10 -24, -16 -16, -18 -8" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M-2 -14 C-10 -10, -16 0, -17 10" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M-2 2 C-10 6, -15 16, -16 28" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M-2 18 C-8 22, -12 34, -14 44" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
          </g>
          
          {/* Right barbs */}
          <g opacity="0.5">
            <path d="M2 -50 C8 -48, 14 -44, 16 -40" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M2 -40 C10 -36, 16 -30, 18 -24" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M2 -28 C10 -24, 16 -16, 18 -8" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M2 -14 C10 -10, 16 0, 17 10" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M2 2 C10 6, 15 16, 16 28" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
            <path d="M2 18 C8 22, 12 34, 14 44" stroke="#2A2A2A" strokeWidth="0.5" fill="none" />
          </g>
        </g>
      </svg>
      
      {/* === TYPOGRAPHY: BLACKFEATHER === */}
      {showText && (
        <h1 
          className="font-display tracking-[0.25em] mt-4"
          style={{ 
            fontSize: `${textSize}px`,
            color: '#D4AF37'
          }}
        >
          BLACKFEATHER
        </h1>
      )}
    </div>
  );
}

/**
 * Simplified crest icon for navbar / smaller contexts
 */
export function CrestIcon({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BLACKFEATHER crest"
    >
      <defs>
        <linearGradient id="crestGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6B1F" />
        </linearGradient>
      </defs>
      
      {/* Simplified crown */}
      <path
        d="M20 22 L18 12 L24 18 L28 8 L32 18 L36 8 L40 18 L46 12 L44 22 Z"
        fill="url(#crestGold)"
      />
      
      {/* Simplified feather */}
      <path
        d="M32 20 C30 28, 28 38, 29 48 C30 54, 31 58, 32 60 C33 58, 34 54, 35 48 C36 38, 34 28, 32 20"
        fill="#1A1A1A"
      />
      
      {/* Simplified filigree curves */}
      <path
        d="M18 28 C16 38, 18 48, 26 56"
        stroke="url(#crestGold)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M46 28 C48 38, 46 48, 38 56"
        stroke="url(#crestGold)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
