import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Bunu ekle
import { supabase } from '../supabaseClient';
import { UserPlus, Save, X } from 'lucide-react';

const StudentForm = () => {
  const navigate = useNavigate(); // 2. Yönlendirme fonksiyonunu tanımla
  const [student, setStudent] = useState({
    name: '',
    surname: '',
    studentNumber: '',
    grade: '',
    parentPhone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('students')
        .insert([
          { 
            name: student.name, 
            surname: student.surname, 
            student_number: student.studentNumber, 
            grade: student.grade, 
            parent_phone: student.parentPhone 
          }
        ]);

      if (error) throw error;

      alert("Öğrenci başarıyla kaydedildi!");
      
      // 3. Başarılı kayıttan sonra liste sayfasına git
      navigate('/ogrenci-listesi'); 

    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  // ... (Geri kalan form kodları aynı)
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <UserPlus className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Yeni Öğrenci Kaydı</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adı</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Örn: Ahmet"
            onChange={(e) => setStudent({...student, name: e.target.value})}
          />
        </div>

        {/* Soyadı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soyadı</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Örn: Yılmaz"
            onChange={(e) => setStudent({...student, surname: e.target.value})}
          />
        </div>

        {/* Okul Numarası */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci No</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Örn: 1234"
            onChange={(e) => setStudent({...student, studentNumber: e.target.value})}
          />
        </div>

        {/* Sınıf Seçimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
          <select 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setStudent({...student, grade: e.target.value})}
          >
            <option value="">Sınıf Seçiniz</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
          </select>
        </div>

        {/* Veli Telefon */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Veli Telefon Numarası</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="0 (5xx) xxx xx xx"
            onChange={(e) => setStudent({...student, parentPhone: e.target.value})}
          />
        </div>

        {/* Butonlar */}
        <div className="md:col-span-2 flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Save size={20} /> Kaydet
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <X size={20} /> Temizle
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;