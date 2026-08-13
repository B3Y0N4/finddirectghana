-- Find Direct Ghana — Advance flexibility
-- Run this in the Supabase SQL Editor AFTER schema.sql, schema-additions.sql,
-- schema-fixes.sql, schema-phase2.sql, and schema-phase3.sql have already
-- been applied.
--
-- Two properties at the same monthly rent are not economically equivalent to
-- a tenant if one requires a 12-month lump sum and the other doesn't. This
-- captures what the landlord actually told the field rep about the advance,
-- not just the number of months.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS advance_flexibility text NOT NULL DEFAULT 'fixed'
  CHECK (advance_flexibility IN ('fixed', 'negotiable', 'shorter_ok', 'monthly'));
