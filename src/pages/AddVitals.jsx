import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Wind, ChevronLeft, ShieldCheck, Save } from "lucide-react";
import { vitalsAPI } from "../features/vitals/vitalsAPI";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";

export default function AddVitals() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hr: "",
    spo2: "",
    note: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hr || !formData.spo2) {
      return toast.error("Please fill in both Heart Rate and SpO2");
    }

    setLoading(true);
    try {
      await vitalsAPI.addVitals({
        hr: parseInt(formData.hr),
        spo2: parseInt(formData.spo2),
        note: formData.note,
        type: "manual"
      });
      toast.success("Vitals recorded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Vitals save error:", error);
      toast.error("Failed to save vitals. Check if Firestore indexes are ready.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-4 md:px-8 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Record Vitals</h1>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Manual Entry</p>
        </div>
      </div>

      <main className="flex-1 p-6 max-w-xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-[1.1rem] font-bold text-gray-900 leading-tight">Safety Verification</h2>
              <p className="text-[0.8rem] text-gray-500 font-medium">Ensure accurate readings for AI analysis</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[0.85rem] font-bold text-gray-700">
                  <Heart size={16} className="text-red-500" />
                  Heart Rate (BPM)
                </label>
                <Input 
                  type="number"
                  placeholder="e.g. 72"
                  value={formData.hr}
                  onChange={(e) => setFormData({...formData, hr: e.target.value})}
                  className="bg-gray-50 border-transparent focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[0.85rem] font-bold text-gray-700">
                  <Wind size={16} className="text-[#0F766E]" />
                  SpO2 (%)
                </label>
                <Input 
                  type="number"
                  placeholder="e.g. 98"
                  value={formData.spo2}
                  onChange={(e) => setFormData({...formData, spo2: e.target.value})}
                  className="bg-gray-50 border-transparent focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.85rem] font-bold text-gray-700">Optional Note</label>
              <textarea 
                className="w-full h-32 px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#0F766E] text-[1rem] font-medium resize-none"
                placeholder="e.g. Taken after 10 mins of rest"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              className="h-14 bg-[#0F766E] hover:bg-[#0d6d65] shadow-lg shadow-[#0F766E]/20 text-white font-bold text-[1rem] flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Reading
            </Button>
          </form>
        </motion.div>

        <div className="mt-8 p-6 bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl">
          <h3 className="text-[0.85rem] font-bold text-[#854D0E] flex items-center gap-2 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-[0.8rem] text-[#854D0E]/80 font-medium leading-relaxed">
            For the most accurate AI safety score, try to take readings at the same time each day, preferably in a seated, relaxed position.
          </p>
        </div>
      </main>
    </div>
  );
}
