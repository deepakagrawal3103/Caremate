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
  Camera as CameraIcon,
  ShieldCheck,
  Bell,
  Volume2,
  X,
  Check,
  History,
  Activity
} from "lucide-react";

export default function AddMedicine() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, result
  const [analysisResult, setAnalysisResult] = useState(null);

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
    inventory: 14,
    frequencyType: "Daily",
    reminderEnabled: true,
    voiceReminder: "None"
  });

  const totalSteps = 7;

  // Handle Scan Logic
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setScanningStatus('scanning');
    
    // Simulate OCR delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: "Amoxicillin",
        strength: "500mg",
      }));
      setScanningStatus('result');
      setLoading(false);
    }, 2000);
  };

  const handleManualEntry = (name) => {
    setFormData(prev => ({ ...prev, name }));
    setStep(3);
  };

  const nextStep = async () => {
    if (step === 6) {
      setLoading(true);
      try {
        // Format schedule as 24h times for the reminder system
        const formattedSchedule = formData.times.map(t => {
          const [time, modifier] = t.time.split(' ');
          let [hours, minutes] = time.split(':');
          if (hours === '12' && modifier === 'AM') hours = '00';
          else if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        });

        const res = await medicineAPI.addMedicine({
          ...formData,
          schedule: formattedSchedule,
          category: formData.form
        });

        const analysis = await medicineAPI.checkInteraction(res.data.medicine._id);
        setAnalysisResult(analysis.data);
        setStep(7);
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

  const renderProgress = () => (
    <div className="flex gap-1.5 mb-6">
      {[...Array(totalSteps)].map((_, i) => (
        <div 
          key={i} 
          className={`h-1 flex-1 rounded-full transition-all duration-700 ${i + 1 <= step ? 'bg-primary' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans pb-24 selection:bg-[#0F4D4A]/10 overflow-x-hidden">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] h-[52px]">
        <button onClick={prevStep} className="p-1.5 text-text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] leading-none mb-1">Step {step} of {totalSteps}</span>
          <h1 className="text-[0.9rem] font-black text-primary uppercase tracking-tight">Add Medication</h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto">
        {renderProgress()}

        {/* STEP 1: ENTRY */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 pt-2">
              <h2 className="text-[1.8rem] font-black text-primary leading-tight uppercase tracking-tight">Medication Entry</h2>
              <p className="text-[0.9rem] text-text-muted font-bold uppercase tracking-widest">Select entry method</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setStep(2)}
                className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all active:scale-95 text-left flex items-center gap-5"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:rotate-12 transition-transform">
                  <ScanLine size={32} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-black text-primary uppercase leading-none mb-1">AI Smart Scan</h3>
                  <p className="text-[0.65rem] text-text-muted font-black uppercase tracking-[0.2em]">Fast Optical Recognition</p>
                </div>
              </button>

              <button
                onClick={() => { setScanningStatus('manual'); setStep(2); }}
                className="group bg-primary rounded-3xl p-6 shadow-xl shadow-primary/20 active:scale-95 transition-all text-left flex items-center gap-5"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:-rotate-12 transition-transform">
                  <FileEdit size={32} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-black text-white uppercase leading-none mb-1">Manual Entry</h3>
                  <p className="text-[0.65rem] text-white/50 font-black uppercase tracking-[0.2em]">Precise Data Input</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCAN / INPUT */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            {scanningStatus === 'scanning' ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-8">
                <div className="relative w-48 h-48 bg-white rounded-[3rem] border-2 border-dashed border-[#0F766E]/30 flex items-center justify-center overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-[#0F766E] shadow-[0_0_15px_#0F766E] animate-scan-bar z-10"></div>
                   <Pill size={80} className="text-[#0F766E]/20" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-[#0F4D4A] animate-pulse">Scanning...</h3>
                  <p className="text-gray-500 font-medium mt-2">Extracting medical details from label</p>
                </div>
              </div>
            ) : scanningStatus === 'result' ? (
              <div className="space-y-8 text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                   <Check size={40} strokeWidth={3} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#0F4D4A]">Detected Medicine</h3>
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm inline-block min-w-[280px]">
                     <span className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest block mb-2">Verified Name</span>
                     <p className="text-3xl font-black text-[#0F4D4A] tracking-tight">{formData.name}</p>
                     <p className="text-gray-400 font-bold mt-1">{formData.strength}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setStep(3)} className="w-full bg-[#0F4D4A] text-white py-5 rounded-full font-black text-[1.1rem] shadow-xl active:scale-95 transition-all">Yes, Correct</button>
                  <button onClick={() => setScanningStatus('manual')} className="w-full text-[#0F766E] font-black uppercase text-[0.8rem] tracking-widest">No, Edit Name</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-[2rem] font-black text-[#0F4D4A] leading-tight">Medicine Name</h2>
                  <p className="text-[1.1rem] text-gray-500 font-medium">What is the name on the package?</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F766E] transition-colors">
                    <Pill size={24} />
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Paracetamol"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-2 border-gray-50 focus:border-[#0F766E]/20 rounded-[2.5rem] py-6 pl-16 pr-8 text-[1.2rem] font-bold text-[#0F4D4A] shadow-sm outline-none transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Aspirin", "Ibuprofen", "Metformin", "Atorvastatin"].map(m => (
                    <button key={m} onClick={() => handleManualEntry(m)} className="px-5 py-2.5 bg-gray-50 text-gray-500 rounded-full text-[0.85rem] font-bold hover:bg-[#0F766E]/10 hover:text-[#0F766E] transition-all">
                      + {m}
                    </button>
                  ))}
                </div>

                {scanningStatus === 'idle' && (
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
                    <h4 className="text-[0.7rem] font-black text-gray-300 uppercase tracking-widest mb-6">Or use Camera</h4>
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <div className="w-20 h-20 bg-[#F0FDFA] rounded-full flex items-center justify-center text-[#0F766E]">
                        <CameraIcon size={32} />
                      </div>
                      <span className="text-[0.9rem] font-black text-[#0F766E] uppercase tracking-widest">Scan Label</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DOSAGE */}
        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-[1.8rem] font-black text-[#0F4D4A] leading-tight">How many times?</h2>
              <p className="text-[1.1rem] text-gray-500 font-medium">Select daily frequency</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 1, label: "Once", desc: "1x per day" },
                { id: 2, label: "Twice", desc: "2x per day" },
                { id: 3, label: "Thrice", desc: "3x per day" },
                { id: 0, label: "Custom", desc: "Set schedule" }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => {
                    const times = opt.id === 1 ? ["Morning"] : opt.id === 2 ? ["Morning", "Night"] : opt.id === 3 ? ["Morning", "Midday", "Night"] : ["Morning"];
                    setFormData({...formData, schedule: times});
                  }}
                  className={`p-6 rounded-[2.5rem] border-2 text-left transition-all active:scale-95 ${
                    (opt.id > 0 && formData.schedule.length === opt.id) || (opt.id === 0 && ![1,2,3].includes(formData.schedule.length))
                      ? 'bg-[#0F4D4A] border-[#0F4D4A] text-white shadow-xl shadow-[#0F4D4A]/20'
                      : 'bg-white border-gray-50 text-[#0F4D4A] shadow-sm'
                  }`}
                >
                  <h4 className="text-[1.2rem] font-black mb-1">{opt.label}</h4>
                  <p className={`text-[0.7rem] font-bold uppercase tracking-widest ${
                    (opt.id > 0 && formData.schedule.length === opt.id) || (opt.id === 0 && ![1,2,3].includes(formData.schedule.length))
                      ? 'text-white/50'
                      : 'text-gray-400'
                  }`}>{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] text-center">Select Timings</h4>
              <div className="flex justify-center gap-2">
                {[
                  { name: "Morning", icon: <Sunrise size={18} /> },
                  { name: "Midday", icon: <Sun size={18} /> },
                  { name: "Night", icon: <Moon size={18} /> }
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
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-primary-light border-primary text-primary'
                          : 'bg-white border-gray-100 text-gray-400'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[0.7rem] font-black uppercase tracking-tight">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SCHEDULE */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-[1.6rem] font-black text-primary uppercase tracking-tight">Set Schedule</h2>
              <p className="text-[0.85rem] text-text-muted font-bold uppercase tracking-widest">When should you take it?</p>
            </div>

            <div className="flex p-0.5 bg-gray-100 rounded-2xl">
              {["Daily", "Selected Days"].map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, frequencyType: type})}
                  className={`flex-1 py-3 rounded-xl text-[0.75rem] font-black uppercase tracking-widest transition-all ${
                    formData.frequencyType === type ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="card-premium space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-[0.9rem] font-black text-primary uppercase tracking-tight">Treatment Span</h4>
                   <p className="text-[0.65rem] text-text-muted font-black uppercase tracking-widest">Auto-duration tracking</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                   <button onClick={() => setFormData({...formData, duration: `${Math.max(1, parseInt(formData.duration) - 1)} Days`})} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm active:scale-90"><Minus size={14} /></button>
                   <span className="text-base font-black text-primary w-12 text-center leading-none">{formData.duration.split(' ')[0]}D</span>
                   <button onClick={() => setFormData({...formData, duration: `${parseInt(formData.duration) + 1} Days`})} className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md active:scale-90"><Plus size={14} /></button>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-primary-light p-4 rounded-xl border border-primary/10">
                <Calendar className="text-primary" size={24} />
                <div>
                  <p className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em]">Start Date</p>
                  <p className="text-[0.95rem] font-black text-primary uppercase leading-tight">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REMINDER */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-[1.6rem] font-black text-primary uppercase tracking-tight">Reminders</h2>
              <p className="text-[0.85rem] text-text-muted font-bold uppercase tracking-widest">Never miss a dose again</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${formData.reminderEnabled ? 'bg-primary text-white rotate-12 shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-300'}`}>
                     <Bell size={32} strokeWidth={3} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-lg font-black text-primary uppercase tracking-tight">Notifications</h3>
                     <p className="text-[0.75rem] text-text-muted font-bold leading-relaxed">Alerts for each scheduled dose.</p>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, reminderEnabled: !formData.reminderEnabled})}
                    className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[0.65rem] transition-all border ${
                      formData.reminderEnabled ? 'bg-primary-light text-primary border-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}
                  >
                    {formData.reminderEnabled ? 'Reminders On' : 'Reminders Off'}
                  </button>
               </div>
               
               <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                  <h4 className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Voice Reminder (Optional)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["None", "Soft Bell", "AI Voice", "Emergency"].map(voice => (
                      <button
                        key={voice}
                        onClick={() => setFormData({...formData, voiceReminder: voice})}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                          formData.voiceReminder === voice ? 'bg-white border-primary text-primary shadow-sm' : 'bg-white border-transparent text-gray-400'
                        }`}
                      >
                        <Volume2 size={14} />
                        <span className="text-[0.7rem] font-black uppercase tracking-tight">{voice}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center space-y-1">
                <h2 className="text-[1.8rem] font-black text-primary uppercase tracking-tight leading-none">Confirm Entry</h2>
                <p className="text-text-muted font-bold text-[0.85rem] uppercase tracking-widest">Final Clinical Review</p>
             </div>

             <div className="card-premium overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                      <ShieldCheck size={20} />
                   </div>
                </div>

                <div className="p-4 md:p-6 space-y-8">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3">
                         <Pill size={28} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-primary uppercase leading-tight">{formData.name}</h3>
                         <p className="text-primary font-black text-[0.65rem] uppercase tracking-widest opacity-80">{formData.strength} • {formData.form}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><History size={20} /></div>
                         <div>
                            <p className="text-[0.55rem] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Dosage & Schedule</p>
                            <p className="text-[0.95rem] font-black text-primary uppercase tracking-tight leading-none">{formData.dosageValue} Unit • {formData.schedule.join(", ")}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><Calendar size={20} /></div>
                         <div>
                            <p className="text-[0.55rem] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Duration</p>
                            <p className="text-[0.95rem] font-black text-primary uppercase tracking-tight leading-none">{formData.duration}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* STEP 7: AFTER SAVE / SUCCESS */}
        {step === 7 && (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl animate-pulse opacity-40"></div>
               <div className="w-28 h-28 bg-primary rounded-[2.5rem] shadow-2xl flex items-center justify-center text-white relative z-10 border-[6px] border-white">
                 <CheckCircle2 size={50} strokeWidth={3} />
               </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-[2rem] font-black text-primary leading-tight uppercase tracking-tight">Saved!</h2>
              <p className="text-[0.95rem] text-text-muted font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                <span className="text-primary">{formData.name}</span> is active.
              </p>
            </div>

            {analysisResult && (
              <div className={`w-full max-w-sm p-6 rounded-3xl border-2 shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 ${
                analysisResult.status === 'danger' ? 'bg-red-50 border-red-100 text-red-900' :
                analysisResult.status === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                'bg-emerald-50 border-emerald-100 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2 mb-3 justify-center">
                   <Activity size={18} className={analysisResult.status === 'danger' ? 'text-red-600' : analysisResult.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'} />
                   <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em]">Safety Scan</h4>
                </div>
                <p className="text-[0.85rem] font-black leading-relaxed mb-2 uppercase tracking-tight">
                   Status: {analysisResult.status}
                </p>
                <p className="text-[0.75rem] font-bold leading-relaxed opacity-80">
                  {analysisResult.interactions?.[0]?.effect || "Safe for use with current health profile."}
                </p>
              </div>
            )}

            <div className="w-full space-y-3 pt-4">
              <button
                onClick={() => navigate("/")}
                className="btn-premium w-full py-4 text-[1rem]"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => { setStep(1); setAnalysisResult(null); }}
                className="w-full bg-white text-text-muted py-3 rounded-xl font-black text-[0.7rem] uppercase tracking-widest active:scale-95 transition-all border border-gray-100"
              >
                Add Another
              </button>
            </div>
          </div>
        )}

        {/* STICKY FOOTER NAVIGATION */}
        {step < 7 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex gap-3 z-[100] max-w-lg mx-auto rounded-t-3xl shadow-2xl">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="w-12 h-12 bg-gray-50 text-text-muted border border-gray-100 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={loading || (step === 2 && !formData.name)}
              className="flex-1 bg-primary text-white py-3 rounded-2xl font-black text-[0.9rem] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : step === 6 ? (
                <>Finish <Check size={18} strokeWidth={3} /></>
              ) : (
                <>Next <ArrowRight size={18} strokeWidth={3} /></>
              )}
            </button>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-bar {
          0% { transform: translateY(0); }
          50% { transform: translateY(180px); }
          100% { transform: translateY(0); }
        }
        .animate-scan-bar {
          animation: scan-bar 2.5s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}