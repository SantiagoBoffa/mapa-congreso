-- Corré esto en Supabase → SQL Editor → New query → Run

create table if not exists public.organizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  contacto text not null default '',
  redes text not null default '',
  areas text[] not null default '{}',
  visible boolean not null default true,
  sedes jsonb not null default '[]'::jsonb,
  fecha timestamptz not null default now()
);

-- Para bases creadas antes de sumar la descripción
alter table public.organizaciones
  add column if not exists descripcion text not null default '';

create index if not exists organizaciones_visible_idx
  on public.organizaciones (visible);

alter table public.organizaciones enable row level security;

-- Lectura pública de fichas visibles (mapa)
drop policy if exists "Lectura publica visibles" on public.organizaciones;
create policy "Lectura publica visibles"
  on public.organizaciones
  for select
  to anon, authenticated
  using (visible = true);

-- Alta pública desde el formulario del evento
drop policy if exists "Alta publica formulario" on public.organizaciones;
create policy "Alta publica formulario"
  on public.organizaciones
  for insert
  to anon, authenticated
  with check (true);

-- Tip: para ocultar una ficha, en Table Editor poné visible = false
-- (el service role del dashboard puede editar sin política extra)
