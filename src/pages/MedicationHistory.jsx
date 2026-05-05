import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Filter, 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Pill,
  ArrowRight
} from 'lucide-react';
import { medicationLogsAPI } from '../features/medicine/medicationLogsAPI';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function MedicationHistory() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      loadLogs();
    }
  }, [user, authLoading]);

  const loadLogs = async () => {
    try {
      const { data } = await medicationLogsAPI.getLogs(50);
      setLogs(data.logs);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.medicineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || log.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    toast.success("History exported as PDF (Simulation)");
  };

  if (authLoading || loading) return <Loader />;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Medication History</h1>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded-xl font-bold text-[0.8rem] hover:bg-[#0d6d65] transition-all shadow-md shadow-[#0F766E]/10"
        >
          <Download size={16} /> Export
        </button>
      </header>

      <main className="p-6 md:p-8 max-w-[1000px] mx-auto space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by medicine name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[0.9rem] font-medium focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
            {['All', 'Taken', 'Missed', 'Skipped'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[0.8rem] font-bold whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-[#0F766E] text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-[#0F766E]/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => (
              <div key={log.id || idx} className="p-5 md:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    log.status === 'Taken' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {log.status === 'Taken' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-black text-gray-900 uppercase tracking-tight leading-none mb-1.5">{log.medicineName}</h3>
                    <div className="flex items-center gap-3 text-gray-500 text-[0.75rem] font-bold">
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-widest border ${
                    log.status === 'Taken' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {log.status}
                  </span>
                  <p className="text-[0.7rem] text-gray-400 font-bold mt-1.5">{log.dosage || '1 Unit'}</p>
                </div>
              </div>
            )) : (
              <div className="p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-200">
                  <Pill size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">No logs found</h3>
                  <p className="text-gray-500 text-[0.9rem]">Your medication history will appear here once you log your doses.</p>
                </div>
                <Link to="/" className="inline-flex items-center gap-2 text-[#0F766E] font-bold text-[0.9rem] hover:underline">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
