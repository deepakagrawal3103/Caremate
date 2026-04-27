import { Brain, QrCode, Users, Bell, Shield, ArrowRight, Zap, History, Smartphone, Star, ShieldCheck, Activity } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Features() {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI Interaction Engine",
      desc: "Our proprietary AI cross-references 50,000+ drug combinations, including supplements and food interactions.",
      color: "bg-[#0A0A0A]",
      textColor: "text-white",
      span: "lg:col-span-2"
    },
    {
      icon: QrCode,
      title: "QuickScan QR",
      desc: "One code for emergencies. Paramedics can access critical medical history without unlocking your phone.",
      color: "bg-[#F0FDFA]",
      textColor: "text-[#0F4D4A]",
      span: "lg:col-span-1"
    },
    {
      icon: ShieldCheck,
      title: "Clinical Trust",
      desc: "HIPAA compliant and encrypted at rest. We never sell your data.",
      color: "bg-[#EBF8FF]",
      textColor: "text-[#0F4D4A]",
      span: "lg:col-span-1"
    },
    {
      icon: Activity,
      title: "Live Analysis",
      desc: "Real-time conflict analysis as you add new medications to your cabinet.",
      color: "bg-white",
      textColor: "text-[#0F4D4A]",
      span: "lg:col-span-2"
    }
  ];

  const subFeatures = [
    { icon: Users, title: "Household Sync", desc: "Manage meds for kids, seniors, and partners from one dashboard." },
    { icon: Bell, title: "Smart Reminders", desc: "Adaptive alerts that understand your routine and schedule." },
    { icon: Shield, title: "Military Grade", desc: "End-to-end encryption. Your medical data stays private." },
    { icon: History, title: "Medication History", desc: "Detailed logs of past prescriptions and adherence trends." },
    { icon: Zap, title: "Instant Analysis", desc: "Real-time safety checks as you scan or add medications." },
    { icon: Smartphone, title: "Mobile Ready", desc: "Seamless experience on all devices, anywhere you go." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-100 overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-32"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[0.8rem] font-black text-[#0F4D4A] uppercase tracking-[0.2em] mb-8 border border-gray-100 shadow-sm">
             The Feature Suite
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-[5.5rem] font-black text-[#0F4D4A] mb-8 tracking-tighter leading-[0.95]">
            Advanced Tools for <br /><span className="text-gray-400">Total Clinical Safety.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            MedSafe combines world-class AI with intuitive design to provide the most robust medication management platform available for families.
          </motion.p>
        </motion.div>

        {/* Main Features Grid - Premium Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-32">
          {mainFeatures.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${f.color} ${f.span} rounded-[3rem] p-12 border border-gray-100 shadow-sm flex flex-col justify-between h-[450px] transition-all hover:scale-[1.01] hover:shadow-xl group cursor-pointer relative overflow-hidden`}
            >
              <div className={`w-16 h-16 ${f.textColor === 'text-white' ? 'bg-white/10' : 'bg-[#0F4D4A]/5'} rounded-2xl flex items-center justify-center ${f.textColor} shrink-0 transition-transform group-hover:scale-110 z-10`}>
                <f.icon size={32} />
              </div>
              <div className="z-10">
                <h3 className={`text-3xl font-black ${f.textColor} mb-4 tracking-tight`}>{f.title}</h3>
                <p className={`${f.textColor === 'text-white' ? 'text-gray-400' : 'text-gray-500'} font-bold leading-relaxed text-lg max-w-sm`}>
                  {f.desc}
                </p>
              </div>
              {f.textColor === 'text-white' && <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent pointer-events-none"></div>}
            </motion.div>
          ))}
        </div>

        {/* Sub Features High-Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-40">
          {subFeatures.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm flex flex-col gap-8 transition-all hover:shadow-lg group cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#0F4D4A] shrink-0 group-hover:bg-[#20D898] group-hover:text-white transition-all">
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3">{feature.title}</h4>
                <p className="text-[#0F4D4A] font-bold leading-relaxed text-[1.1rem]">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic CTA */}
        <div className="bg-[#0F172A] rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter">Ready to experience <br /> total clinical safety?</h2>
              <p className="text-xl text-teal-100/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                 Join thousands of users who trust MedSafe to manage their household prescriptions with AI precision.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-4 bg-[#20D898] text-[#0F172A] px-12 py-5 rounded-2xl text-[1.1rem] font-black hover:bg-white transition-all shadow-xl active:scale-95 group">
                Get Started Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
           <motion.div 
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-20 -right-20 w-80 h-80 border border-white/5 rounded-full pointer-events-none"
           ></motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
