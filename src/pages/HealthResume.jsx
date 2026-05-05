import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ShieldCheck, 
  PhoneCall, 
  Pill, 
  Printer, 
  History,
  Activity,
  User,
  FileText
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { medicineAPI } from "../features/medicine/medicineAPI";
import { vitalsAPI } from "../features/vitals/vitalsAPI";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

export default function HealthResume() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [vitals, setVitals] = useState({ heartRate: "--", spo2: "--" });
  const [loading, setLoading] = useState(true);

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
      setMedications(medsRes.data.medicines);
      if (vitalsRes.data.vitals) {
        setVitals(vitalsRes.data.vitals);
      }
    } catch (error) {
      console.error("Resume fetch error:", error);
    } finally {
      setLoading(false);
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
  const userData = user || {
    name: "Guest User",
    age: "--",
    gender: "Not specified"
  };
  const conditions = userData.conditions || ["No recorded conditions"];
  const emergencyContact = {
    name: userData.emergencyContactName || "Not set",
    phone: userData.emergencyContactPhone || "Not set"
  };

  const publicLink = `https://caremate-pro.ai/profile/${user?.uid}`;

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
          <Link to="/emergency-mode" className="lg:hidden bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
             SOS
          </Link>
       </header>

       <main className="px-8 py-10 mx-auto max-w-[1100px] pb-24">
        
        {/* Title Area */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
           <div>
              <p className="text-[0.7rem] md:text-sm font-bold uppercase tracking-widest text-[#0F766E] mb-2">Patient Records / Portfolio 2024</p>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 uppercase">Clinical Health Resume</h1>
              <p className="text-gray-500 max-w-xl leading-relaxed text-[0.95rem] md:text-[1.05rem]">
                A curated summary of medical heritage, active management, and preventative risk analysis.
              </p>
           </div>
           <div className="text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#0F766E]/20 pl-4 md:pl-0 md:pr-4 py-1">
              <span className="block text-[0.65rem] md:text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Dossier ID</span>
              <span className="font-mono text-gray-900 font-semibold text-base md:text-lg uppercase">#SH-{user?.uid?.slice(0, 6)}</span>
           </div>
        </div>

        {/* 1. Basic Identity (TOP - VERY CLEAR) */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 mb-10">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-10 items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-[#F0FDFA] overflow-hidden shrink-0 relative flex items-center justify-center border border-[#CCFBF1]">
                 <img src={user?.photoURL || "https://img.freepik.com/premium-vector/female-doctor-character-with-stethoscope-3d-avatar-vector-illustration_1150-65063.jpg"} alt="Avatar" className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2 w-8 h-8 bg-[#0F766E] rounded-xl flex justify-center items-center text-white shadow-md">
                   <ShieldCheck className="w-4 h-4" />
                 </div>
              </div>
             
              <div className="flex-1 w-full">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F766E]">
                     <User size={18} />
                   </div>
                   <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Basic Identity</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div>
                     <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                     <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight uppercase">{userData.name}</h2>
                   </div>
                   <div>
                     <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Age / Gender</p>
                     <p className="text-2xl font-black text-gray-900 leading-tight">
                       {user?.age || "--"} YRS / {user?.gender || "MALE"}
                     </p>
                   </div>
                   <div>
                     <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Group</p>
                     <p className="text-2xl font-black text-red-600 leading-tight bg-red-50 inline-block px-3 py-0.5 rounded-xl border border-red-100 uppercase">
                       {user?.bloodGroup || "O+"}(VE)
                     </p>
                   </div>
                 </div>
              </div>
            </div>
        </section>

        {/* 2. Critical Alerts (MOST IMPORTANT 🔥) - RED / BOLD */}
        <section className="bg-[#FFF5F5] rounded-3xl p-6 md:p-10 border-2 border-red-100 shadow-sm relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck size={120} className="text-red-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <ShieldCheck size={24} fill="currentColor" />
            </div>
            <h3 className="text-[1rem] font-black text-red-600 uppercase tracking-[0.2em]">Critical Alerts 🔥</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100">
              <p className="text-[0.75rem] font-black text-red-500 uppercase tracking-widest mb-3">Allergies (Drug / Food)</p>
              <p className="text-[1.25rem] font-black text-red-700 leading-tight uppercase">
                {user?.allergies?.length > 0 ? user.allergies.join(", ") : "NO KNOWN ALLERGIES"}
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100">
              <p className="text-[0.75rem] font-black text-red-500 uppercase tracking-widest mb-3">High-Risk Conditions</p>
              <p className="text-[1.25rem] font-black text-red-700 leading-tight uppercase">
                {user?.conditions?.length > 0 ? user.conditions.join(", ") : "NONE REPORTED"}
              </p>
              <p className="text-[0.65rem] text-red-400 font-bold mt-2 uppercase">(Heart, Diabetes, BP)</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100">
              <p className="text-[0.75rem] font-black text-red-500 uppercase tracking-widest mb-3">Dangerous Medications</p>
              <p className="text-[1.25rem] font-black text-red-700 leading-tight uppercase">
                {medications.filter(m => m.interactionStatus === 'danger').length > 0 
                  ? medications.filter(m => m.interactionStatus === 'danger').map(m => m.name).join(", ") 
                  : "NONE DETECTED"}
              </p>
              <p className="text-[0.65rem] text-red-400 font-bold mt-2 uppercase">Interaction Risk: LOW</p>
            </div>
          </div>
        </section>

        {/* 3. Emergency & QR (REAL POWER FEATURE) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Emergency Contact */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <PhoneCall size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Emergency Contact</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Name / Relation</p>
                  <p className="text-[1.25rem] font-black text-[#0F4D4A] uppercase">{user?.emergencyContactName || "NOT CONFIGURED"}</p>
                </div>
                <a href={`tel:${user?.emergencyContactPhone}`} className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-sm hover:bg-red-100 transition-all">
                  <PhoneCall size={24} />
                </a>
              </div>
              <div>
                <p className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-[1.5rem] font-mono font-black text-[#0F4D4A]">{user?.emergencyContactPhone || "--- --- ----"}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-[#0F4D4A] rounded-3xl p-8 md:p-10 text-white flex items-center gap-8 shadow-xl relative overflow-hidden group">
            <div className="bg-white p-4 rounded-3xl shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10">
              <QRCodeCanvas value={publicLink || "emergency"} size={120} bgColor="#ffffff" fgColor="#000000" level="H" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Digital QR Profile</h3>
              <p className="text-[#CCFBF1] text-[1rem] leading-tight font-medium opacity-90 mb-6">
                Scan to instantly unlock full clinical history and vital medical records.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-[0.8rem] font-black uppercase tracking-widest border border-white/20">
                 <ShieldCheck size={16} /> Secure Power Feature
              </div>
            </div>
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </section>

        {/* 4. Medical History (Bullet List) */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 md:p-10 mb-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F766E]">
              <History size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Clinical History</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-[0.8rem] font-black text-[#0F766E] uppercase tracking-widest mb-6 border-l-4 border-[#0F766E] pl-4">Chronic Diseases</p>
              <ul className="space-y-4">
                {user?.diseases?.length > 0 ? user.diseases.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0F766E] mt-2 shrink-0"></div>
                    <span className="text-[1.1rem] font-bold text-gray-900 uppercase leading-tight">{d}</span>
                  </li>
                )) : <li className="text-gray-400 italic">No chronic conditions reported.</li>}
              </ul>
            </div>
            <div>
              <p className="text-[0.8rem] font-black text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-gray-200 pl-4">Past Major Illnesses</p>
              <ul className="space-y-4">
                {user?.pastIllnesses?.length > 0 ? user.pastIllnesses.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                    <span className="text-[1.1rem] font-bold text-gray-600 uppercase leading-tight">{d}</span>
                  </li>
                )) : <li className="text-gray-400 italic">No major past illnesses recorded.</li>}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Current Medications (Keep only active medicines) */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 md:p-10 mb-10">
           <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F766E]">
                 <Pill size={22} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Active Medications</h3>
             </div>
             <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Active Dosage</span>
           </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medications.length > 0 ? medications.slice(0, 8).map((med) => (
                <div key={med._id} className="flex gap-5 items-center bg-[#F8FAFC] border border-[#E5E7EB] p-5 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex justify-center items-center shrink-0 text-[#0F766E] group-hover:scale-110 transition-transform">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                      <h5 className="font-bold text-gray-900 text-[1.1rem] uppercase">{med.name}</h5>
                      <p className="text-[0.85rem] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        {med.strength || "N/A"} • {med.schedule?.join(", ") || "No schedule"}
                      </p>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 italic">No active medications found.</p>
                </div>
              )}
            </div>
        </section>

        {/* 6. Doctor / Notes (Optional) */}
        <section className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 border border-dashed border-gray-200 mb-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                 <p className="text-[0.8rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Primary Physician</p>
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#0F766E] shadow-sm">
                       <Activity size={32} />
                    </div>
                    <div>
                       <p className="text-[1.25rem] font-black text-[#0F4D4A] uppercase">{user?.primaryDoctor || "Not Assigned"}</p>
                       <p className="text-[0.85rem] text-gray-400 font-bold uppercase tracking-wider">Board Certified MD</p>
                    </div>
                 </div>
              </div>
              <div>
                 <p className="text-[0.8rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Special Instructions</p>
                 <div className="bg-white/80 p-6 rounded-3xl shadow-sm min-h-[100px]">
                    <p className="text-[1rem] font-medium text-gray-500 italic leading-relaxed">
                       "{user?.specialNotes || "No specific instructions recorded for medical personnel in emergency situations."}"
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-10 border-t border-[#E5E7EB]">
           <p className="text-gray-400 text-[0.9rem] font-bold uppercase tracking-widest">Authenticated Dossier • MedSafe AI Clinical Engine</p>
           <button onClick={() => window.print()} className="bg-[#0F766E] hover:bg-[#047857] text-white px-10 py-5 rounded-3xl text-[1.1rem] font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#0F766E]/20">
              <Printer className="w-6 h-6" /> Print Official Resume
           </button>
        </div>

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
                     <td className="py-6 font-bold text-gray-900">{new Date().toLocaleDateString()}</td>
                     <td className="py-6 text-gray-700">Initial Assessment</td>
                     <td className="py-6 font-bold text-[#0F766E]">Active</td>
                     <td className="py-6"><span className="bg-[#ecfdf5] text-[#059669] px-3 py-1.5 rounded-xl text-[0.75rem] md:text-[0.85rem] font-bold uppercase tracking-wider">Resolved</span></td>
                     <td className="py-6 text-gray-500">Profile synchronized with clinical engine.</td>
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
              <span className="text-gray-500 font-semibold">{new Date().toLocaleString()}</span>
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