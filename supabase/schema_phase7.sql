-- ============================================================================
--  Magic Stories — Phase 7 schema: notifications
--  A unified notifications table fed by DB triggers:
--    - someone likes my post / reply / news comment
--    - someone replies to my post
--    - someone else replies in a thread I took part in
--    - a new news item is announced to everyone
--  News content is static (src/data/news.ts); a new item is announced by
--  inserting its slug into news_announcements (see supabase/announce_news.sql).
--  Run in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- ============================================================================

-- ── notifications ─────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade, -- recipient
  actor_id   uuid references public.profiles (id) on delete cascade,          -- who acted (null = system/news)
  type       text not null check (type in
               ('post_like','reply_like','comment_like','post_reply','thread_reply','news')),
  post_id    uuid references public.posts (id) on delete cascade,
  reply_id   uuid references public.replies (id) on delete cascade,
  news_slug  text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, read, created_at desc);

alter table public.notifications enable row level security;

-- Recipients can read and mark-as-read their own; deletes allowed for cleanup.
-- NO insert policy on purpose: only the SECURITY DEFINER triggers below write
-- here (they run as the table owner and bypass RLS), so clients can never
-- forge a notification.
drop policy if exists "Users see their own notifications" on public.notifications;
create policy "Users see their own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users update their own notifications" on public.notifications;
create policy "Users update their own notifications"
  on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users delete their own notifications" on public.notifications;
create policy "Users delete their own notifications"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- ── trigger functions (SECURITY DEFINER → bypass RLS to write rows) ──────────

-- like on my post
create or replace function public.notify_post_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid;
begin
  select author_id into owner from public.posts where id = new.post_id;
  if owner is not null and owner <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (owner, new.user_id, 'post_like', new.post_id);
  end if;
  return new;
end $$;

create or replace function public.unnotify_post_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid;
begin
  select author_id into owner from public.posts where id = old.post_id;
  delete from public.notifications
   where type = 'post_like' and post_id = old.post_id
     and actor_id = old.user_id and user_id = owner and read = false;
  return old;
end $$;

-- like on my reply
create or replace function public.notify_reply_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid; p_id uuid;
begin
  select author_id, post_id into owner, p_id from public.replies where id = new.reply_id;
  if owner is not null and owner <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, post_id, reply_id)
    values (owner, new.user_id, 'reply_like', p_id, new.reply_id);
  end if;
  return new;
end $$;

create or replace function public.unnotify_reply_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid;
begin
  select author_id into owner from public.replies where id = old.reply_id;
  delete from public.notifications
   where type = 'reply_like' and reply_id = old.reply_id
     and actor_id = old.user_id and user_id = owner and read = false;
  return old;
end $$;

-- like on my news comment
create or replace function public.notify_comment_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid; slug text;
begin
  select author_id, news_slug into owner, slug from public.news_comments where id = new.comment_id;
  if owner is not null and owner <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, news_slug)
    values (owner, new.user_id, 'comment_like', slug);
  end if;
  return new;
end $$;

create or replace function public.unnotify_comment_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid; slug text;
begin
  select author_id, news_slug into owner, slug from public.news_comments where id = old.comment_id;
  delete from public.notifications
   where type = 'comment_like' and news_slug = slug
     and actor_id = old.user_id and user_id = owner and read = false;
  return old;
end $$;

-- reply to my post + co-participants of the thread
create or replace function public.notify_reply()
returns trigger language plpgsql security definer set search_path = public as $$
declare p_owner uuid;
begin
  select author_id into p_owner from public.posts where id = new.post_id;

  if p_owner is not null and p_owner <> new.author_id then
    insert into public.notifications (user_id, actor_id, type, post_id, reply_id)
    values (p_owner, new.author_id, 'post_reply', new.post_id, new.id);
  end if;

  -- everyone else who already replied in this thread (distinct), minus the
  -- post owner (already notified above) and the new author themselves
  insert into public.notifications (user_id, actor_id, type, post_id, reply_id)
  select distinct r.author_id, new.author_id, 'thread_reply', new.post_id, new.id
  from public.replies r
  where r.post_id = new.post_id
    and r.id <> new.id
    and r.author_id <> new.author_id
    and r.author_id is distinct from p_owner;

  return new;
end $$;

-- ── triggers ─────────────────────────────────────────────────────────────────
drop trigger if exists trg_notify_post_like on public.likes;
create trigger trg_notify_post_like after insert on public.likes
  for each row execute function public.notify_post_like();
drop trigger if exists trg_unnotify_post_like on public.likes;
create trigger trg_unnotify_post_like after delete on public.likes
  for each row execute function public.unnotify_post_like();

drop trigger if exists trg_notify_reply_like on public.reply_likes;
create trigger trg_notify_reply_like after insert on public.reply_likes
  for each row execute function public.notify_reply_like();
drop trigger if exists trg_unnotify_reply_like on public.reply_likes;
create trigger trg_unnotify_reply_like after delete on public.reply_likes
  for each row execute function public.unnotify_reply_like();

drop trigger if exists trg_notify_comment_like on public.news_comment_likes;
create trigger trg_notify_comment_like after insert on public.news_comment_likes
  for each row execute function public.notify_comment_like();
drop trigger if exists trg_unnotify_comment_like on public.news_comment_likes;
create trigger trg_unnotify_comment_like after delete on public.news_comment_likes
  for each row execute function public.unnotify_comment_like();

drop trigger if exists trg_notify_reply on public.replies;
create trigger trg_notify_reply after insert on public.replies
  for each row execute function public.notify_reply();

-- ── new-news announcements (fan out to every user) ───────────────────────────
create table if not exists public.news_announcements (
  slug       text primary key,
  created_at timestamptz not null default now()
);

alter table public.news_announcements enable row level security;
-- No policies: only the SQL Editor (postgres) writes here; clients never touch it.

create or replace function public.fanout_news()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, actor_id, type, news_slug)
  select p.id, null, 'news', new.slug from public.profiles p;
  return new;
end $$;

drop trigger if exists trg_fanout_news on public.news_announcements;
create trigger trg_fanout_news after insert on public.news_announcements
  for each row execute function public.fanout_news();

-- ── realtime ────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;
