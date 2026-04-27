import React, { useState } from 'react';
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

export default function MedicationHistory() {
  const [filter, setFilter] = useState('Weekly');

  const stats = [
    { label: "Overall Adherence", value: "94%", icon: <Activity className="text-[#0F766E]" />, sub: "+2% this month" },
    { label: "Doses Taken", value: "128", icon: <CheckCircle2 className="text-[#0F766E]" />, sub: "Past 30 days" },
    { label: "Doses Missed", value: "6", icon: <XCircle className="text-red-500" />, sub: "Action required" },
  ];

  const history = [
    {
      date: "Today, Oct 24",
      items: [
        { time: "08:00 AM", medicine: "Amlodipine", dose: "5mg", status: "Taken", type: "Hypertension" },
        { time: "12:30 PM", medicine: "Metformin", dose: "500mg", status: "Upcoming", type: "Diabetes" },
        { time: "06:00 PM", medicine: "Lisinopril", dose: "10mg", status: "Upcoming", type: "BP Control" },
      ]
    },
    {
      date: "Yesterday, Oct 23",
      items: [
        { time: "08:00 AM", medicine: "Amlodipine", dose: "5mg", status: "Taken", type: "Hypertension" },
        { time: "12:30 PM", medicine: "Metformin", dose: "500mg", status: "Missed", type: "Diabetes" },
        { time: "06:00 PM", medicine: "Lisinopril", dose: "10mg", status: "Taken", type: "BP Control" },
      ]
    },
    {
      date: "Oct 22, 2023",
      items: [
        { time: "08:00 AM", medicine: "Amlodipine", dose: "5mg", status: "Taken", type: "Hypertension" },
        { time: "12:30 PM", medicine: "Metformin", dose: "500mg", status: "Taken", type: "Diabetes" },
        { time: "06:00 PM", medicine: "Lisinopril", dose: "10mg", status: "Taken", type: "BP Control" },
      ]
    }
  ];

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
        
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="lg:hidden relative p-1.5 text-[#0F4D4A] hover:bg-[#F0FDFA] rounded-xl transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>
          <Link to="/emergency-mode" className="lg:hidden bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
            SOS
          </Link>
          <div className="relative w-[300px] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="w-full bg-[#F1F5F9] border-none rounded-lg py-2 pl-10 pr-4 text-[0.9rem] focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 p-1"><Bell size={20} /></Link>
          <Link to="/settings" className="text-gray-400 hover:text-gray-900 p-1"><Settings size={20} /></Link>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0">
             <img src="https://img.freepik.com/premium-vector/3d-avatar-young-man-with-glasses-shirt-vector-illustration_1150-65064.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
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
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl font-bold text-[0.9rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-10">
          {history
            .filter(day => {
              if (filter === 'Daily') return day.date.includes('Today');
              if (filter === 'Weekly') return true; // Show all mock data for weekly
              return true; // Monthly
            })
            .map((day, i) => (
            <div key={i}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[1.1rem] font-bold text-gray-900 whitespace-nowrap">{day.date}</h3>
                <div className="h-[1px] w-full bg-gray-100"></div>
              </div>
              <div className="space-y-4">
                {day.items.map((item, j) => (
                  <div key={j} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6 hover:border-[#0F766E]/30 transition-all group cursor-pointer">
                    <div className="w-12 md:w-16 text-center shrink-0">
                      <p className="text-[0.8rem] md:text-[0.85rem] font-black text-gray-900">{item.time.split(' ')[0]}</p>
                      <p className="text-[0.6rem] md:text-[0.65rem] font-bold text-gray-400 uppercase tracking-tighter">{item.time.split(' ')[1]}</p>
                    </div>
                    
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#0F766E]/5 transition-colors">
                      <Pill size={20} className="text-gray-400 group-hover:text-[#0F766E] transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.95rem] md:text-[1rem] font-bold text-gray-900 truncate">{item.medicine}</h4>
                      <p className="text-[0.75rem] md:text-[0.8rem] text-gray-400 font-medium truncate">{item.type} · {item.dose}</p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                      <div className="hidden sm:block text-right">
                         <span className={`text-[0.6rem] md:text-[0.65rem] font-black px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg uppercase tracking-wider ${
                           item.status === 'Taken' ? 'bg-[#F0FDFA] text-[#0F766E]' : 
                           item.status === 'Missed' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
                         }`}>
                           {item.status}
                         </span>
                      </div>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                           item.status === 'Taken' ? 'text-[#0F766E]' : 
                           item.status === 'Missed' ? 'text-red-500' : 'text-gray-200'
                      }`}>
                        {item.status === 'Taken' && <CheckCircle2 size={24} md:size={28} fill="currentColor" className="text-white fill-[#0F766E]" />}
                        {item.status === 'Missed' && <XCircle size={24} md:size={28} fill="currentColor" className="text-white fill-red-500" />}
                        {item.status === 'Upcoming' && <Clock size={24} md:size={28} className="text-gray-200" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <button className="w-full mt-12 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-[0.9rem] font-bold text-gray-400 hover:bg-white hover:border-gray-300 transition-all uppercase tracking-[0.2em]">
          Load Older Records
        </button>
      </main>
    </div>
  );
}
