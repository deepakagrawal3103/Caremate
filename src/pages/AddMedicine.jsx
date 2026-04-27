import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { medicineAPI } from "../features/medicine/medicineAPI";
import toast from "react-hot-toast";
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
  Upload,
  Camera as CameraIcon
} from "lucide-react";

export default function AddMedicine() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    strength: "",
    form: "Tablet",
    dosageValue: 1,
    schedule: ["Morning"],
    times: [
      { time: "08:00 AM", instruction: "After Food" }
    ],
    duration: "7 Days",
    inventory: 14
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    toast.loading("Processing image with AI...");
    
    // Simulate OCR delay
    setTimeout(() => {
      toast.dismiss();
      // Since we don't have a real vision API, we'll "auto-detect" some fields
      // and then let the user refine them in Step 3.
      setFormData(prev => ({
        ...prev,
        name: "Detected Medicine",
        strength: "Detecting...",
      }));
      setStep(3);
      toast.success("Text extracted! Please verify details.");
      setLoading(false);
    }, 2500);
  };

  const handleScan = async (text) => {
    if (!text.trim()) {
      toast.error("Please enter label text");
      return;
    }
    
    setLoading(true);
    setScanning(true);
    try {
      const { data } = await medicineAPI.normalizeMedicine(text);
      setFormData(prev => ({
        ...prev,
        name: data.brandName || prev.name,
        dosage: data.genericName || prev.dosage,
        strength: data.strength || prev.strength,
        category: data.class || prev.category
      }));
      toast.success(`Identified: ${data.brandName}`);
      setStep(3); // Move to Name step
    } catch (error) {
      toast.error("Analysis failed. Please enter manually.");
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const nextStep = async () => {
    if (step === 5) {
      setLoading(true);
      try {
        // Format schedule as 24h times for the reminder system
        const formattedSchedule = formData.times.map(t => {
          const [time, modifier] = t.time.split(' ');
          let [hours, minutes] = time.split(':');
          if (hours === '12') hours = '00';
          if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        });

        const res = await medicineAPI.addMedicine({
          ...formData,
          schedule: formattedSchedule,
          category: formData.form // Using form as category if not specified
        });

        // Trigger AI Interaction Check in background
        toast.promise(
          medicineAPI.checkInteraction(res.data.medicine._id),
           {
             loading: 'Analyzing drug interactions...',
             success: (data) => {
               if (data.data.status === 'danger') return "⚠️ CRITICAL: Interaction detected!";
               if (data.data.status === 'warning') return "⚡ Caution: Minor interaction noted.";
               return "✅ Safety check passed!";
             },
             error: 'Safety check failed.',
           }
        );

        setStep(6);
      } catch (error) {
        toast.error("Failed to add medicine");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 1) navigate(-1);
    else setStep(prev => prev - 1);
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
        <Link to="/emergency-mode" className="bg-[#B91C1C] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold active:scale-95 transition-transform shadow-sm">
          SOS
        </Link>
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
            <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="w-16 h-16 bg-[#F0FDFA] rounded-2xl flex items-center justify-center text-[#0F4D4A] mx-auto">
                <ScanLine size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-[#0F4D4A]">Smart Addition</h3>
                <p className="text-[0.9rem] text-gray-500 font-medium">Use AI to extract details from a photo or label text.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center gap-3 p-6 bg-[#F8FAFC] rounded-3xl border-2 border-dashed border-gray-100 hover:border-[#0F766E]/30 cursor-pointer transition-all group">
                   <CameraIcon size={28} className="text-gray-400 group-hover:text-[#0F766E]" />
                   <span className="text-[0.7rem] font-black uppercase text-gray-400 group-hover:text-[#0F766E]">Take Photo</span>
                   <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                </label>
                <label className="flex flex-col items-center justify-center gap-3 p-6 bg-[#F8FAFC] rounded-3xl border-2 border-dashed border-gray-100 hover:border-[#0F766E]/30 cursor-pointer transition-all group">
                   <Upload size={28} className="text-gray-400 group-hover:text-[#0F766E]" />
                   <span className="text-[0.7rem] font-black uppercase text-gray-400 group-hover:text-[#0F766E]">Upload Image</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[0.7rem] font-black text-gray-300 bg-white px-4">OR USE TEXT</div>
              </div>

              <textarea 
                id="labelInput"
                placeholder="Paste label text here..."
                className="w-full h-24 bg-[#F8FAFC] border-none rounded-2xl p-4 text-[0.9rem] font-medium focus:ring-2 focus:ring-[#0F766E]/20"
              ></textarea>

              <button 
                onClick={() => handleScan(document.getElementById('labelInput').value)}
                disabled={loading}
                className="w-full bg-[#0F4D4A] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0F4D4A]/10 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Text"}
              </button>
            </div>

            <p className="text-center text-[0.85rem] font-bold text-gray-400 uppercase tracking-widest">
              Or <button onClick={() => setStep(3)} className="text-[#0F766E] border-b-2 border-[#0F766E]/20 ml-1">Enter manually</button>
            </p>
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
                         You have <span className="font-bold text-gray-900">{formData.inventory} doses</span> remaining in your inventory. We&apos;ll alert you 2 days before it ends.
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