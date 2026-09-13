-- Unified Migration Script for Fredora & TemperaMap
-- Idempotent setup

-- ==========================================
-- EXTENSIONS & CONFIG
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- FREDORA MULTICONCEPT TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS homepage (
  id SERIAL PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  motto TEXT,
  mission_statement TEXT,
  vision_statement TEXT,
  core_values JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  whatsapp_number TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  meta_description TEXT,
  google_analytics_id TEXT,
  catalogue_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  division_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  division_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- TEMPERAMAP TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  provider TEXT DEFAULT 'local',
  provider_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS passcodes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  test_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  used_at TIMESTAMPTZ,
  used_by TEXT
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  company TEXT DEFAULT '',
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'star',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS test_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  user_name TEXT,
  test_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  paid BOOLEAN DEFAULT false,
  answers JSONB,
  results JSONB,
  primary_temp TEXT,
  secondary_temp TEXT,
  blend TEXT,
  passcode_used TEXT,
  partner_session_id TEXT,
  workplace JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS corporate_teams (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  name TEXT NOT NULL,
  member_session_ids JSONB NOT NULL DEFAULT '[]',
  report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_division ON products(division_slug);
CREATE INDEX IF NOT EXISTS idx_services_division ON services(division_slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_passcodes_code_status ON passcodes(code, status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id ON test_sessions(user_id);

-- ==========================================
-- RLS POLICIES (Public Access for In-Memory Sync)
-- ==========================================
-- Since vite.config.ts uses the anon key for reads/writes via the Supabase REST API,
-- public access must be granted.
-- WARNING: In a production environment with direct DB connections or Auth,
-- you should restrict these policies to authenticated users using (select auth.uid()).

ALTER TABLE homepage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on homepage" ON homepage;
CREATE POLICY "Enable read/write for anon on homepage" ON homepage FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on products" ON products;
CREATE POLICY "Enable read/write for anon on products" ON products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on services" ON services;
CREATE POLICY "Enable read/write for anon on services" ON services FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on posts" ON posts;
CREATE POLICY "Enable read/write for anon on posts" ON posts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on messages" ON messages;
CREATE POLICY "Enable read/write for anon on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "Enable read/write for anon on newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on users" ON users;
CREATE POLICY "Enable read/write for anon on users" ON users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE passcodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on passcodes" ON passcodes;
CREATE POLICY "Enable read/write for anon on passcodes" ON passcodes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on testimonials" ON testimonials;
CREATE POLICY "Enable read/write for anon on testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on faqs" ON faqs;
CREATE POLICY "Enable read/write for anon on faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on features" ON features;
CREATE POLICY "Enable read/write for anon on features" ON features FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on test_sessions" ON test_sessions;
CREATE POLICY "Enable read/write for anon on test_sessions" ON test_sessions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE corporate_teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read/write for anon on corporate_teams" ON corporate_teams;
CREATE POLICY "Enable read/write for anon on corporate_teams" ON corporate_teams FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO homepage (id, hero_title, hero_subtitle) 
VALUES (1, 'Fredora Multiconcept', 'A Nigerian company dedicated to excellence across multiple sectors')
ON CONFLICT (id) DO NOTHING;

INSERT INTO faqs (id, question, answer, sort_order) VALUES
  ('f-001', 'What is TemperaMap?', 'TemperaMap is an online temperament assessment that helps individuals and teams understand their unique blend of the four classical temperaments.', 0),
  ('f-002', 'How long does the test take?', 'Most users complete the assessment in 5-10 minutes. The questions are straightforward and designed to be intuitive.', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO features (id, title, description, icon, sort_order) VALUES
  ('v-001', 'Four Temperaments', 'Discover your unique blend of Sanguine, Choleric, Melancholic, and Phlegmatic temperaments.', 'layers', 0),
  ('v-002', 'Couple Analysis', 'Compare temperaments side-by-side to strengthen your closest relationships.', 'heart', 1)
ON CONFLICT (id) DO NOTHING;
