import { Link } from "react-router-dom";
import { ShieldCheck, Play, CheckCircle, Users, Bell, Shield, Zap, QrCode, ArrowRight, Star, Heart, Menu, X, Pill, Brain, Clock, Lock, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

// Image Imports
import riskImg from "../assets/ai risk analizer.jpg";
import trackerImg from "../assets/medicine tracker.jpg";
import reportsImg from "../assets/clinical reports.jpg";
import heartHero from "../assets/heart_hero.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
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

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const [activeTab, setActiveTab] = useState(0);

  const showcaseItems = [
    {
      title: "AI Risk Analysis",
      description: "Advanced interaction detection across 50k+ drug combinations.",
      image: riskImg
    },
    {
      title: "Medicine Tracker",
      description: "Intuitive daily schedules and adherence tracking.",
      image: trackerImg
    },
    {
      title: "Clinical Reports",
      description: "Professional-grade summaries for your healthcare providers.",
      image: reportsImg
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-100 overflow-x-hidden">
      <LandingNavbar />

      {/* Hero Section - BioTrack Style */}
      <header className="pt-32 lg:pt-40 pb-20 px-6 max-w-7xl mx-auto relative overflow-visible">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="z-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-[0.9rem] font-bold text-gray-400">+10K <span className="uppercase tracking-widest text-[0.7rem] ml-1">Clients</span></p>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-6xl lg:text-[5.5rem] font-black text-[#0F4D4A] leading-[0.95] mb-8 tracking-tighter"
            >
              Your Health <br /> 
              Data, <span className="text-gray-400">Decoded</span> <br />
              by AI
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-md"
            >
              MedSafe helps you track, understand, and act on your medical records — with smart AI insights and clean clinical dashboards.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Link to="/dashboard" className="bg-white text-[#0F4D4A] px-8 py-4 rounded-full text-[1rem] font-black hover:shadow-xl transition-all border border-gray-100 flex items-center gap-4 group">
                See Dashboard
                <div className="w-10 h-10 bg-[#51B4F1] rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                   <ArrowRight size={20} />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Animated Heart & Labels */}
          <motion.div variants={itemVariants} className="relative z-10 lg:scale-110 lg:translate-x-10">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img 
                src={heartHero} 
                alt="AI Medical Visualization" 
                className="w-full max-w-[600px] mx-auto drop-shadow-[0_0_50px_rgba(81,180,241,0.2)]"
              />
              
              {/* Floating Labels */}
              <motion.div 
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/4 -left-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4"
              >
                 <div className="w-8 h-8 bg-[#51B4F1]/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#51B4F1] rounded-full"></div>
                 </div>
                 <div>
                    <h5 className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Biomarker Analysis</h5>
                    <p className="text-[0.9rem] font-black text-[#0F4D4A]">Real-time <span className="text-gray-400 font-medium">data insights</span></p>
                 </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 right-0 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50"
              >
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#51B4F1]/10 rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-[#51B4F1] rounded-full"></div>
                    </div>
                    <h5 className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Health Dashboard</h5>
                 </div>
                 <h4 className="text-[1.1rem] font-black text-[#0F4D4A] mb-1">Track</h4>
                 <p className="text-[0.8rem] text-gray-500 font-medium">trends with <span className="text-[#0F4D4A] font-black">confidence</span></p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </header>

      {/* Feature Grid - Designed to Deliver Clarity and Trust */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-[4rem] font-black text-[#0F4D4A] mb-4 tracking-tighter leading-tight"
          >
            Designed to Deliver <br /> Clarity and Trust
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 font-bold max-w-lg mx-auto"
          >
            Trusted by clinics, labs, and wellness professionals worldwide.
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
           {/* Card 1: Black */}
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-[#0A0A0A] rounded-[2.5rem] p-10 h-[450px] flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02]"
           >
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
                 <Heart size={24} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white leading-tight mb-4">
                    Early detection <br />
                    of health <span className="text-gray-600">risks</span>
                 </h3>
                 <p className="text-gray-500 font-medium text-[0.9rem]">Spot issues before they become serious.</p>
              </div>
           </motion.div>

           {/* Card 2: Red Smoky */}
           <motion.div 
             initial={{ opacity: 0, y: 60 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-gradient-to-br from-[#1A0505] to-[#450A0A] rounded-[2.5rem] p-10 h-[400px] flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all hover:scale-[1.02]"
           >
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white z-10">
                 <Info size={24} />
              </div>
              <div className="z-10">
                 <h3 className="text-2xl font-black text-white leading-tight mb-4">
                    AI-powered <br />
                    interpretation <br />
                    <span className="text-gray-400 opacity-60">(no doctor-speak)</span>
                 </h3>
                 <p className="text-gray-400 font-medium text-[0.8rem]">Get clear insights without medical jargon.</p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#DC2626_0%,transparent_70%)] opacity-30 group-hover:opacity-50 transition-opacity"></div>
           </motion.div>

           {/* Card 3: Blue Abstract */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-[#EBF8FF] rounded-[2.5rem] p-10 h-[450px] flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all hover:scale-[1.02]"
           >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0F4D4A] z-10 shadow-sm">
                 <ShieldCheck size={24} />
              </div>
              <div className="z-10">
                 <h3 className="text-2xl font-black text-[#0F4D4A] leading-tight mb-4">
                    Track your Iron, <br />
                    Liver, Hormones, <br />
                    B12 <span className="text-gray-400">& more</span>
                 </h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#63B3ED]/40 to-transparent opacity-50"></div>
           </motion.div>

           {/* Card 4: Light Grey */}
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="bg-[#F1F5F9] rounded-[2.5rem] p-10 h-[380px] flex flex-col justify-end group cursor-pointer transition-all hover:scale-[1.02]"
           >
              <div>
                 <h3 className="text-2xl font-black text-[#0F4D4A] leading-tight mb-4">
                    Visual <br />
                    dashboards, <br />
                    alerts & smart <span className="text-gray-400">reports</span>
                 </h3>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Product Showcase Section - Existing (Already updated in previous step) */}
      <section className="py-32 px-6 bg-[#0F4D4A] overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/3">
             <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight">Clinical Power. Simplified.</motion.h2>
             <div className="space-y-4">
                {showcaseItems.map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${activeTab === idx ? "bg-white/10 border border-white/20" : "hover:bg-white/5 opacity-50 hover:opacity-100"}`}
                  >
                    <h4 className="text-xl font-black text-white mb-1">{item.title}</h4>
                    <p className="text-teal-100/60 font-medium text-[0.9rem]">{item.description}</p>
                  </motion.button>
                ))}
             </div>
          </div>
          <div className="lg:w-2/3 relative">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-[2.5rem] p-3 shadow-2xl overflow-hidden aspect-[4/3] relative"
                >
                  <img 
                    src={showcaseItems[activeTab].image} 
                    alt={showcaseItems[activeTab].title} 
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F4D4A]/20 to-transparent pointer-events-none"></div>
                </motion.div>
             </AnimatePresence>
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#20D898] blur-[120px] opacity-20 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto bg-[#0F172A] rounded-[3.5rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight">Ready to secure your health journey?</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-teal-100/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Join thousands of families who sleep better knowing their prescriptions are verified by clinical-grade AI.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col items-center gap-8">
              <Link to="/dashboard" className="bg-[#20D898] text-[#0F172A] px-12 py-5 rounded-2xl text-[1.1rem] font-black hover:bg-white hover:scale-105 transition-all shadow-xl shadow-teal-400/10 active:scale-95">Get Started Free</Link>
              <div className="flex items-center gap-2">
                 <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#20D898" className="text-[#20D898]" />)}
                 </div>
                 <span className="text-white font-bold text-[0.9rem]">4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, rotate: -10 }} whileInView={{ opacity: 0.05, rotate: 0 }} transition={{ duration: 2 }} className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none"><ShieldCheck size={300} className="text-white" /></motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}

// No internal mocks needed
