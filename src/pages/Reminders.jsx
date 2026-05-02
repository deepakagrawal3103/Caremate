import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Settings,
  X as CloseIcon,
  Pill,
  Edit2,
  Trash2,
  Plus,
  Save,
  Trash
} from 'lucide-react';

export default function Reminders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [activeTab, setActiveTab] = useState('Reminders');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadMedications();
    }
  }, [user, authLoading]);

  const loadMedications = async () => {
    try {
      const { data } = await medicineAPI.getAllMedicines();
      setMedications(data.medicines);
    } catch (error) {
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogDose = async (med) => {
    try {
      const newInventory = Math.max(0, (med.inventory || 0) - (med.dosageValue || 1));
      await Promise.all([
        medicineAPI.updateMedicine(med._id, { inventory: newInventory }),
        medicationLogsAPI.logDose({
          medicineId: med._id,
          medicineName: med.name,
          dosage: med.strength,
          status: "Taken",
          type: med.category
        })
      ]);
      toast.success(`Dose for ${med.name} logged!`);
      loadMedications();
    } catch (error) {
      toast.error("Failed to log dose");
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Remove this medication?")) {
      try {
        await medicineAPI.deleteMedicine(id);
        toast.success("Medication removed");
        loadMedications();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleEditClick = (med) => {
    setEditingMed({ ...med });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await medicineAPI.updateMedicine(editingMed._id, editingMed);
      toast.success("Medication updated!");
      setIsEditModalOpen(false);
      loadMedications();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader /></div>;

  const lowStockNotifications = medications.filter(m => m.inventory < 5).map(m => ({
    id: m._id,
    type: 'warning',
    title: 'Low Stock Alert',
    message: `Your supply of ${m.name} is running low (${m.inventory} units remaining).`,
    time: 'System',
    icon: <Clock size={18} />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    medicine: m
  }));

  const systemNotifications = [
    {
      id: 'welcome',
      type: 'success',
      title: 'Profile Synchronized',
      message: `Your health profile is active and protected by MedSecure AI.`,
      time: 'Update',
      icon: <CheckCircle2 size={18} />,
      color: 'text-[#0F766E]',
      bg: 'bg-[#F0FDFA]'
    },
    ...lowStockNotifications
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-20 font-sans text-primary">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-lg bg-white border border-border text-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-lg leading-none">←</span>
          </button>
          <div>
            <h1 className="text-2xl font-sans text-gray-900 font-bold tracking-tight">Clinical Alerts</h1>
            <p className="text-[0.9rem] font-medium text-secondary">Manage tasks and system updates</p>
          </div>
        </div>

        <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
           <button 
             onClick={() => setActiveTab('Reminders')}
             className={`flex-1 py-2 text-[0.85rem] font-bold rounded-lg transition-all ${activeTab === 'Reminders' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Dose Reminders
           </button>
           <button 
             onClick={() => setActiveTab('Notifications')}
             className={`flex-1 py-2 text-[0.85rem] font-bold rounded-lg transition-all ${activeTab === 'Notifications' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Notifications ({systemNotifications.length})
           </button>
        </div>

        <div className="space-y-4 pb-12">
          {activeTab === 'Reminders' && medications.map((med) => (
            <div key={med._id} className="bg-white rounded-xl shadow-md p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center text-lg shrink-0">
                  💊
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Time to take {med.name}</h3>
                    <div className="flex gap-2 -mt-1">
                      <button 
                        onClick={() => handleEditClick(med)}
                        className="p-2 text-gray-400 hover:text-[#0F766E] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(med._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-[#0F766E] uppercase tracking-widest mt-0.5">
                    {med.strength} • {med.schedule?.join(" & ") || "As needed"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleLogDose(med)}
                  className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-[#0F766E] text-white hover:opacity-90 transition-opacity"
                >
                  Taken
                </button>
                <button 
                  onClick={() => toast.success("Snoozed for 15 mins")}
                  className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-white border border-gray-200 text-[#506071] hover:bg-gray-50 transition-colors"
                >
                  Snooze
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'Reminders' && medications.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-50">
              <div className="w-16 h-16 rounded-full bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center text-2xl mx-auto mb-4">
                ✨
              </div>
              <p className="text-[16px] font-bold text-gray-900">All caught up!</p>
              <p className="text-base font-medium text-secondary mt-1">No pending medication routines.</p>
            </div>
          )}

          {activeTab === 'Notifications' && systemNotifications.map((n) => (
            <div key={n.id} className="bg-white rounded-xl shadow-sm border border-gray-50 p-5 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className={`w-10 h-10 rounded-xl ${n.bg} ${n.color} flex items-center justify-center shrink-0`}>
                {n.icon}
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[0.95rem] font-bold text-gray-900 leading-tight">{n.title}</h3>
                    <span className="text-[0.65rem] font-bold text-gray-400 uppercase">{n.time}</span>
                 </div>
                 <p className="text-[0.85rem] text-gray-500 font-medium leading-relaxed mb-3">
                   {n.message}
                 </p>
                 <div className="flex gap-4">
                    <button className="text-[0.75rem] font-bold text-[#0F766E] hover:underline">Dismiss</button>
                    {n.medicine && (
                      <button 
                        onClick={() => handleEditClick(n.medicine)}
                        className="text-[0.75rem] font-bold text-[#0F766E] hover:underline"
                      >
                        Refill / Manage
                      </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editingMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-[450px] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Reminder</h3>
                  <p className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">Adjust clinical details</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Medicine Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={editingMed.name} 
                      onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })} 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0F4D4A]/10 focus:bg-white rounded-2xl px-5 py-3.5 font-bold text-[#0F4D4A] outline-none transition-all" 
                    />
                    <Pill className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Strength</label>
                    <input 
                      type="text" 
                      value={editingMed.strength} 
                      onChange={(e) => setEditingMed({ ...editingMed, strength: e.target.value })} 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0F4D4A]/10 focus:bg-white rounded-2xl px-5 py-3.5 font-bold text-[#0F4D4A] outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Dosage Unit</label>
                    <input 
                      type="number" 
                      value={editingMed.dosageValue} 
                      onChange={(e) => setEditingMed({ ...editingMed, dosageValue: parseFloat(e.target.value) })} 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0F4D4A]/10 focus:bg-white rounded-2xl px-5 py-3.5 font-bold text-[#0F4D4A] outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Frequency</label>
                  <div className="flex flex-wrap gap-2">
                    {['Morning', 'Midday', 'Night'].map((time) => {
                      const isSelected = editingMed.schedule?.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            const newSchedule = isSelected
                              ? editingMed.schedule.filter(s => s !== time)
                              : [...(editingMed.schedule || []), time];
                            setEditingMed({ ...editingMed, schedule: newSchedule });
                          }}
                          className={`px-4 py-2 rounded-xl text-[0.8rem] font-bold transition-all ${
                            isSelected 
                              ? 'bg-[#0F4D4A] text-white shadow-lg shadow-[#0F4D4A]/20' 
                              : 'bg-gray-50 text-gray-400 border-2 border-transparent'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Stock Inventory</label>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border-2 border-transparent focus-within:border-[#0F4D4A]/10 focus-within:bg-white transition-all">
                    <button 
                      type="button"
                      onClick={() => setEditingMed({...editingMed, inventory: Math.max(0, editingMed.inventory - 1)})}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 active:scale-90"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={editingMed.inventory} 
                      onChange={(e) => setEditingMed({ ...editingMed, inventory: parseInt(e.target.value) || 0 })} 
                      className="flex-1 bg-transparent border-none text-center font-black text-[#0F4D4A] outline-none" 
                    />
                    <button 
                      type="button"
                      onClick={() => setEditingMed({...editingMed, inventory: editingMed.inventory + 1})}
                      className="w-10 h-10 rounded-xl bg-[#0F4D4A] shadow-lg shadow-[#0F4D4A]/20 flex items-center justify-center text-white active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-400 uppercase tracking-widest text-[0.8rem] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[1.5] py-4 rounded-2xl bg-[#0F4D4A] text-white font-black uppercase tracking-widest text-[0.8rem] shadow-xl shadow-[#0F4D4A]/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
