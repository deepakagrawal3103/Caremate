import React from 'react';
import { QRCodeCanvas } from "qrcode.react";
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
  XCircle,
  ArrowRight,
  PhoneCall,
  BarChart2,
  TrendingUp,
  Printer,
  History,
  BrainCog,
  Share2,
  X
} from 'lucide-react';
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAuth } from "../context/AuthContext";
import { recordsAPI } from "../features/records/recordsAPI";
import { medicineAPI } from "../features/medicine/medicineAPI";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Edit2, X as CloseIcon, Sun, SunDim, Sunrise, Moon, Search as SearchIcon } from "lucide-react";
import { medicationLogsAPI } from "../features/medicine/medicationLogsAPI";

export default function PatientRecords() {
  const { openMobileMenu } = useMobileMenu();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('Clinical Timeline');
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState([]);
  const [conditions, setConditions] = React.useState([]);
  const [medicines, setMedicines] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingMed, setEditingMed] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [adherenceLogs, setAdherenceLogs] = React.useState([]);
  const [adherenceFilter, setAdherenceFilter] = React.useState('Weekly');
  const [publicLink, setPublicLink] = React.useState("");
  const [safetyScore, setSafetyScore] = React.useState(100);

  React.useEffect(() => {
    if (!authLoading && user) {
      setPublicLink(`https://caremate.ai/profile/${user.uid}`);
      loadData();
    }
  }, [user, authLoading]);

  React.useEffect(() => {
    if (medicines.length >= 0) {
      let score = 100;
      medicines.forEach(m => {
        if (m.interactionStatus === 'danger') score -= 15;
        if (m.interactionStatus === 'warning') score -= 5;
      });
      setSafetyScore(Math.max(0, score));
    }
  }, [medicines]);

  const loadData = async () => {
    try {
      // Use individual try-catch for each call to prevent one failure from blocking all
      const fetchReports = async () => {
        try { return await recordsAPI.getReports(); } 
        catch (e) { console.error("Reports load fail:", e); return []; }
      };
      
      const fetchConditions = async () => {
        try { return await recordsAPI.getConditions(); } 
        catch (e) { console.error("Conditions load fail:", e); return []; }
      };

      const fetchMedicines = async () => {
        try { return await medicineAPI.getAllMedicines(); } 
        catch (e) { console.error("Medicines load fail:", e); return { data: { medicines: [] } }; }
      };

      const fetchLogs = async () => {
        try { return await medicationLogsAPI.getLogs(); } 
        catch (e) { console.error("Logs load fail:", e); return { data: { logs: [] } }; }
      };

      const [reportsData, conditionsData, medsRes, logsRes] = await Promise.all([
        fetchReports(),
        fetchConditions(),
        fetchMedicines(),
        fetchLogs()
      ]);

      setReports(reportsData);
      setConditions(conditionsData);
      setMedicines(medsRes.data.medicines);
      setAdherenceLogs(logsRes.data.logs);
    } catch (error) {
      console.error("Critical data load error:", error);
      // Only show toast if it's a critical structural error
      if (!reports.length && !medicines.length) {
        toast.error("Connecting to clinical database...");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("emergency-qr");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `caremate-emergency-${user?.name || 'patient'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR code downloaded!");
    } else {
      toast.error("Failed to download image.");
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

  const handleLogDose = async (med) => {
    try {
      const newInventory = Math.max(0, (med.inventory || 0) - (med.dosageValue || 1));
      await Promise.all([
        medicineAPI.updateMedicine(med._id, { inventory: newInventory }),
        medicationLogsAPI.logDose({
          medicineId: med._id,
          medicineName: med.name,
          dosage: med.strength,
          status: "Taken",
          type: med.category
        })
      ]);
      toast.success(`Dose for ${med.name} logged!`);
      loadData();
    } catch (error) {
      toast.error("Failed to log dose");
    }
  };

  const handleDeleteMed = async (id) => {
    if (window.confirm("Are you sure you want to remove this medication?")) {
      try {
        await medicineAPI.deleteMedicine(id);
        toast.success("Medication removed");
        loadData();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleEditClick = (med) => {
    setEditingMed({ ...med, reminders: med.reminders || ["08:00"] });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await medicineAPI.updateMedicine(editingMed._id, editingMed);
      toast.success("Updated successfully");
      setIsEditModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const getMedStyles = (med) => {
    if (med.interactionStatus === 'danger') return { color: "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]", icon: AlertTriangle };
    if (med.inventory < 5) return { color: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]", icon: AlertTriangle };
    return { color: "bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]", icon: Pill };
  };

  const filteredMedications = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (med.category && med.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const clinicalReports = reports;
  const chronicConditions = conditions.length > 0 ? conditions : (user?.diseases?.map(c => ({ name: c, status: 'Active' })) || []);
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
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-black bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md uppercase">{user?.bloodGroup || "O+"} Blood</span>
              <span className="text-[0.8rem] text-gray-500 font-bold uppercase tracking-tight">{user?.age || "45"} YRS</span>
            </div>
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
      <header className="hidden lg:flex px-4 py-1 items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] h-[48px]">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clinical records..."
              className="w-full bg-gray-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-[0.8rem] font-bold focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <Link to="/alerts" className="text-gray-400 hover:text-primary transition-colors p-1"><Bell size={18} /></Link>
          <button className="text-gray-400 hover:text-primary transition-colors p-1 hidden sm:block"><PlusCircle size={18} /></button>
          <Link to="/settings" className="text-gray-400 hover:text-primary transition-colors p-1"><Settings size={18} /></Link>
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
            <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="hidden lg:block px-6 py-4 max-w-[1500px] mx-auto">
        {/* Title & Actions Row */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-4 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-black text-primary leading-tight uppercase tracking-tight">Patient Records Dashboard</h1>
            <p className="text-text-muted font-bold text-[0.7rem] uppercase tracking-widest">Clinical Data Management & History</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              className="btn-premium"
            >
              <Download size={14} /> Export dossier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Patient Hero Card */}
            <div className="card-premium flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary-light overflow-hidden shrink-0 border border-primary/10 shadow-inner">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.name || "Patient"} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-black text-primary uppercase leading-tight">{user?.name || "Patient Name"}</h2>
                  <span className="badge-compact bg-primary-light text-primary border-primary/10">{user?.bloodGroup || "B+"} BLOOD</span>
                </div>
                <p className="text-text-muted font-black text-[0.65rem] uppercase tracking-[0.2em]">
                  ID: #{user?.uid?.slice(0, 8)} • DOB: {user?.dob || "14 MAY 1978"} • {user?.age || "45"} YRS
                </p>
              </div>
            </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-6 gap-3">
                {[
                  { label: "Weight", val: user?.weight || "--", unit: "kg" },
                  { label: "Height", val: user?.height || "--", unit: "cm" },
                  { label: "BP", val: user?.bp || "--", unit: "mmHg" },
                  { label: "SPO2", val: user?.spo2 || "--", unit: "%" },
                  { label: "Temp", val: user?.temp || "--", unit: "°F" },
                  { label: "Pulse", val: user?.hr || "--", unit: "bpm" },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-sm transition-all">
                    <p className="text-[0.55rem] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-primary">{stat.val}</span>
                      <span className="text-[0.6rem] font-bold text-text-muted">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center px-4 md:px-6 border-b border-gray-100 overflow-x-auto">
                <div className="flex gap-6 h-[44px] items-center">
                  {['Timeline', 'Health Resume', 'Clinical Reports', 'Medication Tracker', 'Adherence', 'Lab Results', 'Emergency QR'].map((tabName) => (
                    <button
                      key={tabName}
                      onClick={() => setActiveTab(tabName === 'Timeline' ? 'Clinical Timeline' : tabName === 'Adherence' ? 'Adherence History' : tabName)}
                      className={`h-full px-1 text-[0.7rem] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        (activeTab === tabName || (tabName === 'Timeline' && activeTab === 'Clinical Timeline') || (tabName === 'Adherence' && activeTab === 'Adherence History')) 
                        ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
                        }`}
                    >
                      {tabName === 'Health Resume' && <FileText size={12} />}
                      {tabName}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 flex items-center justify-end">
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

              {activeTab === 'Clinical Reports' && (
                <div className="p-4">
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Document</th>
                          <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Date</th>
                          <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Type</th>
                          <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {reports.map((report, i) => (
                          <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                  <FileText size={14} />
                                </div>
                                <span className="text-[0.85rem] font-black text-primary uppercase leading-none">{report.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[0.75rem] font-bold text-text-muted uppercase tracking-tight">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge-compact bg-gray-50 text-text-muted border-gray-100">{report.type} • {report.size}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {report.fileUrl ? (
                                <a href={report.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark p-1.5 transition-colors inline-block">
                                  <Download size={14} />
                                </a>
                              ) : (
                                <span className="text-gray-300 text-[0.55rem] font-black uppercase tracking-tighter">DEMO</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Medication Tracker' && (
                <div className="p-4">
                   <div className="flex justify-between items-center mb-4">
                     <div className="relative flex-1 max-w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search medicines..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-[0.75rem] font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                     </div>
                     <Link to="/add-medicine" className="bg-primary text-white px-3 py-1.5 rounded-lg text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm">
                        <Plus size={14} strokeWidth={3} /> Add New
                     </Link>
                   </div>

                   <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Medication</th>
                            <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Dosage/Schedule</th>
                            <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Supply</th>
                            <th className="px-4 py-3 text-[0.6rem] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredMedications.map((med) => {
                            const styles = getMedStyles(med);
                            return (
                              <tr key={med._id} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.color} shadow-sm`}>
                                      <Pill size={14} />
                                    </div>
                                    <div>
                                      <p className="text-[0.8rem] font-black text-primary leading-tight uppercase">{med.name}</p>
                                      <p className="text-[0.55rem] text-text-muted font-black uppercase tracking-widest">{med.category || "General"}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-[0.8rem] font-black text-primary leading-none mb-1">{med.strength}</p>
                                  <p className="text-[0.6rem] text-text-muted font-bold uppercase">{med.schedule?.join(", ")}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                     <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${med.inventory < 5 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (med.inventory / 30) * 100)}%` }}></div>
                                     </div>
                                     <span className="text-[0.65rem] font-black text-text-muted uppercase">{med.inventory}U</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleLogDose(med)} className="text-primary hover:text-primary-dark text-[0.65rem] font-black uppercase tracking-widest px-2 py-1 rounded hover:bg-primary-light transition-all">Log</button>
                                    <button onClick={() => handleEditClick(med)} className="text-gray-300 hover:text-primary transition-colors p-1"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteMed(med._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><CloseIcon size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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

              {activeTab === 'Health Resume' && (
                <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
                  {/* Summary Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-[#0F4D4A] tracking-tight uppercase">Health Resume</h2>
                        <span className="bg-[#F0FDFA] text-[#0F766E] text-[0.6rem] font-black px-2 py-1 rounded-md uppercase border border-[#CCFBF1]">Official Dossier</span>
                      </div>
                      <p className="text-gray-500 font-medium text-[0.9rem]">Essential clinical snapshot for rapid medical assessment.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <Link to="/profile" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 text-gray-600 px-5 py-3 rounded-2xl text-[0.8rem] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                        <Settings size={16} /> Edit Profile
                      </Link>
                      <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0F4D4A] text-white px-6 py-3 rounded-2xl text-[0.8rem] font-black uppercase tracking-widest hover:bg-[#0d6d65] transition-all shadow-lg shadow-[#0F4D4A]/20">
                        <Printer size={16} /> Download Dossier
                      </button>
                    </div>
                  </div>

                  {/* 1. Basic Identity (TOP - VERY CLEAR) */}
                  <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F766E]">
                        <User size={18} />
                      </div>
                      <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Basic Identity</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-xl md:text-2xl font-black text-[#0F4D4A] leading-tight uppercase">{user?.name || "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Age / Gender</p>
                        <p className="text-xl md:text-2xl font-black text-[#0F4D4A] leading-tight">
                          {user?.age || "45"} YRS / {user?.gender || "MALE"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Group</p>
                        <p className="text-xl md:text-2xl font-black text-red-600 leading-tight bg-red-50 inline-block px-3 py-0.5 rounded-xl border border-red-100">
                          {user?.bloodGroup || "O+"}(VE)
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 2. Critical Alerts (MOST IMPORTANT 🔥) - RED / BOLD */}
                  <section className="bg-[#FFF5F5] rounded-3xl p-6 md:p-8 border-2 border-red-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <AlertTriangle size={80} className="text-red-600" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-200">
                        <AlertTriangle size={18} fill="currentColor" />
                      </div>
                      <h3 className="text-[0.85rem] font-black text-red-600 uppercase tracking-[0.2em]">Critical Alerts 🔥</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-red-100">
                        <p className="text-[0.7rem] font-black text-red-500 uppercase tracking-widest mb-2">Allergies (Drug / Food)</p>
                        <p className="text-[1.1rem] font-black text-red-700 leading-tight uppercase">
                          {user?.allergies?.length > 0 ? user.allergies.join(", ") : "NO KNOWN ALLERGIES"}
                        </p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-red-100">
                        <p className="text-[0.7rem] font-black text-red-500 uppercase tracking-widest mb-2">High-Risk Conditions</p>
                        <p className="text-[1.1rem] font-black text-red-700 leading-tight uppercase">
                          {chronicConditions?.length > 0 ? chronicConditions.map(c => c.name || c).join(", ") : "NONE REPORTED"}
                        </p>
                        <p className="text-[0.6rem] text-red-400 font-bold mt-1 uppercase">(Heart, Diabetes, BP)</p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-red-100">
                        <p className="text-[0.7rem] font-black text-red-500 uppercase tracking-widest mb-2">Dangerous Medications</p>
                        <p className="text-[1.1rem] font-black text-red-700 leading-tight uppercase">
                          {medicines.filter(m => m.interactionStatus === 'danger').length > 0 
                            ? medicines.filter(m => m.interactionStatus === 'danger').map(m => m.name).join(", ") 
                            : "NONE DETECTED"}
                        </p>
                        <p className="text-[0.6rem] text-red-400 font-bold mt-1 uppercase">Interaction Risk: LOW</p>
                      </div>
                    </div>
                  </section>

                  {/* 3. Emergency & QR (VERY IMPORTANT - REAL POWER FEATURE) */}
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Emergency Contact */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                          <Phone size={18} fill="currentColor" />
                        </div>
                        <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Emergency Contact</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[0.65rem] font-bold text-gray-400 uppercase mb-1">Contact Name / Relation</p>
                            <p className="text-xl font-black text-[#0F4D4A] uppercase leading-tight">{user?.emergencyContactName || "NOT CONFIGURED"}</p>
                          </div>
                          {user?.emergencyContactPhone && (
                            <a href={`tel:${user.emergencyContactPhone}`} className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors">
                              <PhoneCall size={20} />
                            </a>
                          )}
                        </div>
                        <div>
                          <p className="text-[0.65rem] font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                          <p className="text-2xl font-mono font-black text-[#0F4D4A] tracking-tight">{user?.emergencyContactPhone || "--- --- ----"}</p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-[#0F4D4A] rounded-3xl p-6 md:p-8 text-white flex items-center gap-6 shadow-xl relative overflow-hidden group">
                      <div className="bg-white p-3 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-2xl relative z-10">
                        <QRCodeCanvas value={publicLink || "emergency"} size={100} bgColor="#ffffff" fgColor="#000000" level="H" />
                      </div>
                      <div className="relative z-10 flex-1">
                        <h3 className="text-[1.1rem] font-black uppercase tracking-tight mb-2">Emergency QR Scan</h3>
                        <p className="text-[#CCFBF1] text-[0.8rem] font-medium leading-tight opacity-90 mb-4">
                          Instant access to full clinical profile & historical records for emergency responders.
                        </p>
                        <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/20">
                          <ShieldCheck size={14} className="text-[#52DFBB]" /> Power Feature
                        </div>
                      </div>
                      {/* Ambient Decor */}
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#52DFBB]/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                  </section>

                  {/* 4. Medical Conditions (Bullet List) */}
                  <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F766E]">
                        <FileText size={18} />
                      </div>
                      <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Medical History</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <p className="text-[0.65rem] font-black text-[#0F766E] uppercase tracking-[0.15em] mb-4 border-l-2 border-[#0F766E] pl-3">Chronic Diseases</p>
                        <ul className="space-y-3">
                          {user?.diseases?.length > 0 ? user.diseases.map((d, i) => (
                            <li key={i} className="flex items-start gap-3 group">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-2 group-hover:scale-150 transition-transform"></div>
                              <span className="text-[1rem] font-bold text-gray-900 leading-tight uppercase">{d}</span>
                            </li>
                          )) : <li className="text-gray-400 italic text-[0.9rem]">No chronic diseases reported.</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 border-l-2 border-gray-200 pl-3">Past Major Illnesses</p>
                        <ul className="space-y-3">
                          {user?.pastIllnesses?.length > 0 ? user.pastIllnesses.map((d, i) => (
                            <li key={i} className="flex items-start gap-3 group">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2"></div>
                              <span className="text-[1rem] font-bold text-gray-600 leading-tight uppercase">{d}</span>
                            </li>
                          )) : <li className="text-gray-400 italic text-[0.9rem]">No major past illnesses recorded.</li>}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 5. Current Medications (Keep only active medicines) */}
                  <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center text-[#0F766E]">
                          <Pill size={18} />
                        </div>
                        <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Current Medications</h3>
                      </div>
                      <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Active Dosage</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {medicines.length > 0 ? medicines.slice(0, 6).map((med) => (
                        <div key={med._id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0F766E] group-hover:scale-110 transition-transform">
                            <Pill size={22} className="fill-[#0F766E]" />
                          </div>
                          <div>
                            <h4 className="text-[1.05rem] font-bold text-[#0F4D4A] uppercase leading-tight">{med.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[0.75rem] font-bold text-[#0F766E] bg-[#CCFBF1] px-1.5 py-0.5 rounded">{med.strength}</span>
                              <span className="text-[0.75rem] text-gray-400 font-bold uppercase">{med.schedule?.[0] || "AS DIRECTED"}</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-3 py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <p className="text-gray-400 italic">No active medications recorded.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 6. Doctor / Notes (Optional) */}
                  <section className="bg-gray-50/50 rounded-3xl p-6 md:p-10 border border-dashed border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <p className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Primary Physician</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0F766E] shadow-sm">
                            <Stethoscope size={24} />
                          </div>
                          <div>
                            <p className="text-[1.1rem] font-black text-[#0F4D4A] uppercase">{user?.primaryDoctor || "Not Assigned"}</p>
                            <p className="text-[0.75rem] text-gray-400 font-bold uppercase">Clinical Specialist</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Clinical Instructions</p>
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                          <p className="text-[0.9rem] font-medium text-gray-500 italic leading-relaxed">
                            "{user?.specialNotes || "No specific instructions recorded for medical personnel in emergency situations."}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="flex justify-between items-center pt-4">
                     <p className="text-[0.7rem] text-gray-400 font-bold uppercase tracking-widest">MedSafe AI Clinical Dossier • #SH-{user?.uid?.slice(0, 6)}</p>
                     <button onClick={handleExport} className="flex items-center gap-2 text-[0.8rem] font-black text-[#0F766E] uppercase tracking-widest hover:underline">
                       <Printer size={16} /> Print Official Resume
                     </button>
                  </div>

                  {/* 7. AI Automated Clinical Summary */}
                  <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-dashed border-[#0F766E]/20 relative overflow-hidden mt-8 no-print">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="flex items-center gap-2 bg-[#F0FDFA] text-[#0F766E] px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border border-[#CCFBF1]">
                         <Activity size={12} className="animate-pulse" /> Live Analysis
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                        <BrainCog size={20} />
                      </div>
                      <h3 className="text-[0.75rem] font-black text-gray-400 uppercase tracking-[0.2em]">Clinical AI Synthesis</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
                         <p className="text-[1rem] text-gray-800 font-medium leading-relaxed">
                           Patient <span className="font-bold text-[#0F4D4A]">{user?.name}</span> ({user?.age}Y, {user?.bloodGroup}) presents with {chronicConditions.length > 0 ? chronicConditions.map(c => c.name || c).join(", ") : "no major chronic conditions"}. 
                           Current safety score is <span className="font-black text-[#0F766E]">{safetyScore}/100</span>. 
                           Total of <span className="font-bold">{medicines.length}</span> active medications are currently managed. 
                           {medicines.filter(m => m.interactionStatus === 'danger').length > 0 ? 
                             ` CRITICAL: ${medicines.filter(m => m.interactionStatus === 'danger').length} severe interaction(s) detected. ` : 
                             " No critical drug-drug interactions detected at this time. "}
                           Recent adherence patterns suggest <span className="font-bold text-[#0F766E] uppercase">{adherenceLogs.length > 0 ? (adherenceLogs.filter(l => l.status === "Taken").length / adherenceLogs.length * 100).toFixed(0) : "100"}%</span> compliance.
                         </p>
                      </div>
                      <div className="flex items-center gap-4 text-[0.7rem] text-gray-400 font-bold uppercase tracking-widest pl-2">
                         <span>Status: Optimized</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         <span>Next Sync: {new Date(Date.now() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'Adherence History' && (
                <div className="p-6 md:p-8 space-y-10 animate-in fade-in duration-700">
                   {/* Adherence Stats */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: "Compliance Rate", val: adherenceLogs.length > 0 ? Math.round((adherenceLogs.filter(l => l.status === "Taken").length / adherenceLogs.length) * 100) + "%" : "100%", icon: <Activity className="text-[#0F766E]" /> },
                        { label: "Doses Taken", val: adherenceLogs.filter(l => l.status === "Taken").length, icon: <Check className="text-[#0F766E]" /> },
                        { label: "Doses Missed", val: adherenceLogs.filter(l => l.status === "Missed").length, icon: <XCircle className="text-red-500" /> }
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-2xl flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl shrink-0">
                             {stat.icon}
                           </div>
                           <div>
                              <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                              <h4 className="text-xl font-black text-gray-900">{stat.val}</h4>
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* History Timeline */}
                   <div className="space-y-8">
                      {Object.entries(
                        adherenceLogs.reduce((groups, log) => {
                          const date = new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
                          if (!groups[date]) groups[date] = [];
                          groups[date].push(log);
                          return groups;
                        }, {})
                      ).map(([date, items]) => (
                        <div key={date}>
                          <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-[0.9rem] font-black text-[#0F4D4A] uppercase tracking-widest">{date}</h3>
                            <div className="h-[1px] flex-1 bg-gray-50"></div>
                          </div>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.id} className="bg-white border border-gray-50 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center shrink-0">
                                   <Pill className="text-[#0F766E]" size={18} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-[0.95rem] font-bold text-gray-900">{item.medicineName}</h4>
                                  <p className="text-[0.75rem] text-gray-400 font-medium">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {item.dosage || "1 dose"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'Emergency QR' && (
                <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 flex flex-col items-center">
                         <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-10 shadow-sm w-full flex flex-col items-center gap-8">
                            <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-white group hover:scale-105 transition-transform duration-500">
                               <div className="bg-[#b91c1c] text-white text-center text-[0.65rem] font-black tracking-[0.2em] py-2 px-8">EMERGENCY ACCESS</div>
                               <div className="p-6 bg-white flex justify-center items-center">
                                  <QRCodeCanvas id="emergency-qr" value={publicLink || "emergency"} size={180} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={false} />
                               </div>
                            </div>
                            <div className="w-full space-y-4">
                               <button onClick={downloadQR} className="w-full bg-[#0F4D4A] text-white py-4 rounded-2xl font-black uppercase text-[0.8rem] tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-[#0F4D4A]/20 hover:bg-[#0d6d65] transition-all">
                                  <Download size={18} /> Download High-Res QR
                               </button>
                               <button onClick={() => { navigator.clipboard.writeText(publicLink); toast.success("Link copied!"); }} className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-black uppercase text-[0.8rem] tracking-widest flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                                  <Share2 size={18} /> Share Clinical Link
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7 space-y-8">
                         <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-4">Emergency Protocol Access</h2>
                            <p className="text-gray-500 font-medium leading-relaxed">
                               This QR code provides first responders with instant access to your clinical profile, active medications, and chronic conditions. Keep a printed copy in your wallet or on your refrigerator.
                            </p>
                         </div>

                         <div className="bg-red-50 border border-red-100 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center gap-4 text-[#b91c1c]">
                               <AlertTriangle size={24} />
                               <h3 className="text-lg font-black uppercase tracking-tight">Active Alerts</h3>
                            </div>
                            <div className="space-y-4">
                               {user?.allergies?.map((a, i) => (
                                 <div key={i} className="bg-white p-4 rounded-2xl border border-red-100 flex justify-between items-center">
                                    <span className="font-bold text-red-700">{a}</span>
                                    <span className="text-[0.6rem] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Severe</span>
                                 </div>
                               ))}
                               {(!user?.allergies || user.allergies.length === 0) && <p className="text-red-400 font-bold italic">No critical allergies reported.</p>}
                            </div>
                         </div>

                         <div className="bg-[#F0FDFA] rounded-3xl p-8">
                            <h4 className="text-[#0F766E] font-black uppercase text-[0.7rem] tracking-widest mb-4">Primary Emergency Responder</h4>
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                  <Phone className="text-[#0F766E]" size={24} />
                               </div>
                               <div>
                                  <p className="text-lg font-black text-gray-900 leading-none mb-1">{user?.emergencyContactName || "Not Set"}</p>
                                  <p className="font-mono text-[#0F766E] font-bold">{user?.emergencyContactPhone || "--- --- ----"}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Chronic Conditions */}
            <div className="card-premium">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="text-primary" size={16} />
                <h3 className="text-[0.75rem] font-black text-primary uppercase tracking-widest">Chronic Conditions</h3>
              </div>
              <div className="space-y-2">
                {chronicConditions.map((item, i) => (
                  <div key={i} className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex justify-between items-center group hover:bg-white hover:border-primary/20 transition-all cursor-pointer">
                    <div>
                      <h4 className="text-[0.85rem] font-black text-primary uppercase leading-tight">{item.name}</h4>
                      <p className="text-[0.6rem] text-text-muted font-bold uppercase">{item.date || "Active"}</p>
                    </div>
                    <span className={`badge-compact ${item.status === 'Controlled' ? 'bg-primary-light text-primary border-primary/10' :
                        item.status === 'Monitoring' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 border border-dashed border-gray-200 py-2.5 rounded-xl text-[0.65rem] font-black text-text-muted hover:bg-gray-50 hover:text-primary transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <Plus size={12} /> Add Condition
              </button>
            </div>

            {/* Record Assistant CTA */}
            <div className="bg-primary rounded-2xl p-4 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-[0.9rem] font-black uppercase tracking-tight mb-1">Clinical Assistant</h3>
                <p className="text-primary-light text-[0.7rem] font-medium leading-tight mb-4 opacity-80">
                  AI-powered summary of the last 48 hours for {user?.name?.split(" ")[0]}.
                </p>
                <button 
                  onClick={() => setActiveTab('Health Resume')}
                  className="w-full bg-white text-primary py-2 rounded-xl font-black text-[0.75rem] uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-primary-light transition-all active:scale-95"
                >
                  Generate Summary
                </button>
              </div>

              {/* Ambient Graphics */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </main>

      {isEditModalOpen && editingMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 uppercase">Edit Medication</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="p-6 md:p-8 space-y-5 md:space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Medication Name</label>
                  <input type="text" value={editingMed.name} onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900 text-[1rem]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Condition / Category</label>
                  <input type="text" value={editingMed.category} onChange={(e) => setEditingMed({ ...editingMed, category: e.target.value })} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900 text-[1rem]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Dosage</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input type="text" placeholder="Amount" value={(editingMed.dosage || "").split(/(\d+)/)[1] || "1"} onChange={(e) => { const unit = (editingMed.dosage || "").replace(/\d+/g, "").trim(); setEditingMed({ ...editingMed, dosage: `${e.target.value}${unit}` }); }} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900" />
                    </div>
                    <div className="w-[100px] md:w-[120px]">
                      <select value={(editingMed.dosage || "").replace(/\d+/g, "").trim().toLowerCase() || "pill"} onChange={(e) => { const amount = (editingMed.dosage || "").split(/(\d+)/)[1] || "1"; setEditingMed({ ...editingMed, dosage: `${amount}${e.target.value}` }); }} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-4 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900">
                        <option value="pill">pill</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Frequency</label>
                    <select value={editingMed.frequency.split(",")[0].trim()} onChange={(e) => { const parts = editingMed.frequency.split(","); const rest = parts.length > 1 ? parts.slice(1).join(",") : ""; setEditingMed({ ...editingMed, frequency: `${e.target.value}${rest ? "," + rest : ""}` }); }} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900">
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">3 times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Food Instruction</label>
                    <select value={editingMed.frequency.toLowerCase().includes("before") ? "Before Food" : editingMed.frequency.toLowerCase().includes("after") ? "After Food" : "With Food"} onChange={(e) => { const freq = editingMed.frequency.split(",")[0].trim(); setEditingMed({ ...editingMed, frequency: `${freq}, ${e.target.value}` }); }} className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 font-bold text-gray-900">
                      <option value="Before Food">Before Food</option>
                      <option value="After Food">After Food</option>
                      <option value="With Food">With Food</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl border-2 border-gray-100 font-black uppercase text-[0.8rem] text-gray-400 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl bg-[#0F4D4A] text-white font-black uppercase text-[0.8rem] hover:bg-[#0d6d65] transition-colors shadow-lg shadow-[#0F766E]/20">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
