-- ============================================================================
--  Promote a user to Artist (badge in feed, news comments and replies).
--  Run in Supabase → SQL Editor. Works there because auth.uid() is null,
--  so the protect_profile_columns trigger lets the change through.
--
--  1. Find the user (after their first Google sign-in):
--     select id, username, display_name from public.profiles
--     order by created_at desc limit 20;
--
--  2. Set role + author_slug (slug must match the card on /authors,
--     e.g. 'rafael', 'mazze', 'miqro' — see src/app/[locale]/authors/page.tsx).
--     The badge then deep-links to /authors#<author_slug>.
-- ============================================================================

update public.profiles
set role = 'artist', author_slug = 'rafael'   -- <- adjust slug
where username = 'CHANGE_ME';                 -- <- or: where id = '<uuid>'

-- Demote back to a regular member:
-- update public.profiles set role = 'member', author_slug = null
-- where username = 'CHANGE_ME';
