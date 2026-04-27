import { Camera, ShieldCheck, QrCode, ArrowRight, Zap, Search, Shield, Activity, Star } from "lucide-react";
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

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-100 overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-32 lg:pt-48 pb-20 px-6">
        {/* Modern Hero */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto text-center mb-32"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[0.8rem] font-black text-[#0F4D4A] uppercase tracking-[0.2em] mb-8 border border-gray-100 shadow-sm">
             The Action Pipeline
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl lg:text-[6rem] font-black text-[#0F4D4A] mb-8 tracking-tighter leading-[0.9]">
            Simple. Safe. <br /> <span className="text-gray-400">Secure.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            MedSafe protects your family through a clinical-grade verification pipeline that transforms complex medical data into clear, actionable safety insights.
          </motion.p>
        </motion.div>

        {/* Visual 1-2-3 Sequence - Premium Design */}
        <div className="max-w-7xl mx-auto mb-40">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Clinical Capture", 
                  desc: "Snap a high-resolution photo of your prescription label or report.", 
                  icon: Camera, 
                  color: "bg-[#0A0A0A]",
                  textColor: "text-white",
                  accent: "text-blue-400"
                },
                { 
                  step: "02", 
                  title: "AI Decoding", 
                  desc: "Our neural engine cross-references 50k+ drug interactions instantly.", 
                  icon: ShieldCheck, 
                  color: "bg-white",
                  textColor: "text-[#0F4D4A]",
                  accent: "text-[#20D898]"
                },
                { 
                  step: "03", 
                  title: "Secure Access", 
                  desc: "Access your clinical profile and safety scores anywhere, anytime.", 
                  icon: QrCode, 
                  color: "bg-[#EBF8FF]",
                  textColor: "text-[#0F4D4A]",
                  accent: "text-blue-500"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`${item.color} rounded-[3rem] p-12 h-[500px] flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
                >
                   <div className="flex justify-between items-start z-10">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                         <item.icon size={32} className={item.textColor === "text-white" ? "text-white" : "text-[#0F4D4A]"} />
                      </div>
                      <span className={`text-4xl font-black opacity-10 ${item.textColor === "text-white" ? "text-white" : "text-[#0F4D4A]"}`}>{item.step}</span>
                   </div>
                   <div className="z-10">
                      <h3 className={`text-3xl font-black ${item.textColor} mb-4 tracking-tight`}>{item.title}</h3>
                      <p className={`${item.textColor === "text-white" ? "text-gray-400" : "text-gray-500"} font-bold text-lg leading-relaxed`}>
                         {item.desc}
                      </p>
                   </div>
                   {i === 1 && <div className="absolute inset-0 bg-gradient-to-tr from-[#20D898]/5 to-transparent pointer-events-none"></div>}
                   {i === 2 && <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent pointer-events-none"></div>}
                </motion.div>
              ))}
           </div>
        </div>

        {/* Technical Spotlight */}
        <section className="py-32 bg-white rounded-[4rem] border border-gray-100 shadow-sm max-w-7xl mx-auto mb-32 relative overflow-hidden">
           <div className="px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl lg:text-5xl font-black text-[#0F4D4A] mb-8 tracking-tighter leading-tight">
                    Beyond Simple Scanning. <br />
                    <span className="text-gray-400">Total clinical awareness.</span>
                 </h2>
                 <div className="space-y-6">
                    {[
                      { title: "Real-time Verification", desc: "Our system doesn't just read text; it understands medical context and dosages.", icon: Activity },
                      { title: "Universal Compatibility", desc: "Works with pharmacy labels, discharge summaries, and lab results.", icon: Search },
                      { title: "Encrypted Pipeline", desc: "Data is anonymized and encrypted before it ever reaches our AI nodes.", icon: Shield }
                    ].map((feat, i) => (
                      <div key={i} className="flex gap-6 items-start">
                         <div className="w-12 h-12 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F4D4A] shrink-0">
                            <feat.icon size={24} />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-[#0F4D4A] mb-2">{feat.title}</h4>
                            <p className="text-gray-500 font-bold leading-relaxed">{feat.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative">
                 <div className="bg-[#0F4D4A] rounded-[3rem] p-12 text-white shadow-2xl relative z-10">
                    <Star className="text-[#20D898] mb-6" size={40} fill="#20D898" />
                    <p className="text-2xl font-black leading-relaxed mb-8">
                       "MedSafe didn't just organize my pills; it caught a major interaction between my new prescription and my daily supplement."
                    </p>
                    <div className="flex items-center gap-4">
                       <img src="https://i.pravatar.cc/100?img=32" alt="User" className="w-12 h-12 rounded-full border-2 border-[#20D898]" />
                       <div>
                          <h5 className="font-black text-white">Dr. Sarah Thompson</h5>
                          <p className="text-teal-100/60 font-bold text-sm">Clinical Pharmacist</p>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#20D898] blur-[120px] opacity-10 -z-0"></div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <div className="max-w-7xl mx-auto px-6 text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="bg-[#0F172A] rounded-[3.5rem] p-12 lg:p-24 text-center relative overflow-hidden"
           >
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight">Protect Your Household Today</h2>
              <p className="text-xl text-teal-100/60 font-medium mb-12 max-w-2xl mx-auto">Join the 25k+ families using MedSafe to ensure clinical-grade safety at home.</p>
              <Link to="/dashboard" className="bg-[#20D898] text-[#0F172A] px-12 py-5 rounded-2xl text-[1.1rem] font-black hover:bg-white transition-all shadow-xl active:scale-95 inline-flex items-center gap-3">
                 Get Started Free <ArrowRight size={20} />
              </Link>
              <p className="mt-8 text-white/30 font-black uppercase tracking-[0.3em] text-[0.7rem]">No Credit Card Required • HIPAA Compliant</p>
           </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

