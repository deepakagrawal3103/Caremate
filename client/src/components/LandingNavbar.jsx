import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black text-[#0F4D4A] tracking-tighter flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 bg-[#0F4D4A] rounded-lg flex items-center justify-center shadow-lg"
            >
               <ShieldCheck className="text-[#20D898] w-5 h-5" />
            </motion.div>
            MedSafe
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['/', '/how-it-works', '/features', '/safety'].map((path) => {
              const labels = { '/': 'Home', '/how-it-works': 'How it Works', '/features': 'Features', '/safety': 'Safety' };
              return (
                <Link 
                  key={path}
                  to={path} 
                  className={`text-[0.9rem] font-bold transition-all relative ${isActive(path) ? "text-[#0F4D4A]" : "text-gray-500 hover:text-[#0F4D4A]"}`}
                >
                  {labels[path]}
                  {isActive(path) && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0F4D4A]" 
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard" className="bg-[#0F4D4A] text-white px-6 py-2.5 rounded-xl text-[0.85rem] font-black hover:bg-teal-900 transition-all shadow-lg shadow-teal-900/10">
              Get Started Free
            </Link>
          </motion.div>
          <button className="md:hidden text-[#0F4D4A]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <Link to="/" className="block text-[0.9rem] font-bold text-[#0F4D4A]">Home</Link>
              <Link to="/how-it-works" className="block text-[0.9rem] font-bold text-gray-500">How it Works</Link>
              <Link to="/features" className="block text-[0.9rem] font-bold text-gray-500">Features</Link>
              <Link to="/safety" className="block text-[0.9rem] font-bold text-gray-500">Safety</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
