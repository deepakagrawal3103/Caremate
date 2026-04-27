import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell, Settings, Plus, ChevronLeft, ChevronRight, Sun, SunDim, Sunrise, Moon, Check,
  Search, ListFilter, Pill, ShieldCheck, Edit2, MoreVertical, AlertTriangle, AlertCircle,
  ArrowRight, ClipboardList, Syringe, X, Clock, Menu
} from "lucide-react";
import { useMobileMenu } from "../context/MobileMenuContext";

export default function MedicineManagement() {
  const navigate = useNavigate();
  const { openMobileMenu } = useMobileMenu();
  const [activeSubTab, setActiveSubTab] = useState('Medicines');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Lisinopril",
      category: "Hypertension Management",
      dosage: "1 pill",
      frequency: "Once daily, Morning",
      reminders: ["08:00"],
      status: "Safe",
      supply: { current: 12, total: 30, percentage: 40 },
      type: "pill",
      statusColor: "bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]",
      iconColor: "bg-[#F0FDFA] text-[#0F766E]",
      icon: Pill
    },
    {
      id: 2,
      name: "Atorvastatin",
      category: "Cholesterol Control",
      dosage: "1 pill",
      frequency: "Once daily, Night",
      reminders: ["21:00"],
      status: "Check Grapefruit",
      supply: { current: 28, total: 30, percentage: 93 },
      type: "syringe",
      statusColor: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
      iconColor: "bg-[#f5f3ff] text-[#7c3aed]",
      icon: Syringe
    },
    {
      id: 3,
      name: "Sertraline",
      category: "Emotional Balance",
      dosage: "1 pill",
      frequency: "Once daily, Morning",
      reminders: ["09:00"],
      status: "Interaction Detected",
      supply: { current: 2, total: 30, percentage: 10 },
      type: "pill",
      statusColor: "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]",
      iconColor: "bg-[#fee2e2] text-[#dc2626]",
      icon: AlertTriangle,
      isAlert: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogDose = (name) => {
    alert(`Dose for ${name} logged successfully!`);
  };

  const handleRefill = (name) => {
    alert(`Refill request sent for ${name}.`);
  };

  const handleEditClick = (med) => {
    setEditingMed({ ...med, reminders: med.reminders || ["08:00"] });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setMedications(meds => meds.map(m => m.id === editingMed.id ? editingMed : m));
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header - Desktop ONLY */}
      <header className="hidden lg:flex px-4 lg:px-5 items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 h-[52px] overflow-hidden">
        <div className="flex gap-4 md:gap-8 h-full overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveSubTab('Overview')}
            className={`${activeSubTab === 'Overview' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('Medicines')}
            className={`${activeSubTab === 'Medicines' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Medicine Tracker
          </button>
          <button
            onClick={() => setActiveSubTab('Reminders')}
            className={`${activeSubTab === 'Reminders' ? 'text-[#0F766E] font-bold border-b-[3px] border-[#0F766E]' : 'text-gray-500 font-medium'} text-[0.85rem] md:text-[0.95rem] whitespace-nowrap hover:text-gray-900 transition-colors h-full pt-0.5`}
          >
            Manage Reminders
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-6 pl-4 bg-white border-l border-gray-50">
          <Link to="/notifications" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Bell className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" fill="currentColor" />
          </Link>
          <Link to="/settings" className="hidden sm:block text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Settings className="w-[20px] h-[20px]" fill="currentColor" />
          </Link>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <img src="https://img.freepik.com/premium-vector/3d-avatar-young-man-with-glasses-shirt-vector-illustration_1150-65064.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-5 py-4 mx-auto max-w-[1200px] relative pb-20">
        {/* MOBILE VIEW (Exactly like Screenshot 1) */}
        <div className="lg:hidden space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pt-2 mb-2">
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
              <Link to="/emergency-mode" className="bg-[#0F4D4A] text-white px-4 py-1.5 rounded-full text-[0.8rem] font-bold">
                SOS
              </Link>
            </div>
          </div>

          {/* Adherence Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-5">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.94)} className="text-[#0F766E]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900 leading-none">94%</span>
                <span className="text-[0.6rem] font-bold text-gray-400 uppercase">Weekly</span>
              </div>
            </div>
            <div>
              <h3 className="text-[1.1rem] font-bold text-gray-900 mb-1">Great Adherence</h3>
              <p className="text-gray-500 text-[0.85rem] font-medium leading-snug">You missed only 1 dose in the last 7 days. Your safety score is optimal.</p>
            </div>
          </div>

          {/* Daily Schedule Section */}
          <section>
            <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-[1.1rem] font-bold text-gray-900">Schedule</h2>
              <span className="text-[0.8rem] font-bold text-[#0F766E]">Today, Oct 12</span>
            </div>

            {/* Time Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['Morning', 'Midday', 'Evening', 'Night'].map((time) => (
                <button
                  key={time}
                  className={`px-4 py-1.5 rounded-full text-[0.8rem] font-bold whitespace-nowrap transition-all ${
                    time === 'Morning' ? 'bg-[#0F766E] text-white shadow-sm' : 'bg-[#F1F5F9] text-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Daily Med Cards */}
            <div className="space-y-3 mt-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
                    <div className="w-6 h-6 border-2 border-[#0F766E] rounded-md flex items-center justify-center">
                      <Plus size={12} strokeWidth={4} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-bold text-gray-900">Lisinopril</h4>
                    <p className="text-[0.85rem] text-gray-500 font-medium">10mg • 08:00 AM</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E]">
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
                    <Pill size={22} className="fill-[#0F766E]" />
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-bold text-gray-900">Vitamin D3</h4>
                    <p className="text-[0.85rem] text-gray-500 font-medium">2000 IU • 08:00 AM</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-200">
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          </section>

          {/* All My Medicines Section */}
          <section>
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-[1.1rem] font-bold text-gray-900">All Medicines</h2>
              <Link to="/medication-history" className="text-[0.8rem] font-bold text-[#0F766E]">History</Link>
            </div>

            <div className="space-y-3">
              {/* Med 1 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-[1.1rem] font-bold text-gray-900">Metformin</h4>
                    <p className="text-[0.9rem] text-gray-500 font-medium">500mg • Twice Daily</p>
                  </div>
                  <span className="text-[0.65rem] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded uppercase tracking-widest border border-emerald-100">Safe</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">
                    <span>Supply: 12 Days Left</span>
                    <span>24/60</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F766E] rounded-full w-[40%]"></div>
                  </div>
                </div>
              </div>

              {/* Med 2 */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-[1.1rem] font-bold text-gray-900">Atorvastatin</h4>
                    <p className="text-[0.9rem] text-gray-500 font-medium">20mg • Evening</p>
                  </div>
                  <span className="text-[0.65rem] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded uppercase tracking-widest border border-red-100">Check Grapefruit</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">
                    <span>Supply: 45 Days Left</span>
                    <span>45/60</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F766E] rounded-full w-[75%]"></div>
                  </div>
                </div>
              </div>

              {/* Med 3 */}
              <div className="bg-white rounded-3xl border-2 border-red-100 p-5 shadow-sm relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-[1.1rem] font-bold text-gray-900">Warfarin</h4>
                    <p className="text-[0.9rem] text-gray-500 font-medium">2.5mg • Evening</p>
                  </div>
                  <span className="text-[0.65rem] font-black text-red-700 bg-red-100 px-2.5 py-1 rounded uppercase tracking-widest">Interaction Detected</span>
                </div>
                <div className="flex items-center gap-2 text-red-600 font-bold text-[0.85rem]">
                  <AlertTriangle size={16} />
                  <span>Conflict with Vitamin K Suppleme...</span>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Action Button */}
        </div>

        {/* DESKTOP VIEW - PRESERVED */}
        <div className="hidden lg:block">
          {/* Page Title & Add Button - Stacked on mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-[1.2rem] md:text-[1.4rem] font-bold text-gray-900 mb-0.5 leading-tight tracking-tight">Medicine Tracker</h1>
              <p className="text-gray-500 text-[0.85rem] font-medium">Manage prescriptions and schedule.</p>
            </div>
            <button
              onClick={() => navigate("/add-medicine")}
              className="w-full md:w-auto bg-[#0F766E] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-[0.85rem] font-bold flex items-center justify-center gap-2 shadow-sm transition-all min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add New
            </button>
          </div>

          {/* Tab Content: Medicines */}
          {activeSubTab === 'Medicines' && (
            <>
              {/* Top Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                {/* Weekly Adherence (Left) */}
                <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm h-[260px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Adherence</h3>
                  {/* Circular Progress */}
                  <div className="relative w-36 h-36 mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="62" stroke="#E5E7EB" strokeWidth="14" fill="none" />
                      <circle cx="72" cy="72" r="62" stroke="#0F766E" strokeWidth="14" fill="none" strokeDasharray="389.5" strokeDashoffset={389.5 * (1 - 0.94)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <span className="text-[2.2rem] font-bold text-[#0F766E] leading-none tracking-tight">94%</span>
                      <span className="text-[0.65rem] font-bold text-gray-500 mt-1.5 uppercase tracking-widest">Excellent</span>
                    </div>
                  </div>
                  <p className="text-[0.9rem] font-medium text-gray-500 w-5/6 leading-relaxed">
                    You've missed only 2 doses this week. Keep up the great routine!
                  </p>
                </div>

                {/* Daily Schedule (Right) */}
                <div className="lg:col-span-8 bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-[260px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Daily Schedule</h3>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[0.95rem] font-semibold text-gray-600">Today, Oct 24</span>
                      <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:h-[180px]">
                    {/* Morning */}
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3 justify-center md:justify-center">
                        <Sun className="w-4 h-4 text-[#0F766E]" />
                        <span className="text-[0.7rem] font-bold text-[#0F766E] uppercase tracking-widest">Morning</span>
                      </div>
                      <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                        <h4 className="font-bold text-gray-900 text-[0.9rem]">{medications[0].name}</h4>
                        <p className="text-[0.75rem] font-medium text-gray-500 mt-0.5 mb-3 md:mb-4">{medications[0].dosage} • After food</p>
                        <button
                          onClick={() => handleLogDose(medications[0].name)}
                          className="bg-[#0F766E] hover:bg-[#047857] text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-lg w-full transition-colors shadow-sm min-h-[40px]"
                        >
                          Log Dose
                        </button>
                      </div>
                    </div>
                    {/* Midday */}
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3 justify-center md:justify-center">
                        <SunDim className="w-4 h-4 text-orange-500" />
                        <span className="text-[0.7rem] font-bold text-orange-500 uppercase tracking-widest">Midday</span>
                      </div>
                      <div className="bg-[#f4faf7] border-[2px] border-[#0F766E] rounded-2xl p-4 flex flex-col items-center justify-center text-center relative flex-1 shadow-sm">
                        <div className="absolute -top-2 -right-2 bg-[#0F766E] rounded-full p-[3px] text-white shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[4]" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-[0.9rem]">Vitamin D3</h4>
                        <p className="text-[0.75rem] font-medium text-gray-500 mt-0.5 mb-3 md:mb-4">2000 IU • 1:00 PM</p>
                        <span className="bg-[#CCFBF1] text-[#0F766E] text-[0.65rem] font-bold py-2.5 px-3 rounded-lg w-full uppercase tracking-widest">Logged 12:55 PM</span>
                      </div>
                    </div>
                    {/* Evening */}
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3 justify-center md:justify-center">
                        <Sunrise className="w-4 h-4 text-indigo-800" />
                        <span className="text-[0.7rem] font-bold text-indigo-800 uppercase tracking-widest">Evening</span>
                      </div>
                      <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                        <h4 className="font-bold text-gray-900 text-[0.9rem]">Metformin</h4>
                        <p className="text-[0.75rem] font-medium text-gray-500 mt-0.5 mb-3 md:mb-4">500mg • Dinner</p>
                        <button
                          onClick={() => handleLogDose("Metformin")}
                          className="bg-[#0F766E] hover:bg-[#047857] text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-lg w-full transition-colors shadow-sm min-h-[40px]"
                        >
                          Log Dose
                        </button>
                      </div>
                    </div>
                    {/* Night */}
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3 justify-center md:justify-center">
                        <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                        <span className="text-[0.7rem] font-bold text-indigo-600 uppercase tracking-widest">Night</span>
                      </div>
                      <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                        <h4 className="font-bold text-gray-900 text-[0.9rem]">{medications[1].name}</h4>
                        <p className="text-[0.75rem] font-medium text-gray-500 mt-0.5 mb-3 md:mb-4">{medications[1].dosage} • Bedtime</p>
                        <button
                          onClick={() => handleLogDose(medications[1].name)}
                          className="bg-[#0F766E] hover:bg-[#047857] text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-lg w-full transition-colors shadow-sm min-h-[40px]"
                        >
                          Log Dose
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All My Medicines */}
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-8 overflow-hidden">
                <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                  <h3 className="text-lg font-bold text-gray-900">All My Medicines</h3>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[320px]">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-[0.9rem] font-medium text-gray-900 rounded-xl py-2.5 md:py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#0F766E] transition-all"
                      />
                    </div>
                    <button className="p-2.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl transition-colors min-h-[44px] flex items-center justify-center">
                      <ListFilter className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-white">
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[25%]">Medication</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[15%]">Dosage</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[18%]">Status</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[17%]">Supply</th>
                        <th className="py-3 px-6 text-[0.8rem] font-bold text-gray-900 w-[25%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredMedications.map((med) => (
                        <tr key={med.id} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${med.id === 3 ? "bg-[#fef2f2]/40 hover:bg-[#fef2f2]/80" : ""}`}>
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${med.iconColor}`}>
                                <med.icon className={`w-[1.2rem] h-[1.2rem] ${med.isAlert ? "fill-[#dc2626] text-white" : med.type === "pill" ? "fill-current" : ""}`} strokeWidth={med.type === "syringe" ? 2 : 1} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-[0.95rem] mb-0.5">{med.name}</p>
                                <p className="text-[0.8rem] text-gray-500 font-medium">{med.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-6">
                            <p className="font-bold text-gray-900 text-[0.9rem] mb-0.5">{med.dosage}</p>
                            <p className="text-[0.8rem] text-gray-500 font-medium">{med.frequency}</p>
                          </td>
                          <td className="py-3 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.75rem] font-bold border ${med.statusColor}`}>
                              {med.id === 1 && <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />}
                              {med.id === 2 && <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />}
                              {med.id === 3 && <AlertCircle className="w-3.5 h-3.5 fill-[#dc2626] text-white" />}
                              {med.status}
                            </span>
                          </td>
                          <td className="py-3 px-6">
                            <div className="flex justify-between items-end mb-1.5">
                              <span className="text-[0.75rem] font-bold text-gray-900">{med.supply.current} / {med.supply.total} days</span>
                              <span className={`text-[0.7rem] font-bold ${med.supply.percentage <= 20 ? "text-[#dc2626] uppercase tracking-widest" : "text-gray-500"}`}>
                                {med.supply.percentage <= 20 ? "Low Stock" : `${med.supply.percentage}% left`}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div className={`h-full ${med.supply.percentage <= 20 ? "bg-[#dc2626]" : "bg-[#0F766E]"} rounded-full`} style={{ width: `${med.supply.percentage}%` }}></div>
                            </div>
                          </td>
                          <td className="py-5 px-8 relative">
                            <div className="flex items-center justify-end gap-3.5 text-gray-400">
                              {med.id === 3 && (
                                <div className="flex gap-2">
                                  <Link
                                    to="/risk-analysis"
                                    className="bg-[#dc2626] hover:bg-red-700 text-white text-[0.75rem] font-bold py-2 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                  >
                                    Review
                                  </Link>
                                  <button
                                    onClick={() => handleRefill(med.name)}
                                    className="bg-white border border-[#dc2626] text-[#dc2626] hover:bg-red-50 text-[0.75rem] font-bold py-2 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                  >
                                    Refill Now
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => handleEditClick(med)}
                                className="hover:text-gray-900 transition-colors"
                              >
                                <Edit2 className="w-[18px] h-[18px] stroke-[2.5]" />
                              </button>
                              <button className="hover:text-gray-900 transition-colors">
                                <MoreVertical className="w-[18px] h-[18px] stroke-[2.5]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 flex justify-between items-center bg-white">
                  <span className="text-[0.85rem] text-gray-500 font-medium">Showing {medications.length} of 8 active medications</span>
                  <button className="text-[#0F766E] font-bold text-[0.85rem] hover:underline">View Archived Medications</button>
                </div>
              </div>

              {/* Bottom Banner - Responsive */}
              <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#0f4d45] to-[#146b60] text-white p-6 md:p-10 flex flex-col md:flex-row items-center shadow-md">
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-10 md:opacity-20 pointer-events-none overflow-hidden">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full transform scale-150 translate-x-10">
                    <circle cx="80" cy="50" r="40" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="80" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
                    <rect x="50" y="45" width="20" height="10" fill="none" stroke="white" strokeWidth="1" />
                    <text x="55" y="52" fill="white" fontSize="6" opacity="0.8" fontWeight="bold">WMH</text>
                  </svg>
                </div>

                <div className="relative z-10 w-full md:w-2/3 md:pl-2 text-center md:text-left">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-[0.6rem] md:text-[0.65rem] font-bold tracking-widest uppercase mb-4 md:mb-5">
                    Medical Insight
                  </div>
                  <h2 className="text-[1.3rem] md:text-[1.6rem] font-bold mb-4 md:mb-5 leading-tight tracking-tight">Did you know taking medication with warm water increases absorption speed?</h2>
                  <button className="font-bold flex items-center justify-center md:justify-start gap-2 text-[0.9rem] md:text-[0.95rem] hover:opacity-80 transition-opacity w-full md:w-auto">
                    Learn more about efficacy <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Tab Content: Reminders Management */}
          {activeSubTab === 'Reminders' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Reminder Settings</h3>
                  <p className="text-gray-500 max-w-[300px] mx-auto">Configure notification preferences and alert sounds for your medications.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Floating Action Button - Positioned differently on mobile/desktop */}
        <div className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50">
          <button
            onClick={() => navigate("/add-medicine")}
            className="w-16 h-16 bg-[#0F766E] hover:bg-[#047857] rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* Edit Modal - Accessible on both mobile and desktop */}
        {isEditModalOpen && editingMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Edit Medication</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 md:p-8 space-y-5 md:space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Medication Name</label>
                  <input
                    type="text"
                    value={editingMed.name}
                    onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900 text-[1rem]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Condition / Category</label>
                  <input
                    type="text"
                    value={editingMed.category}
                    onChange={(e) => setEditingMed({ ...editingMed, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900 text-[1rem]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Dosage</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Amount"
                        value={editingMed.dosage.split(/(\d+)/)[1] || "1"}
                        onChange={(e) => {
                          const unit = editingMed.dosage.replace(/\d+/g, "").trim();
                          setEditingMed({ ...editingMed, dosage: `${e.target.value}${unit}` });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                      />
                    </div>
                    <div className="w-[100px] md:w-[120px]">
                      <select
                        value={editingMed.dosage.replace(/\d+/g, "").trim().toLowerCase() || "pill"}
                        onChange={(e) => {
                          const amount = editingMed.dosage.split(/(\d+)/)[1] || "1";
                          setEditingMed({ ...editingMed, dosage: `${amount}${e.target.value}` });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                      >
                        <option value="pill">pill</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Frequency</label>
                    <select
                      value={editingMed.frequency.split(",")[0].trim()}
                      onChange={(e) => {
                        const parts = editingMed.frequency.split(",");
                        const rest = parts.length > 1 ? parts.slice(1).join(",") : "";
                        setEditingMed({ ...editingMed, frequency: `${e.target.value}${rest ? "," + rest : ""}` });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">3 times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Food Instruction</label>
                    <select
                      value={editingMed.frequency.toLowerCase().includes("before") ? "Before Food" : editingMed.frequency.toLowerCase().includes("after") ? "After Food" : "With Food"}
                      onChange={(e) => {
                        const freq = editingMed.frequency.split(",")[0].trim();
                        setEditingMed({ ...editingMed, frequency: `${freq}, ${e.target.value}` });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                    >
                      <option value="Before Food">Before Food</option>
                      <option value="After Food">After Food</option>
                      <option value="With Food">With Food</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[0.85rem] md:text-[0.9rem] font-bold text-gray-700">Dose Reminders</label>
                    <button
                      type="button"
                      onClick={() => setEditingMed({ ...editingMed, reminders: [...editingMed.reminders, "12:00"] })}
                      className="text-[#0F766E] text-[0.8rem] font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Time
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingMed.reminders.map((time, idx) => (
                      <div key={idx} className="relative group">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newReminders = [...editingMed.reminders];
                            newReminders[idx] = e.target.value;
                            setEditingMed({ ...editingMed, reminders: newReminders });
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-medium text-gray-900"
                        />
                        {editingMed.reminders.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newReminders = editingMed.reminders.filter((_, i) => i !== idx);
                              setEditingMed({ ...editingMed, reminders: newReminders });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl bg-[#0F766E] text-white font-bold hover:bg-[#0d6d65] transition-colors shadow-lg shadow-[#0F766E]/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
