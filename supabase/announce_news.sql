-- ============================================================================
--  Announce a news item to every user (Phase 7 notifications).
--  After adding an item to src/data/news.ts AND deploying, run this in
--  Supabase -> SQL Editor with the item's slug. The fanout_news trigger then
--  creates one 'news' notification per profile. Re-running is a no-op.
-- ============================================================================
insert into public.news_announcements (slug) values ('CHANGE_ME')
on conflict (slug) do nothing;
