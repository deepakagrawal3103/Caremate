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

const COMMON_DISEASES = [
  // Cardiovascular
  "Hypertension (High Blood Pressure)",
  "High Cholesterol (Hyperlipidemia)",
  "Heart Disease (CAD)",
  "Congestive Heart Failure (CHF)",
  "Atrial Fibrillation (Afib)",
  "Post-Stroke Recovery",
  
  // Metabolic & Endocrine
  "Type 2 Diabetes (High Sugar)",
  "Type 1 Diabetes",
  "Hypothyroidism",
  "Hyperthyroidism",
  "PCOS",
  "Vitamin D Deficiency",
  "Iron Deficiency (Anemia)",
  
  // Respiratory
  "Asthma",
  "COPD (Chronic Lung Disease)",
  "Sleep Apnea",
  "Seasonal Allergies",
  "Sinusitis",
  
  // Digestive
  "GERD (Acid Reflux)",
  "Gastritis",
  "Irritable Bowel Syndrome (IBS)",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Fatty Liver Disease",
  
  // Neurological & Mental Health
  "Migraine",
  "Epilepsy (Seizures)",
  "Alzheimer's / Dementia",
  "Parkinson's Disease",
  "Multiple Sclerosis (MS)",
  "Depression",
  "Anxiety Disorder",
  "Insomnia",
  "Bipolar Disorder",
  "PTSD",
  
  // Musculoskeletal & Others
  "Arthritis (Osteo/Rheumatoid)",
  "Osteoporosis",
  "Chronic Kidney Disease (CKD)",
  "Psoriasis",
  "Eczema",
  "Cancer (Active/Remission)",
  "HIV / AIDS"
];

const COMMON_ALLERGIES = [
  "Penicillin",
  "Peanuts",
  "Pollen",
  "Dust Mites",
  "Latex",
  "Shellfish",
  "Milk / Dairy",
  "Egg",
  "Soy",
  "Wheat"
];

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
    photoURL: '',
    diseases: [],
    allergies: []
  });
  const [currentDisease, setCurrentDisease] = useState("");
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);
  const [allergySuggestions, setAllergySuggestions] = useState([]);

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
        photoURL: user.photoURL || '',
        diseases: user.diseases || [],
        allergies: user.allergies || []
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
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <select 
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-11 pr-8 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20 appearance-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="Don't Know">Don't Know</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronLeft size={16} className="-rotate-90" />
                    </div>
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
              <p className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest">Chronic Conditions</p>
              <div className="relative">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentDisease}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentDisease(val);
                      if (val.trim()) {
                        setDiseaseSuggestions(COMMON_DISEASES.filter(d => d.toLowerCase().includes(val.toLowerCase())));
                      } else {
                        setDiseaseSuggestions([]);
                      }
                    }}
                    className="flex-1 bg-[#F8FAFC] border-none rounded-2xl py-3 px-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20 text-[0.9rem]"
                    placeholder="e.g. Hypertension"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (currentDisease.trim()) {
                        setFormData({...formData, diseases: [...formData.diseases, currentDisease.trim()]});
                        setCurrentDisease("");
                        setDiseaseSuggestions([]);
                      }
                    }}
                    className="bg-[#0F766E] text-white px-4 rounded-2xl font-bold text-[0.8rem]"
                  >Add</button>
                </div>
                
                {diseaseSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    {diseaseSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, diseases: [...formData.diseases, suggestion]});
                          setCurrentDisease("");
                          setDiseaseSuggestions([]);
                        }}
                        className="w-full text-left px-5 py-3 text-[0.85rem] font-bold text-gray-700 hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-colors border-b border-gray-50 last:border-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.diseases.map((d, i) => (
                  <span key={i} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[0.7rem] font-black uppercase flex items-center gap-2 border border-red-100">
                    {d}
                    <button type="button" onClick={() => setFormData({...formData, diseases: formData.diseases.filter((_, idx) => idx !== i)})}><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <p className="text-[0.7rem] font-black text-red-700 uppercase tracking-widest">Allergies</p>
              <div className="relative">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentAllergy}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentAllergy(val);
                      if (val.trim()) {
                        setAllergySuggestions(COMMON_ALLERGIES.filter(a => a.toLowerCase().includes(val.toLowerCase())));
                      } else {
                        setAllergySuggestions([]);
                      }
                    }}
                    className="flex-1 bg-[#F8FAFC] border-none rounded-2xl py-3 px-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#0F766E]/20 text-[0.9rem]"
                    placeholder="e.g. Penicillin"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (currentAllergy.trim()) {
                        setFormData({...formData, allergies: [...formData.allergies, currentAllergy.trim()]});
                        setCurrentAllergy("");
                        setAllergySuggestions([]);
                      }
                    }}
                    className="bg-red-600 text-white px-4 rounded-2xl font-bold text-[0.8rem]"
                  >Add</button>
                </div>

                {allergySuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    {allergySuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, allergies: [...formData.allergies, suggestion]});
                          setCurrentAllergy("");
                          setAllergySuggestions([]);
                        }}
                        className="w-full text-left px-5 py-3 text-[0.85rem] font-bold text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border-b border-gray-50 last:border-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((a, i) => (
                  <span key={i} className="bg-red-100 text-red-800 px-3 py-1.5 rounded-xl text-[0.7rem] font-black uppercase flex items-center gap-2 border border-red-200">
                    {a}
                    <button type="button" onClick={() => setFormData({...formData, allergies: formData.allergies.filter((_, idx) => idx !== i)})}><X size={12} /></button>
                  </span>
                ))}
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
