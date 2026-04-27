import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import AddMedicine from "./pages/AddMedicine";
import HealthResume from "./pages/HealthResume";
import QRPage from "./pages/QRPage";
import Chatbot from "./pages/Chatbot";
import Onboarding from "./pages/Onboarding";
import RiskScore from "./pages/RiskScore";
import MedicineManagement from "./pages/MedicineManagement";
import Reminders from "./pages/Reminders";
import InteractionResult from "./pages/InteractionResult";
import PublicProfile from "./pages/PublicProfile";
import EmergencyMode from "./pages/EmergencyMode";
import PatientRecords from "./pages/PatientRecords";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import MedicationHistory from "./pages/MedicationHistory";
import Features from "./pages/Features";
import Safety from "./pages/Safety";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";


function App() {
  return (
    <AuthProvider>
      <MobileMenuProvider>
        <div className="min-h-screen bg-background text-primary font-sans">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public/profile/:id" element={<PublicProfile />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/emergency-mode" element={<EmergencyMode />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-medicine" element={<PrivateRoute><AddMedicine /></PrivateRoute>} />
          <Route path="/health-resume" element={<PrivateRoute><HealthResume /></PrivateRoute>} />
          <Route path="/qr" element={<PrivateRoute hideSidebar={true}><QRPage /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
          <Route path="/risk-analysis" element={<PrivateRoute><RiskScore /></PrivateRoute>} />
          <Route path="/medications" element={<PrivateRoute><MedicineManagement /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><Reminders /></PrivateRoute>} />
          <Route path="/interaction-result" element={<PrivateRoute><InteractionResult /></PrivateRoute>} />
          <Route path="/patient-records" element={<PrivateRoute><PatientRecords /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/medication-history" element={<PrivateRoute><MedicationHistory /></PrivateRoute>} />

          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </MobileMenuProvider>
    </AuthProvider>
  );
}

export default App;