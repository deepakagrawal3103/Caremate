import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Search,
  Bell,
  HelpCircle,
  Plus,
  Settings,
  LogOut,
  Filter,
  Download,
  Activity,
  Thermometer,
  Wind,
  Heart,
  Calendar,
  Clock,
  MoreVertical,
  PlusCircle,
  FileText,
  ShieldCheck,
  Stethoscope,
  Menu,
  AlertTriangle,
  Phone,
  Zap,
  Pill,
  Check,
  ChevronLeft,
  History
} from 'lucide-react';
import { useMobileMenu } from "../context/MobileMenuContext";

export default function PatientRecords() {
  const { openMobileMenu } = useMobileMenu();
  const [activeTab, setActiveTab] = React.useState('Clinical Timeline');

  const clinicalReports = [
    { name: "Post-Op Cardiology Summary", date: "Oct 24, 2023", type: "PDF", size: "1.2 MB", status: "READY" },
    { name: "Blood Work: Comprehensive Panel", date: "Oct 20, 2023", type: "PDF", size: "850 KB", status: "READY" },
    { name: "Chest X-Ray Analysis", date: "Sep 29, 2023", type: "DICOM", size: "45.0 MB", status: "ARCHIVED" }
  ];

  const chronicConditions = [
    { name: "Hypertension", date: "Diagnosed 2018", status: "Controlled", details: "On Lisinopril 10mg" },
    { name: "Type 2 Diabetes", date: "Diagnosed 2021", status: "Monitoring", details: "HbA1c: 6.8%" },
    { name: "Atrial Fibrillation", date: "Diagnosed 2021", status: "Stable", details: "Pacemaker implanted" }
  ];

  const pastSurgeries = [
    { name: "Permanent Pacemaker Implantation", date: "Aug 12, 2021", hospital: "St. Mary's Cardiology" },
    { name: "Knee Arthroscopy (Left)", date: "Jan 15, 2019", hospital: "Orthopedic Center" }
  ];

  const labMetrics = [
    { name: "HbA1c", value: "6.8%", range: "4.0-5.6%", status: "High" },
    { name: "LDL Cholesterol", value: "92 mg/dL", range: "<100 mg/dL", status: "Normal" },
    { name: "Creatinine", value: "0.9 mg/dL", range: "0.7-1.3 mg/dL", status: "Normal" }
  ];

  const familyHistory = [
    { relation: "Father", condition: "Myocardial Infarction at 58", risk: "Elevated" },
    { relation: "Mother", condition: "Type 2 Diabetes", risk: "Genetic" }
  ];

  const careTeam = [
    { name: "Dr. Marcus Sterling", specialty: "Interventional Cardiology", role: "Primary Surgeon", phone: "+1 (555) 012-3456", email: "m.sterling@medsafe.com" },
    { name: "Dr. Sarah Jenkins", specialty: "Internal Medicine", role: "Primary Care", phone: "+1 (555) 987-6543", email: "s.jenkins@medsafe.com" }
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans pb-24">
      {/* MOBILE VIEW (Exactly like Screenshot 4) */}
      <div className="lg:hidden space-y-5 px-4 bg-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <button 
            onClick={() => window.history.back()}
            className="p-1 text-[#0F4D4A]"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[1.2rem] font-bold text-[#0F4D4A] tracking-tight">CareMate</h1>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-1.5 text-[#0F4D4A] hover:bg-[#F0FDFA] rounded-xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <Link to="/emergency-mode" className="bg-[#FDECEC] text-[#B91C1C] px-4 py-1.5 rounded-full text-[0.8rem] font-bold border border-[#FEE2E2]">
              SOS
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src="https://img.freepik.com/premium-photo/business-woman-portrait-office-confident-smile-happy-corporate-female-professional_590464-180010.jpg" alt="Eleanor Vance" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-[1.4rem] font-bold text-[#0F4D4A]">Eleanor Vance</h2>
            <p className="text-[0.85rem] text-gray-500 font-medium tracking-tight uppercase">Patient ID: #CM-99420</p>
          </div>
        </div>

        {/* Emergency Info Box */}
        <div className="bg-[#FFF5F5] rounded-3xl border border-[#FEE2E2] p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#B91C1C]">
            <AlertTriangle size={20} className="fill-[#B91C1C] text-white" />
            <h3 className="text-[1.1rem] font-bold">Emergency Info</h3>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">CRITICAL CONDITION</p>
            <p className="text-[1.1rem] font-bold text-[#0F4D4A]">Permanent Pacemaker (2021)</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">EMERGENCY CONTACT</p>
              <p className="text-[1rem] font-bold text-[#0F4D4A]">Sarah Vance (Daughter)</p>
            </div>
            <button className="w-10 h-10 bg-[#0F4D4A] rounded-xl flex items-center justify-center text-white">
              <Phone size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Chronic Conditions */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="text-[#0F4D4A]" size={20} />
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Chronic Conditions</h3>
          </div>
          <div className="space-y-3">
            {chronicConditions.map((condition, i) => (
              <div key={i} className="flex justify-between items-start py-3 border-b border-gray-50 last:border-0">
                <div>
                  <h4 className="text-[0.95rem] font-bold text-[#0F4D4A]">{condition.name}</h4>
                  <p className="text-[0.8rem] text-gray-500 font-medium">{condition.date}</p>
                </div>
                <span className="bg-[#F0FDFA] text-[#0F4D4A] text-[0.65rem] font-black px-2 py-1 rounded-md uppercase">{condition.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lab Highlights */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#0F4D4A]" size={20} />
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Lab Highlights</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {labMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{metric.name}</p>
                  <p className="text-[1.1rem] font-black text-[#0F4D4A]">{metric.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.6rem] text-gray-400 font-bold">Ref: {metric.range}</p>
                  <span className={`text-[0.65rem] font-black uppercase ${metric.status === 'Normal' ? 'text-green-500' : 'text-amber-500'}`}>{metric.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Procedures */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <History className="text-[#0F4D4A]" size={20} />
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Past Procedures</h3>
          </div>
          <div className="space-y-4">
            {pastSurgeries.map((surgery, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#0F4D4A] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-[#0F4D4A] leading-tight">{surgery.name}</h4>
                  <p className="text-[0.75rem] text-gray-500 font-medium">{surgery.date} • {surgery.hospital}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Medicines Section */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Active Medicines</h3>
            <span className="bg-gray-100 text-gray-500 text-[0.7rem] font-bold px-3 py-1 rounded-full">4 Items</span>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#CCFBF1] rounded-full flex items-center justify-center text-[#0F4D4A]">
                  <Pill size={22} className="fill-[#0F4D4A]" />
                </div>
                <div>
                  <h4 className="text-[1rem] font-bold text-[#0F4D4A]">Lisinopril</h4>
                  <p className="text-[0.85rem] text-gray-500 font-medium">10mg • Once Daily (Morning)</p>
                </div>
              </div>
              <div className="w-6 h-6 bg-[#0F4D4A] rounded-full flex items-center justify-center text-white">
                <Check size={16} strokeWidth={4} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center">
                    <Plus size={14} strokeWidth={4} />
                  </div>
                </div>
                <div>
                  <h4 className="text-[1rem] font-bold text-[#0F4D4A]">Atorvastatin</h4>
                  <p className="text-[0.85rem] text-gray-500 font-medium">20mg • Evening</p>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Family History */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-[#0F4D4A]" size={20} />
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Family History</h3>
          </div>
          <div className="space-y-4">
            {familyHistory.map((item, i) => (
              <div key={i} className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">{item.relation}</p>
                <p className="text-[1rem] font-bold text-[#0F4D4A] mb-1">{item.condition}</p>
                <span className="text-[0.6rem] font-black bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded uppercase">{item.risk} Risk Factor</span>
              </div>
            ))}
          </div>
        </section>

        {/* Operating Doctors / Care Team */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Stethoscope className="text-[#0F4D4A]" size={20} />
              <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Care Team</h3>
            </div>
            <button className="text-[0.75rem] font-black text-[#0F4D4A] opacity-60 uppercase tracking-widest">Directory</button>
          </div>
          <div className="space-y-4">
            {careTeam.map((doctor, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#F0FDFA] rounded-2xl border border-[#CCFBF1]">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white">
                   <img src={i === 0 ? "https://img.freepik.com/premium-photo/portrait-mature-male-doctor-wearing-white-coat-standing-hospital-corridor_496156-541.jpg" : "https://img.freepik.com/free-photo/doctor-with-her-arms-crossed-white-background_23-2147730303.jpg"} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[1rem] font-black text-[#0F4D4A]">{doctor.name}</h4>
                  <p className="text-[0.75rem] text-gray-500 font-bold uppercase tracking-tight">{doctor.specialty} • {doctor.role}</p>
                </div>
                <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F4D4A] shadow-sm active:scale-90 transition-transform">
                  <Phone size={18} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Notes Card */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="text-[#0F4D4A]" size={20} />
              <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Clinical Notes</h3>
            </div>
            <button className="text-[0.75rem] font-black text-[#0F4D4A] opacity-60 uppercase tracking-widest">Add New</button>
          </div>
          <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-5">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
                <span className="text-[0.65rem] font-black text-[#D97706] uppercase tracking-widest">DR. MARCUS • OCT 24</span>
             </div>
             <p className="text-[0.9rem] text-[#92400E] font-medium leading-relaxed">
                Patient is responding well to Lisinopril. No reports of dry cough. Advised to continue low-sodium diet and monitor blood glucose levels daily.
             </p>
          </div>
        </section>

        {/* Quick Share QR Card */}
        <div className="bg-[#0F4D4A] rounded-3xl p-6 text-white flex items-center gap-5 shadow-xl relative overflow-hidden">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20">
            {/* QR Code Placeholder */}
            <div className="w-14 h-14 bg-white grid grid-cols-5 grid-rows-5 gap-0.5 p-1 opacity-80">
              {[...Array(25)].map((_, i) => (
                <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[1rem] font-bold mb-1">Quick Share</h3>
            <p className="text-[0.75rem] text-[#CCFBF1] font-medium leading-tight opacity-90">
              Emergency responders can scan this to access your critical records instantly.
            </p>
          </div>
          {/* Ambient Graphics */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Export Button */}
        <button className="w-full flex items-center justify-center gap-2 text-gray-500 text-[0.8rem] font-bold uppercase tracking-widest pt-2 pb-6">
          <Download size={16} /> Export Health PDF
        </button>
      </div>

      {/* Top Header - Desktop ONLY */}
      <header className="hidden lg:flex px-4 md:px-5 py-2 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[52px]">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              className="w-full bg-[#F1F5F9] border-none rounded-lg py-2 pl-9 md:pl-10 pr-4 text-[0.85rem] md:text-[0.9rem] focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5 ml-4">
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 transition-colors p-1"><Bell size={20} /></Link>
          <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 hidden sm:block"><PlusCircle size={20} /></button>
          <Link to="/settings" className="text-gray-400 hover:text-gray-900 transition-colors p-1"><Settings size={20} /></Link>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
            <img src="https://img.freepik.com/premium-vector/3d-avatar-young-man-with-glasses-shirt-vector-illustration_1150-65064.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="hidden lg:block p-4 md:p-5 max-w-[1400px] mx-auto">
        {/* Title & Actions Row - Responsive */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">Patient Records</h1>
            <p className="text-gray-500 font-medium text-[0.8rem] md:text-[0.85rem]">Manage clinical data and history.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="bg-white border border-gray-100 p-1 rounded-xl flex flex-1 sm:flex-none">
              <button className="flex-1 px-4 py-1.5 text-[0.8rem] md:text-[0.85rem] font-bold bg-gray-50 text-gray-900 rounded-lg shadow-sm">List</button>
              <button className="flex-1 px-4 py-1.5 text-[0.8rem] md:text-[0.85rem] font-bold text-gray-400 hover:text-gray-600 transition-colors">Timeline</button>
            </div>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-[0.8rem] md:text-[0.85rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-colors min-h-[40px]">
              <Filter size={16} /> Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-[0.8rem] md:text-[0.85rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-colors min-h-[40px]">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Patient Hero Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-center sm:items-start mb-5 text-center sm:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#0F766E]/10 overflow-hidden shrink-0 border border-[#0F766E]/20">
                  <img src="https://img.freepik.com/premium-photo/business-woman-portrait-office-confident-smile-happy-corporate-female-professional_590464-180010.jpg" alt="Elena Rodriguez" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">Elena Rodriguez</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="bg-[#F0FDFA] text-[#0F766E] text-[0.6rem] md:text-[0.65rem] font-black px-2.5 py-1 rounded-full uppercase border border-[#0F766E]/10">B+ BLOOD</span>
                      <span className="bg-[#FEF2F2] text-[#B91C1C] text-[0.6rem] md:text-[0.65rem] font-black px-2.5 py-1 rounded-full uppercase border border-[#B91C1C]/10">PENICILLIN ALLERGY</span>
                    </div>
                  </div>
                  <p className="text-gray-400 font-bold text-[0.75rem] md:text-[0.85rem] uppercase tracking-widest">
                    ID: #PX-88294 • DOB: May 14, 1978 (45 yrs)
                  </p>
                </div>
              </div>

              {/* Vitals Grid - Responsive */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Heart Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">72</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">bpm</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">BP</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">118/76</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">mmHg</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">SPO2</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">98</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">%</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Temp</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">98.6</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">°F</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 md:px-6 py-0 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-[1] overflow-x-auto no-scrollbar">
                <div className="flex gap-5 md:gap-6 h-[48px] md:h-[52px] shrink-0">
                  {['Clinical Timeline', 'Clinical Reports', 'Lab Results'].map((tabName) => (
                    <button
                      key={tabName}
                      onClick={() => setActiveTab(tabName)}
                      className={`h-full px-1 text-[0.85rem] md:text-[0.9rem] font-bold transition-all border-b-[3px] whitespace-nowrap ${activeTab === tabName ? 'text-[#0F766E] border-[#0F766E]' : 'text-gray-400 border-transparent hover:text-gray-600'
                        }`}
                    >
                      {tabName}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:block ml-4">
                  {activeTab === 'Clinical Timeline' && (
                    <button className="text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline whitespace-nowrap">View All Events</button>
                  )}
                  {activeTab === 'Clinical Reports' && (
                    <button className="flex items-center gap-2 text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline whitespace-nowrap">
                      <PlusCircle size={14} /> Generate Report
                    </button>
                  )}
                </div>
              </div>

              {activeTab === 'Clinical Reports' && (
                <div className="p-5">
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-6 py-4 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Report Name</th>
                          <th className="px-6 py-4 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {clinicalReports.map((report, i) => (
                          <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                  <FileText size={16} />
                                </div>
                                <span className="text-[0.9rem] font-bold text-gray-900">{report.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[0.85rem] font-medium text-gray-500">{report.date}</td>
                            <td className="px-6 py-4">
                              <span className="text-[0.7rem] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-tighter">{report.type} • {report.size}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-[#0F766E] hover:text-[#0D635D] p-2 transition-colors">
                                <Download size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Lab Results' && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Stethoscope className="text-gray-300" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">No Lab Results Yet</h4>
                  <p className="text-gray-500 text-[0.9rem] max-w-[280px]">Detailed laboratory metrics will appear here once uploaded by the clinical lab.</p>
                </div>
              )}

              {activeTab === 'Clinical Timeline' && (
                <div className="p-5 md:p-6 space-y-6 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-gray-50"></div>

                  {/* Event 1 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[0.55rem] top-1.5 w-3 h-3 rounded-full bg-[#0F766E] ring-4 ring-white z-10"></div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[0.95rem] font-black text-gray-900 uppercase">Post-Op Follow-up: Cardiology</h4>
                      <span className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider">Oct 24, 2023 • 10:30 AM</span>
                    </div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                      <p className="text-[0.85rem] text-gray-600 leading-tight font-medium mb-3">
                        Recovery is progressing optimally. ECG shows normal sinus rhythm. Patient reports no shortness of breath during light physical activity.
                      </p>
                      <div className="flex gap-1.5">
                        <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.6rem] font-black px-2 py-1 rounded uppercase tracking-tight">Image</span>
                        <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.6rem] font-black px-2 py-1 rounded uppercase tracking-tight">Lab Results</span>
                      </div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[0.55rem] top-1.5 w-3 h-3 rounded-full bg-gray-400 ring-4 ring-white z-10"></div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[0.95rem] font-black text-gray-900 uppercase">Prescription Renewal: Lisinopril</h4>
                      <span className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider">Oct 12, 2023 • 03:15 PM</span>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                          <Plus size={12} className="text-[#0F766E]" />
                        </div>
                        <span className="text-[0.8rem] font-bold text-gray-900 uppercase">Verified Medication Tag Applied</span>
                      </div>
                      <p className="text-[0.9rem] text-gray-600 leading-relaxed font-medium">
                        Dose maintained at 10mg daily. Patient noted consistent adherence via telehealth check.
                      </p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[0.55rem] top-1.5 w-3 h-3 rounded-full bg-[#B91C1C] ring-4 ring-white z-10"></div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[0.95rem] font-black text-gray-900 uppercase text-[#B91C1C]">Emergency Admission: Chest Pain</h4>
                      <span className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider">Sep 28, 2023 • 11:42 PM</span>
                    </div>
                    <div className="bg-[#FEF2F2]/40 rounded-2xl p-6 border border-[#FEF2F2]">
                      <p className="text-[0.9rem] text-[#991B1B] leading-relaxed font-medium mb-4">
                        Acute onset symptoms. Admitted via ER Unit 4. Stabilized within 45 minutes of arrival.
                      </p>
                      <div className="flex gap-5">
                        <button className="flex items-center gap-1.5 text-[0.75rem] font-black text-gray-900 uppercase tracking-tight">
                          <span className="text-gray-400">👁</span> View Full ER Report
                        </button>
                        <button className="flex items-center gap-1.5 text-[0.75rem] font-black text-gray-900 uppercase tracking-tight">
                          <User size={14} className="text-gray-400" /> Dr. Marcus Sterling
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Chronic Conditions */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="text-[#0F766E]" size={18} />
                <h3 className="text-[0.95rem] font-bold text-gray-900">Chronic Conditions</h3>
              </div>
              <div className="space-y-3">
                {chronicConditions.map((item, i) => (
                  <div key={i} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex justify-between items-center group hover:bg-white transition-all cursor-pointer">
                    <div>
                      <h4 className="text-[0.9rem] font-black text-gray-900 uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[0.7rem] text-gray-400 font-bold uppercase">{item.date}</p>
                    </div>
                    <span className={`text-[0.65rem] font-black px-2 py-1 rounded-md uppercase ${item.status === 'Controlled' ? 'bg-[#F0FDFA] text-[#0F766E]' :
                        item.status === 'Monitoring' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F4F4F5] text-gray-500'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-5 border border-dashed border-gray-200 py-3 rounded-xl text-[0.8rem] font-bold text-gray-400 hover:bg-gray-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                <Plus size={14} /> Add Medical Condition
              </button>
            </div>


            {/* Record Assistant CTA */}
            <div className="bg-[#0F766E] rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
              <h3 className="text-[1rem] font-bold mb-2 relative z-10">Record Assistant</h3>
              <p className="text-[#CCFBF1] text-[0.75rem] font-medium leading-tight mb-5 relative z-10">
                AI-powered summary of the last 48 hours for Elena Rodriguez.
              </p>
              <button className="w-full bg-white text-[#0F766E] py-2 rounded-lg font-black text-[0.85rem] shadow-lg shadow-black/10 relative z-10 hover:bg-[#F0FDFA] transition-all">
                Generate Summary
              </button>

              {/* Ambient Graphics */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
