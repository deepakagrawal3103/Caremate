import { Link } from "react-router-dom";
import { ShieldCheck, Twitter, Linkedin, Facebook, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingFooter() {
  return (
    <footer className="pt-32 pb-12 px-6 bg-[#F8FAFC] overflow-hidden border-t border-gray-100 relative">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-white to-transparent pointer-events-none opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-black text-[#0F4D4A] tracking-tighter flex items-center gap-3 mb-8">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 bg-[#0F4D4A] rounded-xl flex items-center justify-center shadow-lg"
              >
                 <ShieldCheck className="text-[#20D898] w-6 h-6" />
              </motion.div>
              MedSafe
            </Link>
            <p className="text-gray-400 font-bold max-w-sm leading-relaxed text-lg italic">
              "Redefining clinical-grade safety for the modern digital household."
            </p>
          </div>
          
          <div>
            <h5 className="font-black text-[#0F4D4A] uppercase text-[0.7rem] tracking-[0.25em] mb-8 opacity-40">The Product</h5>
            <ul className="space-y-4">
              {["Safety Engine", "Emergency QR", "Family Sync", "Clinical API"].map(item => (
                <li key={item}><Link to="#" className="text-gray-500 font-bold hover:text-[#0F4D4A] transition-all text-[0.95rem]">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-black text-[#0F4D4A] uppercase text-[0.7rem] tracking-[0.25em] mb-8 opacity-40">Security</h5>
            <ul className="space-y-4">
              {["Privacy Policy", "HIPAA Center", "Data Promise", "Trust & Safety"].map(item => (
                <li key={item}><Link to="#" className="text-gray-500 font-bold hover:text-[#0F4D4A] transition-all text-[0.95rem]">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-black text-[#0F4D4A] uppercase text-[0.7rem] tracking-[0.25em] mb-8 opacity-40">Connect</h5>
            <ul className="space-y-4">
              {["Support Hub", "Clinical Ethics", "Twitter", "LinkedIn"].map(item => (
                <li key={item}><Link to="#" className="text-gray-500 font-bold hover:text-[#0F4D4A] transition-all text-[0.95rem]">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-200 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-gray-400 font-black text-[0.75rem] uppercase tracking-widest">© 2024 MedSafe Technologies Inc.</p>
            <div className="flex gap-8">
              <Link to="#" className="text-gray-300 hover:text-[#0F4D4A] transition-colors"><Twitter size={16} /></Link>
              <Link to="#" className="text-gray-300 hover:text-[#0F4D4A] transition-colors"><Linkedin size={16} /></Link>
              <Link to="#" className="text-gray-300 hover:text-[#0F4D4A] transition-colors"><Facebook size={16} /></Link>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                <ShieldCheck size={14} className="text-[#20D898]" />
                <span className="text-[0.65rem] font-black text-[#0F4D4A] uppercase tracking-widest">HIPAA Compliant</span>
             </div>
             <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                <Lock size={14} className="text-blue-500" />
                <span className="text-[0.65rem] font-black text-[#0F4D4A] uppercase tracking-widest">AES-256 SECURED</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
