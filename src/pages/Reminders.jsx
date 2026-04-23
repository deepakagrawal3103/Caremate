import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Reminders() {
  const navigate = useNavigate();

  // Mock data
  const [reminders, setReminders] = useState([
    { id: 1, text: "Time to take Eliquis (Apixaban)", time: "09:00 AM", status: "pending" },
    { id: 2, text: "Take Humalog (Lispro) before breakfast", time: "08:30 AM", status: "pending" },
  ]);

  const updateStatus = (id, newStatus) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

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
            <h1 className="text-2xl font-sans text-gray-900 font-bold tracking-tight">Active Alerts</h1>
            <p className="text-[0.9rem] font-medium text-secondary">Pending medication routines</p>
          </div>
        </div>

        <div className="space-y-4">
          {reminders.filter(r => r.status === "pending").map((rem) => (
            <div key={rem.id} className="bg-white rounded-xl shadow-md p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff3e0] text-[#d97706] flex items-center justify-center text-lg shrink-0">
                  ⏰
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">{rem.text}</h3>
                  <p className="text-[12px] font-bold text-[#d97706] uppercase tracking-widest mt-0.5">{rem.time}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => updateStatus(rem.id, "taken")}
                  className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  Taken
                </button>
                <button 
                  onClick={() => updateStatus(rem.id, "snoozed")}
                  className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-white border border-border text-[#506071] hover:bg-gray-50 transition-colors"
                >
                  Snooze
                </button>
                <button 
                  onClick={() => updateStatus(rem.id, "missed")}
                  className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-red-50 text-red-500 hover:bg-[#fbd0d0] transition-colors"
                >
                  Missed
                </button>
              </div>
            </div>
          ))}

          {reminders.filter(r => r.status === "pending").length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12  text-center">
              <div className="w-16 h-16 rounded-full bg-[#e6eff6] text-gray-900 flex items-center justify-center text-2xl mx-auto mb-4">
                ✨
              </div>
              <p className="text-[16px] font-bold text-gray-900">All caught up!</p>
              <p className="text-base font-medium text-secondary mt-1">No pending medication routines at this time.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
