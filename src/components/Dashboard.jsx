import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserPlus, 
  PlusCircle, 
  LayoutDashboard 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Üst Başlık */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
          <LayoutDashboard className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ayvacık AİHL</h1>
          <p className="text-slate-500 font-medium">Okul Yönetim Sistemi Paneli</p>
        </div>
      </div>
      
      {/* Kart Izgarası */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. ÖĞRENCİ KAYIT */}
        <Link to="/ogrenci-kayit" className="group">
          <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <UserPlus size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Yeni Öğrenci</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">Sisteme yeni öğrenci kaydı yapın ve bilgilerini girin.</p>
          </div>
        </Link>

        {/* 2. ÖĞRENCİ LİSTESİ */}
        <Link to="/ogrenci-listesi" className="group">
          <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-500 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <Users size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Öğrenci Listesi</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">Kayıtlı öğrencileri görün, silin veya bilgilerini güncelleyin.</p>
          </div>
        </Link>

        {/* 3. KURS KAYIT */}
        <Link to="/kurs-kayit" className="group">
          <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-500 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <PlusCircle size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Yeni Kurs Ekle</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">Ders programına yeni kurslar ve öğretmenler tanımlayın.</p>
          </div>
        </Link>

        {/* 4. KURS LİSTESİ */}
        <Link to="/kurs-listesi" className="group">
          <div className="h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-500 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <BookOpen size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Kurs Yönetimi</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">Mevcut kursları listeleyin ve detayları düzenleyin.</p>
          </div>
        </Link>

      </div>

      {/* Gelecek Özellikler Bilgi Notu */}
      <div className="max-w-6xl mx-auto mt-12 p-4 bg-slate-800 rounded-xl flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-yellow-400" />
          <span className="text-sm font-medium">Not Sistemi Modülü Yakında Eklenecektir.</span>
        </div>
        <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300">v1.2</span>
      </div>
    </div>
  );
};

export default Dashboard;