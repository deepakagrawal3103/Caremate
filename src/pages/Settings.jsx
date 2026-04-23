import React from 'react';
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Lock,
  Globe,
  Database,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Smartphone,
  Eye,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Account & Profile",
      items: [
        { icon: <User size={18} />, label: "Profile Information", desc: "Update your name, degree, and clinical specialty.", link: "/profile" },
        { icon: <Mail size={18} />, label: "Email & Communication", desc: "Manage clinical alert delivery and system reports.", link: "#" },
      ]
    },
    {
      title: "System Configuration",
      items: [
        { icon: <Shield size={18} />, label: "Security & HIPAA", desc: "Configure access logs and data encryption settings.", link: "#" },
        { icon: <Bell size={18} />, label: "Notification Preferences", desc: "Set thresholds for critical adherence alerts.", link: "#" },
        { icon: <Globe size={18} />, label: "Region & Language", desc: "Adjust timezone and localized medical terminology.", link: "#" },
      ]
    },
    {
      title: "Integrations & Data",
      items: [
        { icon: <Database size={18} />, label: "EHR Sync", desc: "Configure background synchronization with central hospitals.", link: "#" },
        { icon: <Smartphone size={18} />, label: "Device Management", desc: "Manage authorized clinical tablets and QR scanners.", link: "#" },
      ]
    }
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Improved for mobile */}
      <header className="px-4 md:px-6 py-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-base md:text-lg font-bold text-gray-900">Settings</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-[200px] hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#F1F5F9] border-none rounded-lg py-1.5 pl-10 pr-4 text-[0.85rem] focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[900px] mx-auto">
        <div className="mb-8 md:mb-10">
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">Clinical Suite Configuration</h2>
           <p className="text-gray-500 font-medium text-[0.95rem] md:text-[1rem]">Manage your facility and security preferences.</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3 md:space-y-4">
              <h3 className="text-[0.65rem] md:text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">{section.title}</h3>
              <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {section.items.map((item, i) => (
                    <div 
                      key={i} 
                      className="p-4 md:p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-[#F8FAFC] text-gray-400 group-hover:text-[#0F766E] group-hover:bg-[#F0FDFA] flex items-center justify-center transition-all shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-[0.95rem] md:text-[1rem] font-bold text-gray-900">{item.label}</h4>
                          <p className="text-[0.8rem] md:text-[0.85rem] text-gray-500 font-medium leading-snug">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 p-6 md:p-8 bg-[#0F766E]/5 rounded-2xl md:rounded-3xl border border-[#0F766E]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div className="flex items-center gap-4 md:gap-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                 <Shield className="text-[#0F766E]" size={24} />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900 text-[0.95rem] md:text-[1rem]">Developer Access</h4>
                 <p className="text-[0.8rem] md:text-[0.85rem] text-gray-500 font-medium">Access API keys and raw system logging.</p>
              </div>
           </div>
           <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl font-bold text-[0.85rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              Access Keys <ExternalLink size={14} />
           </button>
        </div>

        <div className="mt-10 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
           <p className="text-[0.7rem] md:text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest">MedSafe Clinical Suite v1.0.4</p>
           <div className="flex gap-4 md:gap-6">
              <button className="text-[0.8rem] md:text-[0.85rem] font-bold text-gray-400 hover:text-gray-600">Privacy Policy</button>
              <button className="text-[0.8rem] md:text-[0.85rem] font-bold text-gray-400 hover:text-gray-600">Terms of Service</button>
           </div>
        </div>
      </main>
    </div>
  );
}
