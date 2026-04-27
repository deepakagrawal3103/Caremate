import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";
import toast from "react-hot-toast";
import { Pill, Clock } from "lucide-react";

export default function DoseReminder() {
  const { user } = useAuth();
  const notifiedDoses = useRef(new Set());

  useEffect(() => {
    if (!user) return;

    const checkReminders = async () => {
      try {
        const { data } = await medicineAPI.getAllMedicines();
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const todayStr = now.toISOString().split('T')[0];

        data.medicines.forEach(med => {
          if (!med.schedule) return;
          
          med.schedule.forEach(time => {
            const [hour, minute] = time.split(':');
            const scheduledTime = `${hour}:${minute}`;
            
            // If scheduled time is within the next 5 minutes
            const scheduledDate = new Date();
            scheduledDate.setHours(parseInt(hour), parseInt(minute), 0);
            
            const diffMs = scheduledDate - now;
            const diffMins = Math.floor(diffMs / 60000);

            const doseId = `${med._id}_${scheduledTime}_${todayStr}`;

            if (diffMins >= 0 && diffMins <= 5 && !notifiedDoses.current.has(doseId)) {
              showReminder(med, time);
              notifiedDoses.current.add(doseId);
            }
          });
        });
      } catch (e) {
        console.error("Reminder check failed", e);
      }
    };

    const showReminder = (med, time) => {
      toast((t) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
            <Pill size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Upcoming Dose: {med.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} /> Scheduled for {time}
            </p>
          </div>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-xs font-bold text-[#0F766E] uppercase"
          >
            OK
          </button>
        </div>
      ), { duration: 10000, position: 'top-right' });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [user]);

  return null; // This component doesn't render anything visible
}
