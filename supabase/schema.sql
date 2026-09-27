-- ================================================================
--  AKLIMASOUND — Schéma Supabase (phase 1b : backend site public)
--  À exécuter : Dashboard Supabase → SQL Editor → New query → coller → Run
--
--  Architecture de sécurité :
--  • Accès 100 % serveur : seules les routes API Next.js parlent à Supabase,
--    avec la clé service_role (secrète, jamais dans le navigateur).
--  • RLS activé sur TOUTES les tables, SANS aucune policy permissive :
--    anon et authenticated sont refusés partout (défense en profondeur —
--    même une fuite de clé anon ne donnerait accès à rien).
--  • Contraintes SQL (CHECK) qui doublent les validations applicatives :
--    longueurs, listes blanches de statuts, bornes numériques.
-- ================================================================

-- ---------- Tables de données publiques ----------

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 80),
  phone      text not null check (char_length(phone) between 8 and 20),
  email      text not null default '' check (char_length(email) <= 120),
  source     text not null default '' check (char_length(source) <= 40),
  member_id  uuid
);

create table if not exists public.quotes (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 80),
  phone      text not null check (char_length(phone) between 8 and 20),
  email      text not null default '' check (char_length(email) <= 120),
  domain     text not null default '' check (char_length(domain) <= 60),
  offer      text not null default '' check (char_length(offer) <= 80),
  date       text not null default '' check (char_length(date) <= 10),
  place      text not null default '' check (char_length(place) <= 80),
  total      bigint not null default 0 check (total >= 0 and total <= 100000000),
  source     text not null default 'formulaire' check (char_length(source) <= 30),
  status     text not null default 'nouveau' check (status in ('nouveau', 'envoyé', 'accepté', 'refusé')),
  msg        text not null default '' check (char_length(msg) <= 600),
  member_id  uuid
);

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  customer     text not null check (char_length(customer) between 1 and 80),
  phone        text not null check (char_length(phone) between 8 and 20),
  domain       text not null default '' check (char_length(domain) <= 60),
  offer        text not null default '' check (char_length(offer) <= 80),
  date         text not null default '' check (char_length(date) <= 10),
  place        text not null default '' check (char_length(place) <= 80),
  total        bigint not null default 0 check (total >= 0 and total <= 100000000),
  deposit_rate int not null default 30 check (deposit_rate in (30, 50)),
  proof_ref    text not null default '' check (char_length(proof_ref) <= 40),
  proof_file   text not null default '' check (char_length(proof_file) <= 300),
  status       text not null default 'deposit_proof'
               check (status in ('deposit_proof', 'confirmed', 'ongoing', 'done', 'cancelled')),
  channel      text not null default 'site' check (char_length(channel) <= 30),
  member_id    uuid
);

create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 120),
  cat        text not null default '' check (char_length(cat) <= 40),
  price      bigint not null default 0 check (price >= 0),
  stock      int not null default 0 check (stock >= 0),
  status     text not null default 'disponible' check (status in ('disponible', 'commande', 'rupture'))
);

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  icon       text not null default 'zap' check (char_length(icon) <= 20),
  title      text not null check (char_length(title) between 1 and 200),
  hot        boolean not null default true,
  read       boolean not null default false
);

create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event      text not null check (char_length(event) between 1 and 40),
  page       text not null default '' check (char_length(page) <= 120),
  vid        text not null default '' check (char_length(vid) <= 24),
  label      text not null default '' check (char_length(label) <= 120),
  ref        text not null default '' check (char_length(ref) <= 160),
  utm        jsonb not null default '{}'::jsonb,
  lang       text not null default 'fr' check (char_length(lang) <= 5)
);

-- ---------- Réglages (ligne unique) ----------

create table if not exists public.settings (
  id              int primary key default 1 check (id = 1),
  pass_hash       text not null default '',   -- mot de passe admin (scrypt) — généré au 1er démarrage
  pass_salt       text not null default '',
  admin_secret    text not null default '',   -- HMAC jetons admin — généré au 1er démarrage
  member_secret   text not null default '',   -- HMAC jetons membres — généré au 1er démarrage
  member_discount int not null default 10 check (member_discount between 0 and 50),
  updated_at      timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Membres (profil, adossé à auth.users) ----------

create table if not exists public.members (
  id           uuid primary key references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  first_name   text not null default '' check (char_length(first_name) <= 40),
  last_name    text not null default '' check (char_length(last_name) <= 40),
  email        text not null default '',
  newsletter   boolean not null default false,
  confirmed_at timestamptz
);

-- Création automatique du profil à l'inscription Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.members (id, email, first_name, last_name, newsletter)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 40),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 40),
    coalesce((new.raw_user_meta_data ->> 'newsletter')::boolean, false)
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    newsletter = excluded.newsletter;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Synchronisation de la confirmation d'e-mail
create or replace function public.handle_user_confirmed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.confirmed_at is not null then
    update public.members set confirmed_at = new.confirmed_at where id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after insert or update of confirmed_at on auth.users
  for each row execute function public.handle_user_confirmed();

-- ---------- updated_at automatique ----------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists quotes_updated on public.quotes;
create trigger quotes_updated before update on public.quotes
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_updated on public.bookings;
create trigger bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists members_updated on public.members;
create trigger members_updated before update on public.members
  for each row execute function public.set_updated_at();

drop trigger if exists settings_updated on public.settings;
create trigger settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------- Liens membres (suppression du membre → anonymisation) ----------

alter table public.leads   drop constraint if exists leads_member_fkey;
alter table public.leads   add constraint leads_member_fkey   foreign key (member_id) references public.members (id) on delete set null;
alter table public.quotes  drop constraint if exists quotes_member_fkey;
alter table public.quotes  add constraint quotes_member_fkey  foreign key (member_id) references public.members (id) on delete set null;
alter table public.bookings drop constraint if exists bookings_member_fkey;
alter table public.bookings add constraint bookings_member_fkey foreign key (member_id) references public.members (id) on delete set null;

-- ---------- Index ----------

create index if not exists leads_created      on public.leads (created_at desc);
create index if not exists quotes_created     on public.quotes (created_at desc);
create index if not exists quotes_member      on public.quotes (member_id);
create index if not exists bookings_created   on public.bookings (created_at desc);
create index if not exists bookings_member    on public.bookings (member_id);
create index if not exists bookings_status    on public.bookings (status);
create index if not exists products_created   on public.products (created_at desc);
create index if not exists notifs_created     on public.notifications (created_at desc);
create index if not exists events_created     on public.events (created_at desc);
create index if not exists members_email      on public.members (email);

-- ---------- RLS : TOUT refusé en accès direct (lecture/écriture serveur uniquement) ----------
-- Aucune policy = anon et authenticated n'ont aucun accès.
-- La clé service_role (côté serveur Next.js) contourne RLS par conception.

alter table public.leads         enable row level security;
alter table public.quotes        enable row level security;
alter table public.bookings      enable row level security;
alter table public.products      enable row level security;
alter table public.notifications enable row level security;
alter table public.events        enable row level security;
alter table public.settings      enable row level security;
alter table public.members       enable row level security;

-- ---------- Storage : preuves d'acompte (bucket PRIVÉ) ----------
-- 5 Mo max, images + PDF uniquement. Chemin : {member_id}/{booking_id}/{uuid}.{ext}
-- RLS storage.objects : aucune policy pour ce bucket = accès direct refusé ;
-- le serveur (service_role) téléverse et signe les URLs de lecture.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('aks-preuves', 'aks-preuves', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

-- ================================================================
--  Fin du schéma. Vérification rapide (optionnel) :
--  select table_name from information_schema.tables where table_schema = 'public';
--  → bookings, events, leads, members, notifications, products, quotes, settings
-- ================================================================
