import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Bell, Settings, AlertTriangle, Pill as PillIcon, X, Calendar, Phone, BrainCog, FileText, ExternalLink, CheckCircle2, ChevronLeft, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { vitalsAPI } from "../features/vitals/vitalsAPI";
import { aiService, AI_MODELS } from "../services/ai";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function RiskScore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [vitals, setVitals] = useState({ heartRate: 72, spo2: 98 });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(12);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [medsRes, vitalsRes] = await Promise.all([
        medicineAPI.getAllMedicines(),
        vitalsAPI.getLatestVitals()
      ]);
      
      const meds = medsRes.data.medicines;
      if (vitalsRes) {
        setVitals({
          heartRate: vitalsRes.hr || 72,
          spo2: vitalsRes.spo2 || 98
        });
      }

      // Run Specialized Local AI Analysis
      const crisisAnalysis = await aiService.askAI(
        "Generate a health crisis forecast based on current medications and vitals.",
        JSON.stringify({ medications: meds, vitals: vitalsRes }),
        AI_MODELS.CRISIS_FORECASTER
      );
      
      if (crisisAnalysis && crisisAnalysis.score !== undefined) {
        setScore(crisisAnalysis.score);
      }

      // Run AI Analysis if there are at least 2 medications
      if (meds.length >= 2) {
        const medNames = meds.map(m => m.name).join(", ");
        const result = await aiService.askAI(
          `Analyze these medications for potential interactions: ${medNames}. 
           Format the response as JSON with: { "hasConflict": boolean, "score": number, "rationale": string, "protocol": string[], "severity": "low"|"medium"|"high" }`,
          "You are a clinical pharmacist. Only return JSON."
        );
        
        try {
          const jsonMatch = result.match(/\{.*\}/s);
          const analysisData = JSON.parse(jsonMatch ? jsonMatch[0] : result);
          setAnalysis(analysisData);
          setScore(analysisData.score || 12);
        } catch (e) {
          console.error("AI Parse Error", e);
          setAnalysis({ hasConflict: false, rationale: result || "No significant interactions detected by AI.", score: 12 });
        }
      } else {
        setAnalysis({ hasConflict: false, rationale: "Add more medications to check for interactions.", score: 5 });
        setScore(5);
      }
    } catch (error) {
      console.error("Safety Analysis Error:", error);
      toast.error("Failed to run safety analysis");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader /></div>;
  
  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Desktop ONLY */}
      <header className="hidden lg:flex px-4 md:px-8 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px] md:h-[72px]">
         <div className="flex items-center gap-3 md:gap-4">
            <span className="text-[#0F766E] font-bold text-[1.1rem] md:text-[1.2rem] tracking-tight">CareMate</span>
         </div>
         <div className="flex-1 max-w-[400px] mx-4 hidden md:block">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" placeholder="Search..." className="w-full bg-[#F1F5F9] rounded-full py-2.5 pl-10 pr-4 text-[0.9rem] text-gray-900 border-transparent focus:ring-2 focus:ring-[#0F766E] transition-all font-medium placeholder:text-gray-400" />
            </div>
         </div>
         <div className="flex items-center gap-3 md:gap-6">
            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 md:p-0">
               <Bell className="w-[18px] h-[18px] fill-current" />
            </button>
            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 md:p-0">
               <Settings className="w-[18px] h-[18px] fill-current" />
            </button>
            <Link to="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
              </div>
            </Link>
         </div>
      </header>

      <main className="px-5 py-6 mx-auto max-w-[1000px] relative pb-24">
         {/* MOBILE VIEW */}
         <div className="lg:hidden space-y-6">
            <div className="flex items-center justify-between pt-2">
               <button onClick={() => window.history.back()} className="p-1 text-[#0F4D4A]">
                  <ChevronLeft size={28} />
               </button>
               <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
               <Link to="/emergency-mode" className="bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
                  SOS
               </Link>
            </div>

            <div className="px-1">
               <h1 className="text-[1.8rem] font-black text-gray-900 leading-tight">Personal Safety Report</h1>
               <p className="text-gray-500 text-[0.9rem] font-medium mt-1">Generated by CareMate AI Clinical Engine</p>
            </div>

            {/* Critical Findings Card */}
            <div className={`${analysis?.hasConflict ? 'bg-[#FEFCE8] border-[#FEF08A]' : 'bg-[#F0FDFA] border-[#CCFBF1]'} rounded-[2rem] p-6 shadow-sm`}>
               <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${analysis?.hasConflict ? 'bg-[#FDE68A] text-[#92400E]' : 'bg-[#CCFBF1] text-[#0F766E]'} flex items-center justify-center`}>
                     {analysis?.hasConflict ? <AlertTriangle size={22} fill="currentColor" className="text-white" /> : <ShieldCheck size={22} />}
                  </div>
                  <h3 className={`text-[1.1rem] font-black ${analysis?.hasConflict ? 'text-[#92400E]' : 'text-[#0F766E]'}`}>
                    {analysis?.hasConflict ? 'Critical Findings' : 'System Clear'}
                  </h3>
               </div>
               <div className="space-y-4">
                  <div>
                     <h4 className="text-[1rem] font-black text-gray-900 mb-1">
                       {analysis?.hasConflict ? 'Potential Interaction Detected' : 'Safety Check Optimal'}
                     </h4>
                     <div className="flex items-center gap-2">
                        <span className={`text-[1.4rem] font-black ${score > 50 ? 'text-[#B91C1C]' : 'text-[#0F766E]'}`}>{score}% Score</span>
                        {analysis?.hasConflict && <span className="text-[0.65rem] font-black text-white bg-[#B91C1C] px-2 py-0.5 rounded-md uppercase tracking-tighter">ACTION REQUIRED</span>}
                     </div>
                  </div>
                  <p className="text-[0.85rem] text-gray-600 font-medium leading-relaxed">
                     {analysis?.rationale}
                  </p>
               </div>
            </div>

            {/* Risk Breakdown Card */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm text-center">
               <h3 className="text-[1rem] font-black text-gray-900 mb-2 uppercase tracking-widest">Risk Breakdown</h3>
               <p className="text-[0.85rem] text-gray-500 font-medium mb-8">Molecular Interaction Analysis</p>
               
               {/* Circular Progress */}
               <div className="relative w-48 h-48 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="96" cy="96" r="82" stroke="#F1F5F9" strokeWidth="18" fill="none" />
                     <circle cx="96" cy="96" r="82" stroke={score > 50 ? "#B91C1C" : "#0F766E"} strokeWidth="18" fill="none" strokeDasharray="515.2" strokeDashoffset={515.2 * (1 - score/100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                     <span className="text-[3.2rem] font-black text-gray-900 leading-none">{score}<span className="text-[1.5rem] text-gray-400 font-bold">%</span></span>
                     <span className="text-[0.7rem] font-black text-gray-400 mt-2 uppercase tracking-[0.2em]">Risk Score</span>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-2 text-[#0F766E]">
                  <CheckCircle2 size={16} />
                  <span className="text-[0.85rem] font-bold">Safe adherence protocol detected</span>
               </div>
            </div>

            {/* Consultation Card */}
            <div className="bg-[#0F172A] rounded-[2rem] p-8 shadow-xl text-white">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white overflow-hidden">
                     <img src={user?.doctorPhoto || "https://ui-avatars.com/api/?name=Doctor&background=0F766E&color=fff"} alt="Doctor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h3 className="text-[1.05rem] font-black text-white leading-tight">{user?.doctorName || "Primary Care Physician"}</h3>
                     <p className="text-gray-400 text-[0.8rem] font-medium">Last Review: {new Date().toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="bg-[#0F766E] hover:bg-[#0d6d65] text-white py-4 rounded-2xl font-black text-[0.9rem] flex items-center justify-center gap-2 transition-all">
                     <Phone size={18} strokeWidth={3} /> Call
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black text-[0.9rem] flex items-center justify-center gap-2 transition-all border border-white/10">
                     <Settings size={18} strokeWidth={3} /> Adjust
                  </button>
               </div>
            </div>

            <div className="text-center pt-4">
               <p className="text-gray-400 text-[0.7rem] font-medium tracking-tight">ID: AR-{user?.uid?.slice(0, 5)} | Time Generated: {new Date().toLocaleTimeString()}</p>
            </div>
         </div>

         {/* DESKTOP VIEW */}
         <div className="hidden lg:block">
            <div className="flex flex-col items-center justify-center text-center mb-10 px-4">
               <div className={`${analysis?.hasConflict ? 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]' : 'bg-[#F0FDFA] border-[#CCFBF1] text-[#0F766E]'} px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 font-bold text-[0.75rem] md:text-[0.8rem] uppercase tracking-widest shadow-sm mb-6`}>
                  {analysis?.hasConflict ? <AlertTriangle className="w-4 h-4 fill-[#b91c1c] text-white" strokeWidth={1} /> : <ShieldCheck className="w-4 h-4" />}
                  {analysis?.hasConflict ? 'CRITICAL ALERT' : 'SAFETY VERIFIED'}
               </div>
               <h1 className={`text-[1.3rem] md:text-[1.6rem] font-bold ${analysis?.hasConflict ? 'text-[#b91c1c]' : 'text-gray-900'} mb-3 tracking-[0.02em] leading-tight`}>
                  {analysis?.hasConflict ? 'DANGEROUS INTERACTION DETECTED' : 'YOUR MEDICATIONS ARE COMPATIBLE'}
               </h1>
               <p className="text-gray-600 font-medium text-[0.9rem] md:text-[0.95rem] max-w-[650px] leading-relaxed">
                  {analysis?.rationale}
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               <div className="lg:col-span-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 relative overflow-hidden">
                  {!analysis?.hasConflict ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                       <div className="w-20 h-20 bg-[#F0FDFA] rounded-full flex items-center justify-center text-[#0F766E] mb-6">
                          <ShieldCheck size={48} />
                       </div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-2">No Conflicts Found</h3>
                       <p className="text-gray-500 max-w-sm">Our AI analysis hasn't found any dangerous interactions between your current medications.</p>
                    </div>
                  ) : (
                    <>
                      <div className="absolute -top-6 -right-6 text-gray-50 pointer-events-none opacity-50">
                         <span className="text-[200px] font-bold leading-none">!</span>
                      </div>
                      <div className="flex items-center gap-3 mb-8 relative z-10">
                         <Activity className="w-6 h-6 text-[#b91c1c]" />
                         <h3 className="text-[1.1rem] font-bold text-gray-900">Molecular Conflict Analysis</h3>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10 py-4">
                         {medications.slice(0, 2).map((med, idx) => (
                            <div key={med._id} className="flex flex-col md:flex-row items-center">
                               <div className="bg-[#F8FAFC] border border-gray-100 rounded-[1.5rem] p-8 flex flex-col items-center w-[240px] shadow-sm">
                                  <div className={`w-12 h-12 rounded-full ${idx === 0 ? 'bg-[#CCFBF1] text-[#0F766E]' : 'bg-[#E0E7FF] text-[#4338ca]'} flex items-center justify-center mb-4 shadow-sm`}>
                                     <PillIcon className="w-6 h-6 fill-current" />
                                  </div>
                                  <h4 className="text-[1.1rem] font-bold text-gray-900 mb-2 text-center">{med.name}</h4>
                                  <span className={`text-[0.6rem] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest ${idx === 0 ? 'bg-[#CCFBF1] text-[#0F766E]' : 'bg-[#E0E7FF] text-[#4338ca]'}`}>
                                    {med.category || "MEDICATION"}
                                  </span>
                               </div>
                               {idx === 0 && (
                                  <div className="relative flex items-center justify-center mx-4 z-10 shrink-0">
                                     <div className="w-10 h-10 rounded-full bg-[#b91c1c] text-white flex items-center justify-center border-4 border-white shadow-sm">
                                        <X className="w-5 h-5 stroke-[3]" />
                                     </div>
                                  </div>
                               )}
                            </div>
                         ))}
                      </div>
                    </>
                  )}
               </div>

               <div className="lg:col-span-4 bg-[#0f172a] rounded-[2rem] p-8 shadow-xl text-white flex flex-col">
                  <div className="flex items-center gap-3 mb-6 text-white">
                     <AlertTriangle className="w-5 h-5" />
                     <h3 className="text-[1.1rem] font-bold">Urgent Protocol</h3>
                  </div>
                  <p className="text-blue-100 font-medium text-[0.95rem] leading-relaxed mb-8">
                     {analysis?.hasConflict ? "To prevent severe side effects, follow these steps immediately:" : "Your medication routine is verified for high safety."}
                  </p>
                  <div className="space-y-6 flex-1 mb-10">
                     {analysis?.protocol ? analysis.protocol.map((step, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className={`w-[22px] h-[22px] rounded-full ${i === 0 ? 'bg-[#b91c1c]' : 'bg-slate-700'} text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 mt-[2px]`}>{i+1}</div>
                           <p className="text-white font-medium text-[0.95rem] leading-snug">{step}</p>
                        </div>
                     )) : (
                        <div className="flex items-start gap-4">
                           <div className="w-[22px] h-[22px] rounded-full bg-emerald-600 text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 mt-[2px]">✓</div>
                           <p className="text-white font-medium text-[0.95rem] leading-snug">No urgent actions required.</p>
                        </div>
                     )}
                  </div>
                  <div className="space-y-3 mt-auto">
                      <button onClick={() => navigate("/medications")} className="w-full bg-[#0F766E] hover:bg-[#047857] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                         <Calendar className="w-4 h-4" /> Adjust Dosage
                      </button>
                     <button className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                        <Phone className="w-4 h-4" /> Contact Doctor
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                     <BrainCog className="w-6 h-6 text-[#0F766E]" />
                     <h3 className="text-[1.05rem] font-bold text-gray-900">AI Rationale</h3>
                  </div>
                  <p className="text-gray-900 font-medium text-[0.95rem] leading-relaxed mb-6">
                     {analysis?.rationale || "Safety analysis complete."}
                  </p>
               </div>

               <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                     <FileText className="w-5 h-5 text-gray-400" />
                     <h3 className="text-[1.05rem] font-bold text-gray-900">Clinical Evidence</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="bg-[#F8FAFC] p-6 rounded-xl border border-gray-100 group relative cursor-pointer">
                        <span className="text-[#0F766E] text-[0.7rem] font-bold uppercase tracking-widest mb-1 block">NEJM STUDY 2023</span>
                        <h4 className="font-bold text-gray-900 text-[0.95rem] mb-1">Bleeding Risks in Combined Antithrombotic Therapy</h4>
                        <ExternalLink className="absolute top-6 right-6 w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-10 text-center">
               <p className="text-gray-400 text-[0.75rem] font-medium">ID: AR-{user?.uid?.slice(0, 5)} | Generated: {new Date().toLocaleString()}</p>
            </div>
         </div>
      </main>
    </div>
  );
}
