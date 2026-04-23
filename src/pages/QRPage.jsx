import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import api from "../services/api";
import { Download, Share2, AlertTriangle, Pill as PillIcon, Phone, Activity, Stethoscope, MapPin, User } from "lucide-react";

export default function QRPage() {
  const [loading, setLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [publicLink, setPublicLink] = useState("https://medsafe-pro.ai/profile/sarah-miller-90823");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Try to get real data but don't block the UI
    try {
      const qrRes = await api.post("/emergency/qr/generate", {}, { silent: true });
      if (qrRes.data) {
        setPublicLink(qrRes.data.publicUrl || publicLink);
        setQrImageUrl(qrRes.data.qrCodeDataUrl || "");
      }
    } catch (error) {
      console.log("Using local profile link (backend unavailable)");
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("emergency-qr");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "sanjeevani-emergency-qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR code downloaded!");
    } else {
      toast.error("Failed to download image.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#F8FAFC] min-h-screen p-8 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl w-full mb-8 shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      <main className="px-6 py-6 mx-auto max-w-[1200px]">
         {/* Top Header - Responsive */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6 md:gap-4">
           <div className="flex items-center gap-4">
              <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full overflow-hidden border-[3px] border-white shadow-sm relative shrink-0">
                 <img src="https://img.freepik.com/premium-photo/business-woman-portrait-office-confident-smile-happy-corporate-female-professional_590464-180010.jpg" alt="Sarah J. Miller" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#0F766E] rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                 </div>
              </div>
              <div>
                <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.65rem] md:text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block mb-1.5">Primary Patient Profile</span>
                <h1 className="text-[1.4rem] md:text-[1.6rem] font-bold text-gray-900 leading-none mb-1">Sarah J. Miller</h1>
                <p className="text-gray-500 font-medium text-[0.85rem] md:text-[0.95rem]">DOB: 12 May 1985 • Blood Type: O+</p>
              </div>
           </div>
           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button onClick={downloadQR} className="w-full sm:flex-1 md:w-auto border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 md:py-2.5 rounded-xl text-[0.9rem] md:text-[0.95rem] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm min-h-[48px]">
                <Download className="w-[18px] h-[18px]" strokeWidth={2.5} /> Download PDF
              </button>
              <button onClick={() => { navigator.clipboard.writeText(publicLink); toast.success("Link copied!"); }} className="w-full sm:flex-1 md:w-auto border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 md:py-2.5 rounded-xl text-[0.9rem] md:text-[0.95rem] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm min-h-[48px]">
                <Share2 className="w-[18px] h-[18px]" strokeWidth={2.5} /> Share Profile
              </button>
           </div>
         </div>

         {/* Grid Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
           {/* Left Column */}
           <div className="lg:col-span-4">
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col items-center">
                 <div className="w-full mb-6">
                    <h3 className="text-[1.1rem] font-bold text-gray-900 mb-1">Emergency Access</h3>
                    <p className="text-gray-500 font-medium text-[0.9rem] w-full text-left">Scan for immediate medical data</p>
                 </div>
                 
                 <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 md:p-8 mb-8 w-full flex items-center justify-center bg-gray-50/50">
                    <div className="relative shadow-xl rounded-lg overflow-hidden bg-white">
                       <div className="bg-[#b91c1c] text-white text-center text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.2em] py-1.5 px-6">EMERGENCY QARE</div>
                       <div className="p-4 bg-white flex justify-center items-center">
                          {qrImageUrl ? (
                             <img src={qrImageUrl} alt="QR Code" className="w-[120px] h-[120px] md:w-[140px] md:h-[140px]" />
                          ) : (
                             <QRCodeCanvas id="emergency-qr" value={publicLink || "emergency"} size={120} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={false} />
                          )}
                       </div>
                    </div>
                 </div>
                 
                 <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-colors shadow-sm mb-3 min-h-[48px]">
                    <Phone className="w-4 h-4 fill-current" /> Emergency Contact
                 </button>
                 <p className="text-[#b91c1c] font-bold text-[0.75rem] md:text-[0.8rem] italic text-center uppercase tracking-tight">TAP TO CALL EMERGENCY SERVICES</p>
              </div>
           </div>

           {/* Right Column */}
           <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Chronic Conditions */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
                 <div className="flex items-center gap-3 mb-5">
                    <Activity className="w-5 h-5 text-[#0F766E] stroke-[2.5]" />
                    <h3 className="text-[1.1rem] font-bold text-gray-900">Chronic Conditions</h3>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    <span className="bg-[#F1F5F9] text-gray-700 px-5 py-2 rounded-xl text-[0.9rem] font-medium border border-gray-200">Type 1 Diabetes</span>
                    <span className="bg-[#F1F5F9] text-gray-700 px-5 py-2 rounded-xl text-[0.9rem] font-medium border border-gray-200">Hypertension</span>
                    <span className="bg-[#F1F5F9] text-gray-700 px-5 py-2 rounded-xl text-[0.9rem] font-medium border border-gray-200">Asthma</span>
                 </div>
              </div>

              {/* Known Allergies */}
              <div className="bg-[#fef2f2] border border-[#fecaca] shadow-sm rounded-3xl p-6">
                 <div className="flex items-center gap-3 mb-5">
                    <AlertTriangle className="w-5 h-5 text-[#b91c1c] stroke-[2.5]" />
                    <h3 className="text-[1.1rem] font-bold text-[#b91c1c]">Known Allergies</h3>
                 </div>
                 <div className="space-y-3">
                    <div className="bg-white border border-[#fecaca] p-4 rounded-xl flex justify-between items-center shadow-sm">
                       <div>
                          <h4 className="text-[#991b1b] font-bold text-[1.05rem]">Penicillin</h4>
                          <p className="text-[#b91c1c] text-[0.75rem] font-bold uppercase tracking-widest mt-0.5">SEVERE / ANAPHYLAXIS</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shadow-sm">
                          <span className="font-bold text-sm">!</span>
                       </div>
                    </div>
                    <div className="bg-[#fef2f2] p-4 rounded-xl border border-transparent flex justify-between items-center opacity-80 pl-5">
                       <div>
                          <h4 className="text-[#991b1b] font-bold text-[1rem]">Peanuts</h4>
                          <p className="text-[#b91c1c] text-[0.75rem] font-bold uppercase tracking-widest mt-0.5 opacity-80">MODERATE</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
                 <div className="flex items-center gap-3 mb-5">
                    <PillIcon className="w-5 h-5 text-[#0F766E] fill-[#0F766E]" strokeWidth={1} />
                    <h3 className="text-[1.1rem] font-bold text-gray-900">Current Medications</h3>
                 </div>
                 <div className="space-y-0">
                    <div className="flex items-center justify-between border-b border-gray-100 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0F766E] shrink-0">
                             <PillIcon className="w-[1.15rem] h-[1.15rem] fill-[#0F766E]" strokeWidth={1} />
                          </div>
                          <div>
                             <h4 className="text-gray-900 font-bold text-[1rem]">Humalog Insulin</h4>
                             <p className="text-gray-500 font-medium text-[0.85rem]">Prandial - Dose as per monitor</p>
                          </div>
                       </div>
                       <span className="bg-[#F1F5F9] text-gray-500 px-3 py-1 rounded-md text-[0.75rem] font-bold border border-gray-200">Verified</span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0F766E] shrink-0">
                             <PillIcon className="w-[1.15rem] h-[1.15rem] fill-[#0F766E]" strokeWidth={1} />
                          </div>
                          <div>
                             <h4 className="text-gray-900 font-bold text-[1rem]">Lisinopril</h4>
                             <p className="text-gray-500 font-medium text-[0.85rem]">10mg - Once daily</p>
                          </div>
                       </div>
                       <span className="bg-[#F1F5F9] text-gray-500 px-3 py-1 rounded-md text-[0.75rem] font-bold border border-gray-200">Verified</span>
                    </div>
                 </div>
              </div>

              {/* Operating Doctor */}
              <div className="bg-[#F0FDFA] border border-[#CCFBF1] shadow-sm rounded-3xl p-6">
                 <div className="flex items-center gap-3 mb-5">
                    <Stethoscope className="w-5 h-5 text-[#0F766E] stroke-[2.5]" />
                    <h3 className="text-[1.1rem] font-bold text-[#0F766E]">Operating Doctor</h3>
                 </div>
                 <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0">
                          <User size={20} className="stroke-[2.5]" />
                       </div>
                       <div>
                          <p className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Doctor Name</p>
                          <h4 className="text-gray-900 font-bold text-[1.1rem]">Dr. Rajesh Malhotra</h4>
                          <p className="text-[#0F766E] font-bold text-[0.85rem]">Senior Consultant Surgeon</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0">
                          <MapPin size={20} className="stroke-[2.5]" />
                       </div>
                       <div>
                          <p className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Clinic Address</p>
                          <p className="text-gray-700 font-medium text-[0.95rem] leading-snug">Apollo Hospitals, Sarita Vihar, Delhi-Mathura Road, New Delhi - 110076</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0">
                          <Phone size={20} className="stroke-[2.5]" />
                       </div>
                       <div>
                          <p className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Direct Contact</p>
                          <h4 className="text-gray-900 font-bold text-[1.05rem]">+91 98765 43210</h4>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         </div>

         {/* Footer Note */}
         <div className="bg-[#F1F5F9] rounded-2xl p-5 mt-8 text-center border border-gray-200">
           <p className="text-gray-500 text-[0.9rem] font-medium leading-relaxed">This emergency profile is managed by <span className="font-bold text-[#0F766E]">MedSafe Pro Clinical Suite</span>. Last updated on October 24, 2023. This information is intended for first responders and clinical personnel.</p>
         </div>
      </main>
    </div>
  );
}