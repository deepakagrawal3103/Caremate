import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  User, 
  Calendar, 
  Activity, 
  Droplets, 
  Scale, 
  Ruler,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    bloodGroup: '',
    weight: '',
    height: '',
    age: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    photoURL: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dob: user.dob || '',
        bloodGroup: user.bloodGroup || '',
        weight: user.weight || '',
        height: user.height || '',
        age: user.age || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      toast.success("Profile updated successfully");
      navigate('/settings');
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      <header className="px-6 py-4 flex items-center gap-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 text-[#0F4D4A]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Health Profile</h1>
      </header>

      <main className="p-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col items-center pb-6 border-b border-gray-50">
               <div className="relative group">
                 <div className="w-24 h-24 rounded-3xl bg-white border-4 border-[#F0FDFA] overflow-hidden shadow-md mb-4 relative">
                    <img 
                      src={formData.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Plus className="text-white w-8 h-8" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({...formData, photoURL: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                 </div>
                 {formData.photoURL && (
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, photoURL: ''})}
                     className="absolute -right-2 -top-2 bg-red-500 text-white p-1 rounded-full shadow-lg border-2 border-white hover:bg-red-600 transition-colors"
                   >
                     <X size={14} />
                   </button>
                 )}
               </div>
               <p className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Personal Identification</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Age</label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                      placeholder="Age"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Blood</label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-11 pr-3 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                      placeholder="B+"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Weight</label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-11 pr-3 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                      placeholder="kg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Height</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-11 pr-3 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                      placeholder="cm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50 space-y-4">
              <p className="text-[0.7rem] font-black text-[#B91C1C] uppercase tracking-widest">Emergency Contact</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Name</label>
                  <input 
                    type="text" 
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                    placeholder="e.g. John Doe (Son)"
                  />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Phone</label>
                  <input 
                    type="text" 
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F4D4A] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0F4D4A]/10 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : <><Save size={20} /> Save Health Profile</>}
          </button>
        </form>
      </main>
    </div>
  );
}
