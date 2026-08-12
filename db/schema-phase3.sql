-- Find Direct Ghana — Phase 3 continued: listing reports
-- Run this in the Supabase SQL Editor AFTER schema.sql, schema-additions.sql,
-- schema-fixes.sql, and schema-phase2.sql have already been applied.
--
-- Backs app/report/page.tsx, which previously had no server-side endpoint at
-- all — submissions were never persisted anywhere. Reporting deliberately
-- does not require login (same reasoning as the existing anonymous
-- inquiry-click tracking on the `inquiries` table): the safety-report path
-- should have as little friction as possible.

create table if not exists reports (
  id             uuid default uuid_generate_v4() primary key,
  listing_url    text,
  issue_type     text not null,
  description    text not null,
  reporter_phone text,
  status         text default 'open',  -- open | reviewed | resolved
  created_at     timestamptz default now()
);

alter table reports enable row level security;

create policy "Public insert reports" on reports for insert with check (true);
