import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell, Settings, Plus, ChevronLeft, ChevronRight, Sun, SunDim, Sunrise, Moon, Check,
  Search, ListFilter, Pill, ShieldCheck, Edit2, MoreVertical, AlertTriangle, AlertCircle,
  ArrowRight, ClipboardList, Syringe, X, Clock, Menu
} from "lucide-react";
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function MedicineManagement() {
  const navigate = useNavigate();
  const { openMobileMenu } = useMobileMenu();
  const { user, loading: authLoading } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('Medicines');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      toast.error("Failed to load medications");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMedStyles = (med) => {
    if (med.isAlert) return { color: "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]", icon: AlertTriangle };
    if (med.inventory < 5) return { color: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]", icon: AlertCircle };
    return { color: "bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]", icon: Pill };
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
    if (window.confirm("Are you sure you want to remove this medication?")) {
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
    setEditingMed({ 
      ...med, 
      schedule: med.schedule || ["08:00"] 
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await medicineAPI.updateMedicine(editingMed._id, editingMed);
      toast.success("Updated successfully");
      setIsEditModalOpen(false);
      loadMedications();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (loading || authLoading) return <Loader />;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Desktop ONLY */}
      <header className="hidden lg:flex px-4 lg:px-5 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[52px] overflow-hidden">
        <div className="flex gap-4 md:gap-8 h-full overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveSubTab('Overview')}
            className={`${activeSubTab === 'Overview' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('Medicines')}
            className={`${activeSubTab === 'Medicines' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Medicine Tracker
          </button>
          <button
            onClick={() => setActiveSubTab('Reminders')}
            className={`${activeSubTab === 'Reminders' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Manage Reminders
          </button>
        </div>

        <Link to="/profile" className="flex items-center gap-2 md:gap-3 md:pl-5 md:border-l border-gray-200 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-[0.85rem] font-bold text-gray-900 leading-tight">{user?.name || "Patient"}</p>
            <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Health Profile</p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
          </div>
        </Link>
      </header>

      <main className="px-4 lg:px-5 py-4 mx-auto max-w-[1200px] relative pb-20">
        {/* MOBILE VIEW */}
        <div className="lg:hidden space-y-6">
          <div className="flex items-center justify-between pt-2 mb-2">
            <button onClick={() => window.history.back()} className="p-1 text-[#0F4D4A]">
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
            <Link to="/emergency-mode" className="bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
              SOS
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-5">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={0} className="text-[#0F766E]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900 leading-none">100%</span>
                <span className="text-[0.6rem] font-bold text-gray-400 uppercase">Live</span>
              </div>
            </div>
            <div>
              <h3 className="text-[1.1rem] font-bold text-gray-900 mb-1">Medication Sync</h3>
              <p className="text-gray-500 text-[0.85rem] font-medium leading-snug">Everything is synchronized with your clinical profile.</p>
            </div>
          </div>

          <section>
            <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-[1.1rem] font-bold text-gray-900">Schedule</h2>
              <span className="text-[0.8rem] font-bold text-[#0F766E]">Today, Oct 24</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['Morning', 'Midday', 'Evening', 'Night'].map((time) => (
                <button
                  key={time}
                  className={`px-4 py-1.5 rounded-full text-[0.8rem] font-bold whitespace-nowrap transition-all ${
                    time === 'Morning' ? 'bg-[#0F766E] text-white shadow-sm' : 'bg-[#F1F5F9] text-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="space-y-3 mt-4">
              {medications.slice(0, 3).map((med) => (
                <div key={med._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
                       <Pill size={22} className="fill-[#0F766E]" />
                    </div>
                    <div>
                      <h4 className="text-[1rem] font-bold text-gray-900">{med.name}</h4>
                      <p className="text-[0.85rem] text-gray-500 font-medium">{med.strength} • {med.schedule?.[0] || "No time set"}</p>
                    </div>
                  </div>
                  <button onClick={() => handleLogDose(med)} className="w-10 h-10 rounded-full border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E]">
                    <Check size={20} strokeWidth={3} />
                  </button>
                </div>
              ))}
              {medications.length === 0 && <p className="text-center text-gray-400 py-4 italic">No schedule found.</p>}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-[1.1rem] font-bold text-gray-900">All Medicines</h2>
              <Link to="/medication-history" className="text-[0.8rem] font-bold text-[#0F766E]">History</Link>
            </div>
            <div className="space-y-3">
              {medications.length > 0 ? medications.map((med) => {
                const styles = getMedStyles(med);
                return (
                  <div key={med._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-[1.1rem] font-bold text-gray-900">{med.name}</h4>
                        <p className="text-[0.9rem] text-gray-500 font-medium">{med.strength} • {med.schedule?.join(", ")}</p>
                      </div>
                      <span className={`text-[0.65rem] font-black px-2.5 py-1 rounded uppercase tracking-widest border ${styles.color}`}>
                        {med.inventory < 5 ? "Low Stock" : "Safe"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">
                        <span>Inventory: {med.inventory} Units Left</span>
                        <span>{Math.round((med.inventory / 30) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${med.inventory < 5 ? 'bg-amber-500' : 'bg-[#0F766E]'}`} style={{ width: `${(med.inventory / 30) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                   <p className="text-gray-400 font-medium">No medications found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-[1.2rem] md:text-[1.4rem] font-bold text-gray-900 mb-0.5 leading-tight tracking-tight">Medicine Tracker</h1>
              <p className="text-gray-500 text-[0.85rem] font-medium">Manage prescriptions and schedule.</p>
            </div>
            <button
              onClick={() => navigate("/add-medicine")}
              className="w-full md:w-auto bg-[#0F766E] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-[0.85rem] font-bold flex items-center justify-center gap-2 shadow-sm transition-all min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add New
            </button>
          </div>

          {activeSubTab === 'Medicines' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm h-[260px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Adherence</h3>
                  <div className="relative w-36 h-36 mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="62" stroke="#E5E7EB" strokeWidth="14" fill="none" />
                      <circle cx="72" cy="72" r="62" stroke="#0F766E" strokeWidth="14" fill="none" strokeDasharray="389.5" strokeDashoffset={0} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <span className="text-[2.2rem] font-bold text-[#0F766E] leading-none tracking-tight">100%</span>
                      <span className="text-[0.65rem] font-bold text-gray-500 mt-1.5 uppercase tracking-widest">Optimized</span>
                    </div>
                  </div>
                  <p className="text-[0.9rem] font-medium text-gray-500 w-5/6 leading-relaxed">
                    Your medication sync is active. All {medications.length} records are synchronized with the clinical cloud.
                  </p>
                </div>

                <div className="lg:col-span-8 bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-[260px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Daily Schedule</h3>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[0.95rem] font-semibold text-gray-600">Today, Oct 24</span>
                      <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:h-[180px]">
                    {['Morning', 'Midday', 'Evening', 'Night'].map((timeLabel, idx) => {
                      const icons = [Sun, SunDim, Sunrise, Moon];
                      const colors = ['text-[#0F766E]', 'text-orange-500', 'text-indigo-800', 'text-indigo-600'];
                      const Icon = icons[idx];
                      const med = medications[idx]; 

                      return (
                        <div key={timeLabel} className="flex flex-col h-full">
                          <div className="flex items-center gap-1.5 mb-2 sm:mb-3 justify-center md:justify-center">
                            <Icon className={`w-4 h-4 ${colors[idx]}`} />
                            <span className={`text-[0.7rem] font-bold ${colors[idx]} uppercase tracking-widest`}>{timeLabel}</span>
                          </div>
                          <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                            {med ? (
                              <>
                                <h4 className="font-bold text-gray-900 text-[0.9rem] truncate w-full">{med.name}</h4>
                                <p className="text-[0.75rem] font-medium text-gray-500 mt-0.5 mb-3 md:mb-4 truncate w-full">{med.strength} • {med.schedule?.[0] || "Sch"}</p>
                                <button
                                  onClick={() => handleLogDose(med)}
                                  className="bg-[#0F766E] hover:bg-[#047857] text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-lg w-full transition-colors shadow-sm min-h-[40px]"
                                >
                                  Log
                                </button>
                              </>
                            ) : (
                              <p className="text-[0.7rem] font-bold text-gray-300 uppercase">No Task</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-8 overflow-hidden">
                <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                  <h3 className="text-lg font-bold text-gray-900">All My Medicines</h3>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[320px]">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-[0.9rem] font-medium text-gray-900 rounded-xl py-2.5 md:py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#0F766E] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-white">
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[25%]">Medication</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[15%]">Dosage</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[18%]">Status</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[17%]">Supply</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[25%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredMedications.map((med) => {
                        const styles = getMedStyles(med);
                        const Icon = styles.icon;
                        return (
                          <tr key={med._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${styles.color}`}>
                                  <Icon className="w-[1.2rem] h-[1.2rem] fill-current" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-[0.95rem] mb-0.5">{med.name}</p>
                                  <p className="text-[0.8rem] text-gray-500 font-medium">{med.category || "General"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <p className="font-bold text-gray-900 text-[0.9rem] mb-0.5">{med.strength}</p>
                              <p className="text-[0.8rem] text-gray-500 font-medium">{med.schedule?.join(", ")}</p>
                            </td>
                            <td className="py-3 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.75rem] font-bold border ${styles.color}`}>
                                {med.inventory < 5 ? "Refill Needed" : "Active"}
                              </span>
                            </td>
                            <td className="py-3 px-6">
                              <div className="flex justify-between items-end mb-1.5">
                                <span className="text-[0.75rem] font-bold text-gray-900">{med.inventory} Units</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                                <div className={`h-full ${med.inventory < 5 ? "bg-[#dc2626]" : "bg-[#0F766E]"} rounded-full`} style={{ width: `${(med.inventory / 30) * 100}%` }}></div>
                              </div>
                            </td>
                            <td className="py-5 px-8 relative text-right">
                              <div className="flex items-center justify-end gap-3.5 text-gray-400">
                                <button onClick={() => handleLogDose(med)} className="text-[#0F766E] hover:text-[#047857] text-[0.8rem] font-bold">Log Dose</button>
                                <button onClick={() => handleEditClick(med)} className="hover:text-gray-900 transition-colors"><Edit2 className="w-[18px] h-[18px]" /></button>
                                <button onClick={() => handleDelete(med._id)} className="hover:text-red-600 transition-colors"><X className="w-[18px] h-[18px]" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#0f4d45] to-[#146b60] text-white p-6 md:p-10 flex flex-col md:flex-row items-center shadow-md">
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-10 md:opacity-20 pointer-events-none overflow-hidden">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full transform scale-150 translate-x-10">
                    <circle cx="80" cy="50" r="40" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="80" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
                    <rect x="50" y="45" width="20" height="10" fill="none" stroke="white" strokeWidth="1" />
                    <text x="55" y="52" fill="white" fontSize="6" opacity="0.8" fontWeight="bold">WMH</text>
                  </svg>
                </div>
                <div className="relative z-10 w-full md:w-2/3 md:pl-2 text-center md:text-left">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-[0.6rem] md:text-[0.65rem] font-bold tracking-widest uppercase mb-4 md:mb-5">Clinical Tip</div>
                  <h2 className="text-[1.3rem] md:text-[1.6rem] font-bold mb-4 md:mb-5 leading-tight tracking-tight">Stay consistent with your routine for maximum efficacy.</h2>
                  <button className="font-bold flex items-center justify-center md:justify-start gap-2 text-[0.9rem] md:text-[0.95rem] hover:opacity-80 transition-opacity w-full md:w-auto">
                    Learn more about efficacy <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'Reminders' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Reminder Settings</h3>
                  <p className="text-gray-500 max-w-[300px] mx-auto">Configure notification preferences and alert sounds for your medications.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50">
          <button onClick={() => navigate("/add-medicine")} className="w-16 h-16 bg-[#0F766E] hover:bg-[#047857] rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <Plus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {isEditModalOpen && editingMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Edit Medication</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="p-6 md:p-8 space-y-5 md:space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Medication Name</label>
                  <input type="text" value={editingMed.name} onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900 text-[1rem]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Condition / Category</label>
                  <input type="text" value={editingMed.category} onChange={(e) => setEditingMed({ ...editingMed, category: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900 text-[1rem]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Dosage Value</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        value={editingMed.dosageValue || 1} 
                        onChange={(e) => setEditingMed({ ...editingMed, dosageValue: parseInt(e.target.value) })} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900" 
                      />
                    </div>
                    <div className="w-[100px] md:w-[120px]">
                      <select 
                        value={editingMed.form || "Tablet"} 
                        onChange={(e) => setEditingMed({ ...editingMed, form: e.target.value, category: e.target.value })} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Strength</label>
                    <input 
                      type="text" 
                      value={editingMed.strength || ""} 
                      onChange={(e) => setEditingMed({ ...editingMed, strength: e.target.value })} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Inventory Status</label>
                    <input 
                      type="number" 
                      value={editingMed.inventory || 0} 
                      onChange={(e) => setEditingMed({ ...editingMed, inventory: parseInt(e.target.value) })} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Schedule (24h)</label>
                    <button type="button" onClick={() => setEditingMed({ ...editingMed, schedule: [...editingMed.schedule, "12:00"] })} className="text-[#0F766E] text-[0.8rem] font-bold flex items-center gap-1 hover:underline">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Time
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editingMed.schedule || []).map((time, idx) => (
                      <div key={idx} className="relative group flex items-center gap-2">
                        <input type="time" value={time} onChange={(e) => { const newSchedule = [...editingMed.schedule]; newSchedule[idx] = e.target.value; setEditingMed({ ...editingMed, schedule: newSchedule }); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900" />
                        <button type="button" onClick={() => setEditingMed({...editingMed, schedule: editingMed.schedule.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-600">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl bg-[#0F766E] text-white font-bold hover:bg-[#0d6d65] transition-colors shadow-lg shadow-[#0F766E]/20">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
