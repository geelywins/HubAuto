// ==============================
// AUTOCAR - MAIN APP
// ==============================

const { useState, useEffect, useRef, useCallback } = React;

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- DUMMY DATA (fallback) ----
const DUMMY_BRANDS = [
  { id: 1, name: 'Geely', country: 'China', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Geely_logo.svg/512px-Geely_logo.svg.png', is_new: false },
  { id: 2, name: 'BYD', country: 'China', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/BYD_auto_logo.svg/512px-BYD_auto_logo.svg.png', is_new: true },
];
const DUMMY_MODELS = [
  { id: 1, brand_id: 1, brand_name: 'Geely', name: 'Geely Emgrand', type: 'Sedan', fuel: 'Gasoline', engine: '1.5L Turbo', power: '177 HP', range: null, price: 'Rp 249 Juta', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', description: 'Sedan modern dengan teknologi terkini, kenyamanan premium dan efisiensi bahan bakar terbaik di kelasnya.', is_new: false, is_featured: true },
  { id: 2, brand_id: 1, brand_name: 'Geely', name: 'Geely Coolray', type: 'SUV', fuel: 'Gasoline', engine: '1.5L Turbo', power: '177 HP', range: null, price: 'Rp 289 Juta', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', description: 'SUV compact sporty dengan desain futuristik, cocok untuk gaya hidup urban aktif Anda.', is_new: true, is_featured: true },
  { id: 3, brand_id: 2, brand_name: 'BYD', name: 'BYD Atto 3', type: 'SUV EV', fuel: 'Electric', engine: 'Electric', power: '204 HP', range: '480 km', price: 'Rp 489 Juta', image: 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', description: 'SUV listrik revolusioner dengan jangkauan 480 km per pengisian, teknologi baterai blade terdepan.', is_new: true, is_featured: true },
  { id: 4, brand_id: 2, brand_name: 'BYD', name: 'BYD Dolphin', type: 'Hatchback EV', fuel: 'Electric', engine: 'Electric', power: '95 HP', range: '427 km', price: 'Rp 379 Juta', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80', description: 'Hatchback listrik lincah dan efisien, pilihan tepat untuk mobilitas perkotaan yang ramah lingkungan.', is_new: false, is_featured: false },
  { id: 5, brand_id: 2, brand_name: 'BYD', name: 'BYD Seal', type: 'Sedan EV', fuel: 'Electric', engine: 'Electric', power: '313 HP', range: '570 km', price: 'Rp 629 Juta', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', description: 'Sedan premium bertenaga tinggi dengan performa luar biasa dan teknologi ultra-modern.', is_new: true, is_featured: false },
  { id: 6, brand_id: 1, brand_name: 'Geely', name: 'Geely Okavango', type: 'MPV', fuel: 'Gasoline', engine: '1.8L Turbo', power: '190 HP', range: null, price: 'Rp 399 Juta', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80', description: 'MPV premium 7 penumpang dengan kenyamanan setara premium, teknologi keselamatan lengkap.', is_new: false, is_featured: false },
];
const DUMMY_ARTICLES = [
  { id: 1, title: 'Geely Coolray 2025: Revolusi SUV Compact untuk Generasi Muda Indonesia', category: 'Review', category_color: '#3B82F6', excerpt: 'Geely Coolray hadir dengan pembaruan signifikan untuk 2025. Desain lebih aerodinamis, interior lebih mewah, dan fitur keselamatan yang lebih lengkap dari sebelumnya.', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', date: '28 Mei 2025', read_time: '5 menit baca', content: '<h1>Geely Coolray 2025: Revolusi SUV Compact</h1><img src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80" /><p>Geely Coolray 2025 hadir dengan pembaruan menyeluruh yang menjadikannya salah satu SUV compact terbaik di segmennya. Dengan desain yang lebih agresif dan aerodinamis, Coolray mampu menarik perhatian di jalanan Indonesia.</p><h2>Performa & Mesin</h2><p>Ditenagai mesin 1.5L Turbo yang menghasilkan 177 HP, Coolray mampu akselerasi 0-100 km/h dalam 8.5 detik. Transmisi 7-speed DCT memberikan perpindahan gigi yang halus dan responsif.</p><h2>Fitur Keselamatan</h2><p>Geely melengkapi Coolray dengan sistem ADAS (Advanced Driver Assistance System) terlengkap di kelasnya, termasuk Lane Keeping Assist, Automatic Emergency Braking, dan Blind Spot Detection.</p><p>Bagi Anda yang tertarik, hubungi kami melalui WhatsApp untuk test drive!</p>' },
  { id: 2, title: 'BYD vs Kendaraan Konvensional: Mana yang Lebih Hemat di Indonesia?', category: 'Perbandingan', category_color: '#10B981', excerpt: 'Analisis mendalam biaya kepemilikan mobil listrik BYD dibandingkan kendaraan bermesin konvensional dalam jangka 5 tahun di Indonesia.', image: 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', date: '22 Mei 2025', read_time: '8 menit baca', content: '<h1>BYD vs Konvensional: Analisis Biaya</h1><p>Artikel lengkap tentang perbandingan biaya kepemilikan...</p>' },
  { id: 3, title: 'Panduan Lengkap: Proses Beli Mobil Baru di AutoCar Indonesia', category: 'Panduan', category_color: '#F59E0B', excerpt: 'Langkah demi langkah cara membeli mobil baru di AutoCar Indonesia — dari konsultasi hingga serah terima kunci. Prosesnya mudah dan transparan!', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80', date: '15 Mei 2025', read_time: '4 menit baca', content: '<h1>Panduan Beli Mobil di AutoCar</h1><p>Panduan lengkap proses pembelian...</p>' },
  { id: 4, title: 'BYD Seal 2025: Sedan Listrik Premium yang Menantang Tesla di Indonesia', category: 'Review', category_color: '#3B82F6', excerpt: 'BYD Seal dengan jangkauan 570 km dan performa 313 HP hadir sebagai alternatif premium untuk sedan listrik di pasar Indonesia.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', date: '8 Mei 2025', read_time: '6 menit baca', content: '<h1>BYD Seal: Sedan Listrik Premium</h1><p>Review lengkap BYD Seal...</p>' },
  { id: 5, title: '7 Alasan Kenapa Mobil Listrik Adalah Masa Depan Transportasi Indonesia', category: 'Opini', category_color: '#8B5CF6', excerpt: 'Dari efisiensi biaya, ramah lingkungan, hingga infrastruktur yang terus berkembang — inilah mengapa Anda harus mulai mempertimbangkan kendaraan listrik.', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80', date: '1 Mei 2025', read_time: '7 menit baca', content: '<h1>Masa Depan Kendaraan Listrik</h1><p>Artikel opini tentang kendaraan listrik...</p>' },
  { id: 6, title: 'Geely Okavango 2025: MPV Premium dengan Harga Terjangkau untuk Keluarga Indonesia', category: 'Review', category_color: '#3B82F6', excerpt: 'Geely Okavango menawarkan kenyamanan setara premium dengan harga yang masih terjangkau — pilihan MPV terbaik untuk keluarga besar.', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80', date: '25 Apr 2025', read_time: '5 menit baca', content: '<h1>Geely Okavango 2025 Review</h1><p>Review lengkap Geely Okavango...</p>' },
];
const TESTIMONIALS = [
  { name: 'Budi Santoso', car: 'BYD Atto 3', text: 'Pengalaman beli mobil di AutoCar sangat menyenangkan! Tim sangat profesional dan membantu dari awal hingga akhir. BYD Atto 3 saya sudah 6 bulan, sangat puas!', initials: 'BS', stars: 5 },
  { name: 'Dewi Rahayu', car: 'Geely Coolray', text: 'Proses pengajuan kredit sangat cepat dan mudah. Tidak perlu repot keliling banyak dealer. AutoCar memang one stop shopping yang sesungguhnya!', initials: 'DR', stars: 5 },
  { name: 'Ahmad Fauzi', car: 'BYD Dolphin', text: 'Test drive langsung ke rumah, prosesnya sangat nyaman. BYD Dolphin pilihan tepat untuk sehari-hari. Hemat banget dibanding BBM!', initials: 'AF', stars: 5 },
  { name: 'Sari Indrawati', car: 'Geely Okavango', text: 'Sudah survey ke banyak dealer, tapi AutoCar yang paling transparan soal harga dan proses. Geely Okavango untuk keluarga sangat worth it!', initials: 'SI', stars: 5 },
];
const WHY_US = [
  { icon: '🏆', title: 'Multi-Brand Resmi', text: 'Kami adalah dealer resmi berbagai brand ternama dunia. Satu tempat untuk semua pilihan mobil impian Anda.' },
  { icon: '💳', title: 'Kredit Mudah', text: 'Proses KPM mudah, cepat dan bunga kompetitif. DP fleksibel, tenor hingga 7 tahun dengan berbagai bank mitra.' },
  { icon: '🚗', title: 'Test Drive ke Rumah', text: 'Layanan test drive langsung ke lokasi Anda. Rasakan sensasi berkendara tanpa harus datang ke showroom.' },
  { icon: '🔧', title: 'Servis & After Sales', text: 'Bengkel bergaransi resmi, spare parts original, dan tim teknisi bersertifikat untuk merawat kendaraan Anda.' },
  { icon: '📱', title: 'Konsultasi 24/7', text: 'Tim konsultan kami siap membantu kapan saja via WhatsApp, telepon, atau kunjungan langsung ke showroom.' },
  { icon: '📋', title: 'Transparansi Harga', text: 'Tidak ada biaya tersembunyi. Harga all-in transparan dengan rincian lengkap sebelum Anda memutuskan.' },
];

// ---- HELPER: WhatsApp Link ----
const WA_NUMBER = '6287710208822';
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// ==============================
// COMPONENTS
// ==============================

// --- LOADING ---
function LoadingScreen({ visible }) {
  if (!visible) return null;
  return (
    <div className="loading-screen">
      <div className="nav-logo">
        <div className="nav-logo-icon">AC</div>
        <span className="text-gradient">AutoCar</span>
      </div>
      <div className="loading-bar"><div className="loading-progress"></div></div>
      <p style={{fontSize:'0.85rem',color:'#9CA3AF'}}>Memuat konten...</p>
    </div>
  );
}

// --- NAVBAR ---
function Navbar({ onNavClick, activePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'brands', label: 'Brand' },
    { id: 'models', label: 'Model' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'Tentang' },
  ];
  const handleNav = (id) => { onNavClick(id); setMobileOpen(false); };
  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-logo" style={{cursor:'pointer'}} onClick={() => handleNav('home')}>
            <div className="nav-logo-icon">AC</div>
            <span><span className="text-gradient">AutoCar</span></span>
          </div>
          <div className="nav-links">
            {navItems.map(n => (
              <span key={n.id} className={`nav-link ${activePage === n.id ? 'active' : ''}`} onClick={() => handleNav(n.id)}>{n.label}</span>
            ))}
          </div>
          <div className="nav-actions">
            <a href={waLink('Halo AutoCar, saya ingin konsultasi pembelian mobil.')} target="_blank" className="nav-wa">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 0C5.374 0 0 5.373 0 11.997c0 2.116.554 4.101 1.524 5.83L.07 23.404a.75.75 0 00.921.921l5.583-1.461A11.944 11.944 0 0012 24c6.624 0 12-5.373 12-11.997C24 5.373 18.624 0 11.998 0zm0 21.999c-1.925 0-3.763-.516-5.345-1.415l-.38-.226-3.96 1.035 1.052-3.842-.248-.395C1.99 15.775 1.5 13.943 1.5 11.997 1.5 6.204 6.207 1.5 11.998 1.5c5.79 0 10.5 4.704 10.5 10.497 0 5.793-4.71 10.502-10.5 10.502z"/></svg>
              WhatsApp
            </a>
            <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {navItems.map(n => (
          <span key={n.id} className={`nav-link ${activePage === n.id ? 'active' : ''}`} onClick={() => handleNav(n.id)}>{n.label}</span>
        ))}
        <div style={{marginTop:16}}>
          <a href={waLink('Halo AutoCar, saya ingin konsultasi pembelian mobil.')} target="_blank" className="nav-wa" style={{display:'inline-flex'}}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 0C5.374 0 0 5.373 0 11.997c0 2.116.554 4.101 1.524 5.83L.07 23.404a.75.75 0 00.921.921l5.583-1.461A11.944 11.944 0 0012 24c6.624 0 12-5.373 12-11.997C24 5.373 18.624 0 11.998 0zm0 21.999c-1.925 0-3.763-.516-5.345-1.415l-.38-.226-3.96 1.035 1.052-3.842-.248-.395C1.99 15.775 1.5 13.943 1.5 11.997 1.5 6.204 6.207 1.5 11.998 1.5c5.79 0 10.5 4.704 10.5 10.497 0 5.793-4.71 10.502-10.5 10.502z"/></svg>
            WhatsApp Kami
          </a>
        </div>
      </div>
    </>
  );
}

// --- HERO ---
function Hero({ onExplore, featuredModel }) {
  const m = featuredModel || DUMMY_MODELS[0];
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">Indonesia's #1 Car Marketplace</div>
            <h1>
              Temukan Mobil <span className="text-gradient">Impian Anda</span> di Satu Tempat
            </h1>
            <p>Geely, BYD, dan brand-brand terbaik dunia tersedia di AutoCar. One stop shopping mobil baru dengan proses mudah, harga transparan, dan layanan terbaik.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onExplore('models')}>
                🚗 Lihat Semua Model
              </button>
              <a href={waLink('Halo AutoCar! Saya ingin konsultasi untuk memilih mobil yang sesuai kebutuhan saya.')} target="_blank" className="btn btn-outline btn-lg">
                💬 Konsultasi Gratis
              </a>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-value">15+</div><div className="hero-stat-label">Model Tersedia</div></div>
              <div><div className="hero-stat-value">2</div><div className="hero-stat-label">Brand Premium</div></div>
              <div><div className="hero-stat-value">500+</div><div className="hero-stat-label">Pelanggan Puas</div></div>
              <div><div className="hero-stat-value">5★</div><div className="hero-stat-label">Rating Layanan</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-car-card">
              <div className="hero-floating hero-floating-1">
                <span className="dot-green"></span> Ready Stock
              </div>
              <img src={m.image} alt={m.name} onError={e => e.target.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} />
              <div className="hero-car-info">
                <div>
                  <div className="hero-car-brand">{m.brand_name} • {m.type}</div>
                  <div className="hero-car-model">{m.name}</div>
                </div>
                <div className="hero-car-price">
                  <div className="hero-car-price-label">Mulai dari</div>
                  <div className="hero-car-price-value">{m.price}</div>
                </div>
              </div>
              <div className="hero-floating hero-floating-2">
                <span className="dot-blue"></span> Test Drive Tersedia
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- TECH STRIP ---
function TechStrip() {
  const items = [
    '⚡ Teknologi EV Terdepan','🛡️ Garansi Resmi Pabrik','🔋 Blade Battery Technology',
    '🤖 ADAS Smart Safety','🌿 Zero Emission Driving','🏆 Award-Winning Design',
    '📱 Connected Car System','⚡ Teknologi EV Terdepan','🛡️ Garansi Resmi Pabrik',
    '🔋 Blade Battery Technology','🤖 ADAS Smart Safety','🌿 Zero Emission Driving',
  ];
  return (
    <div className="tech-strip">
      <div className="tech-strip-inner">
        {items.map((t, i) => (
          <div key={i} className="tech-strip-item">
            <span>{t}</span>
            <span style={{color:'rgba(255,255,255,0.2)'}}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- BRANDS ---
function BrandsSection({ brands, onBrandClick }) {
  const data = brands.length ? brands : DUMMY_BRANDS;
  return (
    <section id="brands" className="section brands-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-primary mb-4">Brand Pilihan</span>
          <h2>Brand Mobil Terbaik <span className="text-gradient">Dunia</span></h2>
          <p>Kami menghadirkan brand-brand ternama dengan reputasi global untuk pilihan terbaik Anda</p>
        </div>
        <div className="brands-grid">
          {data.map(b => (
            <div key={b.id} className="brand-card" onClick={() => onBrandClick(b)}>
              {b.is_new && <div className="brand-card-badge"><span className="badge badge-new">NEW</span></div>}
              <div className="brand-logo-wrap">
                <img src={b.logo} alt={b.name} onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span style="font-size:1.8rem;font-weight:900;color:#0066FF">${b.name.slice(0,2)}</span>`; }} />
              </div>
              <div className="brand-name">{b.name}</div>
              <div className="brand-country">{b.country}</div>
              <div className="brand-model-count">Lihat Semua Model →</div>
            </div>
          ))}
          <div className="brand-card" style={{borderStyle:'dashed',cursor:'default',background:'transparent'}}>
            <div className="brand-logo-wrap" style={{background:'transparent'}}>
              <span style={{fontSize:'2rem'}}>+</span>
            </div>
            <div className="brand-name" style={{color:'#9CA3AF'}}>Coming Soon</div>
            <div className="brand-country">Brand Baru Segera Hadir</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MODELS ---
function ModelsSection({ models, brands, selectedBrand, onModelClick }) {
  const [filter, setFilter] = useState('all');
  const allModels = models.length ? models : DUMMY_MODELS;
  const brandList = [{ id: 'all', name: 'Semua Brand' }, ...(brands.length ? brands : DUMMY_BRANDS)];
  const filtered = filter === 'all' ? allModels : allModels.filter(m => m.brand_id == filter || m.brand_name?.toLowerCase() === filter.toLowerCase());
  const typeFilters = ['all', ...new Set(allModels.map(m => m.fuel === 'Electric' ? 'EV' : 'Gasoline'))];
  const [typeFilter, setTypeFilter] = useState('all');
  const displayed = typeFilter === 'all' ? filtered : filtered.filter(m => (typeFilter === 'EV' ? m.fuel === 'Electric' : m.fuel !== 'Electric'));

  return (
    <section id="models" className="section models-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-accent mb-4">Model Pilihan</span>
          <h2>Pilih Mobil <span className="text-gradient">Sesuai Impian</span></h2>
          <p>Dari SUV sporty, sedan elegan, hingga EV masa depan — temukan yang sempurna untuk Anda</p>
        </div>
        <div className="models-filter">
          {brandList.map(b => (
            <button key={b.id} className={`filter-btn ${filter == b.id ? 'active' : ''}`} onClick={() => setFilter(b.id)}>
              {b.name}
            </button>
          ))}
          <span style={{width:1,background:'#E5E7EB',margin:'0 4px'}}></span>
          <button className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>⚡ Semua</button>
          <button className={`filter-btn ${typeFilter === 'EV' ? 'active' : ''}`} onClick={() => setTypeFilter('EV')}>⚡ Electric</button>
          <button className={`filter-btn ${typeFilter === 'Gasoline' ? 'active' : ''}`} onClick={() => setTypeFilter('Gasoline')}>⛽ Bensin</button>
        </div>
        {displayed.length === 0 && (
          <div className="text-center" style={{padding:'48px 0',color:'#9CA3AF'}}>
            <div style={{fontSize:'3rem',marginBottom:12}}>🚗</div>
            <p>Tidak ada model yang sesuai filter</p>
          </div>
        )}
        <div className="models-grid">
          {displayed.map(m => (
            <CarCard key={m.id} model={m} onClick={() => onModelClick(m)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CAR CARD ---
function CarCard({ model: m, onClick }) {
  const brandLogo = DUMMY_BRANDS.find(b => b.name === m.brand_name)?.logo;
  return (
    <div className="car-card" onClick={onClick}>
      <div className="car-card-img">
        <img src={m.image} alt={m.name} onError={e => e.target.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} />
        <div className="car-card-overlay"></div>
        <div className="car-card-type">
          <span className="badge" style={{background: m.fuel==='Electric' ? 'rgba(0,212,170,0.9)' : 'rgba(0,102,255,0.9)', color:'white', fontSize:'0.7rem'}}>
            {m.fuel === 'Electric' ? '⚡ Electric' : `⛽ ${m.type}`}
          </span>
        </div>
        {brandLogo && (
          <div className="car-card-brand-logo">
            <img src={brandLogo} alt={m.brand_name} onError={e => e.target.style.display='none'} />
          </div>
        )}
        {m.is_new && <div style={{position:'absolute',top:12,right:12}}><span className="badge badge-new" style={{fontSize:'0.65rem'}}>NEW</span></div>}
      </div>
      <div className="car-card-body">
        <div className="car-card-brand">{m.brand_name}</div>
        <div className="car-card-name">{m.name}</div>
        <div className="car-card-desc">{m.description}</div>
        <div className="car-card-specs">
          <div className="car-spec"><div className="car-spec-value">{m.engine}</div><div className="car-spec-label">Mesin</div></div>
          <div className="car-spec"><div className="car-spec-value">{m.power}</div><div className="car-spec-label">Tenaga</div></div>
          <div className="car-spec"><div className="car-spec-value">{m.range || m.type}</div><div className="car-spec-label">{m.range ? 'Jangkauan' : 'Tipe'}</div></div>
        </div>
        <div className="car-card-footer">
          <div className="car-price"><div className="car-price-label">Mulai dari</div><div className="car-price-value">{m.price}</div></div>
          <button className="car-wa-btn" onClick={e => { e.stopPropagation(); window.open(waLink(`Halo AutoCar! Saya tertarik dengan ${m.name} seharga ${m.price}. Bisa minta info lebih lanjut?`), '_blank'); }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 0C5.374 0 0 5.373 0 11.997c0 2.116.554 4.101 1.524 5.83L.07 23.404a.75.75 0 00.921.921l5.583-1.461A11.944 11.944 0 0012 24c6.624 0 12-5.373 12-11.997C24 5.373 18.624 0 11.998 0zm0 21.999c-1.925 0-3.763-.516-5.345-1.415l-.38-.226-3.96 1.035 1.052-3.842-.248-.395C1.99 15.775 1.5 13.943 1.5 11.997 1.5 6.204 6.207 1.5 11.998 1.5c5.79 0 10.5 4.704 10.5 10.497 0 5.793-4.71 10.502-10.5 10.502z"/></svg>
            Tanya WA
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CAROUSEL ---
function CarouselSection({ models }) {
  const [idx, setIdx] = useState(0);
  const data = (models.length ? models : DUMMY_MODELS).slice(0, 6);
  const prev = () => setIdx(i => (i - 1 + data.length) % data.length);
  const next = () => setIdx(i => (i + 1) % data.length);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [data.length]);
  return (
    <section className="carousel-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge" style={{background:'rgba(0,212,170,0.15)',color:'#00D4AA',marginBottom:16}}>Featured Models</span>
          <h2>Model <span style={{color:'#00D4AA'}}>Unggulan</span> Pilihan</h2>
          <p style={{color:'rgba(255,255,255,0.6)'}}>Temukan model-model terpopuler dengan teknologi terdepan</p>
        </div>
        <div className="carousel-wrapper" style={{overflow:'hidden'}}>
          <div className="carousel-track" style={{transform: `translateX(calc(-${idx * (440 + 24)}px))`}}>
            {data.map((m, i) => (
              <div key={m.id} className="carousel-slide">
                <img src={m.image} alt={m.name} onError={e => e.target.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} style={{width:'100%',height:280,objectFit:'cover'}} />
                <div className="carousel-slide-body">
                  <div className="carousel-slide-brand">{m.brand_name} · {m.type}</div>
                  <div className="carousel-slide-title">{m.name}</div>
                  <div className="carousel-slide-text">{m.description}</div>
                  <div style={{marginTop:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:800,color:'#00D4AA'}}>{m.price}</span>
                    <a href={waLink(`Halo! Saya tertarik dengan ${m.name}. Bisa info lebih lanjut?`)} target="_blank" style={{background:'#25D366',color:'white',padding:'8px 16px',borderRadius:8,fontSize:'0.8rem',fontWeight:600,textDecoration:'none'}}>Tanya WA</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-nav">
          <button className="carousel-btn" onClick={prev}>←</button>
          <div className="carousel-dots">
            {data.map((_, i) => <div key={i} className={`carousel-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}></div>)}
          </div>
          <button className="carousel-btn" onClick={next}>→</button>
        </div>
      </div>
    </section>
  );
}

// --- BLOG ---
function BlogSection({ articles, onArticleClick }) {
  const data = articles.length ? articles : DUMMY_ARTICLES;
  return (
    <section id="blog" className="section blog-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-primary mb-4">Blog & Artikel</span>
          <h2>Informasi & Tips <span className="text-gradient">Terkini</span></h2>
          <p>Dapatkan informasi terbaru seputar dunia otomotif, review, dan panduan membeli mobil</p>
        </div>
        <div className="blog-grid">
          {data.map(a => (
            <div key={a.id} className="blog-card" onClick={() => onArticleClick(a)}>
              <div className="blog-card-img">
                <img src={a.image} alt={a.title} onError={e => e.target.src='https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=80'} />
              </div>
              <div className="blog-card-body">
                <div className="blog-meta">
                  <span className="blog-tag" style={{background:`${a.category_color}20`,color:a.category_color}}>{a.category}</span>
                  <span className="blog-date">{a.date}</span>
                </div>
                <div className="blog-title">{a.title}</div>
                <div className="blog-excerpt">{a.excerpt}</div>
              </div>
              <div className="blog-footer">
                <span style={{fontSize:'0.78rem',color:'#9CA3AF'}}>📖 {a.read_time}</span>
                <span className="blog-read-more">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- WHY US ---
function WhySection() {
  return (
    <section className="section why-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge" style={{background:'rgba(0,212,170,0.15)',color:'#00D4AA',marginBottom:16}}>Kenapa AutoCar?</span>
          <h2>Layanan <span style={{color:'#00D4AA'}}>Terbaik</span> untuk Anda</h2>
          <p>Kami berkomitmen memberikan pengalaman berbelanja mobil yang mudah, nyaman dan transparan</p>
        </div>
        <div className="why-grid">
          {WHY_US.map((w, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{w.icon}</div>
              <div className="why-title">{w.title}</div>
              <div className="why-text">{w.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- TESTIMONIALS ---
function TestimonialsSection() {
  return (
    <section className="section testimonials-section" id="about">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-accent mb-4">Testimoni</span>
          <h2>Apa Kata <span className="text-gradient">Pelanggan Kami</span></h2>
          <p>Kepuasan pelanggan adalah prioritas utama kami dalam setiap transaksi</p>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testi-card">
              <div className="testi-stars">{'★'.repeat(t.stars)}</div>
              <div className="testi-text">"{t.text}"</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div><div className="testi-name">{t.name}</div><div className="testi-car">Pemilik {t.car}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA ---
function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Siap Menemukan Mobil Impian Anda?</h2>
        <p>Konsultasikan kebutuhan Anda dengan tim ahli kami. Gratis, cepat, dan tanpa tekanan!</p>
        <div className="cta-actions">
          <a href={waLink('Halo AutoCar! Saya ingin konsultasi dan test drive. Kapan bisa dijadwalkan?')} target="_blank" className="btn btn-white btn-lg">
            💬 Chat WhatsApp Sekarang
          </a>
          <a href="tel:+6287710208822" className="btn btn-ghost btn-lg">📞 Hubungi Kami</a>
        </div>
      </div>
    </section>
  );
}

// --- FOOTER ---
function Footer({ onNavClick }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{marginBottom:16}}>
              <div className="nav-logo-icon">AC</div>
              <span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:800,color:'white'}}>AutoCar</span>
            </div>
            <p>One stop shopping mobil terpercaya di Indonesia. Kami menghadirkan brand-brand terbaik dunia dengan layanan prima dan harga transparan.</p>
            <div className="footer-contact mt-4">
              <div className="footer-contact-item">📍 <span>Jakarta, Indonesia</span></div>
              <div className="footer-contact-item">📱 <strong>0877-1020-8822</strong></div>
              <div className="footer-contact-item">💬 <a href={waLink('Halo AutoCar!')} target="_blank" style={{color:'#00D4AA'}}>WhatsApp Kami</a></div>
            </div>
          </div>
          <div>
            <div className="footer-title">Brand</div>
            <ul className="footer-links">
              <li><a href="#" onClick={() => onNavClick('brands')}>Geely Indonesia</a></li>
              <li><a href="#" onClick={() => onNavClick('brands')}>BYD Indonesia</a></li>
              <li><a href="#" style={{color:'rgba(255,255,255,0.3)'}}>Coming Soon...</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Layanan</div>
            <ul className="footer-links">
              <li><a href="#">Beli Mobil Baru</a></li>
              <li><a href="#">Kredit Kendaraan</a></li>
              <li><a href="#">Test Drive</a></li>
              <li><a href="#">Servis & Bengkel</a></li>
              <li><a href="#">Tukar Tambah</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Info</div>
            <ul className="footer-links">
              <li><a href="#" onClick={() => onNavClick('blog')}>Blog & Artikel</a></li>
              <li><a href="#">Promo Terkini</a></li>
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Karir</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AutoCar Indonesia. Hak cipta dilindungi. | WA: 087710208822</p>
          <div className="footer-social">
            <a href={waLink('Halo AutoCar!')} target="_blank" className="social-icon">💬</a>
            <div className="social-icon">📘</div>
            <div className="social-icon">📸</div>
            <div className="social-icon">🎥</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- CAR MODAL ---
function CarModal({ model, onClose }) {
  if (!model) return null;
  const brandLogo = DUMMY_BRANDS.find(b => b.name === model.brand_name)?.logo;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-brand">{model.brand_name} · {model.type}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <img src={model.image} alt={model.name} className="modal-img" onError={e => e.target.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} />
          <div className="modal-title">{model.name}</div>
          <div className="modal-price">{model.price}</div>
          <div className="modal-desc">{model.description}</div>
          <div className="modal-specs-grid">
            <div className="modal-spec-item"><div className="modal-spec-value">{model.engine}</div><div className="modal-spec-label">Mesin</div></div>
            <div className="modal-spec-item"><div className="modal-spec-value">{model.power}</div><div className="modal-spec-label">Tenaga</div></div>
            <div className="modal-spec-item"><div className="modal-spec-value">{model.range || '—'}</div><div className="modal-spec-label">Jangkauan EV</div></div>
            <div className="modal-spec-item"><div className="modal-spec-value">{model.fuel}</div><div className="modal-spec-label">Bahan Bakar</div></div>
            <div className="modal-spec-item"><div className="modal-spec-value">{model.brand_name}</div><div className="modal-spec-label">Brand</div></div>
            <div className="modal-spec-item"><div className="modal-spec-value">{model.type}</div><div className="modal-spec-label">Tipe</div></div>
          </div>
          <div className="modal-actions">
            <a href={waLink(`Halo AutoCar! Saya tertarik dengan ${model.name} seharga ${model.price}. Bisa minta info lengkap dan jadwal test drive?`)} target="_blank" className="btn btn-primary" style={{flex:1,justifyContent:'center'}}>
              💬 Tanya via WhatsApp
            </a>
            <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- BLOG MODAL ---
function BlogModal({ article, onClose }) {
  if (!article) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:780}} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="blog-tag" style={{background:`${article.category_color}20`,color:article.category_color}}>{article.category}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body blog-modal-content">
          <div style={{fontSize:'0.8rem',color:'#9CA3AF',marginBottom:8}}>{article.date} · {article.read_time}</div>
          <div dangerouslySetInnerHTML={{__html: article.content}} />
          <div style={{marginTop:32,padding:24,background:'#F0F9FF',borderRadius:16,textAlign:'center'}}>
            <p style={{fontWeight:700,marginBottom:12}}>Tertarik? Hubungi kami sekarang!</p>
            <a href={waLink(`Halo AutoCar! Saya baru membaca artikel "${article.title}" dan ingin tahu lebih lanjut.`)} target="_blank" className="btn btn-primary">💬 Tanya via WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// MAIN APP
// ==============================
function App() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Try Supabase
        const [{ data: b }, { data: m }, { data: a }] = await Promise.all([
          supabase.from('brands').select('*').order('name'),
          supabase.from('models').select('*').order('brand_name'),
          supabase.from('articles').select('*').order('created_at', { ascending: false }),
        ]);
        if (b?.length) setBrands(b);
        if (m?.length) setModels(m);
        if (a?.length) setArticles(a);
      } catch (e) {
        // Use dummy data
      }
      setTimeout(() => setLoading(false), 1200);
    };
    init();
  }, []);

  const scrollToSection = (id) => {
    setActivePage(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBrandClick = (brand) => {
    setActivePage('models');
    setTimeout(() => {
      const el = document.getElementById('models');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const featuredModel = (models.length ? models : DUMMY_MODELS).find(m => m.is_featured) || DUMMY_MODELS[0];

  if (loading) return <LoadingScreen visible={true} />;

  return (
    <div>
      <Navbar onNavClick={scrollToSection} activePage={activePage} />

      <Hero onExplore={scrollToSection} featuredModel={featuredModel} />
      <TechStrip />
      <BrandsSection brands={brands} onBrandClick={handleBrandClick} />
      <ModelsSection models={models} brands={brands} selectedBrand={null} onModelClick={setSelectedModel} />
      <CarouselSection models={models} />
      <BlogSection articles={articles} onArticleClick={setSelectedArticle} />
      <WhySection />
      <TestimonialsSection />
      <CTASection />
      <Footer onNavClick={scrollToSection} />

      {selectedModel && <CarModal model={selectedModel} onClose={() => setSelectedModel(null)} />}
      {selectedArticle && <BlogModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>}

      <a href={waLink('Halo AutoCar! Saya ingin konsultasi pembelian mobil.')} target="_blank" className="wa-float">
        <div className="wa-float-pulse"></div>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 0C5.374 0 0 5.373 0 11.997c0 2.116.554 4.101 1.524 5.83L.07 23.404a.75.75 0 00.921.921l5.583-1.461A11.944 11.944 0 0012 24c6.624 0 12-5.373 12-11.997C24 5.373 18.624 0 11.998 0zm0 21.999c-1.925 0-3.763-.516-5.345-1.415l-.38-.226-3.96 1.035 1.052-3.842-.248-.395C1.99 15.775 1.5 13.943 1.5 11.997 1.5 6.204 6.207 1.5 11.998 1.5c5.79 0 10.5 4.704 10.5 10.497 0 5.793-4.71 10.502-10.5 10.502z"/></svg>
      </a>

      <button className="back-to-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
