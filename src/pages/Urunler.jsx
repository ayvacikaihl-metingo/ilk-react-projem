import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
const [aramaMetni, setAramaMetni] = useState('');
// --- 1. GİRİŞ SAYFASI BİLEŞENİ ---
const Login = ({ setSession }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) alert(error.message)
    else if (isSignUp) alert("Kayıt başarılı! Giriş yapabilirsiniz.")
  }

  return (
    <div style={containerStyle}>
      <h1>{isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="email" placeholder="E-posta" onChange={e => setEmail(e.target.value)} style={inputStyle} required />
        <input type="password" placeholder="Şifre" onChange={e => setPassword(e.target.value)} style={inputStyle} required />
        <button type="submit" style={mainButtonStyle}>{isSignUp ? 'Kaydol' : 'Giriş'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} style={linkButtonStyle}>
        {isSignUp ? 'Zaten hesabım var' : 'Hesabım yok, kayıt ol'}
      </button>
    </div>
  )
}

// --- 2. ÜRÜNLER SAYFASI BİLEŞENİ ---
const Urunler = ({ user }) => {
  const [urunler, setUrunler] = useState([])
  const [ad, setAd] = useState('')
  const [fiyat, setFiyat] = useState('')
  const [duzenlenenId, setDuzenlenenId] = useState(null)

  useEffect(() => { urunleriGetir() }, [])

  async function urunleriGetir() {
    const { data } = await supabase.from('urunler').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setUrunler(data || [])
  }

  const urunKaydet = async (e) => {
  e.preventDefault();
  console.log("Kayıt işlemi başladı..."); // Konsola yazdır

  const veri = { ad, fiyat, user_id: user.id };
  
  let result;
  if (duzenlenenId) {
    result = await supabase.from('urunler').update({ ad, fiyat }).eq('id', duzenlenenId);
  } else {
    result = await supabase.from('urunler').insert([veri]);
  }

  const { error } = result;

  if (error) {
    console.error("Supabase Hatası:", error);
    alert("Veritabanı Hatası: " + error.message); // Hatayı ekrana bas
  } else {
    console.log("Başarıyla kaydedildi!");
    setAd(''); setFiyat(''); urunleriGetir();
  }
};

  const duzenleModunaGec = (u) => {
    setDuzenlenenId(u.id); setAd(u.ad); setFiyat(u.fiyat)
  }
{/* Arama Kutusu */}
<div className="mb-6">
  <div className="relative">
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
      🔍
    </span>
    <input 
      type="text"
      placeholder="Ürün adı ile ara..."
      value={aramaMetni}
      onChange={(e) => setAramaMetni(e.target.value)}
      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
    />
  </div>
</div>
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Ürün Paneli</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ background: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>Çıkış</button>
      </div>

      <form onSubmit={urunKaydet} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input placeholder="Ürün Adı" value={ad} onChange={e => setAd(e.target.value)} style={inputStyle} required />
        <input type="number" placeholder="Fiyat" value={fiyat} onChange={e => setFiyat(e.target.value)} style={inputStyle} required />
        <button type="submit" style={{ ...mainButtonStyle, width: '150px' }}>{duzenlenenId ? 'Güncelle' : 'Ekle'}</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#444' }}>
            <th style={tdStyle}>Ürün Adı</th>
            <th style={tdStyle}>Fiyat</th>
            <th style={tdStyle}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {urunler.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #555' }}>
              <td style={tdStyle}>{u.ad}</td>
              <td style={tdStyle}>{u.fiyat} TL</td>
              <td style={tdStyle}>
                <button onClick={() => duzenleModunaGec(u)} style={{ marginRight: '10px' }}>Düleznle</button>
                <button onClick={() => sil(u.id)} style={{ color: 'red' }}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- 3. ANA UYGULAMA MANTIĞI ---
export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={!session ? <Login /> : <Navigate to="/urunler" />} />
        <Route path="/urunler" element={session ? <Urunler user={session.user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

// --- STİLLER ---
const containerStyle = { textAlign: 'center', marginTop: '100px', color: 'white' }
const formStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }
const inputStyle = { padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white' }
const mainButtonStyle = { padding: '10px 20px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
const linkButtonStyle = { background: 'none', border: 'none', color: '#1e90ff', textDecoration: 'underline', marginTop: '15px', cursor: 'pointer' }
const tdStyle = { padding: '12px', textAlign: 'left' }