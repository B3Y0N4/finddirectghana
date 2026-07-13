-- Find Direct Ghana — Supabase Schema
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ─── Listings ────────────────────────────────────────────────────────────────
create table listings (
  id                    uuid default uuid_generate_v4() primary key,
  slug                  text unique,
  title                 text not null,
  type                  text not null,
  status                text default 'pending',     -- pending | approved | rejected
  price_ghs             numeric not null,
  advance_months        integer default 12,
  price_negotiable      boolean default false,
  neighborhood          text not null,
  address               text,
  city                  text default 'Accra',
  bedrooms              integer,
  bathrooms             integer,
  size_sqm              integer,
  description           text,
  features              text[] default '{}',
  furnished             boolean default false,
  image_urls            text[] default '{}',
  video_url             text,
  -- Owner
  owner_name            text not null,
  owner_phone           text not null,
  owner_email           text,
  -- Verification
  ghana_card_front_url  text,
  ghana_card_back_url   text,
  selfie_url            text,
  verification_level    text default 'none',  -- none | pending | phone | full
  verified_phone        boolean default false,
  verified_card         boolean default false,
  -- Stats
  views                 integer default 0,
  inquiries             integer default 0,
  -- Admin
  admin_notes           text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
create table reviews (
  id                  uuid default uuid_generate_v4() primary key,
  landlord_slug       text not null,
  reviewer_type       text not null,  -- tenant | landlord
  reviewer_name       text not null,
  reviewer_initials   text,
  rating              integer not null check (rating between 1 and 5),
  categories          text[] default '{}',
  title               text not null,
  body                text not null,
  status              text default 'pending',  -- pending | approved | rejected
  verified            boolean default false,
  created_at          timestamptz default now()
);

-- ─── Inquiries ───────────────────────────────────────────────────────────────
create table inquiries (
  id            uuid default uuid_generate_v4() primary key,
  listing_id    uuid references listings(id) on delete cascade,
  listing_slug  text,
  contact_type  text,  -- whatsapp | call
  created_at    timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table listings  enable row level security;
alter table reviews   enable row level security;
alter table inquiries enable row level security;

-- Anyone can submit a listing or review
create policy "Public insert listings"  on listings  for insert with check (true);
create policy "Public insert reviews"   on reviews   for insert with check (true);
create policy "Public insert inquiries" on inquiries for insert with check (true);

-- Only approved records are readable by the public
create policy "Public read approved listings" on listings for select using (status = 'approved');
create policy "Public read approved reviews"  on reviews  for select using (status = 'approved');

-- ─── Storage Buckets ─────────────────────────────────────────────────────────
-- Run these separately in the Supabase Storage UI or via API:
--
--   Bucket: property-images   (Public)
--   Bucket: verification-docs (Private)
--
-- Or via SQL:
insert into storage.buckets (id, name, public) values ('property-images',   'property-images',   true)  on conflict do nothing;
insert into storage.buckets (id, name, public) values ('verification-docs', 'verification-docs', false) on conflict do nothing;

-- Allow anyone to upload to property-images
create policy "Public upload property images"
  on storage.objects for insert
  with check (bucket_id = 'property-images');

create policy "Public read property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

-- verification-docs: no public access (admin only via service role)
