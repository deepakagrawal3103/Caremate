import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  LayoutDashboard, 
  BrainCog,
  QrCode,
  HelpCircle,
  LogOut,
  Pill,
  Plus,
  AlertTriangle,
  FileText,
  Settings,
  User,
  History,
  Bell,
  MessageSquare,
  AlarmClock
} from "lucide-react";


export default function Sidebar({ onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLinkClick = (path) => {
    if (onClose) onClose();
    if (path) navigate(path);
  };

  const navItems = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={18} strokeWidth={2.5} /> },
    { label: "Add Medicine", path: "/add-medicine", icon: <Plus size={18} strokeWidth={2.5} /> },
    { label: "Patient Records", path: "/patient-records", icon: <User size={18} strokeWidth={2.5} /> },
    { label: "Medicine Tracker", path: "/medications", icon: <Pill size={18} strokeWidth={2.5} /> },
    { label: "AI Risk Analysis", path: "/risk-analysis", icon: <BrainCog size={18} strokeWidth={2.5} /> },
    { label: "MedSafe AI Chat", path: "/chatbot", icon: <MessageSquare size={18} strokeWidth={2.5} /> },
    { label: "Health Resume", path: "/health-resume", icon: <FileText size={18} strokeWidth={2.5} /> },
    { label: "Notifications", path: "/notifications", icon: <Bell size={18} strokeWidth={2.5} /> },
    { label: "Alerts & Reminders", path: "/alerts", icon: <AlarmClock size={18} strokeWidth={2.5} /> },
    { label: "Adherence History", path: "/medication-history", icon: <History size={18} strokeWidth={2.5} /> },
    { label: "Emergency QR", path: "/qr", icon: <QrCode size={18} strokeWidth={2.5} /> },
  ];

  return (
    <aside className="w-full bg-white border-r border-gray-100 h-full flex flex-col overflow-y-auto">
      
      {/* Logo Area */}
      <div className="px-5 py-4 hidden lg:block">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#0F766E] text-white flex justify-center items-center shadow-sm">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight tracking-tight">MedSafe Pro</h1>
            <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Clinical Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 lg:mt-0">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleLinkClick(item.path)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-[0.85rem] font-semibold transition-colors ${
                    isActive 
                      ? "bg-[#F0FDFA] text-[#0F766E] border-l-[3px] border-[#0F766E]" 
                      : "text-gray-500 border-l-[3px] border-transparent hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col gap-1 border-t border-gray-50 mt-auto">
         <button 
           onClick={() => handleLinkClick('/emergency-mode')}
           className="bg-[#DC2626] hover:bg-red-700 text-white w-full py-2.5 rounded-xl flex justify-center items-center gap-2 text-[0.9rem] font-bold shadow-md shadow-red-500/20 transition-all mb-2 min-h-[44px]"
         >
           <AlertTriangle size={16} strokeWidth={2.5} /> Emergency Mode
         </button>
         
         <button 
           onClick={() => handleLinkClick('/settings')}
           className="flex items-center gap-3 px-2 py-2 text-[0.85rem] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
         >
            <Settings size={16} strokeWidth={2.5} /> Settings
         </button>

         <button className="flex items-center gap-3 px-2 py-2 text-[0.85rem] font-semibold text-gray-600 hover:text-gray-900 transition-colors text-left">
           <HelpCircle size={16} strokeWidth={2.5} /> Support
         </button>
         <button 
           onClick={() => {
             if (onClose) onClose();
             logout();
           }} 
           className="flex items-center gap-3 px-2 py-2 text-[0.85rem] font-semibold text-gray-600 hover:text-gray-900 transition-colors text-left"
         >
           <LogOut size={16} strokeWidth={2.5} /> Sign Out
         </button>
      </div>
    </aside>
  );
}

