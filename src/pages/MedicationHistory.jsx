import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bell, 
  Settings,
  Pill,
  Activity,
  ArrowRight,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { medicationLogsAPI } from '../features/medicine/medicationLogsAPI';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

export default function MedicationHistory() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Weekly');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data } = await medicationLogsAPI.getLogs();
      setLogs(data.logs);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const takenCount = filteredLogs.filter(l => l.status === "Taken").length;
  const missedCount = filteredLogs.filter(l => l.status === "Missed").length;
  const adherence = filteredLogs.length > 0 ? Math.round((takenCount / filteredLogs.length) * 100) : 100;

  const stats = [
    { label: "Overall Adherence", value: `${adherence}%`, icon: <Activity className="text-[#0F766E]" />, sub: "Based on logged data" },
    { label: "Doses Taken", value: takenCount.toString(), icon: <CheckCircle2 className="text-[#0F766E]" />, sub: "Total records" },
    { label: "Doses Missed", value: missedCount.toString(), icon: <XCircle className="text-red-500" />, sub: "Action required" },
  ];

  const handleExport = () => {
    toast.loading("Exporting History...");
    setTimeout(() => {
      window.print();
      toast.dismiss();
      toast.success("History exported successfully!");
    }, 1500);
  };

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  if (loading) return <Loader />;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans pb-20">
      {/* Top Header - Improved for mobile */}
      <header className="px-4 md:px-6 py-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => window.history.back()} className="p-1 text-[#0F4D4A]">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight lg:hidden">CareMate</h2>
          <h1 className="hidden lg:block text-lg md:text-xl font-bold text-gray-900">History</h1>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/emergency-mode" className="lg:hidden bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
            SOS
          </Link>
          <div className="relative w-[300px] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F1F5F9] border-none rounded-lg py-2 pl-10 pr-4 text-[0.9rem] focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 p-1"><Bell size={20} /></Link>
          <Link to="/settings" className="text-gray-400 hover:text-gray-900 p-1"><Settings size={20} /></Link>
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 hover:opacity-80 transition-opacity">
             <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
          </Link>
        </div>
      </header>

      <main className="p-8 max-w-[1000px] mx-auto">
        {/* Stats Row - Improved for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl md:text-2xl shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-[0.6rem] md:text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <h4 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">{stat.value}</h4>
                <p className="text-[0.7rem] md:text-[0.75rem] font-bold text-[#0F766E] mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-white border border-gray-100 p-1.5 rounded-2xl flex shadow-sm w-full md:w-auto">
            {['Daily', 'Weekly', 'Monthly'].map((t) => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 md:flex-none px-6 py-2 text-[0.85rem] font-bold rounded-xl transition-all ${filter === t ? 'bg-[#0F766E] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl font-bold text-[0.9rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
              <Calendar size={18} /> Select Date
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl font-bold text-[0.9rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-10">
          {Object.keys(groupedLogs).length > 0 ? Object.entries(groupedLogs).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[1.1rem] font-bold text-gray-900 whitespace-nowrap">{date}</h3>
                <div className="h-[1px] w-full bg-gray-100"></div>
              </div>
              <div className="space-y-4">
                {items.map((item, j) => (
                  <div key={item.id} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6">
                    <div className="w-12 md:w-16 text-center shrink-0">
                      <p className="text-[0.85rem] font-black text-gray-900">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Pill size={20} className="text-[#0F766E]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.95rem] md:text-[1rem] font-bold text-gray-900 truncate">{item.medicineName}</h4>
                      <p className="text-[0.75rem] md:text-[0.8rem] text-gray-400 font-medium truncate">{item.type || "Medication"} · {item.dosage || "1 dose"}</p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                      <span className={`text-[0.65rem] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        item.status === 'Taken' ? 'bg-[#F0FDFA] text-[#0F766E]' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status}
                      </span>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                        item.status === 'Taken' ? 'text-[#0F766E]' : 'text-red-500'
                      }`}>
                        {item.status === 'Taken' ? <CheckCircle2 size={24} fill="currentColor" className="text-white fill-[#0F766E]" /> : <XCircle size={24} fill="currentColor" className="text-white fill-red-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No history found. Log your first dose!</p>
            </div>
          )}
        </div>

        {/* Load More */}
        <button className="w-full mt-12 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-[0.9rem] font-bold text-gray-400 hover:bg-white hover:border-gray-300 transition-all uppercase tracking-[0.2em]">
          Load Older Records
        </button>
      </main>
    </div>
  );
}
