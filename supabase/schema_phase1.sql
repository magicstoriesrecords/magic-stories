-- ============================================================================
--  The Campfire — Phase 1 schema: profiles + avatars storage
--  Run this in Supabase → SQL Editor → New query → Run.
--  Safe to re-run (uses IF NOT EXISTS / drop-and-recreate where needed).
-- ============================================================================

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per authenticated user. `role` distinguishes label artists from
-- regular members; `author_slug` links an artist to their card on /authors.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null,
  display_name text,
  avatar_url  text,
  role        text not null default 'member' check (role in ('member', 'artist')),
  author_slug text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone (including signed-out visitors) can read profiles.
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- A user may update only their own profile.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── auto-create a profile when a new user signs up ──────────────────────────
-- Generates a unique handle from the email local-part and copies the Google
-- name / picture as sensible defaults the user can later change.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username  text;
  final_username text;
  suffix         int := 0;
begin
  base_username := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g');
  if base_username = '' then
    base_username := 'user';
  end if;
  base_username := left(base_username, 18);
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── protect privileged columns ──────────────────────────────────────────────
-- Members must not be able to promote themselves to "artist" or link to an
-- author. These columns can only change via SQL Editor / service role.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null then
    new.role := old.role;
    new.author_slug := old.author_slug;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_columns_trg on public.profiles;
create trigger protect_profile_columns_trg
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ── avatars storage bucket ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read of avatar images.
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- A user can write only into their own folder: avatars/<user-id>/...
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
