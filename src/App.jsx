import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import AddMedicine from "./pages/AddMedicine";
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
import Settings from "./pages/Settings";
import MedicationHistory from "./pages/MedicationHistory";
import AddVitals from "./pages/AddVitals";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


import DoseReminder from "./components/DoseReminder";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <MobileMenuProvider>
        <DoseReminder />
        <Toaster />
        <div className="min-h-screen bg-background text-primary font-sans">
        <Routes>
          <Route path="/public/profile/:id" element={<PublicProfile />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/emergency-mode" element={<EmergencyMode />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-medicine" element={<PrivateRoute><AddMedicine /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><Reminders /></PrivateRoute>} />
          <Route path="/interaction-result" element={<PrivateRoute><InteractionResult /></PrivateRoute>} />
          <Route path="/patient-records" element={<PrivateRoute><PatientRecords /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
           <Route path="/add-vitals" element={<PrivateRoute><AddVitals /></PrivateRoute>} />
           <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
           <Route path="/medication-history" element={<PrivateRoute><MedicationHistory /></PrivateRoute>} />

          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </MobileMenuProvider>
    </AuthProvider>
  );
}

export default App;