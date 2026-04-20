import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ogrenci-kayit" element={<StudentForm />} />
      </Routes>
    </Router>
  );
}
// --- 1. LOGIN BİLEŞENİ ---
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-6">{isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="E-posta" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white outline-none" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Şifre" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white outline-none" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
            {loading ? 'Bekleyiniz...' : (isSignUp ? 'Kaydol' : 'Giriş')}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-slate-400 text-sm underline">
          {isSignUp ? 'Giriş Yap' : 'Hesap Oluştur'}
        </button>
      </div>
    </div>
  )
}

// --- 2. URUNLER BİLEŞENİ ---
const Urunler = ({ user }) => {
  const [urunler, setUrunler] = useState([])
  const [ad, setAd] = useState('')
  const [fiyat, setFiyat] = useState('')
  const [duzenlenenId, setDuzenlenenId] = useState(null)
  const [aramaMetni, setAramaMetni] = useState('') // ARAMA STATE'İ BURADA OLMALI

  useEffect(() => { urunleriGetir() }, [])

  async function urunleriGetir() {
    const { data } = await supabase.from('urunler').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setUrunler(data || [])
  }

  const urunKaydet = async (e) => {
    e.preventDefault()
    if (duzenlenenId) {
      await supabase.from('urunler').update({ ad, fiyat }).eq('id', duzenlenenId)
      setDuzenlenenId(null)
    } else {
      await supabase.from('urunler').insert([{ ad, fiyat, user_id: user.id }])
    }
    setAd(''); setFiyat(''); urunleriGetir()
  }

  const sil = async (id) => {
    if (confirm("Silmek istediğine emin misin?")) {
      await supabase.from('urunler').delete().eq('id', id)
      urunleriGetir()
    }
  }

  // Filtreleme işlemini burada yapıyoruz
  const filtrelenmisUrunler = urunler.filter(u => 
    u.ad.toLowerCase().includes(aramaMetni.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
          <button onClick={() => supabase.auth.signOut()} className="bg-red-600 px-4 py-2 rounded-lg text-sm">Çıkış</button>
        </div>

        <form onSubmit={urunKaydet} className="flex gap-4 mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
          <input placeholder="Ürün Adı" value={ad} onChange={e => setAd(e.target.value)} className="flex-1 bg-slate-900 p-3 rounded-lg outline-none border border-slate-700" required />
          <input type="number" step="0.01" placeholder="Fiyat" value={fiyat} onChange={e => setFiyat(e.target.value)} className="w-32 bg-slate-900 p-3 rounded-lg outline-none border border-slate-700" required />
          <button type="submit" className="bg-emerald-600 px-6 py-3 rounded-lg font-bold">{duzenlenenId ? 'Güncelle' : 'Ekle'}</button>
        </form>

        {/* Arama Kutusu */}
        <input 
          type="text" 
          placeholder="Ürünlerde ara..." 
          className="w-full mb-6 bg-slate-800 p-3 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
        />

        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-4">Ürün</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisUrunler.map(u => (
                <tr key={u.id} className="border-t border-slate-700 hover:bg-slate-700/50 transition-all">
                  <td className="p-4">{u.ad}</td>
                  <td className="p-4 text-emerald-400 font-bold">{u.fiyat} TL</td>
                  <td className="p-4 text-right">
                    <button onClick={() => {setDuzenlenenId(u.id); setAd(u.ad); setFiyat(u.fiyat)}} className="text-blue-400 mr-4">Düzenle</button>
                    <button onClick={() => sil(u.id)} className="text-red-400">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- 3. ANA UYGULAMA ---
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
