-- Find Direct Ghana — Phase 1 hardening fixes
-- Run this in the Supabase SQL Editor AFTER schema.sql and schema-additions.sql
-- have already been applied.
--
-- Context: listings/reviews/property-image inserts are currently open to
-- anyone holding the anon key (`with check (true)`), bypassing the app's
-- login requirement entirely. The app itself always writes through the
-- service-role client (which bypasses RLS), so this change only closes the
-- direct-anon-key hole — it should be a no-op for the app's own behavior.

drop policy if exists "Public insert listings" on listings;
create policy "Authenticated insert listings" on listings for insert
  to authenticated with check (true);

drop policy if exists "Public insert reviews" on reviews;
create policy "Authenticated insert reviews" on reviews for insert
  to authenticated with check (true);

drop policy if exists "Public upload property images" on storage.objects;
create policy "Authenticated upload property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');
