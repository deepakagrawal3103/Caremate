import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { Menu, X, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useMobileMenu } from "../context/MobileMenuContext";

export default function Layout({ children, hideSidebar = false }) {
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();

  if (hideSidebar) {
    return (
      <div className="min-h-screen bg-background font-sans text-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-primary flex flex-col lg:flex-row">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Sidebar content */}
          <div className="relative w-[280px] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={closeMobileMenu}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar onClose={closeMobileMenu} />
          </div>
        </div>
      )}

      {/* Sidebar - Desktop ONLY */}
      <div className="hidden lg:block">
        <div className="relative w-[210px] h-full">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 lg:pb-0">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
}

