-- ============================================================================
--  Magic Stories — Phase 5 schema: news engagement (likes + comments)
--  For the homepage News carousel. News CONTENT is static (src/data/news.ts);
--  only engagement lives in the DB, keyed by the news slug (text).
--  Run in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- ============================================================================

-- ── news_likes ───────────────────────────────────────────────────────────────
-- Composite PK (one like per user per news item). The PK doubles as the
-- realtime replica identity, so DELETE events still carry news_slug + user_id.
create table if not exists public.news_likes (
  news_slug  text not null check (char_length(news_slug) between 1 and 80),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (news_slug, user_id)
);

alter table public.news_likes enable row level security;

drop policy if exists "News likes are viewable by everyone" on public.news_likes;
create policy "News likes are viewable by everyone"
  on public.news_likes for select using (true);

drop policy if exists "Users can like news as themselves" on public.news_likes;
create policy "Users can like news as themselves"
  on public.news_likes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can remove their own news like" on public.news_likes;
create policy "Users can remove their own news like"
  on public.news_likes for delete to authenticated
  using (user_id = auth.uid());

-- ── news_comments ────────────────────────────────────────────────────────────
create table if not exists public.news_comments (
  id         uuid primary key default gen_random_uuid(),
  news_slug  text not null check (char_length(news_slug) between 1 and 80),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists news_comments_slug_idx
  on public.news_comments (news_slug, created_at);

alter table public.news_comments enable row level security;

drop policy if exists "News comments are viewable by everyone" on public.news_comments;
create policy "News comments are viewable by everyone"
  on public.news_comments for select using (true);

drop policy if exists "Users can comment news as themselves" on public.news_comments;
create policy "Users can comment news as themselves"
  on public.news_comments for insert to authenticated
  with check (author_id = auth.uid());

drop policy if exists "Users can update their own news comments" on public.news_comments;
create policy "Users can update their own news comments"
  on public.news_comments for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "Users can delete their own news comments" on public.news_comments;
create policy "Users can delete their own news comments"
  on public.news_comments for delete to authenticated
  using (author_id = auth.uid());

-- ── realtime ────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table public.news_likes;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.news_comments;
exception when duplicate_object then null;
end $$;
