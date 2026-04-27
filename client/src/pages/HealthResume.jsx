import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { 
  ChevronLeft, 
  ShieldCheck, 
  PhoneCall, 
  BarChart2, 
  TrendingUp, 
  Pill, 
  Printer, 
  History,
  Bell
} from "lucide-react";

export default function HealthResume() {
  const navigate = useNavigate();
  const [resume, setResume] = useState({
    user: {
      name: "Rajesh Kumar",
      age: "63",
      gender: "Male",
      diseases: ["Type 2 Diabetes"]
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHealthResume();
  }, []);

  const fetchHealthResume = async () => {
    try {
      const { data } = await api.get("/health/resume", { silent: true });
      if (data) setResume(data);
    } catch (error) {
      console.log("Using cached health profile (backend offline)");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#F8FAFC] min-h-screen p-8 animate-pulse space-y-6">
        <div className="h-16 bg-white rounded-2xl w-full mb-8 shadow-sm border border-[#E5E7EB]"></div>
        <div className="h-64 bg-white rounded-2xl shadow-sm border border-[#E5E7EB]"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-2xl shadow-sm border border-[#E5E7EB]"></div>
          <div className="h-64 bg-white rounded-2xl shadow-sm border border-[#E5E7EB]"></div>
        </div>
      </div>
    );
  }

  // Fallback defaults if API misses them
  const userData = resume?.user || {
    name: "Rajesh Kumar",
    age: "63",
    gender: "Male"
  };
  const conditions = userData.diseases || ["Type 2 Diabetes"];
  const emergencyContact = {
    name: "Sunita Kumar (Wife)",
    phone: "+91 98765 43210"
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans overflow-x-hidden">
       {/* Header */}
       <header className="px-4 md:px-8 flex items-center justify-between bg-white border-b border-[#E5E7EB] sticky top-0 z-10 h-[64px] md:h-[72px]">
          <div className="flex items-center gap-2 md:gap-4">
             <button onClick={() => navigate(-1)} className="p-1 text-[#0F4D4A]">
                <ChevronLeft size={28} />
             </button>
             <h2 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight lg:hidden">CareMate</h2>
             <h2 className="hidden lg:block text-base md:text-lg font-bold text-gray-900">Health Resume</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="lg:hidden relative p-1.5 text-[#0F4D4A] hover:bg-[#F0FDFA] rounded-xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <Link to="/emergency-mode" className="lg:hidden bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
               SOS
            </Link>
          </div>
       </header>

       <main className="px-8 py-10 mx-auto max-w-[1100px] pb-24">
        
        {/* Title Area */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
           <div>
              <p className="text-[0.7rem] md:text-sm font-bold uppercase tracking-widest text-[#0F766E] mb-2">Patient Records / Portfolio 2024</p>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Clinical Health Resume</h1>
              <p className="text-gray-500 max-w-xl leading-relaxed text-[0.95rem] md:text-[1.05rem]">
                A curated summary of medical heritage, active management, and preventative risk analysis.
              </p>
           </div>
           <div className="text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#0F766E]/20 pl-4 md:pl-0 md:pr-4 py-1">
              <span className="block text-[0.65rem] md:text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Dossier ID</span>
              <span className="font-mono text-gray-900 font-semibold text-base md:text-lg">#SH-772-9910-CL</span>
           </div>
        </div>

        {/* Profile Identity Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-10 items-center mb-10">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-[#F0FDFA] overflow-hidden shrink-0 relative flex items-center justify-center border border-[#CCFBF1]">
              <img src="https://img.freepik.com/premium-vector/female-doctor-character-with-stethoscope-3d-avatar-vector-illustration_1150-65063.jpg" alt="Avatar" className="w-full h-full object-cover mix-blend-multiply" />
              <div className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-[#0F766E] rounded-xl md:rounded-2xl flex justify-center items-center text-white shadow-md">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
              </div>
           </div>
           
           <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{userData.name}</h2>
               <p className="text-[0.7rem] md:text-sm uppercase font-bold tracking-widest text-gray-400 mb-6">Patient Profile & Identity</p>
               
               <div className="space-y-4 md:space-y-5">
                  <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-[#E5E7EB]">
                    <span className="text-[0.95rem] md:text-[1.05rem] font-semibold text-gray-500">Biological Age</span>
                    <span className="font-bold text-gray-900 text-lg md:text-xl">{userData.age} {userData.age ? 'Years' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-[#E5E7EB]">
                    <span className="text-[0.95rem] md:text-[1.05rem] font-semibold text-gray-500">Primary Condition</span>
                    <span className="text-[0.85rem] md:text-[1.05rem] font-bold text-[#059669] bg-[#ecfdf5] px-3 md:px-4 py-1 md:py-1.5 rounded-xl tracking-wide">{conditions[0] || "Undiagnosed"}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[0.95rem] md:text-[1.05rem] font-semibold text-gray-500">Blood Group</span>
                    <span className="font-bold text-[#DC2626] text-lg md:text-xl">O Positive</span>
                  </div>
               </div>
             </div>
             
             <div className="flex items-end justify-end">
               <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-6 md:p-8 w-full h-full flex flex-col justify-center">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0">
                       <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
                     </div>
                     <div>
                       <span className="block text-[0.65rem] md:text-sm uppercase font-bold tracking-widest text-gray-400 mb-1">Emergency Care Contact</span>
                       <h4 className="font-bold text-gray-900 text-[1rem] md:text-[1.1rem] mb-1">{emergencyContact.name}</h4>
                       <span className="text-[0.95rem] md:text-[1.05rem] font-mono font-semibold text-gray-500">{emergencyContact.phone}</span>
                     </div>
                  </div>
               </div>
             </div>
           </div>
        </section>

        {/* Two Column Layout for Middle Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          
          {/* Left Block -> Risk Assessment & Clinical Outlook */}
          <div className="col-span-1 lg:col-span-2 space-y-10 flex flex-col">
            
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 flex-1">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F0FDFA] rounded-full flex items-center justify-center">
                     <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-[#0F766E]" />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Risk Assessment</h3>
                 </div>
                 <span className="text-[0.7rem] md:text-[0.85rem] font-bold tracking-widest uppercase text-[#059669] bg-[#ecfdf5] px-3 md:px-4 py-1.5 md:py-2 rounded-xl flex items-center gap-2 self-start md:self-auto">
                   <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span> Active Analysis
                 </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Gauge 1 */}
                 <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-3xl">
                     <span className="block text-[0.8rem] uppercase font-bold tracking-widest text-gray-500 mb-6">Cardiovascular</span>
                    <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
                       <span className="text-4xl font-bold text-gray-900">74<span className="text-xl text-gray-400 ml-1">%</span></span>
                       <span className="text-[0.75rem] font-bold text-[#DC2626] tracking-widest uppercase bg-[#FEF2F2] px-2 py-1 rounded-md">Elevated</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-[#DC2626] rounded-full transition-all duration-1000" style={{width: '74%'}}></div>
                    </div>
                 </div>

                 {/* Gauge 2 */}
                 <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-3xl">
                     <span className="block text-[0.8rem] uppercase font-bold tracking-widest text-gray-500 mb-6">Mobility Stability</span>
                    <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
                       <span className="text-4xl font-bold text-gray-900">12<span className="text-xl text-gray-400 ml-1">%</span></span>
                       <span className="text-[0.75rem] font-bold text-[#059669] tracking-widest uppercase bg-[#ecfdf5] px-2 py-1 rounded-md">Minimal</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-[#059669] rounded-full transition-all duration-1000" style={{width: '12%'}}></div>
                    </div>
                 </div>

                 {/* Gauge 3 */}
                 <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-3xl">
                     <span className="block text-[0.8rem] uppercase font-bold tracking-widest text-gray-500 mb-6">Cognitive Health</span>
                    <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
                       <span className="text-4xl font-bold text-gray-900">38<span className="text-xl text-gray-400 ml-1">%</span></span>
                       <span className="text-[0.75rem] font-bold text-[#0F766E] tracking-widest uppercase bg-[#F0FDFA] px-2 py-1 rounded-md">Baseline</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0F766E] rounded-full transition-all duration-1000" style={{width: '38%'}}></div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Clinical Outlook Dark Box */}
            <div className="bg-[#0F766E] rounded-3xl shadow-md p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
               <div className="w-20 h-20 shrink-0 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md z-10">
                 <TrendingUp className="w-8 h-8 text-white" />
               </div>
               <div className="z-10 text-center md:text-left">
                  <h4 className="text-white font-bold text-[1.25rem] tracking-tight mb-2">Clinical Outlook</h4>
                  <p className="text-blue-100 text-[1.05rem] leading-relaxed font-medium">
                    Current trajectory shows positive stabilization in cardiovascular markers following medication adjustment. Continue monitoring hydration levels during activity.
                  </p>
               </div>
               {/* Decor */}
               <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            </div>

          </div>

          {/* Right Block -> Medication List */}
          <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 md:p-10 flex flex-col">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-[#F0FDFA] rounded-full flex items-center justify-center">
                 <Pill className="w-6 h-6 text-[#0F766E]" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Medications</h3>
             </div>

             <div className="space-y-6 flex-1">
               <div className="flex gap-4 items-center bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-2xl">
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex justify-center items-center shrink-0 text-[#0F766E]">
                   <Pill className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="font-bold text-gray-900 text-[1.05rem]">Lisinopril</h5>
                    <p className="text-[0.8rem] text-gray-500 font-bold uppercase tracking-widest mt-0.5">10MG • DAILY AM</p>
                 </div>
               </div>

               <div className="flex gap-4 items-center bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-2xl">
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex justify-center items-center shrink-0 text-[#059669]">
                   <Pill className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="font-bold text-gray-900 text-[1.05rem]">Atorvastatin</h5>
                    <p className="text-[0.8rem] text-gray-500 font-bold uppercase tracking-widest mt-0.5">20MG • NIGHTLY</p>
                 </div>
               </div>

               <div className="flex gap-4 items-center bg-gray-50 border border-[#E5E7EB] p-4 rounded-2xl opacity-70">
                 <div className="w-14 h-14 rounded-2xl bg-gray-200 flex justify-center items-center shrink-0 text-gray-400">
                   <Pill className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="font-bold text-gray-500 text-[1.05rem]">Metformin</h5>
                    <p className="text-[0.8rem] text-gray-400 font-bold uppercase tracking-widest mt-0.5">500MG • DISCONTINUED</p>
                 </div>
               </div>
             </div>

             <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                 <button className="w-full bg-[#0F766E] hover:bg-[#047857] text-white py-4 rounded-2xl text-[1.05rem] font-bold transition-all flex items-center justify-center gap-2 shadow-md">
                 <Printer className="w-5 h-5" /> Print Prescription
               </button>
             </div>
          </div>
          
        </section>

        {/* Clinical Alerts History Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 overflow-hidden">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                 <History className="w-5 h-5 md:w-6 md:h-6 text-[#DC2626]" />
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Alerts History</h3>
             </div>
             <span className="text-[0.7rem] md:text-[0.85rem] font-bold tracking-widest uppercase text-gray-400">Archival Data</span>
           </div>

           <div className="overflow-x-auto -mx-6 md:mx-0">
             <div className="inline-block min-w-full align-middle px-6 md:px-0">
               <table className="w-full text-left border-collapse min-w-[700px]">
                 <thead>
                    <tr className="border-b-2 border-[#E5E7EB]">
                      <th className="pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest text-gray-400 w-1/6">Event Date</th>
                      <th className="pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest text-gray-400 w-1/5">Alert Type</th>
                      <th className="pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest text-gray-400 w-1/6">Metric</th>
                      <th className="pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest text-gray-400 w-1/6">Status</th>
                      <th className="pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest text-gray-400 flex-1">Actions Taken</th>
                    </tr>
                 </thead>
                 <tbody className="text-[0.95rem] md:text-[1.05rem] text-gray-900 font-medium">
                   <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors">
                     <td className="py-6 font-bold text-gray-900">Oct 12, 2023</td>
                     <td className="py-6 text-gray-700">Tachycardia Episode</td>
                     <td className="py-6 font-bold text-[#DC2626]">114 BPM</td>
                     <td className="py-6"><span className="bg-[#ecfdf5] text-[#059669] px-3 py-1.5 rounded-xl text-[0.75rem] md:text-[0.85rem] font-bold uppercase tracking-wider">Resolved</span></td>
                     <td className="py-6 text-gray-500">Caregiver notified, patient rested for 20m.</td>
                   </tr>
                   <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors">
                     <td className="py-6 font-bold text-gray-900">Sep 28, 2023</td>
                     <td className="py-6 text-gray-700">Medication Missed</td>
                     <td className="py-6 font-semibold text-gray-500">Lisinopril</td>
                     <td className="py-6"><span className="bg-[#ecfdf5] text-[#059669] px-3 py-1.5 rounded-xl text-[0.75rem] md:text-[0.85rem] font-bold uppercase tracking-wider">Resolved</span></td>
                     <td className="py-6 text-gray-500">Dosage taken at 14:00. Logged.</td>
                   </tr>
                   <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors">
                     <td className="py-6 font-bold text-gray-900">Aug 15, 2023</td>
                     <td className="py-6 text-gray-700">Oxygen Desat</td>
                     <td className="py-6 font-bold text-[#D97706]">91% SpO2</td>
                     <td className="py-6"><span className="bg-[#ecfdf5] text-[#059669] px-3 py-1.5 rounded-xl text-[0.75rem] md:text-[0.85rem] font-bold uppercase tracking-wider">Resolved</span></td>
                     <td className="py-6 text-gray-500">Adjusted ventilation mask fit.</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
        </section>

        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col md:flex-row justify-between items-start md:items-center text-[0.95rem]">
          <div className="flex flex-col md:flex-row md:gap-20 gap-6">
            <div>
              <span className="block text-[0.8rem] uppercase font-bold tracking-widest text-gray-400 mb-1">Authenticated By</span>
              <span className="font-bold text-gray-900 text-lg">Dr. Arthur B. Sterling II</span>
            </div>
            <div>
              <span className="block text-[0.8rem] uppercase font-bold tracking-widest text-gray-400 mb-1">Generated At</span>
              <span className="text-gray-500 font-semibold">Jan 24, 2024 | 09:42:12 GMT</span>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <span className="text-[0.85rem] uppercase font-bold tracking-widest text-[#0F766E]">Confidential - Physician Eyes Only</span>
          </div>
        </footer>

       </main>
    </div>
  );
}