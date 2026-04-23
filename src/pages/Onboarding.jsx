import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Input from "../components/Input";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
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

  const handleComplete = () => {
    // In real app, save to backend here
    navigate("/");
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
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g. 65"
            />
            <div className="pt-4">
              <Button onClick={() => setStep(2)} fullWidth className="h-[56px] flex justify-between px-6">
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
              <Button onClick={() => setStep(3)} fullWidth className="h-[56px] flex justify-between px-6">
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
