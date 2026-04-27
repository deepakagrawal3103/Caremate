import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera,
  ChevronLeft,
  CheckCircle2,
  Plus,
  Minus,
  Sun,
  Sunrise,
  Moon,
  Clock,
  ChevronRight,
  Info,
  Lightbulb,
  FileEdit,
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Pill,
  Calendar,
  AlertCircle,
  Zap,
  Bell
} from "lucide-react";

export default function AddMedicine() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "Amoxicillin",
    strength: "500mg",
    form: "Tablet",
    dosageValue: 1,
    schedule: ["Morning", "Night"],
    times: [
      { time: "08:00 AM", instruction: "After Food" },
      { time: "09:00 PM", instruction: "Before Bed" }
    ],
    duration: "7 Days",
    inventory: 14
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (step === 1) navigate(-1);
    else setStep(prev => prev - 1);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep(3); // Go to refine details
    }, 3000);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans pb-24 selection:bg-[#0F4D4A]/10">
      {/* Mobile Header */}
      <header className="lg:hidden px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={prevStep} className="p-1 text-[#0F4D4A] active:scale-90 transition-transform">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative p-1.5 text-[#0F4D4A] hover:bg-[#F0FDFA] rounded-xl transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>
          <Link to="/emergency-mode" className="bg-[#B91C1C] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold active:scale-95 transition-transform shadow-sm">
            SOS
          </Link>
        </div>
      </header>

      <main className="px-5 py-6 max-w-md mx-auto">
        
        {/* STEP 1: CHOICE */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 bg-[#F0FDFA] px-3 py-1 rounded-full text-[#0F4D4A] text-[0.7rem] font-black uppercase tracking-widest border border-[#CCFBF1]">
                <Zap size={12} fill="currentColor" /> Smart Addition
              </div>
              <h2 className="text-[2rem] font-black text-[#0F4D4A] leading-tight">Add Medicine</h2>
              <p className="text-[1rem] text-gray-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                Select your preferred way to record your new medication.
              </p>
            </div>

            <div className="space-y-5">
              {/* Scan Option */}
              <div
                onClick={() => setStep(2)}
                className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFBF1]/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                <div className="w-20 h-20 bg-[#F0FDFA] rounded-3xl flex items-center justify-center text-[#0F4D4A] shadow-inner relative z-10">
                  <ScanLine size={36} strokeWidth={2.5} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-[1.3rem] font-black text-[#0F4D4A] mb-1">AI Smart Scan</h3>
                  <p className="text-[0.9rem] text-gray-400 font-bold uppercase tracking-wider">Fastest & Reliable</p>
                </div>
              </div>

              {/* Manual Option */}
              <div
                onClick={() => setStep(3)}
                className="group bg-[#0F4D4A] rounded-[2.5rem] p-8 shadow-xl shadow-[#0F4D4A]/20 active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white relative z-10">
                  <FileEdit size={36} strokeWidth={2.5} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-[1.3rem] font-black text-white mb-1">Manual Entry</h3>
                  <p className="text-[0.9rem] text-white/50 font-bold uppercase tracking-wider">Enter details yourself</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Lightbulb size={24} />
              </div>
              <p className="text-[0.9rem] text-gray-500 font-medium leading-relaxed">
                <span className="font-bold text-gray-900">Pro Tip:</span> Scanning the prescription or package automatically checks for dosage errors and interactions.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-[0.8rem] font-black text-[#0F4D4A] uppercase tracking-[0.2em]">Scanner View</h3>
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>

            <div className="relative aspect-[3/4] bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white">
              {/* Camera Feed Simulation */}
              <img 
                src="https://img.freepik.com/free-photo/pharmaceutical-container-with-tablets-pills_23-2148892408.jpg" 
                className="w-full h-full object-cover opacity-80" 
                alt="Scanning..."
              />
              
              {/* Scan Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Viewfinder */}
                <div className="w-64 h-64 border-2 border-white/30 rounded-[2rem] relative">
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#52DFBB] rounded-tl-xl"></div>
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#52DFBB] rounded-tr-xl"></div>
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#52DFBB] rounded-bl-xl"></div>
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#52DFBB] rounded-br-xl"></div>
                   
                   {/* Scanning Bar */}
                   {scanning && (
                     <div className="absolute inset-x-0 h-[2px] bg-[#52DFBB] shadow-[0_0_15px_#52DFBB] animate-scan-bar"></div>
                   )}
                </div>
                
                <p className="mt-8 text-white text-[0.95rem] font-bold text-center px-8 opacity-80 drop-shadow-md">
                   Align the medicine name or prescription within the box
                </p>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-10 inset-x-0 flex justify-center px-10">
                 {!scanning ? (
                   <button 
                    onClick={handleScan}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                   >
                     <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                       <Camera size={32} className="text-[#0F4D4A]" />
                     </div>
                   </button>
                 ) : (
                   <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white font-bold text-[0.9rem]">Analyzing Molecule...</span>
                   </div>
                 )}
              </div>
            </div>

            <button 
              onClick={() => setStep(1)}
              className="w-full py-4 text-gray-400 font-bold text-[0.9rem] uppercase tracking-widest"
            >
              Cancel Scanning
            </button>
          </div>
        )}

        {/* STEP 3: REFINE DETAILS */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div>
              <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Validate Data</h3>
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Medicine Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#0F4D4A]/10 focus:bg-white rounded-2xl p-4 font-bold text-[#0F4D4A] outline-none transition-all"
                    />
                    <Pill className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Strength</label>
                      <input 
                        type="text" 
                        value={formData.strength}
                        className="w-full bg-[#F8FAFC] border-2 border-transparent rounded-2xl p-4 font-bold text-[#0F4D4A] outline-none"
                        readOnly
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.7rem] font-black text-[#0F4D4A] uppercase tracking-widest ml-1">Form</label>
                      <input 
                        type="text" 
                        value={formData.form}
                        className="w-full bg-[#F8FAFC] border-2 border-transparent rounded-2xl p-4 font-bold text-[#0F4D4A] outline-none"
                        readOnly
                      />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-[0.9rem] text-emerald-800 font-medium leading-relaxed">
                <span className="font-bold">Molecule Verified.</span> This medication is safe for your current cardiac profile.
              </p>
            </div>

            <button
              onClick={nextStep}
              className="w-full bg-[#0F4D4A] text-white py-5 rounded-full font-black text-[1.1rem] flex items-center justify-center gap-3 shadow-xl shadow-[#0F4D4A]/20 active:scale-95 transition-all"
            >
              Set Schedule <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 4: SCHEDULE */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <section>
              <h4 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Dosage per intake</h4>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex items-center justify-between">
                <button
                  onClick={() => setFormData({ ...formData, dosageValue: Math.max(0.5, formData.dosageValue - 0.5) })}
                  className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 active:bg-gray-100 transition-colors"
                >
                  <Minus size={28} />
                </button>
                <div className="text-center">
                  <span className="text-[3rem] font-black text-[#0F4D4A] leading-none">{formData.dosageValue}</span>
                  <p className="text-[0.8rem] text-gray-400 font-black uppercase tracking-widest mt-1">Tablets</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, dosageValue: formData.dosageValue + 0.5 })}
                  className="w-14 h-14 rounded-2xl bg-[#0F4D4A] flex items-center justify-center text-white shadow-lg shadow-[#0F4D4A]/20 active:scale-90 transition-transform"
                >
                  <Plus size={28} />
                </button>
              </div>
            </section>

            <section>
              <h4 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Frequency</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Morning", icon: <Sunrise size={24} /> },
                  { name: "Midday", icon: <Sun size={24} /> },
                  { name: "Night", icon: <Moon size={24} /> }
                ].map((item) => {
                  const isSelected = formData.schedule.includes(item.name);
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        const newSchedule = isSelected
                          ? formData.schedule.filter(s => s !== item.name)
                          : [...formData.schedule, item.name];
                        setFormData({ ...formData, schedule: newSchedule });
                      }}
                      className={`flex flex-col items-center justify-center gap-4 py-6 rounded-[2rem] border-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-[#0F4D4A] border-[#0F4D4A] text-white shadow-lg shadow-[#0F4D4A]/20'
                          : 'bg-white border-transparent text-gray-400 shadow-sm'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[0.8rem] font-black uppercase tracking-wider">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
               <h4 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Treatment Duration</h4>
               <div className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#0F4D4A]">
                       <Calendar size={20} />
                    </div>
                    <span className="font-bold text-[#0F4D4A]">7 Days Course</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
               </div>
            </section>

            <button
              onClick={nextStep}
              className="w-full bg-[#0F4D4A] text-white py-5 rounded-full font-black text-[1.1rem] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
            >
              Review Order <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
             <div className="text-center space-y-2 mb-2">
                <h2 className="text-[1.8rem] font-black text-[#0F4D4A]">Final Review</h2>
                <p className="text-gray-500 font-medium text-[0.95rem]">Confirm details before activation</p>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 bg-gradient-to-br from-[#0F4D4A] to-[#0A3D3A] text-white">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                         <Pill size={28} />
                      </div>
                      <span className="px-3 py-1 bg-[#52DFBB] text-[#0F4D4A] rounded-lg text-[0.65rem] font-black uppercase tracking-widest">Prescribed</span>
                   </div>
                   <h3 className="text-[1.6rem] font-black leading-none mb-2">{formData.name}</h3>
                   <p className="text-white/60 font-bold text-[0.9rem] uppercase tracking-wider">{formData.strength} • {formData.form}</p>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[0.7rem] tracking-widest">Dosage</span>
                      <span className="text-[#0F4D4A] font-black text-[1.1rem]">{formData.dosageValue} Unit(s)</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[0.7rem] tracking-widest">Schedule</span>
                      <span className="text-[#0F4D4A] font-black text-[1.1rem]">{formData.schedule.join(" & ")}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[0.7rem] tracking-widest">Duration</span>
                      <span className="text-[#0F4D4A] font-black text-[1.1rem]">{formData.duration}</span>
                   </div>
                   
                   <div className="pt-4 border-t border-gray-50 flex items-start gap-4">
                      <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                      <p className="text-[0.85rem] text-gray-500 font-medium leading-snug">
                         You have <span className="font-bold text-gray-900">{formData.inventory} doses</span> remaining in your inventory. We'll alert you 2 days before it ends.
                      </p>
                   </div>
                </div>
             </div>

             <button
               onClick={nextStep}
               className="w-full bg-[#0F4D4A] text-white py-5 rounded-full font-black text-[1.2rem] shadow-2xl active:scale-95 transition-all"
             >
               Confirm & Add
             </button>
          </div>
        )}

        {/* STEP 6: SUCCESS */}
        {step === 6 && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
               <div className="absolute inset-0 bg-[#CCFBF1] rounded-full blur-2xl animate-pulse opacity-50"></div>
               <div className="w-32 h-32 bg-[#F0FDFA] rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-[#0F766E] relative z-10">
                 <CheckCircle2 size={56} strokeWidth={3} />
               </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-[2.2rem] font-black text-[#0F4D4A] leading-tight">Medication Added</h2>
              <p className="text-[1.05rem] text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                <span className="font-bold text-[#0F4D4A]">{formData.name}</span> has been successfully integrated into your care plan.
              </p>
            </div>

            <div className="w-full space-y-4 pt-6">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#0F4D4A] text-white py-5 rounded-full font-black text-[1.1rem] shadow-xl active:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-white border border-gray-100 text-gray-500 py-5 rounded-full font-black text-[1.1rem] shadow-sm active:scale-95 transition-all"
              >
                Add Another
              </button>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-bar {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan-bar {
          animation: scan-bar 2s linear infinite;
        }
      `}} />
    </div>
  );
}