import { Link } from 'react-router-dom';
import { UserPlus, Users, Settings } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Okul Yönetim Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Öğrenci Kayıt Kartı */}
        <Link to="/ogrenci-kayit" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UserPlus size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Öğrenci Kaydı</h3>
            <p className="text-gray-500 text-sm mt-2">Yeni öğrenci bilgilerini sisteme ekleyin.</p>
          </div>
        </Link>

        {/* Diğer Menüler (Örnek) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-50">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Öğrenci Listesi</h3>
          <p className="text-gray-500 text-sm mt-2">Kayıtlı öğrencileri görüntüle (Yakında).</p>
        </div>
      </div>
    </div>
  );
};