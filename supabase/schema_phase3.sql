-- ============================================================================
--  The Campfire — Phase 3 schema: likes + replies (with realtime)
--  Run in Supabase → SQL Editor → New query → Run. Safe to re-run.
-- ============================================================================

-- ── likes ───────────────────────────────────────────────────────────────────
-- Composite PK (one like per user per post). The PK doubles as the realtime
-- replica identity, so DELETE events still carry post_id + user_id.
create table if not exists public.likes (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.likes enable row level security;

drop policy if exists "Likes are viewable by everyone" on public.likes;
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

drop policy if exists "Users can like as themselves" on public.likes;
create policy "Users can like as themselves"
  on public.likes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can remove their own like" on public.likes;
create policy "Users can remove their own like"
  on public.likes for delete to authenticated
  using (user_id = auth.uid());

-- ── replies ─────────────────────────────────────────────────────────────────
create table if not exists public.replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists replies_post_idx on public.replies (post_id, created_at);

alter table public.replies enable row level security;

drop policy if exists "Replies are viewable by everyone" on public.replies;
create policy "Replies are viewable by everyone"
  on public.replies for select using (true);

drop policy if exists "Users can reply as themselves" on public.replies;
create policy "Users can reply as themselves"
  on public.replies for insert to authenticated
  with check (author_id = auth.uid());

drop policy if exists "Users can update their own replies" on public.replies;
create policy "Users can update their own replies"
  on public.replies for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "Users can delete their own replies" on public.replies;
create policy "Users can delete their own replies"
  on public.replies for delete to authenticated
  using (author_id = auth.uid());

-- ── realtime ────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table public.likes;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.replies;
exception when duplicate_object then null;
end $$;
