# Supabase Auth Setup

This project already includes client-side Supabase auth for email/password sign-in on [`/auth`](../src/app/auth/page.tsx).

To bring authentication back online, wire up a Supabase project with the settings below.

## 1. Create or Open a Supabase Project

In Supabase:

1. Open your project.
2. Go to `Settings` -> `API`.
3. Copy:
   - `Project URL`
   - `anon public` key

Add them to `.env.local`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the Next.js dev server after editing env vars.

## 2. Enable Email/Password Auth

In Supabase:

1. Go to `Authentication` -> `Providers`.
2. Enable `Email`.
3. Enable `Email/password`.

If you want users to be able to sign in immediately after account creation, either:

- disable `Confirm email`, or
- keep it enabled and make sure your SMTP/email flow is configured.

This app currently shows `Check your email to confirm your account` after sign-up, so either mode works, but confirmation-required mode needs working email delivery.

## 3. Set Site URL and Redirect URLs

In Supabase:

1. Go to `Authentication` -> `URL Configuration`.
2. Set `Site URL` to your main app URL.
3. Add these redirect URLs:

For local development:

```text
http://localhost:3000
http://localhost:3000/auth
```

For production, also add your deployed domain, for example:

```text
https://your-domain.com
https://your-domain.com/auth
```

## 4. Create the App Tables

The app expects `sagas` and `chapters`.

Run this in the Supabase SQL editor if the tables are missing:

```sql
create extension if not exists pgcrypto;

create table if not exists public.sagas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image text,
  is_complete boolean default false,
  is_published boolean default false,
  total_chapters int default 0,
  price numeric(10,2) default 0,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  saga_id uuid references public.sagas(id) on delete cascade,
  chapter_number int not null,
  title text not null,
  video_url text,
  is_free boolean default false,
  duration_seconds int,
  created_at timestamptz default now()
);
```

## 5. Add Read Policies

This app fetches published sagas and their chapters on the public home page.
If RLS is enabled without policies, auth may work but the feed will fail.

Run this in the Supabase SQL editor:

```sql
alter table public.sagas enable row level security;
alter table public.chapters enable row level security;

create policy "public can read published sagas"
on public.sagas
for select
to anon, authenticated
using (
  is_published = true
  and deleted_at is null
);

create policy "public can read chapters from published sagas"
on public.chapters
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.sagas
    where public.sagas.id = public.chapters.saga_id
      and public.sagas.is_published = true
      and public.sagas.deleted_at is null
  )
);
```

If you rerun the script later and policies already exist, delete or rename the existing policies first.

## 6. Verify the Auth Flow

Start the app:

```bash
npm install
npm run dev
```

Then verify:

1. Open `http://localhost:3000/auth`
2. Create an account
3. Sign in
4. Confirm the navbar shows your email menu instead of `Sign In`
5. Open a saga page and verify the CTA changes from `Sign In to Unlock` to `Unlock Full Saga`

## Notes About Current App Behavior

- Auth is client-side only right now.
- Without Supabase env vars, the app falls back to mock data.
- Sign-out is already implemented in the navbar menu.
- Payments are still placeholder-only.
