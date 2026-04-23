import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Briefcase, AlertTriangle, Pill as PillIcon, Contact, ShieldCheck } from "lucide-react";

export default function PublicProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    // In real app, fetch by id
    // Mocking for now to match UI layout requirement
    setTimeout(() => {
      setPatientData({
        name: "Arthur S. Vance",
        bloodType: "O Negative",
        risk: "High Risk",
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans text-primary">
        <div className="w-14 h-14 border-4 border-t-[#113757] border-[#e8e5dc] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      {/* Minimal Header */}
      <div className="bg-primary px-6 py-8 text-center text-white">
        <div className="w-14 h-14 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-white mb-4">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-3xl font-sans font-bold tracking-tight mb-2">{patientData?.name || "Patient Profile"}</h1>
        <div className="flex items-center justify-center gap-3 text-base font-medium tracking-wide text-white/80">
          <span>Blood Type: {patientData?.bloodType || "O Negative"}</span>
          <span>•</span>
          <span className="text-[#fbd0d0] font-bold">EMERGENCY ACCESS</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        
        {/* Risk Status */}
        <div className="bg-red-50 rounded-2xl p-6 flex items-center justify-between shadow-sm ">
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <h2 className="text-lg font-bold text-red-500">High Risk Patient</h2>
              <p className="text-base text-red-500/80 font-medium">Requires immediate attention to allergies and conditions</p>
            </div>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="bg-white shadow-lg rounded-2xl p-8 ">
          <div className="flex items-center gap-4 mb-7">
            <Briefcase className="w-5 h-5 text-red-800" />
            <span className="text-base font-bold tracking-widest uppercase text-secondary">CHRONIC CONDITIONS</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-primary text-lg">
              <span className="font-bold text-gray-900">Type 1 Diabetes Mellitus</span>
              <span className="text-secondary text-base italic font-medium">Insulin Dependent</span>
            </div>
            <div className="flex justify-between items-center text-primary text-lg">
              <span className="font-bold text-gray-900">Atrial Fibrillation</span>
              <span className="text-secondary text-base italic font-medium">Paroxysmal</span>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white shadow-lg rounded-2xl p-8 ">
          <div className="flex items-center gap-4 mb-7">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-base font-bold tracking-widest uppercase text-red-500">LIFE-THREATENING ALLERGIES</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-1">
            <div className="bg-red-50 px-5 py-[0.6rem] rounded-xl text-base font-bold text-red-500 shadow-sm ">
              Penicillin (Severe)
            </div>
            <div className="bg-red-50 px-5 py-[0.6rem] rounded-xl text-base font-bold text-red-500 shadow-sm ">
              Shellfish
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white shadow-lg rounded-2xl p-8 ">
          <div className="flex items-center gap-4 mb-7">
            <PillIcon className="w-5 h-5 text-red-800" />
            <span className="text-base font-bold tracking-widest uppercase text-secondary">CURRENT MEDICATION LOGS</span>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-border p-6 rounded-2xl flex justify-between items-center shadow-sm ">
              <div>
                <h5 className="font-bold text-gray-900 text-lg mb-1">Eliquis (Apixaban)</h5>
                <p className="text-gray-500 text-base font-semibold">Anticoagulant for Stroke Prevention</p>
              </div>
              <span className="text-base font-bold text-[#506071]">5mg - Twice Daily</span>
            </div>
            <div className="bg-white border border-border p-6 rounded-2xl flex justify-between items-center shadow-sm ">
              <div>
                <h5 className="font-bold text-gray-900 text-lg mb-1">Humalog (Lispro)</h5>
                <p className="text-gray-500 text-base font-semibold">Rapid-acting Insulin</p>
              </div>
              <span className="text-base font-bold text-[#506071]">Sliding Scale</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-primary rounded-2xl p-8 shadow-md mt-2">
          <div className="flex items-center gap-4 mb-6">
            <Contact className="w-[1.35rem] h-[1.35rem] text-white" />
            <span className="text-base font-bold tracking-widest uppercase text-white/90">PRIMARY EMERGENCY CONTACT</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <h4 className="font-sans font-bold text-white text-[1.7rem] mb-[0.35rem]">Eleanor Vance</h4>
              <p className="text-base text-blue-200 font-medium tracking-wide">Spouse & Legal Proxy</p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
              <a href="tel:+15559023481" className="font-bold text-white text-[1.15rem] tracking-wider mb-[0.35rem] bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                Call +1 (555) 902-3481
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
