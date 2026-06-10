-- ============================================
-- AUTOCAR INDONESIA - SUPABASE DATABASE SETUP
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- ---- BRANDS TABLE ----
CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  logo TEXT,
  is_new BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  model_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- MODELS TABLE ----
CREATE TABLE IF NOT EXISTS models (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT REFERENCES brands(id) ON DELETE CASCADE,
  brand_name VARCHAR(100),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100),
  fuel VARCHAR(50) DEFAULT 'Gasoline',
  engine VARCHAR(100),
  power VARCHAR(50),
  range VARCHAR(50),
  price VARCHAR(100),
  image TEXT,
  description TEXT,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- ARTICLES TABLE ----
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'Review',
  category_color VARCHAR(20) DEFAULT '#3B82F6',
  excerpt TEXT,
  image TEXT,
  date VARCHAR(100),
  read_time VARCHAR(50),
  content TEXT,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- ENABLE ROW LEVEL SECURITY ----
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- ---- POLICIES: Public Read ----
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read models" ON models FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'published');

-- ---- POLICIES: Admin Write (semua) ----
CREATE POLICY "Admin all brands" ON brands FOR ALL USING (true);
CREATE POLICY "Admin all models" ON models FOR ALL USING (true);
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (true);

-- ---- SEED DATA: BRANDS ----
INSERT INTO brands (name, country, logo, is_new, status) VALUES
('Geely', 'China', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Geely_logo.svg/512px-Geely_logo.svg.png', false, 'active'),
('BYD', 'China', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/BYD_auto_logo.svg/512px-BYD_auto_logo.svg.png', true, 'active');

-- ---- SEED DATA: MODELS ----
INSERT INTO models (brand_id, brand_name, name, type, fuel, engine, power, range, price, image, description, is_new, is_featured, status) VALUES
(1, 'Geely', 'Geely Emgrand', 'Sedan', 'Gasoline', '1.5L Turbo', '177 HP', '', 'Rp 249 Juta', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', 'Sedan modern dengan teknologi terkini, kenyamanan premium.', false, true, 'active'),
(1, 'Geely', 'Geely Coolray', 'SUV', 'Gasoline', '1.5L Turbo', '177 HP', '', 'Rp 289 Juta', 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', 'SUV compact sporty dengan desain futuristik.', true, true, 'active'),
(1, 'Geely', 'Geely Okavango', 'MPV', 'Gasoline', '1.8L Turbo', '190 HP', '', 'Rp 399 Juta', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80', 'MPV premium 7 penumpang dengan kenyamanan setara premium.', false, false, 'active'),
(2, 'BYD', 'BYD Atto 3', 'SUV EV', 'Electric', 'Electric', '204 HP', '480 km', 'Rp 489 Juta', 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', 'SUV listrik revolusioner dengan jangkauan 480 km.', true, true, 'active'),
(2, 'BYD', 'BYD Dolphin', 'Hatchback EV', 'Electric', 'Electric', '95 HP', '427 km', 'Rp 379 Juta', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80', 'Hatchback listrik lincah untuk mobilitas perkotaan.', false, false, 'active'),
(2, 'BYD', 'BYD Seal', 'Sedan EV', 'Electric', 'Electric', '313 HP', '570 km', 'Rp 629 Juta', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', 'Sedan premium bertenaga tinggi dengan performa luar biasa.', true, false, 'active');

-- ---- SEED DATA: ARTICLES ----
INSERT INTO articles (title, category, category_color, excerpt, image, date, read_time, content, status) VALUES
('Geely Coolray 2025: Revolusi SUV Compact untuk Generasi Muda', 'Review', '#3B82F6', 'Geely Coolray hadir dengan pembaruan signifikan untuk 2025 yang mengubah persepsi SUV compact.', 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', '28 Mei 2025', '5 menit baca', '<h1>Geely Coolray 2025</h1><p>Review lengkap Geely Coolray terbaru...</p>', 'published'),
('BYD vs Kendaraan Konvensional: Analisis Biaya 5 Tahun', 'Perbandingan', '#10B981', 'Analisis mendalam biaya kepemilikan mobil listrik BYD dibandingkan kendaraan bermesin konvensional.', 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', '22 Mei 2025', '8 menit baca', '<h1>BYD vs Konvensional</h1><p>Analisis biaya kepemilikan...</p>', 'published'),
('Panduan Lengkap Beli Mobil Baru di AutoCar Indonesia', 'Panduan', '#F59E0B', 'Langkah demi langkah proses membeli mobil baru di AutoCar — mudah, transparan, dan terpercaya.', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80', '15 Mei 2025', '4 menit baca', '<h1>Panduan Beli Mobil</h1><p>Panduan lengkap...</p>', 'published');

-- ============================================
-- SETUP SELESAI! Website siap digunakan.
-- ============================================
