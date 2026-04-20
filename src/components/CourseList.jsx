import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { BookOpen, Search, Edit, Trash2, ArrowLeft, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => { fetchCourses(); }, []);

  async function fetchCourses() {
    const { data } = await supabase.from('courses').select('*').order('course_name');
    setCourses(data || []);
  }

  async function deleteCourse(id) {
    if (window.confirm("Bu kursu silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) fetchCourses();
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase.from('courses').update(editingCourse).eq('id', editingCourse.id);
    if (!error) {
      setIsEditModalOpen(false);
      fetchCourses();
    }
  }

  const filtered = courses.filter(c => c.course_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32} /> Kurs Yönetimi
          </h2>
          <Link to="/dashboard" className="text-slate-600 flex items-center gap-2"><ArrowLeft size={20}/> Geri</Link>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Kurs ara..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4">Kurs Adı</th>
                <th className="p-4">Öğretmen</th>
                <th className="p-4">Kod</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/50">
                  <td className="p-4 font-medium">{c.course_name}</td>
                  <td className="p-4">{c.teacher_name}</td>
                  <td className="p-4">{c.course_code}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setEditingCourse(c); setIsEditModalOpen(true); }} className="text-blue-600 p-2 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button>
                    <button onClick={() => deleteCourse(c.id)} className="text-red-600 p-2 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme Modali */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Kursu Düzenle</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input 
                value={editingCourse.course_name} 
                onChange={e => setEditingCourse({...editingCourse, course_name: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
              <input 
                value={editingCourse.teacher_name} 
                onChange={e => setEditingCourse({...editingCourse, teacher_name: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                <Save size={18}/> Güncelle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;