import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Plus,
  FileText
} from 'lucide-react';

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: <Home size={22} /> },
    { label: "Add Medicine", path: "/add-medicine", icon: <Plus size={22} />, isMiddle: true },
    { label: "Records", path: "/patient-records", icon: <FileText size={22} /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F8FAFC]/80 backdrop-blur-md border-t border-gray-100 px-4 py-2 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

        if (item.isMiddle) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 -translate-y-1"
            >
              <div className="w-16 h-10 bg-[#E9F3F1] rounded-xl flex items-center justify-center text-[#0F4D4A] shadow-sm">
                <div className="w-6 h-6 bg-[#0F4D4A] rounded-md flex items-center justify-center text-white">
                  <Plus size={16} strokeWidth={3} />
                </div>
              </div>
              <span className="text-[0.65rem] font-bold text-[#64748B]">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all ${
              isActive ? 'text-[#0F4D4A]' : 'text-[#94A3B8]'
            }`}
          >
            <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[0.65rem] font-bold`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
