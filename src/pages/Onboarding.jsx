import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Input from "../components/Input";
import { ChevronRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    bloodGroup: "",
    height: "",
    weight: "",
    diseases: [],
    allergies: [],
  });
  const [currentDisease, setCurrentDisease] = useState("");
  const [currentAllergy, setCurrentAllergy] = useState("");

  const handleAddDisease = () => {
    if (currentDisease.trim()) {
      setFormData({ ...formData, diseases: [...formData.diseases, currentDisease.trim()] });
      setCurrentDisease("");
    }
  };

  const handleAddAllergy = () => {
    if (currentAllergy.trim()) {
      setFormData({ ...formData, allergies: [...formData.allergies, currentAllergy.trim()] });
      setCurrentAllergy("");
    }
  };

  const { updateUser } = useAuth();

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.height || !formData.weight || !formData.bloodGroup) {
        toast.error("Please fill in all basic identity fields");
        return false;
      }
      if (formData.age < 1 || formData.height < 20 || formData.weight < 2) {
        toast.error("Please enter realistic physical measurements");
        return false;
      }
    }
    if (step === 2 && formData.diseases.length === 0) {
      if (!window.confirm("Continue without adding any chronic conditions?")) return false;
    }
    if (step === 3 && formData.allergies.length === 0) {
      if (!window.confirm("Continue without adding any allergies? Critical for safety checks.")) return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep()) return;
    try {
      await updateUser(formData);
      navigate("/");
    } catch (error) {
      console.error("Failed to complete setup:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans text-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg  p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl font-sans text-gray-900 font-bold tracking-tight">Profile Setup</h1>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold tracking-widest uppercase text-secondary">Basic Identity</h2>
            <div className="grid grid-cols-2 gap-4">
               <Input
                 label="Age"
                 type="number"
                 value={formData.age}
                 onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                 placeholder="e.g. 65"
               />
               <Input
                 label="Height (cm)"
                 type="number"
                 value={formData.height}
                 onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                 placeholder="170"
               />
            </div>
            <Input
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="70"
            />
            <div className="space-y-2">
               <label className="text-[0.9rem] font-bold text-gray-700">Blood Group</label>
               <select 
                 className="w-full h-[56px] px-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary text-[1rem] font-medium"
                 value={formData.bloodGroup}
                 onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
               >
                 <option value="">Select Group</option>
                 {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                   <option key={bg} value={bg}>{bg}</option>
                 ))}
               </select>
            </div>
            <div className="pt-4">
              <Button onClick={handleNext} fullWidth className="h-[56px] flex justify-between px-6">
                <span>Continue</span>
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold tracking-widest uppercase text-secondary">Chronic Conditions</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={currentDisease}
                  onChange={(e) => setCurrentDisease(e.target.value)}
                  placeholder="e.g. Hypertension"
                  className="mb-0"
                />
              </div>
              <Button onClick={handleAddDisease} variant="secondary" className="px-6 h-[56px]">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.diseases.map((d, i) => (
                <div key={i} className="bg-surface-low text-primary px-4 py-2 rounded-xl text-base font-bold flex items-center gap-2">
                  {d}
                  <button onClick={() => setFormData({ ...formData, diseases: formData.diseases.filter((_, idx) => idx !== i) })} className="text-secondary hover:text-red-700">✕</button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={() => setStep(1)} variant="secondary" className="px-6 h-[56px]">Back</Button>
              <Button onClick={handleNext} fullWidth className="h-[56px] flex justify-between px-6">
                <span>Continue</span>
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold tracking-widest uppercase text-red-700">Allergies (Critical)</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={currentAllergy}
                  onChange={(e) => setCurrentAllergy(e.target.value)}
                  placeholder="e.g. Penicillin"
                  className="mb-0"
                />
              </div>
              <Button onClick={handleAddAllergy} variant="secondary" className="px-6 h-[56px]">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((a, i) => (
                <div key={i} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-base font-bold flex items-center gap-2">
                  {a}
                  <button onClick={() => setFormData({ ...formData, allergies: formData.allergies.filter((_, idx) => idx !== i) })} className="hover:text-red-700">✕</button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={() => setStep(2)} variant="secondary" className="px-6 h-[56px]">Back</Button>
              <Button onClick={handleComplete} fullWidth className="h-[56px] flex justify-center px-6 bg-primary">
                <span>Complete Setup</span>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
