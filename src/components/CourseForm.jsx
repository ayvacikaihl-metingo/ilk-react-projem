import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, Save, ArrowLeft } from 'lucide-react';

const CourseForm = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({ course_name: '', teacher_name: '', course_code: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').insert([course]);
    if (!error) {
      alert("Kurs başarıyla eklendi!");
      navigate('/kurs-listesi');
    } else {
      alert("Hata: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-6 text-slate-800">
          <BookOpen className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold">Yeni Kurs Ekle</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Kurs Adı (Örn: Matematik)" required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setCourse({...course, course_name: e.target.value})}
          />
          <input 
            type="text" placeholder="Öğretmen Adı"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setCourse({...course, teacher_name: e.target.value})}
          />
          <input 
            type="text" placeholder="Kurs Kodu (Örn: MAT101)"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setCourse({...course, course_code: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
            <Save size={20} /> Kursu Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;