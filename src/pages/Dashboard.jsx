import { useAuth } from "../context/AuthContext";
import { useMobileMenu } from "../context/MobileMenuContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { vitalsAPI } from "../features/vitals/vitalsAPI";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";
import { aiService, AI_MODELS } from "../services/ai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, Search, Plus, ShieldCheck, Clock, Pill, Activity, Heart, Wind, Edit2, Menu, AlertTriangle, Calendar, Check, CheckCircle2, XCircle } from "lucide-react";
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
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [behaviorPrediction, setBehaviorPrediction] = useState(null);

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
      const medsRes = await medicineAPI.getAllMedicines().catch(e => {
        console.error("Meds fetch error:", e);
        return { data: { medicines: [] } };
      });
      setMedicines(medsRes.data.medicines);

      const latestVitals = await vitalsAPI.getLatestVitals().catch(e => {
        console.error("Vitals fetch error:", e);
        return null;
      });
      if (latestVitals) {
        setVitals({ hr: latestVitals.hr, spo2: latestVitals.spo2 });
      }

      const logsRes = await medicationLogsAPI.getLogs(20).catch(e => {
        console.error("Logs fetch error:", e);
        return { data: { logs: [] } };
      });
      const doseLogs = logsRes.data.logs;
      setLogs(doseLogs);

      // Run Behavior Prediction AI
      if (doseLogs.length > 0) {
        const prediction = await aiService.askAI(
          "Predict the patient's medication adherence behavior based on these logs.",
          JSON.stringify(doseLogs),
          AI_MODELS.BEHAVIOR_PREDICTOR
        );
        setBehaviorPrediction(prediction);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medicines.length >= 0) {
      generateAlerts();
    }
  }, [medicines, logs]);

  const generateAlerts = async () => {
    const newAlerts = [];

    // 1. Dangerous Drug Interactions
    const interactionAlerts = medicines
      .filter(m => m.interactionStatus === 'danger' || m.interactionStatus === 'warning')
      .map(m => {
        const details = m.interactions?.[0];
        const type = details?.type === 'condition' ? 'Condition Conflict' : 'Drug Interaction';
        const target = details?.target || 'Multiple Factors';
        
        return {
          id: `inter-${m._id}`,
          type: m.interactionStatus === 'danger' ? 'danger' : 'warning',
          title: `AI Safety Alert: ${m.name}`,
          message: `${type} with ${target}: ${details?.effect || 'Consult doctor immediately.'}`,
          icon: AlertTriangle,
          link: '/risk-analysis'
        };
      });
      newAlerts.push(...interactionAlerts);
      
    // 1b. Missing AI Analysis Alert
    const unanalyzedMeds = medicines.filter(m => !m.interactionStatus);
    if (unanalyzedMeds.length > 0) {
      newAlerts.push({
        id: 'missing-ai',
        type: 'info',
        title: 'Safety Analysis Required',
        message: `${unanalyzedMeds.length} new medication(s) need AI interaction scanning.`,
        link: '/add-medicine',
        icon: ShieldCheck
      });
    }

    // 2. Missed Doses (Today)
    const today = new Date().toDateString();
    const missedToday = logs.filter(l => l.status === 'Missed' && new Date(l.timestamp).toDateString() === today);
    if (missedToday.length > 0) {
      newAlerts.push({
        type: 'warning',
        title: 'Missed Dose',
        message: `You missed a dose of ${missedToday[0].medicineName} today.`,
        link: '/medication-history'
      });
    }

    // 3. Low Stock
    const lowStockMeds = medicines.filter(m => m.inventory <= 5);
    if (lowStockMeds.length > 0) {
      newAlerts.push({
        type: 'info',
        title: 'Low Stock',
        message: `${lowStockMeds[0].name} is running low (${lowStockMeds[0].inventory} left).`,
        link: '/medication-history'
      });
    }

    // 4. Expiring Medicine (Using duration as proxy since expiryDate is not in schema yet)
    // Or if we have expiryDate
    const expiringMeds = medicines.filter(m => m.expiryDate && new Date(m.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    if (expiringMeds.length > 0) {
      newAlerts.push({
        type: 'warning',
        title: 'Medicine Expiring',
        message: `${expiringMeds[0].name} is expiring soon.`,
        link: '/medication-history'
      });
    }

    const rankedAlerts = await aiService.askAI(
      "Rank these clinical alerts by medical priority.",
      JSON.stringify(newAlerts),
      AI_MODELS.ALERT_RANKER
    );
    
    setAlerts(Array.isArray(rankedAlerts) ? rankedAlerts : newAlerts);
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

  const dailyTimeline = medicines.flatMap(med => 
    (med.schedule || []).map(time => ({
      time,
      medicineName: med.name,
      strength: med.strength,
      dosage: med.dosageValue,
      form: med.form,
      id: med._id
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

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
          <Link to="/alerts" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
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

      <main className="px-4 py-3 mx-auto max-w-[1280px] w-full">
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

          {/* Mobile Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`rounded-2xl p-4 flex items-center justify-between shadow-sm border ${
                  alert.type === 'danger' ? 'bg-red-50 border-red-100' : 
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 text-[0.6rem] font-black ${
                      alert.type === 'danger' ? 'bg-red-600' : 
                      alert.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                    }`}>!</div>
                    <div>
                      <h4 className={`font-black text-[0.8rem] ${
                        alert.type === 'danger' ? 'text-red-900' : 
                        alert.type === 'warning' ? 'text-amber-900' : 'text-blue-900'
                      }`}>{alert.title}</h4>
                      <p className={`text-[0.7rem] font-bold ${
                        alert.type === 'danger' ? 'text-red-600' : 
                        alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`}>{alert.message}</p>
                    </div>
                  </div>
                  <Link to={alert.link} className={`px-3 py-1 rounded-lg text-[0.7rem] font-black text-white ${
                    alert.type === 'danger' ? 'bg-red-600' : 
                    alert.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>GO</Link>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
            <Link to="/profile" className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-[#F0FDFA] shrink-0 shadow-sm">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Patient Profile</p>
                <h2 className="text-[1.5rem] font-black text-[#0F4D4A] leading-none">{user?.name || "Guest User"}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                   <span className="bg-[#E0F2FE] text-[#0369A1] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">{user?.age || "--"} Years</span>
                   <span className="bg-[#FEF9C3] text-[#854D0E] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">{user?.bloodGroup || "B+"}</span>
                   {user?.diseases?.map((disease, idx) => (
                     <span key={idx} className="bg-red-50 text-red-600 text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                       {disease}
                     </span>
                   ))}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[1.1rem] font-black text-[#0F4D4A]">My Medications</h3>
              <Link to="/add-medicine" className="text-[0.7rem] font-black text-[#0F766E] flex items-center gap-1">
                <Plus size={14} /> ADD NEW
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-hide snap-x">
              {medicines.length > 0 ? medicines.map((med) => (
                <div key={med._id} className="min-w-[140px] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm snap-start">
                  <div className="w-10 h-10 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F4D4A] mb-3">
                    <Pill size={20} />
                  </div>
                  <h4 className="text-[0.9rem] font-black text-[#0F4D4A] truncate">{med.name}</h4>
                  <p className="text-[0.7rem] text-gray-400 font-bold">{med.strength}</p>
                </div>
              )) : (
                <Link to="/add-medicine" className="min-w-[140px] h-[120px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <Plus size={24} />
                  <span className="text-[0.7rem] font-bold mt-1">Add First</span>
                </Link>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[1.1rem] font-black text-[#0F4D4A]">Today's Schedule</h3>
              <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">{dailyTimeline.length} Doses</span>
            </div>
            <div className="space-y-4">
              {dailyTimeline.length > 0 ? dailyTimeline.map((item, i) => (
                <div key={`${item.id}-${i}`} className="bg-white border border-gray-100 rounded-[1.8rem] p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${i === 0 ? 'bg-[#52DFBB]' : 'bg-gray-200'}`}></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F0FDFA] rounded-2xl flex flex-col items-center justify-center text-[#0F4D4A]">
                      <span className="text-[0.9rem] font-black leading-none">{item.time}</span>
                      <span className="text-[0.5rem] font-black uppercase opacity-60 mt-1">Time</span>
                    </div>
                    <div>
                      <h4 className="text-[1.05rem] font-black text-[#0F4D4A]">{item.medicineName}</h4>
                      <p className="text-[0.8rem] text-gray-400 font-bold">{item.dosage} {item.form || 'Unit'}</p>
                    </div>
                  </div>
                  <button className="bg-[#0F4D4A] text-white px-5 py-2.5 rounded-xl text-[0.85rem] font-black shadow-lg shadow-[#0F4D4A]/10 active:scale-95 transition-transform">LOG</button>
                </div>
              )) : (
                <div className="bg-white rounded-[1.8rem] border border-dashed border-gray-200 py-10 text-center">
                  <p className="text-gray-400 italic font-medium text-[0.9rem]">No doses scheduled for today.</p>
                </div>
              )}
            </div>
          </section>

          <section className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[1.1rem] font-black text-[#0F4D4A]">Recent Activity</h3>
              <Link to="/medication-history" className="text-[0.7rem] font-bold text-[#0F766E] uppercase tracking-widest">History</Link>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              {logs.length > 0 ? logs.slice(0, 5).map((log, i) => (
                <div key={log.id} className={`p-4 flex items-center justify-between ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.status === 'Taken' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {log.status === 'Taken' ? <Check size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div>
                      <h4 className="text-[0.85rem] font-bold text-gray-900">{log.medicineName}</h4>
                      <p className="text-[0.65rem] text-gray-400 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {log.status}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-400 text-[0.85rem] italic">No recent activity</div>
              )}
            </div>
          </section>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          {/* Patient Header Card - COMPACT */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#F0FDFA] shrink-0 shadow-sm">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[1.5rem] font-black text-[#0F4D4A] tracking-tight leading-none">{user?.name || "Patient Name"}</h2>
                  <span className="bg-[#E0F2FE] text-[#0369A1] text-[0.65rem] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{user?.age || "--"} Yrs</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">Chronic:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user?.diseases && user.diseases.length > 0 ? (
                      user.diseases.map((condition, idx) => (
                        <span key={idx} className="bg-red-50 text-red-600 text-[0.55rem] font-black px-2 py-0.5 rounded uppercase tracking-tighter border border-red-100">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-[0.6rem] text-gray-400 font-bold italic">None listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
               <div className="bg-[#F8FAFC] px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px]">
                  <p className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest mb-0.5">Blood</p>
                  <p className="text-[0.9rem] font-black text-[#0F4D4A]">{user?.bloodGroup || "B+"}</p>
               </div>
               <div className="bg-[#F8FAFC] px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px]">
                  <p className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest mb-0.5">Weight</p>
                  <p className="text-[0.9rem] font-black text-[#0F4D4A]">{user?.weight || "--"} kg</p>
               </div>
            </div>
          </div>

          {/* Alerts Section */}
          {alerts.map((alert, idx) => (
            <div key={idx} className={`border rounded-xl p-3 flex items-center justify-between mb-4 shadow-sm ${
              alert.type === 'danger' ? 'bg-[#fdeceb] border-[#facccb]' : 
              alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${
                  alert.type === 'danger' ? 'bg-[#b91c1c]' : 
                  alert.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                }`}>!</div>
                <div>
                  <h4 className={`font-semibold text-[0.85rem] ${
                    alert.type === 'danger' ? 'text-[#991b1b]' : 
                    alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                  }`}>{alert.title}</h4>
                  <p className={`text-[0.8rem] font-medium leading-tight ${
                    alert.type === 'danger' ? 'text-[#b91c1c]' : 
                    alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                  }`}>{alert.message}</p>
                </div>
              </div>
              <Link to={alert.link} className={`px-4 py-1.5 rounded-lg text-[0.8rem] font-semibold text-white ${
                alert.type === 'danger' ? 'bg-[#b91c1c]' : 
                alert.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
              }`}>Review</Link>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between mb-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-emerald-800 font-semibold text-[0.85rem]">All Systems Normal</h4>
                  <p className="text-emerald-600 text-[0.8rem] font-medium leading-tight">No critical health alerts at this time.</p>
                </div>
              </div>
            </div>
          )}
          <section className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col h-[200px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[0.9rem] font-bold text-gray-900">Daily Timeline</h3>
                <Clock className="text-gray-300" size={16} />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {dailyTimeline.length > 0 ? dailyTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3 relative">
                    {idx !== dailyTimeline.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-18px] w-[1px] bg-gray-100"></div>
                    )}
                    <div className={`w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center shrink-0 z-10 ${
                      idx === 0 ? 'border-[#0F766E]' : 'border-gray-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#0F766E]' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="flex-1 pb-1">
                       <p className="text-[0.65rem] font-black text-[#0F766E] leading-none mb-0.5">{item.time}</p>
                       <h4 className="text-[0.8rem] font-bold text-gray-900 truncate">{item.medicineName}</h4>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                    <Calendar size={28} className="mb-1" />
                    <p className="text-[0.7rem] font-bold">Empty</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden h-[200px]">
              <div className="absolute top-4 right-4 text-gray-100">
                <ShieldCheck size={100} strokeWidth={1} />
              </div>
              <div className="relative">
                <h3 className="text-[1rem] font-bold text-gray-900 mb-0.5">Safety Score</h3>
                <p className="text-gray-500 text-[0.75rem] font-medium w-2/3 leading-tight">
                  Real-time monitoring of vitals and adherence.
                </p>
              </div>
              <div className="flex items-end gap-2 mt-auto relative z-10">
                <span className="text-[3.5rem] font-black text-[#0F766E] leading-[0.8]">{safetyScore}</span>
                <div className="pb-1">
                  <span className="text-[1rem] text-gray-300 font-bold leading-none">/100</span>
                  <p className="text-[0.6rem] font-black text-[#0F766E] uppercase tracking-widest mt-0.5">Optimized Status</p>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-[0.95rem] font-bold text-gray-900">Current Medications</h3>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 items-center">
              {filteredMedicines.map((med) => (
                <div key={med._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex flex-col h-[120px] group hover:border-[#0F766E] transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                      <Pill size={16} />
                    </div>
                    <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.55rem] font-black px-1.5 py-0.5 rounded uppercase">Active</span>
                  </div>
                  <h4 className="text-gray-900 font-black text-[0.8rem] truncate mb-0.5">{med.name}</h4>
                  <p className="text-gray-400 text-[0.65rem] font-bold">{med.strength}</p>
                </div>
              ))}
              <Link to="/add-medicine" className="rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-[120px] text-gray-400 hover:bg-white hover:border-[#0F766E] hover:text-[#0F766E] transition-all">
                <Plus size={20} className="mb-1" />
                <span className="text-[0.65rem] font-black uppercase tracking-widest">Add</span>
              </Link>
              <Link to="/medication-history" className="text-[0.75rem] font-bold text-[#0F766E] hover:underline px-2">
                View All →
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-4 pb-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[0.95rem] font-bold text-gray-900">Vitals</h3>
                <Link to="/add-vitals" className="text-[0.7rem] font-black text-[#0F766E] flex items-center gap-1 hover:underline">
                  <Plus size={14} /> LOG NEW
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest">Heart Rate</span>
                    <Heart className="w-3.5 h-3.5 text-[#dc2626] fill-[#dc2626]" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-900">{vitals.hr || "--"}</span>
                    <span className="text-[0.6rem] font-bold text-gray-400">BPM</span>
                  </div>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest">SPO2</span>
                    <Wind className="w-3.5 h-3.5 text-[#0F766E]" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-900">{vitals.spo2}</span>
                    <span className="text-[0.6rem] font-bold text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-[260px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[0.95rem] font-bold text-gray-900">Recent Activity</h3>
                <Link to="/medication-history" className="text-[0.75rem] font-bold text-[#0F766E]">History</Link>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {logs.length > 0 ? logs.slice(0, 8).map((log, i) => (
                  <div key={log.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        log.status === 'Taken' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {log.status === 'Taken' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </div>
                      <div>
                        <h4 className="text-[0.8rem] font-bold text-gray-900 truncate max-w-[120px]">{log.medicineName}</h4>
                        <p className="text-[0.65rem] text-gray-400 font-medium">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[0.55rem] font-black px-1.5 py-0.5 rounded uppercase ${
                      log.status === 'Taken' ? 'bg-[#F0FDFA] text-[#0F766E]' : 'bg-red-50 text-red-600'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                    <Clock size={32} className="mb-2" />
                    <p className="text-[0.7rem] font-bold">No activity</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}