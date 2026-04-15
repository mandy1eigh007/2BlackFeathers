import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'BLACKFEATHER',
  description: 'Stories that actually end. Power. Betrayal. Rebirth.',
  openGraph: {
    title: 'BLACKFEATHER',
    description: 'Short-form cinematic stories. Complete. No filler. No tricks.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0B] text-[#EAEAEA] antialiased grain">
        {/* Atmospheric layers */}
        <div className="crimson-depth" aria-hidden="true" />
        <div className="smoke-layer" aria-hidden="true" />
        <div className="ember-layer" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        {/* App content — above all atmospheric layers */}
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
