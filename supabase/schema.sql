-- ============================================================
-- FerryCompare — Schéma Supabase
-- Colle ce SQL dans : Supabase → SQL Editor → Run
-- ============================================================

-- Table des réservations
create table if not exists public.bookings_store (
  id                text primary key,
  status            text not null default 'pending',
  outbound_id       text not null,
  inbound_id        text,
  passengers        jsonb not null default '[]',
  vehicle           jsonb,
  options           jsonb not null default '{}',
  contact           jsonb not null default '{}',
  total_eur         numeric(10,2) not null default 0,
  stripe_session_id text,
  paid_at           timestamptz,
  user_id           uuid references auth.users(id) on delete set null,
  created_at        timestamptz not null default now()
);

-- Index pour récupérer les réservations par utilisateur
create index if not exists bookings_store_user_id_idx
  on public.bookings_store (user_id);

-- Activer Row Level Security
alter table public.bookings_store enable row level security;

-- Politique : chaque utilisateur voit uniquement ses propres réservations
create policy "Users can view own bookings"
  on public.bookings_store for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookings"
  on public.bookings_store for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own bookings"
  on public.bookings_store for update
  using (auth.uid() = user_id or user_id is null);

-- Politique service role : accès total (pour les API routes)
create policy "Service role has full access"
  on public.bookings_store for all
  using (auth.role() = 'service_role');
