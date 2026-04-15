# BLACKFEATHER

> Stories that actually end. Power. Betrayal. Rebirth.

A cinematic short-form streaming app built with Next.js 14, TypeScript, and Tailwind CSS.

## Brand System v2.1.0

### Color Palette (LOCKED)

| Role | Hex | Usage |
|------|-----|-------|
| Black True | `#0B0B0B` | Primary background |
| Black Panel | `#111111` | Cards, modals |
| Black Card | `#141414` | Elevated surfaces |
| Crimson Deep | `#5A0A0A` | Shadows, depth |
| Crimson Accent | `#8B0000` | Primary crimson |
| Crimson Button | `#7A0E0E` | CTA buttons |
| Gold Highlight | `#D4AF37` | Primary gold |
| Gold Mid | `#B8962E` | Gold midtones |
| Gold Shadow | `#8C6B1F` | Gold shadows |
| Ember | `#FF6A00` | Accent glow |
| Text Primary | `#EAEAEA` | Body text |

### Typography

- **Display**: Cinzel (headings, buttons, UI labels)
- **Body**: Cormorant Garamond (prose, taglines)

### Motion Rules

- Ember drift: 12-20s
- Smoke drift: 20-30s
- Glow pulse: 5-8s
- Fade-in: 0.8-1.2s

**PROHIBITED**: bounce, shake, spin, rapid pulse, neon glow, flash

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. (Optional) Add your Supabase credentials to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Brand system CSS
│   ├── layout.tsx       # Root layout with atmospheric layers
│   ├── page.tsx         # Home page
│   ├── auth/
│   │   └── page.tsx     # Authentication
│   └── saga/
│       └── [slug]/
│           └── page.tsx # Saga detail page
├── components/
│   ├── BlackfeatherLogo.tsx
│   ├── ChapterCard.tsx
│   ├── ChapterPlayer.tsx
│   ├── FeedStates.tsx
│   ├── HeroSection.tsx
│   ├── HomeContent.tsx
│   ├── Navbar.tsx
│   ├── SagaCard.tsx
│   └── SagaFeed.tsx
├── config/
│   ├── brand-system.ts      # Visual governance
│   ├── brand-validation.ts  # Validation utilities
│   ├── brand-enforcement.ts # CI/build enforcement
│   ├── story-system.ts      # Narrative rules
│   ├── story-validation.ts  # Story validation
│   ├── system-health.ts     # Health check
│   └── index.ts
└── lib/
    ├── auth-context.tsx
    ├── queries.ts
    ├── supabase.ts
    └── types.ts
```

## Supabase Schema

The app expects these tables:

```sql
-- Sagas table
create table sagas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image text,
  is_complete boolean default false,
  is_published boolean default false,
  total_chapters int default 0,
  price decimal(10,2) default 0,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

-- Chapters table
create table chapters (
  id uuid primary key default gen_random_uuid(),
  saga_id uuid references sagas(id),
  chapter_number int not null,
  title text not null,
  video_url text,
  is_free boolean default false,
  duration_seconds int,
  created_at timestamptz default now()
);
```

## License

Proprietary - All rights reserved.
