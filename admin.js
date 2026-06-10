// ==============================
// AUTOCAR ADMIN PANEL
// ==============================
const { useState, useEffect, useRef, useCallback } = React;

// ---- SUPABASE ----
const SUPABASE_URL = 'https://uoikdkfgwrhtdgbwuvyy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mtdnERcp4a0-2jXdPRgSbQ_yZhJw9As';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- AUTH ----
const ADMIN_USER = 'admin@autocar.id';
const ADMIN_PASS = 'autocar2025!';

// ---- TOAST MANAGER ----
let _toastSet = null;
const toast = {
  success: (msg) => _toastSet && _toastSet(p => [...p, {id:Date.now(),msg,type:'success'}]),
  error: (msg) => _toastSet && _toastSet(p => [...p, {id:Date.now(),msg,type:'error'}]),
  warning: (msg) => _toastSet && _toastSet(p => [...p, {id:Date.now(),msg,type:'warning'}]),
};
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _toastSet = setToasts;
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts(p => p.slice(1)), 3500);
    return () => clearTimeout(t);
  }, [toasts]);
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <span>{t.type==='success'?'✅':t.type==='error'?'❌':'⚠️'}</span>
          <span>{t.msg}</span>
          <span className="toast-close" onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>✕</span>
        </div>
      ))}
    </div>
  );
}

// ---- DUMMY DATA ----
const INIT_BRANDS = [
  { id: 1, name: 'Geely', country: 'China', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Geely_logo.svg/512px-Geely_logo.svg.png', is_new: false, status: 'active', model_count: 4 },
  { id: 2, name: 'BYD', country: 'China', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/BYD_auto_logo.svg/512px-BYD_auto_logo.svg.png', is_new: true, status: 'active', model_count: 5 },
];
const INIT_MODELS = [
  { id: 1, brand_id: 1, brand_name: 'Geely', name: 'Geely Emgrand', type: 'Sedan', fuel: 'Gasoline', engine: '1.5L Turbo', power: '177 HP', range: '', price: 'Rp 249 Juta', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', description: 'Sedan modern dengan teknologi terkini.', is_new: false, is_featured: true, status: 'active' },
  { id: 2, brand_id: 1, brand_name: 'Geely', name: 'Geely Coolray', type: 'SUV', fuel: 'Gasoline', engine: '1.5L Turbo', power: '177 HP', range: '', price: 'Rp 289 Juta', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', description: 'SUV compact sporty dengan desain futuristik.', is_new: true, is_featured: true, status: 'active' },
  { id: 3, brand_id: 2, brand_name: 'BYD', name: 'BYD Atto 3', type: 'SUV EV', fuel: 'Electric', engine: 'Electric', power: '204 HP', range: '480 km', price: 'Rp 489 Juta', image: 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', description: 'SUV listrik dengan jangkauan 480 km.', is_new: true, is_featured: true, status: 'active' },
  { id: 4, brand_id: 2, brand_name: 'BYD', name: 'BYD Dolphin', type: 'Hatchback EV', fuel: 'Electric', engine: 'Electric', power: '95 HP', range: '427 km', price: 'Rp 379 Juta', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80', description: 'Hatchback listrik lincah dan efisien.', is_new: false, is_featured: false, status: 'active' },
];
const INIT_ARTICLES = [
  { id: 1, title: 'Geely Coolray 2025: Revolusi SUV Compact', category: 'Review', category_color: '#3B82F6', excerpt: 'Geely Coolray hadir dengan pembaruan signifikan untuk 2025.', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', date: '28 Mei 2025', read_time: '5 menit baca', status: 'published', content: '<h1>Geely Coolray 2025</h1><p>Review lengkap Geely Coolray...</p>' },
  { id: 2, title: 'BYD vs Kendaraan Konvensional: Mana Lebih Hemat?', category: 'Perbandingan', category_color: '#10B981', excerpt: 'Analisis biaya kepemilikan mobil listrik BYD vs konvensional.', image: 'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=600&q=80', date: '22 Mei 2025', read_time: '8 menit baca', status: 'published', content: '<h1>BYD vs Konvensional</h1><p>Analisis biaya...</p>' },
];

// ==============================
// LOGIN PAGE
// ==============================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    await new Promise(r => setTimeout(r, 800));
    if (email === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('ac_admin', '1');
      onLogin();
    } else { setErr('Email atau password salah.'); }
    setLoading(false);
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">AC</div>
          <h1>AutoCar Admin</h1>
          <p>Panel manajemen konten website</p>
        </div>
        {err && <div className="login-error">{err}</div>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Email Admin</label>
            <input className="form-control" type="email" placeholder="admin@autocar.id" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Memverifikasi...' : '🔐 Masuk ke Admin Panel'}
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:'0.78rem',color:'#94A3B8',marginTop:16}}>
          Demo: admin@autocar.id / autocar2025!
        </p>
      </div>
    </div>
  );
}

// ==============================
// SIDEBAR
// ==============================
function Sidebar({ active, setActive, onLogout }) {
  const nav = [
    { group: 'Main', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    ]},
    { group: 'Konten', items: [
      { id: 'brands', icon: '🏷️', label: 'Brand' },
      { id: 'models', icon: '🚗', label: 'Model Mobil' },
      { id: 'articles', icon: '📝', label: 'Artikel / Blog' },
    ]},
    { group: 'Media', items: [
      { id: 'media', icon: '🖼️', label: 'Galeri Foto' },
    ]},
    { group: 'Website', items: [
      { id: 'htmleditor', icon: '💻', label: 'HTML Editor' },
    ]},
    { group: 'Pengaturan', items: [
      { id: 'settings', icon: '⚙️', label: 'Pengaturan' },
    ]},
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AC</div>
          <div>
            <div>AutoCar</div>
            <span className="sidebar-tag">Admin Panel v1.0</span>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(g => (
          <div key={g.group} className="nav-group">
            <div className="nav-group-title">{g.group}</div>
            {g.items.map(item => (
              <div key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>
                <div className="nav-icon">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">AD</div>
          <div>
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Super Administrator</div>
          </div>
          <button className="sidebar-logout" onClick={onLogout}>Keluar</button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// TOPBAR
// ==============================
function Topbar({ page }) {
  const titles = { dashboard:'Dashboard', brands:'Manajemen Brand', models:'Manajemen Model Mobil', articles:'Artikel & Blog', media:'Galeri Foto', htmleditor:'HTML Editor', settings:'Pengaturan' };
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{titles[page] || page}</div>
        <div className="topbar-breadcrumb">AutoCar Admin → {titles[page]}</div>
      </div>
      <div className="topbar-actions">
        <a href="index.html" target="_blank" className="btn btn-outline btn-sm">🔗 Lihat Website</a>
        <div className="topbar-notif" style={{position:'relative',cursor:'pointer',fontSize:'1.2rem'}}>
          🔔 <div className="notif-dot"></div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// DASHBOARD
// ==============================
function Dashboard({ brands, models, articles, setPage }) {
  const stats = [
    { label: 'Total Brand', value: brands.length, icon: '🏷️', color: '#EEF4FF', change: '+1 bulan ini', up: true },
    { label: 'Total Model', value: models.length, icon: '🚗', color: '#F0FDF4', change: '+2 bulan ini', up: true },
    { label: 'Artikel', value: articles.length, icon: '📝', color: '#FFFBEB', change: '+3 bulan ini', up: true },
    { label: 'Pengunjung/Hari', value: '1,234', icon: '👥', color: '#FDF4FF', change: '+12% minggu ini', up: true },
  ];
  const activities = [
    { text: 'Brand BYD ditandai "NEW"', time: '2 jam lalu', color: '#3B82F6' },
    { text: 'Artikel baru ditambahkan', time: '4 jam lalu', color: '#10B981' },
    { text: 'Model Geely Coolray diupdate', time: '1 hari lalu', color: '#F59E0B' },
    { text: 'Foto galeri diupload (5 foto)', time: '2 hari lalu', color: '#8B5CF6' },
    { text: 'Pengaturan SEO diperbarui', time: '3 hari lalu', color: '#EC4899' },
  ];
  return (
    <div>
      <div className="stats-grid">
        {stats.map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.color}}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.up ? 'up' : 'down'}`}>{s.up ? '↑' : '↓'} {s.change}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="quick-actions">
        {[
          { icon:'🏷️', label:'Tambah Brand', page:'brands' },
          { icon:'🚗', label:'Tambah Model', page:'models' },
          { icon:'📝', label:'Tulis Artikel', page:'articles' },
          { icon:'🖼️', label:'Upload Foto', page:'media' },
        ].map((q,i) => (
          <div key={i} className="quick-action-card" onClick={() => setPage(q.page)}>
            <div className="qa-icon">{q.icon}</div>
            <div className="qa-label">{q.label}</div>
          </div>
        ))}
      </div>
      <div className="recent-grid">
        <div className="card">
          <div className="card-header"><div className="card-title">Aktivitas Terbaru</div></div>
          <div className="card-body" style={{padding:'0 24px'}}>
            <div className="activity-list">
              {activities.map((a,i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{background:a.color}}></div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Info Website</div></div>
          <div className="card-body">
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[
                { label: 'Status Website', value: '✅ Online', color: '#22C55E' },
                { label: 'Total Halaman', value: '8 Halaman' },
                { label: 'Database', value: '🟢 Supabase' },
                { label: 'Kontak WA', value: '0877-1020-8822' },
                { label: 'Terakhir Update', value: 'Hari ini' },
              ].map((r,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:12,borderBottom:i<4?'1px solid #F1F5F9':'none'}}>
                  <span style={{fontSize:'0.82rem',color:'#64748B'}}>{r.label}</span>
                  <span style={{fontSize:'0.82rem',fontWeight:600,color:r.color||'#0F172A'}}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// IMAGE INPUT COMPONENT
// ==============================
function ImageInput({ value, onChange, label, type='car' }) {
  const [mode, setMode] = useState('url');
  const [preview, setPreview] = useState(value || '');
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const url = ev.target.result; setPreview(url); onChange(url); };
    reader.readAsDataURL(f);
  };
  const handleUrl = (v) => { setPreview(v); onChange(v); };
  return (
    <div>
      <div className="img-type-toggle">
        <button type="button" className={`img-type-btn ${mode==='url'?'active':''}`} onClick={() => setMode('url')}>🔗 URL</button>
        <button type="button" className={`img-type-btn ${mode==='file'?'active':''}`} onClick={() => setMode('file')}>📁 Upload File</button>
      </div>
      {mode === 'url' ? (
        <input className="form-control" type="url" placeholder="https://example.com/image.jpg" value={value} onChange={e => handleUrl(e.target.value)} />
      ) : (
        <input className="form-control" type="file" accept="image/*" onChange={handleFile} />
      )}
      {(preview || value) && (
        <div className="img-preview-wrap">
          <img src={preview || value} alt="preview" className={type === 'logo' ? 'img-preview-logo' : 'img-preview'} onError={e => e.target.style.display='none'} />
        </div>
      )}
    </div>
  );
}

// ==============================
// BRANDS PAGE
// ==============================
function BrandsPage({ brands, setBrands }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name:'', country:'', logo:'', is_new:false, status:'active' });

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name:'', country:'', logo:'', is_new:false, status:'active' }); setEditItem(null); setShowForm(true); };
  const openEdit = (b) => { setForm({...b}); setEditItem(b); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name || !form.country) { toast.error('Nama dan negara wajib diisi!'); return; }
    try {
      if (editItem) {
        const { error } = await sb.from('brands').update(form).eq('id', editItem.id);
        if (error) throw error;
        setBrands(p => p.map(b => b.id === editItem.id ? {...form, id:editItem.id} : b));
      } else {
        const { data, error } = await sb.from('brands').insert([form]).select();
        if (error) throw error;
        setBrands(p => [...p, data ? data[0] : {...form, id: Date.now(), model_count:0}]);
      }
      toast.success(editItem ? 'Brand berhasil diupdate!' : 'Brand berhasil ditambahkan!');
      setShowForm(false);
    } catch(e) {
      // Offline fallback
      if (editItem) setBrands(p => p.map(b => b.id === editItem.id ? {...form, id:editItem.id} : b));
      else setBrands(p => [...p, {...form, id: Date.now(), model_count:0}]);
      toast.success(editItem ? 'Brand diupdate (lokal)!' : 'Brand ditambahkan (lokal)!');
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await sb.from('brands').delete().eq('id', deleteItem.id);
    } catch(e) {}
    setBrands(p => p.filter(b => b.id !== deleteItem.id));
    toast.success('Brand dihapus!'); setDeleteItem(null);
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Cari brand..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{marginLeft:'auto'}}>
          <button className="btn btn-primary" onClick={openAdd}>+ Tambah Brand</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Logo</th><th>Nama Brand</th><th>Negara</th><th>Status</th><th>Badge</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6}><div className="table-empty"><div className="table-empty-icon">🏷️</div><p>Belum ada brand</p></div></td></tr>
              )}
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><img src={b.logo} alt={b.name} className="td-logo" onError={e => { e.target.style.display='none'; }} /></td>
                  <td><strong>{b.name}</strong></td>
                  <td>{b.country}</td>
                  <td><span className={`status status-${b.status}`}>{b.status === 'active' ? '● Aktif' : '● Nonaktif'}</span></td>
                  <td>{b.is_new && <span className="status status-new">✦ NEW</span>}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteItem(b)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editItem ? '✏️ Edit Brand' : '+ Tambah Brand Baru'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nama Brand <span className="required">*</span></label>
                  <input className="form-control" placeholder="cth: Toyota" value={form.name} onChange={e => setForm(p => ({...p,name:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Negara Asal <span className="required">*</span></label>
                  <input className="form-control" placeholder="cth: Japan" value={form.country} onChange={e => setForm(p => ({...p,country:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(p => ({...p,status:e.target.value}))}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
                <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:28}}>
                  <div className="toggle-wrap">
                    <label className="toggle">
                      <input type="checkbox" checked={form.is_new} onChange={e => setForm(p => ({...p,is_new:e.target.checked}))} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Tandai sebagai "NEW"</span>
                  </div>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Logo Brand</label>
                  <div className="form-hint" style={{marginBottom:8}}>Ukuran logo yang disarankan: 200×200px (format PNG transparan). Bisa URL atau upload file.</div>
                  <ImageInput value={form.logo} onChange={v => setForm(p => ({...p,logo:v}))} type="logo" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>💾 Simpan Brand</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteItem && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-body">
              <div className="delete-confirm">
                <div className="delete-confirm-icon">🗑️</div>
                <h3>Hapus Brand?</h3>
                <p>Anda yakin ingin menghapus <strong>{deleteItem.name}</strong>?</p>
                <p style={{color:'#EF4444',fontSize:'0.8rem'}}>Semua model yang terkait juga akan terpengaruh.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteItem(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete}>🗑️ Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// MODELS PAGE
// ==============================
function ModelsPage({ models, setModels, brands }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const emptyForm = { brand_id:'', brand_name:'', name:'', type:'', fuel:'Gasoline', engine:'', power:'', range:'', price:'', image:'', description:'', is_new:false, is_featured:false, status:'active' };
  const [form, setForm] = useState(emptyForm);

  const filtered = models.filter(m =>
    (filterBrand === 'all' || m.brand_id == filterBrand) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.brand_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); };
  const openEdit = (m) => { setForm({...m}); setEditItem(m); setShowForm(true); };

  const handleBrandChange = (id) => {
    const b = brands.find(b => b.id == id);
    setForm(p => ({...p, brand_id: id, brand_name: b?.name || ''}));
  };

  const handleSave = async () => {
    if (!form.name || !form.brand_id) { toast.error('Nama model dan brand wajib diisi!'); return; }
    try {
      if (editItem) {
        await sb.from('models').update(form).eq('id', editItem.id);
        setModels(p => p.map(m => m.id === editItem.id ? {...form, id:editItem.id} : m));
      } else {
        const { data } = await sb.from('models').insert([form]).select();
        setModels(p => [...p, data ? data[0] : {...form, id: Date.now()}]);
      }
      toast.success(editItem ? 'Model berhasil diupdate!' : 'Model berhasil ditambahkan!');
      setShowForm(false);
    } catch(e) {
      if (editItem) setModels(p => p.map(m => m.id === editItem.id ? {...form, id:editItem.id} : m));
      else setModels(p => [...p, {...form, id: Date.now()}]);
      toast.success(editItem ? 'Model diupdate (lokal)!' : 'Model ditambahkan (lokal)!');
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    try { await sb.from('models').delete().eq('id', deleteItem.id); } catch(e) {}
    setModels(p => p.filter(m => m.id !== deleteItem.id));
    toast.success('Model dihapus!'); setDeleteItem(null);
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Cari model..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
          <option value="all">Semua Brand</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div style={{marginLeft:'auto'}}>
          <button className="btn btn-primary" onClick={openAdd}>+ Tambah Model</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Foto</th><th>Brand</th><th>Nama Model</th><th>Tipe</th><th>Bahan Bakar</th><th>Harga</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="table-empty"><div className="table-empty-icon">🚗</div><p>Belum ada model</p></div></td></tr>
              )}
              {filtered.map(m => (
                <tr key={m.id}>
                  <td><img src={m.image} alt={m.name} className="td-img" onError={e => { e.target.style.opacity=0.3; }} /></td>
                  <td><span className="type-badge">{m.brand_name}</span></td>
                  <td><strong>{m.name}</strong>{m.is_new && <span className="status status-new" style={{marginLeft:6}}>NEW</span>}</td>
                  <td>{m.type}</td>
                  <td><span className={`type-badge ${m.fuel==='Electric'?'ev-badge':''}`}>{m.fuel==='Electric'?'⚡ EV':'⛽ '+m.fuel}</span></td>
                  <td><strong style={{color:'#0066FF'}}>{m.price}</strong></td>
                  <td><span className={`status status-${m.status}`}>{m.status==='active'?'● Aktif':'● Draft'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(m)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteItem(m)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editItem ? '✏️ Edit Model Mobil' : '+ Tambah Model Baru'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Brand <span className="required">*</span></label>
                  <select className="form-control" value={form.brand_id} onChange={e => handleBrandChange(e.target.value)}>
                    <option value="">-- Pilih Brand --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Model <span className="required">*</span></label>
                  <input className="form-control" placeholder="cth: BYD Atto 3" value={form.name} onChange={e => setForm(p => ({...p,name:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipe Kendaraan</label>
                  <input className="form-control" placeholder="cth: SUV, Sedan, MPV, Hatchback" value={form.type} onChange={e => setForm(p => ({...p,type:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bahan Bakar</label>
                  <select className="form-control" value={form.fuel} onChange={e => setForm(p => ({...p,fuel:e.target.value}))}>
                    <option value="Gasoline">Gasoline (Bensin)</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mesin / Motor</label>
                  <input className="form-control" placeholder="cth: 1.5L Turbo / Electric" value={form.engine} onChange={e => setForm(p => ({...p,engine:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenaga (HP)</label>
                  <input className="form-control" placeholder="cth: 177 HP" value={form.power} onChange={e => setForm(p => ({...p,power:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jangkauan EV (km)</label>
                  <input className="form-control" placeholder="cth: 480 km (kosongkan jika bukan EV)" value={form.range} onChange={e => setForm(p => ({...p,range:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga</label>
                  <input className="form-control" placeholder="cth: Rp 489 Juta" value={form.price} onChange={e => setForm(p => ({...p,price:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(p => ({...p,status:e.target.value}))}>
                    <option value="active">Aktif (Tampil di Website)</option>
                    <option value="draft">Draft (Tersembunyi)</option>
                  </select>
                </div>
                <div className="form-group" style={{display:'flex',flexDirection:'column',gap:12,paddingTop:24}}>
                  <div className="toggle-wrap">
                    <label className="toggle">
                      <input type="checkbox" checked={form.is_new} onChange={e => setForm(p => ({...p,is_new:e.target.checked}))} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Tandai sebagai "NEW"</span>
                  </div>
                  <div className="toggle-wrap">
                    <label className="toggle">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({...p,is_featured:e.target.checked}))} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Tampilkan di Hero</span>
                  </div>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Deskripsi Singkat</label>
                  <textarea className="form-control" placeholder="Deskripsi singkat mobil (1-2 kalimat)" value={form.description} onChange={e => setForm(p => ({...p,description:e.target.value}))} style={{minHeight:80}} />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Foto Mobil</label>
                  <div className="form-hint" style={{marginBottom:8}}>Ukuran ideal: 1200×800px, rasio 3:2. Bisa URL atau upload file gambar.</div>
                  <ImageInput value={form.image} onChange={v => setForm(p => ({...p,image:v}))} type="car" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>💾 Simpan Model</button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-body">
              <div className="delete-confirm">
                <div className="delete-confirm-icon">🗑️</div>
                <h3>Hapus Model?</h3>
                <p>Anda yakin ingin menghapus <strong>{deleteItem.name}</strong>?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteItem(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete}>🗑️ Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// ARTICLES PAGE
// ==============================
function ArticlesPage({ articles, setArticles }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState('');
  const [contentTab, setContentTab] = useState('visual');
  const contentRef = useRef(null);
  const emptyForm = { title:'', category:'Review', category_color:'#3B82F6', excerpt:'', image:'', date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}), read_time:'5 menit baca', status:'published', content:'' };
  const [form, setForm] = useState(emptyForm);

  const CATEGORIES = [
    { label: 'Review', color: '#3B82F6' },
    { label: 'Perbandingan', color: '#10B981' },
    { label: 'Panduan', color: '#F59E0B' },
    { label: 'Opini', color: '#8B5CF6' },
    { label: 'Berita', color: '#EC4899' },
    { label: 'Tips', color: '#06B6D4' },
  ];

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); setTimeout(() => { if(contentRef.current) contentRef.current.innerHTML = ''; }, 100); };
  const openEdit = (a) => { setForm({...a}); setEditItem(a); setShowForm(true); setTimeout(() => { if(contentRef.current) contentRef.current.innerHTML = a.content||''; }, 100); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Judul artikel wajib diisi!'); return; }
    const content = contentRef.current ? contentRef.current.innerHTML : form.content;
    const finalForm = {...form, content};
    try {
      if (editItem) {
        await sb.from('articles').update(finalForm).eq('id', editItem.id);
        setArticles(p => p.map(a => a.id === editItem.id ? {...finalForm, id:editItem.id} : a));
      } else {
        const { data } = await sb.from('articles').insert([finalForm]).select();
        setArticles(p => [...p, data ? data[0] : {...finalForm, id: Date.now()}]);
      }
      toast.success(editItem ? 'Artikel diupdate!' : 'Artikel ditambahkan!');
      setShowForm(false);
    } catch(e) {
      if (editItem) setArticles(p => p.map(a => a.id === editItem.id ? {...finalForm, id:editItem.id} : a));
      else setArticles(p => [...p, {...finalForm, id: Date.now()}]);
      toast.success('Artikel disimpan (lokal)!');
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    try { await sb.from('articles').delete().eq('id', deleteItem.id); } catch(e) {}
    setArticles(p => p.filter(a => a.id !== deleteItem.id));
    toast.success('Artikel dihapus!'); setDeleteItem(null);
  };

  const execCmd = (cmd, val = null) => {
    contentRef.current?.focus();
    document.execCommand(cmd, false, val);
  };
  const insertImg = () => {
    const url = prompt('URL Gambar:');
    if (url) execCmd('insertImage', url);
  };
  const insertLink = () => {
    const url = prompt('URL Link:');
    if (url) execCmd('createLink', url);
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{marginLeft:'auto'}}>
          <button className="btn btn-primary" onClick={openAdd}>+ Tulis Artikel</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Foto</th><th>Judul</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6}><div className="table-empty"><div className="table-empty-icon">📝</div><p>Belum ada artikel</p></div></td></tr>
              )}
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><img src={a.image} alt={a.title} className="td-img" onError={e => e.target.style.opacity=0.3} /></td>
                  <td style={{maxWidth:280}}><strong style={{display:'block',marginBottom:2}}>{a.title}</strong><span style={{fontSize:'0.78rem',color:'#64748B'}}>{a.excerpt?.slice(0,60)}...</span></td>
                  <td><span className="status" style={{background:a.category_color+'20',color:a.category_color}}>{a.category}</span></td>
                  <td style={{whiteSpace:'nowrap'}}>{a.date}</td>
                  <td><span className={`status ${a.status==='published'?'status-active':'status-draft'}`}>{a.status==='published'?'● Published':'● Draft'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteItem(a)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editItem ? '✏️ Edit Artikel' : '📝 Tulis Artikel Baru'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Judul Artikel <span className="required">*</span></label>
                <input className="form-control" placeholder="Judul artikel yang menarik untuk SEO..." value={form.title} onChange={e => setForm(p => ({...p,title:e.target.value}))} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-control" value={form.category} onChange={e => {
                    const cat = CATEGORIES.find(c => c.label === e.target.value);
                    setForm(p => ({...p, category: e.target.value, category_color: cat?.color || '#3B82F6'}));
                  }}>
                    {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(p => ({...p,status:e.target.value}))}>
                    <option value="published">Published (Tampil)</option>
                    <option value="draft">Draft (Tersembunyi)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal</label>
                  <input className="form-control" placeholder="28 Mei 2025" value={form.date} onChange={e => setForm(p => ({...p,date:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimasi Baca</label>
                  <input className="form-control" placeholder="5 menit baca" value={form.read_time} onChange={e => setForm(p => ({...p,read_time:e.target.value}))} />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Foto Utama Artikel</label>
                  <ImageInput value={form.image} onChange={v => setForm(p => ({...p,image:v}))} type="car" />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Ringkasan / Excerpt</label>
                  <textarea className="form-control" placeholder="Ringkasan singkat artikel untuk preview di halaman blog..." value={form.excerpt} onChange={e => setForm(p => ({...p,excerpt:e.target.value}))} style={{minHeight:72}} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Konten Artikel (Teks + Gambar)</label>
                <div className="editor-tabs">
                  <div className={`editor-tab ${contentTab==='visual'?'active':''}`} onClick={() => setContentTab('visual')}>✏️ Visual Editor</div>
                  <div className={`editor-tab ${contentTab==='html'?'active':''}`} onClick={() => { setContentTab('html'); if(form.content) { /* sync */ }}}>{'</>'} HTML</div>
                </div>
                {contentTab === 'visual' ? (
                  <div className="rich-editor">
                    <div className="rich-toolbar">
                      {[['bold','B'],['italic','I'],['underline','U']].map(([c,l]) => (
                        <button key={c} type="button" className="rich-toolbar-btn" onClick={() => execCmd(c)} style={{fontStyle:c==='italic'?'italic':'',textDecoration:c==='underline'?'underline':''}}>{l}</button>
                      ))}
                      <span style={{width:1,background:'#E2E8F0',margin:'0 4px'}}></span>
                      <button type="button" className="rich-toolbar-btn" onClick={() => execCmd('formatBlock','h1')}>H1</button>
                      <button type="button" className="rich-toolbar-btn" onClick={() => execCmd('formatBlock','h2')}>H2</button>
                      <button type="button" className="rich-toolbar-btn" onClick={() => execCmd('formatBlock','p')}>P</button>
                      <span style={{width:1,background:'#E2E8F0',margin:'0 4px'}}></span>
                      <button type="button" className="rich-toolbar-btn" onClick={() => execCmd('insertUnorderedList')}>• List</button>
                      <button type="button" className="rich-toolbar-btn" onClick={insertImg}>🖼️</button>
                      <button type="button" className="rich-toolbar-btn" onClick={insertLink}>🔗</button>
                      <span style={{width:1,background:'#E2E8F0',margin:'0 4px'}}></span>
                      <button type="button" className="rich-toolbar-btn" style={{color:'#EF4444'}} onClick={() => execCmd('removeFormat')}>✕</button>
                    </div>
                    <div ref={contentRef} className="rich-content" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{__html: form.content || ''}} />
                  </div>
                ) : (
                  <textarea className="html-editor" value={form.content} onChange={e => setForm(p => ({...p,content:e.target.value}))} placeholder="<h1>Judul</h1><p>Isi artikel...</p><img src='url' />" />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn btn-success" onClick={() => { setForm(p=>({...p,status:'draft'})); setTimeout(handleSave,50); }}>Simpan Draft</button>
              <button className="btn btn-primary" onClick={handleSave}>🚀 Publish Artikel</button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-body">
              <div className="delete-confirm">
                <div className="delete-confirm-icon">🗑️</div>
                <h3>Hapus Artikel?</h3>
                <p>Anda yakin menghapus <strong>"{deleteItem.title?.slice(0,40)}..."</strong>?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteItem(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete}>🗑️ Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// MEDIA GALLERY
// ==============================
function MediaPage() {
  const [photos, setPhotos] = useState([
    { id:1, url:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80', label:'Geely Emgrand' },
    { id:2, url:'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&q=80', label:'Geely Coolray' },
    { id:3, url:'https://images.unsplash.com/photo-1610186591551-45f540e38f6b?w=400&q=80', label:'BYD Atto 3' },
    { id:4, url:'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80', label:'BYD Dolphin' },
    { id:5, url:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80', label:'BYD Seal' },
    { id:6, url:'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80', label:'Geely Okavango' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ url:'', label:'' });
  const handleAdd = () => {
    if (!newPhoto.url) { toast.error('URL/file foto wajib!'); return; }
    setPhotos(p => [...p, {...newPhoto, id: Date.now()}]);
    setNewPhoto({ url:'', label:'' }); setShowAdd(false);
    toast.success('Foto ditambahkan!');
  };
  return (
    <div>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Tambah Foto</button>
        <div style={{marginLeft:'auto',fontSize:'0.82rem',color:'#64748B'}}>{photos.length} foto tersimpan</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
        {photos.map(p => (
          <div key={p.id} className="card" style={{overflow:'hidden',position:'relative'}}>
            <img src={p.url} alt={p.label} style={{width:'100%',height:150,objectFit:'cover',display:'block'}} onError={e => e.target.style.opacity=0.3} />
            <div style={{padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'0.8rem',fontWeight:600,color:'#334155'}}>{p.label}</span>
              <button className="btn btn-danger btn-sm btn-icon" onClick={() => { setPhotos(pr => pr.filter(x => x.id !== p.id)); toast.success('Foto dihapus!'); }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header"><h2>🖼️ Tambah Foto</h2><button className="close-btn" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Foto (URL atau Upload)</label>
                <ImageInput value={newPhoto.url} onChange={v => setNewPhoto(p => ({...p,url:v}))} type="car" />
              </div>
              <div className="form-group">
                <label className="form-label">Label/Nama Foto</label>
                <input className="form-control" placeholder="cth: BYD Atto 3 - Eksterior" value={newPhoto.label} onChange={e => setNewPhoto(p => ({...p,label:e.target.value}))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleAdd}>💾 Simpan Foto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// HTML EDITOR
// ==============================
function HtmlEditorPage() {
  const [file, setFile] = useState('index.html');
  const [code, setCode] = useState('');
  const [tab, setTab] = useState('code');
  const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>AutoCar Indonesia</title>
  <!-- Edit meta SEO di sini -->
  <meta name="description" content="AutoCar Indonesia – One Stop Car Shopping" />
</head>
<body>
  <!-- Edit konten website di sini -->
  <!-- File ini dikelola melalui Admin Panel -->
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>`;
  useEffect(() => { setCode(SAMPLE_HTML); }, []);
  const handleSave = () => { toast.success(`File ${file} berhasil disimpan!`); };
  const handleFormat = () => {
    try {
      const lines = code.split('\n').map(l => l.trim()).filter(l => l);
      setCode(lines.join('\n'));
      toast.success('HTML diformat!');
    } catch(e) { toast.error('Format gagal'); }
  };
  return (
    <div>
      <div className="toolbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:'0.82rem',color:'#64748B'}}>File:</span>
          <select className="filter-select" value={file} onChange={e => setFile(e.target.value)}>
            <option value="index.html">index.html (Halaman Utama)</option>
            <option value="app.js">app.js (React App)</option>
            <option value="styles.css">styles.css (CSS)</option>
            <option value="admin.html">admin.html (Panel Admin)</option>
          </select>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:8}}>
          <button className="btn btn-ghost btn-sm" onClick={handleFormat}>🔧 Format</button>
          <button className="btn btn-success" onClick={handleSave}>💾 Simpan {file}</button>
        </div>
      </div>
      <div className="card">
        <div className="editor-tabs" style={{padding:'0 20px',borderBottom:'1px solid #E2E8F0'}}>
          <div className={`editor-tab ${tab==='code'?'active':''}`} onClick={() => setTab('code')}>{'</>'} Kode</div>
          <div className={`editor-tab ${tab==='preview'?'active':''}`} onClick={() => setTab('preview')}>👁️ Preview</div>
        </div>
        <div style={{padding:0}}>
          {tab === 'code' ? (
            <textarea className="html-editor" style={{minHeight:480,borderRadius:'0 0 12px 12px'}} value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
          ) : (
            <div className="html-preview" style={{minHeight:480,borderRadius:'0 0 12px 12px'}} dangerouslySetInnerHTML={{__html: code}} />
          )}
        </div>
      </div>
      <div style={{marginTop:12,padding:'12px 16px',background:'#FFFBEB',borderRadius:8,border:'1px solid #FDE68A',fontSize:'0.8rem',color:'#92400E'}}>
        ⚠️ <strong>Perhatian:</strong> Perubahan pada HTML Editor bersifat lokal. Untuk deploy, upload file ke hosting Anda. Selalu backup sebelum mengedit.
      </div>
    </div>
  );
}

// ==============================
// SETTINGS PAGE
// ==============================
function SettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'AutoCar Indonesia', site_desc: 'One Stop Car Shopping Terpercaya',
    wa_number: '087710208822', address: 'Jakarta, Indonesia',
    supabase_url: SUPABASE_URL, supabase_key: SUPABASE_KEY,
    seo_keywords: 'beli mobil, Geely Indonesia, BYD Indonesia, dealer mobil',
    google_analytics: '',
  });
  const handleSave = () => toast.success('Pengaturan berhasil disimpan!');
  return (
    <div>
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><div className="card-title">⚙️ Pengaturan Website</div></div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama Website</label>
              <input className="form-control" value={settings.site_name} onChange={e => setSettings(p=>({...p,site_name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp</label>
              <input className="form-control" placeholder="087710208822" value={settings.wa_number} onChange={e => setSettings(p=>({...p,wa_number:e.target.value}))} />
            </div>
            <div className="form-group form-full">
              <label className="form-label">Deskripsi Website (SEO)</label>
              <textarea className="form-control" value={settings.site_desc} onChange={e => setSettings(p=>({...p,site_desc:e.target.value}))} style={{minHeight:72}} />
            </div>
            <div className="form-group form-full">
              <label className="form-label">Kata Kunci SEO</label>
              <input className="form-control" value={settings.seo_keywords} onChange={e => setSettings(p=>({...p,seo_keywords:e.target.value}))} />
              <div className="form-hint">Pisahkan dengan koma. Penting untuk SEO Google.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat</label>
              <input className="form-control" value={settings.address} onChange={e => setSettings(p=>({...p,address:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input className="form-control" placeholder="G-XXXXXXXXXX" value={settings.google_analytics} onChange={e => setSettings(p=>({...p,google_analytics:e.target.value}))} />
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><div className="card-title">🗄️ Konfigurasi Supabase</div></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Supabase Project URL</label>
            <input className="form-control" placeholder="https://xxxx.supabase.co" value={settings.supabase_url} onChange={e => setSettings(p=>({...p,supabase_url:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Supabase Anon Key</label>
            <input className="form-control" type="password" placeholder="eyJhbG..." value={settings.supabase_key} onChange={e => setSettings(p=>({...p,supabase_key:e.target.value}))} />
            <div className="form-hint">Gunakan Anon/Public key. Jangan gunakan Service Role key di frontend!</div>
          </div>
          <div style={{padding:'12px 16px',background:'#EEF4FF',borderRadius:8,fontSize:'0.8rem',color:'#1D4ED8',marginBottom:8}}>
            💡 <strong>Setup Supabase:</strong> Buat tabel <code>brands</code>, <code>models</code>, dan <code>articles</code> di Supabase. Lihat file <code>supabase-setup.sql</code> untuk skema lengkap.
          </div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSave}>💾 Simpan Semua Pengaturan</button>
    </div>
  );
}

// ==============================
// MAIN ADMIN APP
// ==============================
function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('ac_admin'));
  const [page, setPage] = useState('dashboard');
  const [brands, setBrands] = useState(INIT_BRANDS);
  const [models, setModels] = useState(INIT_MODELS);
  const [articles, setArticles] = useState(INIT_ARTICLES);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: b }, { data: m }, { data: a }] = await Promise.all([
          sb.from('brands').select('*'),
          sb.from('models').select('*'),
          sb.from('articles').select('*'),
        ]);
        if (b?.length) setBrands(b);
        if (m?.length) setModels(m);
        if (a?.length) setArticles(a);
      } catch(e) {}
    };
    if (isLoggedIn) load();
  }, [isLoggedIn]);

  const handleLogout = () => { localStorage.removeItem('ac_admin'); setIsLoggedIn(false); };

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <Dashboard brands={brands} models={models} articles={articles} setPage={setPage} />;
      case 'brands': return <BrandsPage brands={brands} setBrands={setBrands} />;
      case 'models': return <ModelsPage models={models} setModels={setModels} brands={brands} />;
      case 'articles': return <ArticlesPage articles={articles} setArticles={setArticles} />;
      case 'media': return <MediaPage />;
      case 'htmleditor': return <HtmlEditorPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard brands={brands} models={models} articles={articles} setPage={setPage} />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar active={page} setActive={setPage} onLogout={handleLogout} />
      <div className="main-content">
        <Topbar page={page} />
        <div className="page-content">{renderPage()}</div>
      </div>
      <ToastContainer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
