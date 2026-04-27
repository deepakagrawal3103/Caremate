import { ShieldCheck, Lock, Eye, FileText, CheckCircle, Shield, AlertTriangle, Activity, Star, ArrowRight } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Safety() {
  const compliancePoints = [
    {
      title: "HIPAA Compliant",
      desc: "All health data is stored and processed according to strict HIPAA regulations.",
      icon: ShieldCheck,
      color: "bg-[#0A0A0A]",
      textColor: "text-white"
    },
    {
      title: "256-bit Encryption",
      desc: "Your data is encrypted both in transit and at rest using AES-256 standards.",
      icon: Lock,
      color: "bg-white",
      textColor: "text-[#0F4D4A]"
    },
    {
      title: "Zero Knowledge",
      desc: "We don't sell your data. Your medical history is accessible only by you.",
      icon: Eye,
      color: "bg-[#F0FDFA]",
      textColor: "text-[#0F4D4A]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-100 overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center mb-32"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-teal-50 text-[#0F4D4A] px-4 py-2 rounded-full text-[0.8rem] font-black uppercase tracking-widest mb-8 border border-teal-100">
            <Shield size={16} fill="currentColor" className="text-[#20D898]" />
            Security First Philosophy
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-[6.5rem] font-black text-[#0F4D4A] mb-8 tracking-tighter leading-[0.9] text-center">
            Trust Built on <br /><span className="text-gray-400">Clinical Standards.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium leading-relaxed">
            At MedSafe, safety isn't a feature—it's our foundation. We combine medical expertise with world-class security to protect your family.
          </motion.p>
        </motion.div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
          {compliancePoints.map((point, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${point.color} rounded-[3rem] p-12 border border-gray-100 shadow-sm flex flex-col justify-between h-[450px] transition-all hover:scale-[1.02] hover:shadow-xl group cursor-pointer relative overflow-hidden`}
            >
              <div className={`w-16 h-16 ${point.textColor === 'text-white' ? 'bg-white/10' : 'bg-[#0F4D4A]/5'} rounded-2xl flex items-center justify-center ${point.textColor} mb-8 group-hover:scale-110 transition-transform`}>
                <point.icon size={32} />
              </div>
              <div className="z-10">
                <h3 className={`text-2xl font-black ${point.textColor} mb-4 tracking-tight`}>{point.title}</h3>
                <p className={`${point.textColor === 'text-white' ? 'text-gray-400' : 'text-gray-500'} font-bold leading-relaxed text-lg`}>
                  {point.desc}
                </p>
              </div>
              {point.textColor === 'text-white' && <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent pointer-events-none"></div>}
            </motion.div>
          ))}
        </div>

        {/* Safety Protocols Section */}
        <section className="bg-white rounded-[4rem] p-12 lg:p-24 border border-gray-100 shadow-sm overflow-hidden relative mb-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl lg:text-5xl font-black text-[#0F4D4A] mb-12 tracking-tighter leading-tight">Clinical Verification <br /> Protocols</h2>
                 <div className="space-y-10">
                    {[
                      { title: "AI Conflict Cross-Check", desc: "Every medicine added is instantly compared against your existing list for contraindications.", icon: AlertTriangle },
                      { title: "Dosage Monitoring", desc: "Our system flags dosages that deviate from FDA-approved clinical ranges.", icon: Activity },
                      { title: "Emergency QR Access", desc: "One-tap clinical profile access for first responders, containing only what's vital.", icon: ShieldCheck }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-8">
                        <div className="w-14 h-14 bg-[#F0FDFA] rounded-2xl flex items-center justify-center text-[#0F4D4A] shrink-0 border border-teal-100 shadow-sm">
                          <item.icon size={28} />
                        </div>
                        <div>
                          <h4 className="text-[1.2rem] font-black text-[#0F4D4A] mb-2 tracking-tight">{item.title}</h4>
                          <p className="text-gray-500 font-bold leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative">
                 <div className="bg-[#0F4D4A] rounded-[3.5rem] p-12 text-white relative z-10 shadow-2xl overflow-hidden group">
                    <h3 className="text-3xl font-black mb-8 tracking-tight">Our Data Promise</h3>
                    <ul className="space-y-6">
                       {[
                         "No selling of health data to third parties.",
                         "All AI processing is done on secure nodes.",
                         "Full transparency on clinical data sources.",
                         "Right to be forgotten: delete anytime."
                       ].map((text, i) => (
                         <li key={i} className="flex items-start gap-4">
                           <CheckCircle className="text-[#20D898] w-6 h-6 shrink-0 mt-0.5" />
                           <span className="font-bold text-teal-50/80 text-lg">{text}</span>
                         </li>
                       ))}
                    </ul>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#20D898] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-teal-50/50 rounded-full blur-3xl -z-0"></div>
              </div>
           </div>
        </section>

        {/* Final CTA for Safety */}
        <div className="max-w-7xl mx-auto text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="bg-[#0F172A] rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl"
           >
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter">Your safety is non-negotiable.</h2>
              <p className="text-xl text-teal-100/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Start protecting your household with the platform built on medical standards and military-grade security.</p>
              <Link to="/dashboard" className="bg-[#20D898] text-[#0F172A] px-12 py-5 rounded-2xl text-[1.1rem] font-black hover:bg-white transition-all shadow-xl active:scale-95 inline-flex items-center gap-3">
                 Experience Secure Safety <ArrowRight size={20} />
              </Link>
           </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
