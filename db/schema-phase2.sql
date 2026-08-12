-- Find Direct Ghana — Phase 2: stable landlord identity for reviews
-- Run this in the Supabase SQL Editor AFTER schema.sql, schema-additions.sql,
-- and schema-fixes.sql have already been applied.
--
-- Context: reviews were previously matched to a landlord by a slugified
-- display-name string (fragile — collides across similarly-named landlords,
-- breaks if a name is edited). listings.owner_id is the real stable id.
-- This adds the equivalent column to reviews so new submissions can be
-- matched by id, with landlord_slug kept as a fallback for older data.

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS landlord_id uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS reviews_landlord_id_status_idx ON reviews (landlord_id, status);
CREATE INDEX IF NOT EXISTS reviews_landlord_slug_status_idx ON reviews (landlord_slug, status);
