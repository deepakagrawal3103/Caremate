import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone, AlertTriangle, Pill, Heart, ShieldAlert, User, Activity, Stethoscope, MapPin } from 'lucide-react';
import { QRCodeCanvas } from "qrcode.react";

export default function EmergencyMode() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] bg-[#8B7E7E] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-2 flex items-center justify-between shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h1 className="text-[#0F766E] font-black text-[1rem] tracking-tight uppercase">MedSecure Pro</h1>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <span className="text-[#DC2626] font-black text-[0.65rem] tracking-[0.2em] flex items-center gap-2">
            <span className="animate-pulse text-[0.7rem]">✱</span> CRITICAL PROTOCOL
          </span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#B91C1C] hover:bg-red-800 text-white px-4 py-1.5 rounded-lg text-[0.75rem] font-black flex items-center gap-2 transition-all shadow-md uppercase tracking-wider"
        >
          <X size={14} strokeWidth={4} /> Exit Mode
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto max-w-[1300px] mx-auto w-full">
        
        {/* Top Patient Card - Improved for mobile */}
        <div className="bg-white border-[2.5px] border-[#B91C1C] rounded-[1.2rem] p-4 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 shadow-xl shrink-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-gray-100">
                <img 
                  src="https://img.freepik.com/premium-photo/business-woman-portrait-office-confident-smile-happy-corporate-female-professional_590464-180010.jpg" 
                  alt="Sarah J. Miller" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#B91C1C] text-white p-1 rounded shadow-md">
                <ShieldAlert size={14} strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex-1 space-y-0.5">
              <p className="text-[0.55rem] md:text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.15em]">Patient Name</p>
              <h2 className="text-[1rem] md:text-[1.1rem] font-black text-gray-900 tracking-tight uppercase leading-none">Sarah J. Miller</h2>
              <div className="flex gap-4 mt-1.5 md:mt-2">
                <div>
                    <p className="text-[0.5rem] md:text-[0.55rem] font-bold text-gray-400 uppercase tracking-widest">Age / Sex</p>
                    <p className="text-[0.75rem] md:text-[0.85rem] font-black text-gray-900">38Y / F</p>
                </div>
                <div>
                    <p className="text-[0.5rem] md:text-[0.55rem] font-bold text-gray-400 uppercase tracking-widest">ID</p>
                    <p className="text-[0.75rem] md:text-[0.85rem] font-black text-gray-900">#SAR-908-23</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full md:w-auto gap-3 items-center justify-between md:justify-end flex-1">
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-2.5 md:p-3 flex flex-col justify-center flex-1 md:flex-none md:max-w-[140px]">
              <p className="text-[0.5rem] md:text-[0.55rem] font-bold text-[#B91C1C] uppercase tracking-[0.15em] mb-0.5">Blood Group</p>
              <p className="text-lg md:text-xl font-black text-[#B91C1C] leading-none text-center md:text-left">O POSITIVE</p>
            </div>

            <div className="flex-1 md:flex-none">
              <div className="bg-[#0F766E]/5 rounded-lg p-2 md:p-2.5 border border-[#0F766E]/10 w-full md:max-w-[180px]">
                 <div className="flex items-center gap-2 mb-1">
                    <Activity size={12} className="text-[#0F766E]" />
                    <span className="text-[0.5rem] md:text-[0.55rem] font-black text-[#0F766E] uppercase tracking-widest">Active Vitals</span>
                 </div>
                 <div className="flex justify-between gap-3">
                    <span className="text-[0.8rem] md:text-[0.9rem] font-black text-gray-900 whitespace-nowrap">76 <span className="text-[0.55rem] md:text-[0.6rem] text-gray-400 font-bold">BPM</span></span>
                    <span className="text-[0.8rem] md:text-[0.9rem] font-black text-gray-900 whitespace-nowrap">99 <span className="text-[0.55rem] md:text-[0.6rem] text-gray-400 font-bold">% O₂</span></span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid - Responsive stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          
          {/* Allergies - RED */}
          <div className="bg-[#B91C1C] rounded-[1.2rem] p-5 md:p-6 text-white shadow-xl flex flex-col shrink-0 lg:shrink">
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-white">
              <X size={14} strokeWidth={4} className="text-white" />
              <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">Severe Allergies</h3>
            </div>
            
            <div className="flex-1 space-y-3">
              <h4 className="text-xl md:text-2xl font-black border-b border-white/20 pb-2 tracking-tight uppercase text-white">Penicillin</h4>
              <h4 className="text-xl md:text-2xl font-black border-b border-white/20 pb-2 tracking-tight uppercase text-white">Aspirin</h4>
              <h4 className="text-xl md:text-2xl font-black border-b border-white/20 pb-2 tracking-tight uppercase text-white">Shellfish</h4>
            </div>

            <div className="mt-4 md:mt-6 pt-3 border-t border-white/20">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-80">Immediate Intervention Required</p>
            </div>
          </div>

          {/* Current Meds - WHITE */}
          <div className="bg-white rounded-[1.2rem] p-5 md:p-6 shadow-xl border border-gray-100 flex flex-col shrink-0 lg:shrink">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <div className="w-5 h-5 rounded bg-[#0F766E] text-white flex items-center justify-center">
                <Pill size={12} strokeWidth={3} />
              </div>
              <h3 className="text-[0.7rem] font-bold text-gray-900 uppercase tracking-[0.2em]">Clinical Meds</h3>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              <div className="bg-[#F8FAFC] border-l-[3px] border-[#0F766E] p-3 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[0.85rem] md:text-[0.9rem] font-black text-gray-900 uppercase tracking-tight">Metformin</h5>
                    <p className="text-gray-500 font-bold text-[0.6rem] md:text-[0.65rem]">500mg • Post-Lunch</p>
                  </div>
                  <span className="text-[#B91C1C] font-black text-[0.5rem] md:text-[0.55rem] uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded">Risk</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border-l-[3px] border-[#0F766E] p-3 rounded-r-lg">
                <h5 className="text-[0.85rem] md:text-[0.9rem] font-black text-gray-900 uppercase tracking-tight">Amlodipine</h5>
                <p className="text-gray-500 font-bold text-[0.6rem] md:text-[0.65rem]">5mg • Morning / BP</p>
              </div>

              <div className="bg-[#F8FAFC] border-l-[3px] border-[#0F766E] p-3 rounded-r-lg">
                <h5 className="text-[0.85rem] md:text-[0.9rem] font-black text-gray-900 uppercase tracking-tight">Atorvastatin</h5>
                <p className="text-gray-500 font-bold text-[0.6rem] md:text-[0.65rem]">10mg • Night / CHL</p>
              </div>
            </div>
          </div>

          {/* Contacts - NAVY */}
          <div className="bg-[#0F172A] rounded-[1.2rem] p-5 md:p-6 text-white shadow-xl flex flex-col md:col-span-2 lg:col-span-1 shrink-0 lg:shrink">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <User className="text-[#14B8A6] w-4 h-4" />
              <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#14B8A6]">Emergency Panel</h3>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 flex-1 overflow-y-auto pr-1">
              <div className="flex-1">
                <p className="text-[0.55rem] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Primary Care (Husband)</p>
                <h4 className="text-[0.9rem] md:text-[1rem] font-black mb-2 tracking-tight uppercase">David Miller</h4>
                <button className="w-full bg-white text-gray-900 py-3 md:py-2.5 rounded-lg font-black text-[0.8rem] flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 min-h-[44px]">
                  <Phone size={16} className="fill-current" /> +91 98765 43210
                </button>
              </div>

              <div className="flex-1">
                <p className="text-[0.55rem] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Operating Doctor</p>
                <h4 className="text-[0.9rem] md:text-[1rem] font-black mb-0.5 tracking-tight uppercase">Dr. Rajesh Malhotra</h4>
                <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 p-2.5 rounded-lg mb-2">
                   <p className="text-[0.55rem] md:text-[0.6rem] font-medium text-gray-300 leading-tight">Apollo Hospitals, Sarita Vihar, New Delhi</p>
                </div>
                <button className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-white py-3 md:py-2.5 rounded-lg font-black text-[0.8rem] flex items-center justify-center gap-2 transition-colors active:scale-95 min-h-[44px]">
                  <Phone size={16} /> +91 98765 43210
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                 <p className="text-[0.55rem] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 text-center">Clinical Profile QR</p>
                 <div className="bg-white p-2 md:p-2.5 rounded-xl shadow-lg inline-block">
                    <QRCodeCanvas value="https://medsafe-pro.ai/profile/sarah-miller-90823" size={100} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Marquee */}
      <footer className="bg-[#B91C1C] py-1.5 overflow-hidden border-t border-white/10">
        <div className="whitespace-nowrap flex gap-10 animate-marquee items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white font-black text-[0.65rem] tracking-[0.25em] uppercase">
              ✱ CRITICAL ALLERGY: PENICILLIN — DO NOT ADMINISTER
            </span>
          ))}
        </div>
      </footer>

      {/* Marquee Animation CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
