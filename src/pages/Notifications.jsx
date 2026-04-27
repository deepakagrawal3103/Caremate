import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  Filter, 
  Search,
  ChevronLeft,
  Settings,
  MoreVertical,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meds, setMeds] = React.useState([]);

  React.useEffect(() => {
    medicineAPI.getAllMedicines().then(res => setMeds(res.data.medicines));
  }, []);

  const generatedNotifications = meds.filter(m => m.inventory < 5).map(m => ({
    id: m._id,
    type: 'warning',
    title: 'Low Stock Alert',
    message: `Your supply of ${m.name} is running low (${m.inventory} units remaining). Please refill soon.`,
    time: 'System Update',
    read: false,
    color: 'text-[#EA580C]',
    bg: 'bg-[#FFF7ED]',
    icon: <Clock size={18} />
  }));

  const staticNotifications = [
    {
      id: 'welcome',
      type: 'success',
      title: 'Profile Synchronized',
      message: `Welcome ${user?.name || "Patient"}! Your health profile is now active and protected by MedSecure AI.`,
      time: 'Just now',
      read: true,
      color: 'text-[#0F766E]',
      bg: 'bg-[#F0FDFA]',
      icon: <CheckCircle2 size={18} />
    }
  ];

  const notifications = [...generatedNotifications, ...staticNotifications];

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Improved for mobile */}
      <header className="px-4 md:px-6 py-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-base md:text-lg font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline whitespace-nowrap">Mark all read</button>
          <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[800px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2 sm:px-0">
           <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">System Alerts</h2>
              <p className="text-gray-500 font-medium text-[0.85rem] md:text-[0.95rem]">Stay updated with critical clinical events.</p>
           </div>
           <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-1.5 text-[0.8rem] md:text-[0.85rem] font-bold bg-gray-50 text-gray-900 rounded-lg shadow-sm">All</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 text-[0.8rem] md:text-[0.85rem] font-bold text-gray-400 hover:text-gray-600 transition-colors">Unread</button>
           </div>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`bg-white border ${n.read ? 'border-gray-100' : 'border-[#0F766E]/20'} rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative group`}
            >
              {!n.read && <div className="absolute top-4 right-4 md:top-5 md:right-5 w-2 h-2 bg-[#0F766E] rounded-full"></div>}
              <div className="flex gap-4 md:gap-5">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${n.bg} ${n.color} flex items-center justify-center shrink-0`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-1 sm:mb-1 gap-1">
                    <h3 className="text-[0.95rem] md:text-[1rem] font-bold text-gray-900 leading-tight truncate w-full">{n.title}</h3>
                    <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-gray-400 uppercase whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-[0.85rem] md:text-[0.9rem] text-gray-500 font-medium leading-relaxed mb-3">
                    {n.message}
                  </p>
                  <div className="flex gap-4">
                    <button className="text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline">View Details</button>
                    <button className="text-[0.75rem] md:text-[0.8rem] font-bold text-gray-400 hover:text-gray-600 transition-colors">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <button className="text-[0.9rem] font-bold text-gray-400 hover:text-gray-600 transition-colors">Load older notifications</button>
        </div>
      </main>
    </div>
  );
}
