-- Category enum
create type entry_category as enum ('shayar', 'short', 'poem', 'song');

-- Main entries table
create table entries (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  category    entry_category not null,
  author      text not null default 'Unknown',
  created_at  timestamptz not null default now()
);

-- Indexes for common queries
create index entries_category_idx on entries (category);
create index entries_created_at_idx on entries (created_at desc);

-- Enable RLS
alter table entries enable row level security;

-- Public can read all entries
create policy "entries_public_read"
  on entries for select
  using (true);

-- Only authenticated users (admins) can insert/update/delete
create policy "entries_admin_insert"
  on entries for insert
  to authenticated
  with check (true);

create policy "entries_admin_update"
  on entries for update
  to authenticated
  using (true);

create policy "entries_admin_delete"
  on entries for delete
  to authenticated
  using (true);
