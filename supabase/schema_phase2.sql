-- ============================================================================
--  The Campfire — Phase 2 schema: posts (feed entries)
--  Run in Supabase → SQL Editor → New query → Run. Safe to re-run.
-- ============================================================================

create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  link_url   text,
  link_type  text check (link_type in ('youtube', 'soundcloud', 'x', 'link')),
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

-- Everyone can read the feed.
drop policy if exists "Posts are viewable by everyone" on public.posts;
create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

-- Logged-in users can post as themselves.
drop policy if exists "Users can create their own posts" on public.posts;
create policy "Users can create their own posts"
  on public.posts for insert to authenticated
  with check (author_id = auth.uid());

-- Authors can edit / delete their own posts.
drop policy if exists "Users can update their own posts" on public.posts;
create policy "Users can update their own posts"
  on public.posts for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
  on public.posts for delete to authenticated
  using (author_id = auth.uid());

-- Enable realtime for the feed (used from Phase 3 onward; harmless now).
do $$
begin
  alter publication supabase_realtime add table public.posts;
exception
  when duplicate_object then null;
end
$$;
