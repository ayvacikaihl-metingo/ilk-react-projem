import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';

// --- 1. LOGIN BİLEŞENİ ---
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-6">{isSignUp ? 'Kayıt Ol' : 'Ayvacık AİHL Giriş'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="E-posta" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white outline-none focus:border-blue-500" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Şifre" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white outline-none focus:border-blue-500" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
            {loading ? 'Bekleyiniz...' : (isSignUp ? 'Kaydol' : 'Giriş')}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-slate-400 text-sm underline">
          {isSignUp ? 'Giriş Yap' : 'Hesap Oluştur'}
        </button>
      </div>
    </div>
  );
};

// --- 2. ANA UYGULAMA ---
export default function App() {
  const [session, setSession] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Yükleniyor durumu ekledik

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsInitialLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sayfa ilk açılırken Supabase'den cevap gelene kadar beyaz sayfa kalmasın diye:
  if (isInitialLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard user={session.user} /> : <Navigate to="/" />} />
        <Route path="/ogrenci-kayit" element={session ? <StudentForm /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
        // App.jsx içinde Routes kısmına ekle:
      <Route path="/ogrenci-listesi" element={session ? <StudentList /> : <Navigate to="/" />} />
      <Route path="/kurs-kayit" element={session ? <CourseForm /> : <Navigate to="/" />} />
      <Route path="/kurs-listesi" element={session ? <CourseList /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}