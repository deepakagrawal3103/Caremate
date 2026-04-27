import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { emergencyAPI } from "../features/emergency/emergencyAPI";
import { Briefcase, AlertTriangle, Pill as PillIcon, Contact, ShieldCheck } from "lucide-react";

export default function PublicProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const data = await emergencyAPI.getPublicProfile(id);
        setPatientData(data);
      } catch (error) {
        console.error("Failed to fetch public profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatientData();
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
          <span>Blood Type: {patientData?.bloodGroup || "Unknown"}</span>
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
            {patientData?.chronicConditions?.length > 0 ? patientData.chronicConditions.map((condition, idx) => (
              <div key={idx} className="flex justify-between items-center text-primary text-lg">
                <span className="font-bold text-gray-900">{condition}</span>
                <span className="text-secondary text-base italic font-medium">Recorded Case</span>
              </div>
            )) : (
              <p className="text-gray-400 font-medium italic">No chronic conditions recorded</p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white shadow-lg rounded-2xl p-8 ">
          <div className="flex items-center gap-4 mb-7">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-base font-bold tracking-widest uppercase text-red-500">LIFE-THREATENING ALLERGIES</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-1">
            {patientData?.allergies?.length > 0 ? patientData.allergies.map((allergy, idx) => (
              <div key={idx} className="bg-red-50 px-5 py-[0.6rem] rounded-xl text-base font-bold text-red-500 shadow-sm ">
                {allergy}
              </div>
            )) : (
              <p className="text-gray-400 font-medium italic">No allergies recorded</p>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white shadow-lg rounded-2xl p-8 ">
          <div className="flex items-center gap-4 mb-7">
            <PillIcon className="w-5 h-5 text-red-800" />
            <span className="text-base font-bold tracking-widest uppercase text-secondary">CURRENT MEDICATION LOGS</span>
          </div>
          <div className="space-y-4">
            {patientData?.medications?.length > 0 ? patientData.medications.map((med, idx) => (
              <div key={idx} className="bg-white border border-border p-6 rounded-2xl flex justify-between items-center shadow-sm ">
                <div>
                  <h5 className="font-bold text-gray-900 text-lg mb-1">{med.name}</h5>
                  <p className="text-gray-500 text-base font-semibold">{med.form || "Medication"}</p>
                </div>
                <span className="text-base font-bold text-[#506071]">{med.strength}</span>
              </div>
            )) : (
              <p className="text-gray-400 font-medium italic">No active medications found</p>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-primary rounded-2xl p-8 shadow-md mt-2">
          <div className="flex items-center gap-4 mb-6">
            <Contact className="w-[1.35rem] h-[1.35rem] text-white" />
            <span className="text-base font-bold tracking-widest uppercase text-white/90">PRIMARY EMERGENCY CONTACT</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between">
            {patientData?.emergencyContacts?.length > 0 ? (
              <>
                <div>
                  <h4 className="font-sans font-bold text-white text-[1.7rem] mb-[0.35rem]">{patientData.emergencyContacts[0].name}</h4>
                  <p className="text-base text-blue-200 font-medium tracking-wide">{patientData.emergencyContacts[0].relation || "Primary Contact"}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                  <a href={`tel:${patientData.emergencyContacts[0].phone}`} className="font-bold text-white text-[1.15rem] tracking-wider mb-[0.35rem] bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                    Call {patientData.emergencyContacts[0].phone}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-white font-medium italic opacity-70">No emergency contacts listed</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
