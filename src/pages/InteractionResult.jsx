import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function InteractionResult() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state or fallback to default
  const [result] = useState(location.state?.result || {
    status: "safe", 
    title: "No Interactions Detected",
    description: "Scan complete. No harmful interactions found.",
    drugs: ["Selected Med", "Current List"],
    mechanism: "The scanned medication does not appear to have any major documented interactions with your current medication profile.",
    action: "You may proceed as prescribed. Always consult with a doctor for specific medical advice."
  });

  const getStatusColors = (status) => {
    switch(status) {
      case "danger": return "bg-red-50 text-red-500";
      case "warning": return "bg-[#fff3e0] text-[#d97706]";
      case "safe": return "bg-[#e6eff6] text-gray-900";
      default: return "bg-white border border-border text-[#506071]";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "danger": return "⚠️";
      case "warning": return "⚡";
      case "safe": return "✅";
      default: return "ℹ️";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 md:p-12 font-sans text-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-14 h-14 rounded-xl bg-white border border-border text-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-xl leading-none">←</span>
          </button>
          <div>
            <h1 className="text-3xl font-sans text-gray-900 font-bold tracking-tight">Interaction Scan</h1>
            <p className="text-base font-medium text-secondary mt-1">Pharmacological safety analysis</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10  space-y-8">
          
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 ${getStatusColors(result.status)}`}>
              {getStatusIcon(result.status)}
            </div>
            <h2 className={`text-2xl font-sans font-bold tracking-tight ${result.status === 'danger' ? 'text-red-500' : result.status === 'warning' ? 'text-[#d97706]' : 'text-gray-900'}`}>
              {result.title}
            </h2>
            <p className="text-[16px] font-medium text-[#506071] mt-3">
              {result.description}
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl space-y-4">
            <p className="text-base font-bold tracking-widest uppercase text-gray-400">Drugs Analyzed</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm font-bold text-gray-900 text-center ">
                {result.drugs[0]}
              </div>
              <span className="text-xl font-bold text-gray-400">+</span>
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm font-bold text-gray-900 text-center ">
                {result.drugs[1]}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-[#eaeaeb]">
            <div>
              <p className="text-base font-bold tracking-widest uppercase text-gray-400 mb-2">Mechanism of Action</p>
              <p className="text-[14px] leading-relaxed text-[#506071] font-medium">{result.mechanism}</p>
            </div>
            <div>
              <p className="text-base font-bold tracking-widest uppercase text-gray-400 mb-2">Recommended Action</p>
              <div className={`p-5 rounded-2xl text-[14px] font-bold leading-relaxed ${getStatusColors(result.status)}`}>
                {result.action}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={() => navigate("/")} fullWidth className="h-[56px]">
              Acknowledge & Return
            </Button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
