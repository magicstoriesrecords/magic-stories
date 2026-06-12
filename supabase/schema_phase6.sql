-- ============================================================================
--  Magic Stories — Phase 6 schema: hearts on comments
--  Likes for news comments (homepage carousel threads) and for replies
--  under Magic Library posts. Counts load with the thread; toggles are
--  optimistic on the client (no realtime needed — threads are short-lived UI).
--  Run in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- ============================================================================

-- ── news_comment_likes ───────────────────────────────────────────────────────
-- One heart per user per news comment; vanishes with the comment or profile.
create table if not exists public.news_comment_likes (
  comment_id uuid not null references public.news_comments (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

alter table public.news_comment_likes enable row level security;

drop policy if exists "News comment likes are viewable by everyone" on public.news_comment_likes;
create policy "News comment likes are viewable by everyone"
  on public.news_comment_likes for select using (true);

drop policy if exists "Users can like news comments as themselves" on public.news_comment_likes;
create policy "Users can like news comments as themselves"
  on public.news_comment_likes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can remove their own news comment like" on public.news_comment_likes;
create policy "Users can remove their own news comment like"
  on public.news_comment_likes for delete to authenticated
  using (user_id = auth.uid());

-- ── reply_likes ──────────────────────────────────────────────────────────────
-- One heart per user per reply (Magic Library threads).
create table if not exists public.reply_likes (
  reply_id   uuid not null references public.replies (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

alter table public.reply_likes enable row level security;

drop policy if exists "Reply likes are viewable by everyone" on public.reply_likes;
create policy "Reply likes are viewable by everyone"
  on public.reply_likes for select using (true);

drop policy if exists "Users can like replies as themselves" on public.reply_likes;
create policy "Users can like replies as themselves"
  on public.reply_likes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can remove their own reply like" on public.reply_likes;
create policy "Users can remove their own reply like"
  on public.reply_likes for delete to authenticated
  using (user_id = auth.uid());
