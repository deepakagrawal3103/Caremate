import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Reminders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader /></div>;

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
          {medications.map((med) => (
            <div key={med._id} className="bg-white rounded-xl shadow-md p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center text-lg shrink-0">
                  💊
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Time to take {med.name}</h3>
                  <p className="text-[12px] font-bold text-[#0F766E] uppercase tracking-widest mt-0.5">{med.strength} • {med.schedule?.[0] || "As needed"}</p>
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

          {medications.length === 0 && (
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
