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
  ChevronLeft
} from 'lucide-react';
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAuth } from "../context/AuthContext";
import { recordsAPI } from "../features/records/recordsAPI";
import { medicineAPI } from "../features/medicine/medicineAPI";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function PatientRecords() {
  const { openMobileMenu } = useMobileMenu();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('Clinical Timeline');
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState([]);
  const [conditions, setConditions] = React.useState([]);
  const [medicines, setMedicines] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      const [reportsData, conditionsData, medsRes] = await Promise.all([
        recordsAPI.getReports(),
        recordsAPI.getConditions(),
        medicineAPI.getAllMedicines()
      ]);
      setReports(reportsData);
      setConditions(conditionsData);
      setMedicines(medsRes.data.medicines);
    } catch (error) {
      console.error("Data load error:", error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.loading("Generating Health Report...");
    setTimeout(() => {
      window.print();
      toast.dismiss();
      toast.success("Report generated successfully!");
    }, 1500);
  };

  if (authLoading || loading) return <Loader />;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const type = file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGE' : 'FILE';
      await recordsAPI.uploadReport(file, file.name, type);
      toast.success("Report uploaded successfully!");
      loadData();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clinicalReports = reports;

  const chronicConditions = conditions.length > 0 ? conditions : (user?.conditions?.map(c => ({ name: c, status: 'Active' })) || []);
  const allergies = user?.allergies || [];

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
          <Link to="/emergency-mode" className="bg-[#FDECEC] text-[#B91C1C] px-4 py-1.5 rounded-full text-[0.8rem] font-bold border border-[#FEE2E2]">
            SOS
          </Link>
        </div>

        {/* Profile Card */}
        <Link to="/profile" className="flex items-center gap-4 py-2 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.name || "Patient"} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-[1.4rem] font-bold text-[#0F4D4A]">{user?.name || "Patient"}</h2>
            <p className="text-[0.85rem] text-gray-500 font-medium tracking-tight uppercase">Patient ID: #{user?.uid?.slice(0, 8) || "CM-99420"}</p>
          </div>
        </Link>

        {/* Emergency Info Box */}
        <div className="bg-[#FFF5F5] rounded-3xl border border-[#FEE2E2] p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#B91C1C]">
            <AlertTriangle size={20} className="fill-[#B91C1C] text-white" />
            <h3 className="text-[1.1rem] font-bold">Emergency Info</h3>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">CHRONIC CONDITIONS</p>
            <p className="text-[1.1rem] font-bold text-[#0F4D4A]">{user?.conditions?.join(", ") || "None Reported"}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">EMERGENCY CONTACT</p>
              <p className="text-[1rem] font-bold text-[#0F4D4A]">{user?.emergencyContactName || "Not Set"}</p>
            </div>
            {user?.emergencyContactPhone && (
              <a href={`tel:${user.emergencyContactPhone}`} className="w-10 h-10 bg-[#0F4D4A] rounded-xl flex items-center justify-center text-white">
                <Phone size={20} fill="currentColor" />
              </a>
            )}
          </div>
        </div>

        {/* Conditions and Allergies Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#0F4D4A]" />
              <h4 className="text-[0.85rem] font-bold text-gray-500">Conditions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {chronicConditions.map((c, i) => (
                <span key={i} className="bg-[#CCFBF1] text-[#0F766E] text-[0.7rem] font-bold px-2 py-1 rounded-md">{c.name}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#B91C1C] fill-[#B91C1C]" />
              <h4 className="text-[0.85rem] font-bold text-gray-500">Allergies</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergies.length > 0 ? allergies.map((a, i) => (
                <span key={i} className="bg-red-50 text-red-600 text-[0.7rem] font-bold px-2 py-1 rounded-md">{a}</span>
              )) : <span className="text-gray-400 text-[0.7rem] font-bold">No Known Allergies</span>}
            </div>
          </div>
        </div>

        {/* Active Medicines Section */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[1.1rem] font-bold text-[#0F4D4A]">Active Medicines</h3>
            <span className="bg-gray-100 text-gray-500 text-[0.7rem] font-bold px-3 py-1 rounded-full">{medicines.length} Items</span>
          </div>
          <div className="space-y-5">
            {medicines.length > 0 ? medicines.slice(0, 3).map((med, i) => (
              <div key={med._id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#CCFBF1] rounded-full flex items-center justify-center text-[#0F4D4A]">
                    <Pill size={22} className="fill-[#0F4D4A]" />
                  </div>
                  <div>
                    <h4 className="text-[1rem] font-bold text-[#0F4D4A]">{med.name}</h4>
                    <p className="text-[0.85rem] text-gray-500 font-medium">{med.strength} • {med.schedule?.[0] || "As per plan"}</p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-[#0F4D4A] rounded-full flex items-center justify-center text-white">
                  <Check size={16} strokeWidth={4} />
                </div>
              </div>
            )) : (
              <p className="text-gray-400 italic text-center py-4">No active medicines.</p>
            )}
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
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 text-gray-500 text-[0.8rem] font-bold uppercase tracking-widest pt-2 pb-6"
        >
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
            <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
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
            <button 
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-[0.8rem] md:text-[0.85rem] text-gray-700 shadow-sm hover:bg-gray-50 transition-colors min-h-[40px]"
            >
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
                  <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.name || "Patient"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">{user?.name || "Patient Name"}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="bg-[#F0FDFA] text-[#0F766E] text-[0.6rem] md:text-[0.65rem] font-black px-2.5 py-1 rounded-full uppercase border border-[#0F766E]/10">{user?.bloodGroup || "B+"} BLOOD</span>
                    </div>
                  </div>
                  <p className="text-gray-400 font-bold text-[0.75rem] md:text-[0.85rem] uppercase tracking-widest">
                    ID: #{user?.uid?.slice(0, 8) || "PX-88294"} • DOB: {user?.dob || "May 14, 1978"} ({user?.age || "45"} yrs)
                  </p>
                </div>
              </div>

              {/* Vitals Grid - Responsive */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Heart Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">{user?.hr || "--"}</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">bpm</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">BP</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">{user?.bp || "--"}</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">mmHg</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">SPO2</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">{user?.spo2 || "--"}</span>
                    <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-400">%</span>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-3 md:p-4 rounded-2xl border border-gray-100">
                  <p className="text-[0.6rem] md:text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Temp</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-gray-900">{user?.temp || "--"}</span>
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
                <div className="ml-auto">
                  {activeTab === 'Clinical Timeline' && (
                    <button className="text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline whitespace-nowrap">View All</button>
                  )}
                  {activeTab === 'Clinical Reports' && (
                    <div className="flex items-center gap-2">
                      {uploading && <span className="text-[0.7rem] text-[#0F766E] animate-pulse font-bold">Uploading...</span>}
                      <label className="flex items-center gap-2 text-[0.75rem] md:text-[0.8rem] font-bold text-[#0F766E] hover:underline cursor-pointer whitespace-nowrap">
                        <PlusCircle size={16} /> <span className="hidden xs:inline">Upload</span>
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" disabled={uploading} />
                      </label>
                    </div>
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
                            <td className="px-6 py-4 text-[0.85rem] font-medium text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[0.7rem] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-tighter">{report.type} • {report.size}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {report.fileUrl ? (
                                <a href={report.fileUrl} target="_blank" rel="noreferrer" className="text-[#0F766E] hover:text-[#0D635D] p-2 transition-colors inline-block">
                                  <Download size={18} />
                                </a>
                              ) : (
                                <span className="text-gray-400 text-[0.7rem] font-bold">DEMO</span>
                              )}
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
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Calendar className="text-gray-300" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Clinical Timeline Empty</h4>
                  <p className="text-gray-500 text-[0.9rem] max-w-[280px]">Your medical events and consultations will appear here once recorded.</p>
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
                AI-powered summary of the last 48 hours for {user?.name?.split(" ")[0] || "Patient"}.
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
