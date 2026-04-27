import { useAuth } from "../context/AuthContext";
import { useMobileMenu } from "../context/MobileMenuContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { vitalsAPI } from "../features/vitals/vitalsAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, Search, Plus, ShieldCheck, Clock, Pill, Activity, Heart, Wind, Edit2, Menu, AlertTriangle, Calendar, Check } from "lucide-react";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { openMobileMenu } = useMobileMenu();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Weekly");
  const [medicines, setMedicines] = useState([]);
  const [vitals, setVitals] = useState({ hr: 72, spo2: 98 });
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [safetyScore, setSafetyScore] = useState(92);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
      fetchVitalsHistory();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchVitalsHistory = async () => {
    try {
      const history = await vitalsAPI.getVitalsHistory("manual", 7);
      setVitalsHistory(history);
    } catch (e) {
      console.error("History fetch error:", e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [medsRes, latestVitals] = await Promise.all([
        medicineAPI.getAllMedicines(),
        vitalsAPI.getLatestVitals()
      ]);
      setMedicines(medsRes.data.medicines);
      if (latestVitals) {
        setVitals({ hr: latestVitals.hr, spo2: latestVitals.spo2 });
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medicines.length > 0 || vitals.hr) {
      calculateSafetyScore();
    }
  }, [medicines, vitals]);

  const calculateSafetyScore = () => {
    let score = 100;
    medicines.forEach(m => {
      if (m.interactionStatus === 'danger') score -= 15;
      if (m.interactionStatus === 'warning') score -= 5;
    });
    if (vitals.hr < 60 || vitals.hr > 100) score -= 10;
    if (vitals.spo2 < 95) score -= 15;
    setSafetyScore(Math.max(0, score));
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) return <Loader />;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Desktop ONLY */}
      <header className="hidden lg:flex px-4 lg:px-5 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[52px] overflow-hidden">
        <div className="relative flex-1 max-w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#E5E7EB] border-transparent text-[0.85rem] text-gray-900 rounded-lg py-1.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Bell className="w-[18px] h-[18px]" fill="currentColor" />
          </Link>
          <Link to="/settings" className="hidden sm:block text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Settings className="w-[18px] h-[18px]" fill="currentColor" />
          </Link>
          <Link to="/profile" className="flex items-center gap-2 md:gap-3 md:pl-5 md:border-l border-gray-200 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-[0.85rem] font-bold text-gray-900 leading-tight">{user?.name || "Patient"}</p>
              <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Health Profile</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-gray-50">
              <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </header>

      <main className="px-4 lg:px-5 py-4 mx-auto max-w-[1200px] w-full">
        {user?.inEmergency && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <AlertTriangle size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-xl font-black text-red-800 uppercase">Emergency Mode Active</h2>
                <p className="text-red-600 font-bold text-[0.85rem]">Responders have been notified. Your profile is now public.</p>
              </div>
            </div>
            <Link to="/emergency-mode" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all text-center">
              Manage SOS
            </Link>
          </div>
        )}

        {/* MOBILE VIEW */}
        <div className="lg:hidden space-y-5 pb-24 px-4 bg-[#F8FAFC]">
          <div className="flex items-center justify-between pt-2">
            <button onClick={openMobileMenu} className="p-1 text-[#0F4D4A]">
              <Menu size={24} />
            </button>
            <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
            <Link to="/emergency-mode" className="bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">SOS</Link>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
            <Link to="/profile" className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-[#F0FDFA] shrink-0 shadow-sm">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Patient Profile</p>
                <h2 className="text-[1.5rem] font-black text-[#0F4D4A] leading-none">{user?.name || "Guest User"}</h2>
                <div className="flex gap-2 mt-2">
                   <span className="bg-[#E0F2FE] text-[#0369A1] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">{user?.age || "--"} Years</span>
                   <span className="bg-[#FEF9C3] text-[#854D0E] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">{user?.bloodGroup || "B+"}</span>
                </div>
              </div>
            </Link>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
               <div className="text-center">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Height</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">{user?.height || "--"} cm</p>
               </div>
               <div className="text-center border-x border-gray-100">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">{user?.weight || "--"} kg</p>
               </div>
               <div className="text-center">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">BMI</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">
                    {user?.height && user?.weight ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : "--"}
                  </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F4D4A] rounded-[2rem] p-5 text-white shadow-lg shadow-[#0F4D4A]/20">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-60 mb-2">SAFETY SCORE</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black">{safetyScore}</span>
                <span className="text-[0.9rem] font-bold opacity-60">/100</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#52DFBB] rounded-full transition-all duration-1000" style={{ width: `${safetyScore}%` }}></div>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-2">NEXT DOSE</p>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F4D4A]">
                   <Clock size={18} />
                </div>
                <span className="text-[1.1rem] font-black text-[#0F4D4A] truncate">{medicines[0]?.schedule?.[0] || "--:--"}</span>
              </div>
              <p className="text-[0.7rem] text-gray-400 font-bold uppercase tracking-widest truncate">{medicines[0]?.name || "Schedule"}</p>
            </div>
          </div>

          <section>
            <h3 className="text-[1.1rem] font-black text-[#0F4D4A] mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {filteredMedicines.length > 0 ? filteredMedicines.slice(0, 3).map((med, i) => (
                <div key={med._id} className="bg-white border border-gray-100 rounded-[1.8rem] p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${i === 0 ? 'bg-[#52DFBB]' : 'bg-gray-200'}`}></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F0FDFA] rounded-2xl flex flex-col items-center justify-center text-[#0F4D4A]">
                      <span className="text-[1rem] font-black leading-none">{med.schedule?.[0]?.split(':')[0] || "12"}</span>
                      <span className="text-[0.6rem] font-black uppercase opacity-60">{med.schedule?.[0]?.includes('PM') ? 'PM' : 'AM'}</span>
                    </div>
                    <div>
                      <h4 className="text-[1.05rem] font-black text-[#0F4D4A]">{med.name}</h4>
                      <p className="text-[0.85rem] text-gray-400 font-bold">{med.strength}</p>
                    </div>
                  </div>
                  <button className="bg-[#0F4D4A] text-white px-5 py-2.5 rounded-xl text-[0.85rem] font-black shadow-lg shadow-[#0F4D4A]/10">LOG</button>
                </div>
              )) : (
                <p className="text-gray-400 italic text-center py-4">No medications found.</p>
              )}
            </div>
          </section>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          <div className="bg-[#fdeceb] border border-[#facccb] rounded-xl p-3 flex items-center justify-between mb-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#b91c1c] flex items-center justify-center text-white shrink-0 mt-0.5">!</div>
              <div>
                <h4 className="text-[#991b1b] font-semibold text-[0.85rem]">Clinical Alert</h4>
                <p className="text-[#b91c1c] text-[0.8rem] font-medium leading-tight">Attention required for latest adherence data.</p>
              </div>
            </div>
            <Link to="/risk-analysis" className="bg-[#b91c1c] text-white px-4 py-1.5 rounded-lg text-[0.8rem] font-semibold">Review</Link>
          </div>

          <section className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden h-[220px]">
              <div className="absolute top-5 right-5 text-gray-100">
                <ShieldCheck size={100} strokeWidth={1} />
              </div>
              <div className="relative">
                <h3 className="text-[1.1rem] font-bold text-gray-900 mb-1">Patient Safety Score</h3>
                <p className="text-gray-500 text-[0.85rem] font-medium w-3/4 leading-tight">Overall health score based on real-time adherence and vitals.</p>
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-[3.5rem] font-bold text-[#0F766E] leading-none">{safetyScore}</span>
                <span className="text-[1.4rem] text-gray-400 font-bold">/100</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-[220px]">
              <h3 className="text-[1rem] font-bold text-gray-900 mb-3">Upcoming Doses</h3>
              <div className="flex-1 overflow-y-auto space-y-4">
                {filteredMedicines.slice(0, 3).map((med, idx) => (
                  <div key={med._id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#0F766E]' : 'bg-gray-300'}`}></div>
                    <div>
                       <p className="text-[0.85rem] font-bold text-gray-900 leading-none">{med.schedule?.[0]}</p>
                       <p className="text-[0.75rem] text-[#0F766E] font-medium">{med.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-[1rem] font-bold text-gray-900">Active Medications</h3>
              <Link to="/medication-history" className="text-[0.8rem] font-bold text-[#0F766E]">History →</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {filteredMedicines.slice(0, 3).map((med) => (
                <div key={med._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-[140px]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                      <Pill size={16} />
                    </div>
                    <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.7rem] font-bold px-2 py-0.5 rounded">Active</span>
                  </div>
                  <h4 className="text-gray-900 font-bold text-[0.9rem] truncate">{med.name}</h4>
                  <p className="text-gray-500 text-[0.75rem] font-medium">{med.strength}</p>
                </div>
              ))}
              <Link to="/add-medicine" className="rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-[140px] text-gray-400 hover:bg-white transition-colors">
                <Plus size={20} className="mb-1" />
                <span className="text-[0.8rem] font-medium">Add New</span>
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6 pb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[1.1rem] font-bold text-gray-900">Patient Vitals</h3>
                <Link to="/add-vitals" className="text-[0.8rem] font-bold text-[#0F766E] flex items-center gap-1">
                   <Plus size={14} /> Add
                </Link>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Heart Rate</span>
                  <Heart className="w-4 h-4 text-[#dc2626] fill-[#dc2626]" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-gray-900">{vitals.hr || "--"}</span>
                  <span className="text-xs font-bold text-gray-400">BPM</span>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">SPO2</span>
                  <Wind className="w-4 h-4 text-[#0F766E]" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-gray-900">{vitals.spo2}</span>
                  <span className="text-xs font-bold text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[1.1rem] font-bold text-gray-900">Safety Trends</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["Daily", "Weekly"].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between gap-4 h-[120px] px-2">
                {vitalsHistory.length > 0 ? vitalsHistory.slice(0, 7).reverse().map((h, i) => (
                  <div key={i} className="flex-1 bg-[#F0FDFA] rounded-t-sm relative group cursor-pointer" style={{ height: `${(h.hr / 150) * 100}%` }}>
                    <div className="absolute inset-0 bg-[#0F766E] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm"></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[0.6rem] font-bold text-[#0F766E] transition-opacity">
                      {h.hr}
                    </div>
                  </div>
                )) : (
                  [...Array(7)].map((_, i) => {
                    const val = 60 + Math.floor(Math.random() * 20) + (vitals.hr - 72);
                    return (
                      <div key={i} className="flex-1 bg-gray-50 rounded-t-sm relative" style={{ height: `${Math.min(100, Math.max(10, (val / 120) * 100))}%` }}></div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}