import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, Search, Plus, ShieldCheck, Clock, Pill, Activity, Heart, Wind, Edit2, Menu, AlertTriangle, Calendar, Check } from "lucide-react";
import { useMobileMenu } from "../context/MobileMenuContext";

export default function Dashboard() {
  const { openMobileMenu } = useMobileMenu();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Weekly");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulated fetch or warmup
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#F8FAFC] min-h-screen p-4 lg:p-8 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl w-full mb-8 shadow-sm"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
          <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
          <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Top Navigation - Desktop ONLY */}
      <header className="hidden lg:flex px-4 lg:px-5 py-2 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="hidden md:block relative w-[280px] lg:w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-[16px] w-[16px] text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#E5E7EB] border-transparent text-[0.85rem] text-gray-900 rounded-lg py-1.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Bell className="w-[18px] h-[18px]" fill="currentColor" />
          </Link>
          <Link to="/settings" className="hidden sm:block text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Settings className="w-[18px] h-[18px]" fill="currentColor" />
          </Link>
          <div className="flex items-center gap-2 md:gap-3 md:pl-5 md:border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-[0.85rem] font-bold text-gray-900 leading-tight">Dr. Rajesh Malhotra</p>
              <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Senior Consultant</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-gray-50">
              <img src="https://img.freepik.com/premium-vector/3d-avatar-young-man-with-glasses-shirt-vector-illustration_1150-65064.jpg" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 lg:px-5 py-4 mx-auto max-w-[1200px] w-full">

        {/* MOBILE VIEW (Exactly like Screenshot 3) */}
        <div className="lg:hidden space-y-5 pb-24 px-4 bg-[#F8FAFC]">

          {/* Header */}
          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={openMobileMenu}
              className="p-1 text-[#0F4D4A]"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
            <Link to="/emergency-mode" className="bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
              SOS
            </Link>
          </div>

          {/* Profile Card / User Profile */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-[#F0FDFA] shrink-0 shadow-sm">
                <img src="https://img.freepik.com/premium-photo/portrait-senior-man-business-attire-looking-camera_1113424-32525.jpg" alt="Rajesh Kumar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <div>
                      <h2 className="text-[1.4rem] font-black text-[#0F4D4A] leading-tight">Rajesh Kumar</h2>
                      <p className="text-[0.85rem] text-gray-400 font-bold uppercase tracking-wider">Patient Profile</p>
                   </div>
                   <button className="w-10 h-10 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F4D4A]">
                      <Edit2 size={18} />
                   </button>
                </div>
                <div className="flex gap-2 mt-2">
                   <span className="bg-[#E0F2FE] text-[#0369A1] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">75 Years</span>
                   <span className="bg-[#FEF9C3] text-[#854D0E] text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">B+ Positive</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
               <div className="text-center">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Height</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">172 cm</p>
               </div>
               <div className="text-center border-x border-gray-100">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">68 kg</p>
               </div>
               <div className="text-center">
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">BMI</p>
                  <p className="text-[0.95rem] font-black text-[#0F4D4A]">22.4</p>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F4D4A] rounded-[2rem] p-5 text-white shadow-lg shadow-[#0F4D4A]/20">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-60 mb-2">ADHERENCE</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black">94</span>
                <span className="text-[0.9rem] font-bold opacity-60">%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#52DFBB] rounded-full w-[94%] transition-all duration-1000"></div>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-2">NEXT DOSE</p>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F4D4A]">
                   <Clock size={18} />
                </div>
                <span className="text-[1.2rem] font-black text-[#0F4D4A]">12:30 PM</span>
              </div>
              <p className="text-[0.7rem] text-gray-400 font-bold uppercase tracking-widest">In 45 Minutes</p>
            </div>
          </div>

          {/* Active Medications Scroll */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-[1.1rem] font-black text-[#0F4D4A]">Active Meds</h3>
              <Link to="/medications" className="text-[0.75rem] font-black text-[#0F4D4A]/50 uppercase tracking-widest">See All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {[
                { name: "Amoxicillin", dose: "500mg", type: "Antibiotic", status: "New Added", color: "bg-[#0F4D4A]", textColor: "text-white" },
                { name: "Metformin", dose: "500mg", type: "Diabetes", status: "Ongoing", color: "bg-white", textColor: "text-[#0F4D4A]" },
                { name: "Lisinopril", dose: "10mg", type: "BP Control", status: "Stable", color: "bg-white", textColor: "text-[#0F4D4A]" },
                { name: "Aspirin", dose: "81mg", type: "Heart", status: "Ongoing", color: "bg-white", textColor: "text-[#0F4D4A]" },
              ].map((med, i) => (
                <div key={i} className={`min-w-[160px] ${med.color} rounded-[2rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[180px] transition-transform active:scale-95`}>
                   <div>
                      <span className={`text-[0.55rem] font-black uppercase tracking-[0.15em] opacity-60 mb-2 block ${med.textColor}`}>{med.status}</span>
                      <h4 className={`text-[1.1rem] font-black leading-tight ${med.textColor}`}>{med.name}</h4>
                      <p className={`text-[0.75rem] font-bold opacity-60 ${med.textColor}`}>{med.type}</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className={`text-[0.85rem] font-black ${med.textColor}`}>{med.dose}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${med.color === 'bg-white' ? 'bg-gray-50' : 'bg-white/10'}`}>
                         <Pill size={16} className={med.textColor} />
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Schedule */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-[1.1rem] font-black text-[#0F4D4A]">Today's Schedule</h3>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#20D898] animate-pulse"></div>
                 <span className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
            <div className="space-y-4">
              {/* Added Amoxicillin */}
              <div className="bg-white border border-gray-100 rounded-[1.8rem] p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#52DFBB]"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F0FDFA] rounded-2xl flex flex-col items-center justify-center text-[#0F4D4A]">
                    <span className="text-[1rem] font-black leading-none">12</span>
                    <span className="text-[0.6rem] font-black uppercase opacity-60">PM</span>
                  </div>
                  <div>
                    <h4 className="text-[1.05rem] font-black text-[#0F4D4A]">Amoxicillin</h4>
                    <p className="text-[0.85rem] text-gray-400 font-bold">500mg • After Lunch</p>
                  </div>
                </div>
                <button className="bg-[#0F4D4A] text-white px-5 py-2.5 rounded-xl text-[0.85rem] font-black shadow-lg shadow-[#0F4D4A]/10 active:scale-90 transition-transform">
                  LOG
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-[1.8rem] p-5 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                    <span className="text-[1rem] font-black leading-none">08</span>
                    <span className="text-[0.6rem] font-black uppercase opacity-60">AM</span>
                  </div>
                  <div>
                    <h4 className="text-[1.05rem] font-black text-gray-400">Aspirin</h4>
                    <p className="text-[0.85rem] text-gray-400 font-bold italic">Logged at 08:04 AM</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-[#20D898] rounded-full flex items-center justify-center text-white shadow-inner">
                  <Check size={20} strokeWidth={4} />
                </div>
              </div>
            </div>
          </section>

          {/* History Overview */}
          <section>
            <h3 className="text-[1rem] font-bold text-[#0F4D4A] mb-3">History Overview</h3>
            <div className="bg-[#F1F5F9] rounded-2xl p-5 flex items-center gap-6">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="6" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="#0F4D4A" strokeWidth="6" fill="transparent" strokeDasharray="175.8" strokeDashoffset={175.8 * (1 - 0.85)} />
                </svg>
                <span className="absolute text-[0.85rem] font-bold text-[#0F4D4A]">85%</span>
              </div>
              <div>
                <h4 className="text-[0.95rem] font-bold text-[#0F4D4A] mb-1">Weekly Adherence</h4>
                <p className="text-[0.8rem] text-gray-500 font-medium leading-tight">Consistent morning logs. Afternoon dosages need attention.</p>
              </div>
            </div>
          </section>

        </div>

        {/* DESKTOP VIEW - PRESERVED */}
        <div className="hidden lg:block">

          {/* Alert Banner */}
          <div className="bg-[#fdeceb] border border-[#facccb] rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#b91c1c] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <span className="font-bold text-xs">!</span>
              </div>
              <div>
                <h4 className="text-[#991b1b] font-semibold text-[0.85rem]">Clinical Alert: Adherence Missing</h4>
                <p className="text-[#b91c1c] text-[0.8rem] mt-0.5 font-medium leading-tight">Kumar missed morning dose of Amlodipine. Contact supervisor if status persists.</p>
              </div>
            </div>
            <Link to="/risk-analysis" className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-4 py-1.5 rounded-lg text-[0.8rem] font-semibold whitespace-nowrap shadow-sm transition-colors text-center">
              Review
            </Link>
          </div>

          {/* Top Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

            {/* Global Safety Score (Left: 2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col justify-between h-[220px]">
              <div className="absolute top-5 right-5 text-gray-200 pointer-events-none">
                <ShieldCheck size={70} strokeWidth={1.5} fill="#E5E7EB" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 bg-[#F0FDFA] text-[#0F766E] px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></div>
                  Compliance
                </div>
                <h3 className="text-[1rem] font-bold text-gray-900 mb-1">Patient Safety Score</h3>
                <p className="text-gray-500 text-[0.85rem] w-3/4 leading-tight font-medium">
                  Rajesh Kumar's overall health score based on adherence, vitals, and prescription analysis.
                </p>
              </div>

              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-[3.5rem] font-bold text-[#0F766E] tracking-tight leading-none">92</span>
                <span className="text-[1.4rem] text-gray-400 font-bold leading-none">/100</span>
                <div className="ml-3 flex flex-col justify-center">
                  <span className="text-[#0F766E] font-bold text-[0.85rem]">Excellent</span>
                  <span className="text-gray-400 text-xs font-medium">↑ 4% from last audit</span>
                </div>
              </div>
            </div>

            {/* Upcoming Doses (Right: 1 col) */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-[220px]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[1rem] font-bold text-gray-900">Doses</h3>
                  <Link to="/medications" className="text-[0.6rem] font-black text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded hover:bg-[#0F766E] hover:text-white transition-all uppercase tracking-wider border border-[#0F766E]/10">
                    Manage
                  </Link>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#8aa1ba] flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between relative pl-3">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-3 w-[1.5px] bg-gray-100"></div>

                {/* Item 1 */}
                <div className="relative pl-5 group cursor-pointer">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0F766E] ring-4 ring-white"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.85rem] font-bold text-gray-900 mb-0 leading-none">12:30 PM</p>
                      <p className="text-[0.8rem] text-[#0F766E] font-medium">Amoxicillin</p>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="relative pl-5 group cursor-pointer">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.85rem] font-bold text-gray-900 mb-0 leading-none">02:00 PM</p>
                      <p className="text-[0.8rem] text-gray-500 font-medium">Saline IV</p>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="relative pl-5 group cursor-pointer">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.85rem] font-bold text-gray-900 mb-0 leading-none">06:00 PM</p>
                      <p className="text-[0.8rem] text-gray-500 font-medium">Lisinopril</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* Active Medications */}
          <section className="mb-4">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-[1rem] font-bold text-gray-900">Active Medications</h3>
              <Link to="/medication-history" className="text-[0.8rem] font-bold text-[#0F766E] hover:underline flex items-center gap-1">
                History →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-[140px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                    <Pill size={16} className="fill-[#0F766E]" />
                  </div>
                  <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.7rem] font-bold px-2 py-0.5 rounded">Active</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-[0.9rem]">Metformin</h4>
                  <p className="text-gray-500 text-[0.75rem] font-medium">500mg Oral</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2">
                  <p className="text-[0.75rem] text-gray-400 font-medium">Next: 12:30 PM</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-[140px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e5e7fd] text-[#4f46e5] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 6v1a5 5 0 0 0 10 0V6" /><path d="M12 21v-3" /><path d="M9 21h6" /><path d="M10 3h4" /><path d="M12 3v2" /></svg>
                  </div>
                  <span className="bg-[#e0e7ff] text-[#4338ca] text-[0.7rem] font-bold px-2 py-0.5 rounded">Ongoing</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-[0.9rem]">Telmisartan</h4>
                  <p className="text-gray-500 text-[0.75rem] font-medium">40mg Oral</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2">
                  <p className="text-[0.75rem] text-gray-400 font-medium">Normal Flow</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-[140px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <span className="bg-[#f3f4f6] text-[#4b5563] text-[0.7rem] font-bold px-2 py-0.5 rounded">Stable</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-[0.9rem]">Amlodipine</h4>
                  <p className="text-gray-500 text-[0.75rem] font-medium">5mg Oral</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2">
                  <p className="text-[0.75rem] text-gray-400 font-medium">Last: 8:00 AM</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-transparent hover:bg-white hover:border-gray-300 transition-colors p-4 flex flex-col items-center justify-center cursor-pointer h-[140px]">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 mb-2 bg-white shadow-sm">
                  <Plus size={16} />
                </div>
                <span className="text-gray-500 font-medium text-[0.8rem]">New Rx</span>
              </div>
            </div>
          </section>

          {/* Bottom Section: Vitals and Trends */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            {/* Patient Vitals */}
            <div className="lg:col-span-1 flex flex-col">
              <h3 className="text-[1.1rem] font-bold text-gray-900 mb-4">Patient Vitals</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 flex-1">
                {/* Heart Rate */}
                <div className="bg-[#E5E7EB] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Heart Rate</span>
                    <Heart className="w-4 h-4 text-[#dc2626] fill-[#dc2626]" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-bold text-gray-900 leading-none">72</span>
                    <span className="text-xs font-bold text-gray-400">BPM</span>
                  </div>
                  <div className="h-[5px] w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F766E] rounded-full w-[72%]"></div>
                  </div>
                </div>

                {/* Oxygen */}
                <div className="bg-[#E5E7EB] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Oxygen (SPO2)</span>
                    <Wind className="w-4 h-4 text-[#0F766E]" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-bold text-gray-900 leading-none">98</span>
                    <span className="text-xs font-bold text-gray-400">%</span>
                  </div>
                  <div className="h-[5px] w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F766E] rounded-full w-[98%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Trends */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[1.1rem] font-bold text-gray-900">Safety Trends</h3>
                <div className="flex bg-[#E5E7EB] rounded-lg p-1">
                  <button
                    onClick={() => setTab("Daily")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === "Daily" ? "text-gray-900 bg-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTab("Weekly")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === "Weekly" ? "text-white bg-[#0F766E] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Weekly
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4 h-[180px] mb-4">
                  {/* Dynamic Chart Bars */}
                  {(tab === "Weekly" ? [
                    { h: "30%", c: "bg-[#c0f1df]" },
                    { h: "50%", c: "bg-[#87ead0]" },
                    { h: "55%", c: "bg-[#52dfbb]" },
                    { h: "40%", c: "bg-[#fadada]" },
                    { h: "65%", c: "bg-[#20d898]", active: true },
                    { h: "25%", c: "bg-[#E5E7EB]" },
                    { h: "35%", c: "bg-[#E5E7EB]" }
                  ] : [
                    { h: "45%", c: "bg-[#c0f1df]" },
                    { h: "65%", c: "bg-[#87ead0]" },
                    { h: "30%", c: "bg-[#fadada]" },
                    { h: "75%", c: "bg-[#52dfbb]" },
                    { h: "85%", c: "bg-[#20d898]", active: true },
                    { h: "60%", c: "bg-[#87ead0]" },
                    { h: "40%", c: "bg-[#c0f1df]" }
                  ]).map((bar, i) => (
                    <div
                      key={i}
                      className={`w-full ${bar.c} rounded-t-sm transition-all hover:opacity-80 ${bar.active ? 'border-2 border-gray-900 shadow-sm relative' : ''}`}
                      style={{ height: bar.h }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-[0.8rem] font-semibold text-gray-400">
                  {(tab === "Weekly" ? ["Mon", "Tue", "Wed", "Thu (Risk)", "Today", "Sat", "Sun"] : ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]).map((label, i) => (
                    <span
                      key={i}
                      className={`w-full text-center ${label === "Thu (Risk)" ? "text-[#b91c1c]" : label === "Today" || label === "16:00" ? "text-[#0F766E] font-bold" : ""}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}