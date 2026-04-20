import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Users, ArrowLeft, Trash2, Edit, Search, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Düzenleme Modali İçin State'ler
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });
    if (!error) setStudents(data);
  }

  async function deleteStudent(id) {
    if (window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (!error) fetchStudents();
    }
  }

  // DÜZENLEME MODALINI AÇ
  const openEditModal = (student) => {
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
  };

  // GÜNCELLEMEYİ KAYDET
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('students')
      .update({
        name: editingStudent.name,
        surname: editingStudent.surname,
        student_number: editingStudent.student_number,
        grade: editingStudent.grade,
        parent_phone: editingStudent.parent_phone
      })
      .eq('id', editingStudent.id);

    if (!error) {
      alert("Öğrenci başarıyla güncellendi!");
      setIsEditModalOpen(false);
      fetchStudents();
    } else {
      alert("Hata: " + error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.name} ${s.surname} ${s.student_number}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-600" size={36} /> Öğrenci Listesi
          </h2>
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
            <ArrowLeft size={20} /> Panele Dön
          </Link>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="İsim veya numara ile ara..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4">Öğrenci Bilgisi</th>
                <th className="p-4">Numara</th>
                <th className="p-4">Sınıf</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{s.name} {s.surname}</td>
                  <td className="p-4 text-slate-600">{s.student_number}</td>
                  <td className="p-4 text-slate-600">{s.grade}. Sınıf</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteStudent(s.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DÜZENLEME MODAL (AÇILIR PENCERE) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Öğrenci Bilgilerini Düzenle</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
                <input 
                  type="text" 
                  value={editingStudent.name} 
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
                <input 
                  type="text" 
                  value={editingStudent.surname} 
                  onChange={(e) => setEditingStudent({...editingStudent, surname: e.target.value})}
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Numara</label>
                  <input 
                    type="text" 
                    value={editingStudent.student_number} 
                    onChange={(e) => setEditingStudent({...editingStudent, student_number: e.target.value})}
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sınıf</label>
                  <input 
                    type="number" 
                    value={editingStudent.grade} 
                    onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;