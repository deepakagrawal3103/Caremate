import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Input from "../components/Input";
import { ChevronRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const COMMON_DISEASES = [
  // Cardiovascular
  "Hypertension (High Blood Pressure)",
  "High Cholesterol (Hyperlipidemia)",
  "Heart Disease (CAD)",
  "Congestive Heart Failure (CHF)",
  "Atrial Fibrillation (Afib)",
  "Post-Stroke Recovery",
  
  // Metabolic & Endocrine
  "Type 2 Diabetes (High Sugar)",
  "Type 1 Diabetes",
  "Hypothyroidism",
  "Hyperthyroidism",
  "PCOS",
  "Vitamin D Deficiency",
  "Iron Deficiency (Anemia)",
  
  // Respiratory
  "Asthma",
  "COPD (Chronic Lung Disease)",
  "Sleep Apnea",
  "Seasonal Allergies",
  "Sinusitis",
  
  // Digestive
  "GERD (Acid Reflux)",
  "Gastritis",
  "Irritable Bowel Syndrome (IBS)",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Fatty Liver Disease",
  
  // Neurological & Mental Health
  "Migraine",
  "Epilepsy (Seizures)",
  "Alzheimer's / Dementia",
  "Parkinson's Disease",
  "Multiple Sclerosis (MS)",
  "Depression",
  "Anxiety Disorder",
  "Insomnia",
  "Bipolar Disorder",
  "PTSD",
  
  // Musculoskeletal & Others
  "Arthritis (Osteo/Rheumatoid)",
  "Osteoporosis",
  "Chronic Kidney Disease (CKD)",
  "Psoriasis",
  "Eczema",
  "Cancer (Active/Remission)",
  "HIV / AIDS"
];

const COMMON_ALLERGIES = [
  "Penicillin",
  "Peanuts",
  "Pollen",
  "Dust Mites",
  "Latex",
  "Shellfish",
  "Milk / Dairy",
  "Egg",
  "Soy",
  "Wheat"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    bloodGroup: "",
    height: "",
    weight: "",
    diseases: [],
    allergies: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [currentDisease, setCurrentDisease] = useState("");
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);
  const [allergySuggestions, setAllergySuggestions] = useState([]);

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
      if (!formData.name || !formData.dob || !formData.age) {
        toast.error("Please fill in all identity fields");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.height || !formData.weight || !formData.bloodGroup) {
        toast.error("Please fill in all physical metrics");
        return false;
      }
      if (formData.height < 20 || formData.weight < 2) {
        toast.error("Please enter realistic physical measurements");
        return false;
      }
    }
    if (step === 3 && formData.diseases.length === 0) {
      if (!window.confirm("Continue without adding any chronic conditions?")) return false;
    }
    if (step === 4 && formData.allergies.length === 0) {
      if (!window.confirm("Continue without adding any allergies? Critical for safety checks.")) return false;
    }
    if (step === 5) {
      if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
        toast.error("Emergency contact details are required for safety");
        return false;
      }
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
            <h2 className="text-base font-bold tracking-widest uppercase text-secondary">Personal Identification</h2>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
            <div className="grid grid-cols-2 gap-4">
               <Input
                 label="Date of Birth"
                 value={formData.dob}
                 onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                 placeholder="DD/MM/YYYY"
               />
               <Input
                 label="Age"
                 type="number"
                 value={formData.age}
                 onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                 placeholder="65"
               />
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
            <h2 className="text-base font-bold tracking-widest uppercase text-secondary">Clinical Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
               <Input
                 label="Height (cm)"
                 type="number"
                 value={formData.height}
                 onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                 placeholder="170"
               />
               <Input
                 label="Weight (kg)"
                 type="number"
                 value={formData.weight}
                 onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                 placeholder="70"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[0.9rem] font-bold text-gray-700">Blood Group</label>
               <select 
                 className="w-full h-[56px] px-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary text-[1rem] font-medium"
                 value={formData.bloodGroup}
                 onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
               >
                 <option value="">Select Group</option>
                 {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't Know"].map(bg => (
                   <option key={bg} value={bg}>{bg}</option>
                 ))}
               </select>
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

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold tracking-widest uppercase text-secondary">Chronic Conditions</h2>
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={currentDisease}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentDisease(val);
                      if (val.trim()) {
                        setDiseaseSuggestions(COMMON_DISEASES.filter(d => d.toLowerCase().includes(val.toLowerCase())));
                      } else {
                        setDiseaseSuggestions([]);
                      }
                    }}
                    placeholder="e.g. Hypertension"
                    className="mb-0"
                  />
                </div>
                <Button onClick={handleAddDisease} variant="secondary" className="px-6 h-[56px]">
                  Add
                </Button>
              </div>

              {diseaseSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  {diseaseSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, diseases: [...formData.diseases, suggestion] });
                        setCurrentDisease("");
                        setDiseaseSuggestions([]);
                      }}
                      className="w-full text-left px-5 py-3 text-[0.85rem] font-bold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors border-b border-gray-50 last:border-none"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
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
              <Button onClick={() => setStep(2)} variant="secondary" className="px-6 h-[56px]">Back</Button>
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
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={currentAllergy}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentAllergy(val);
                      if (val.trim()) {
                        setAllergySuggestions(COMMON_ALLERGIES.filter(a => a.toLowerCase().includes(val.toLowerCase())));
                      } else {
                        setAllergySuggestions([]);
                      }
                    }}
                    placeholder="e.g. Penicillin"
                    className="mb-0"
                  />
                </div>
                <Button onClick={handleAddAllergy} variant="secondary" className="px-6 h-[56px]">
                  Add
                </Button>
              </div>

              {allergySuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  {allergySuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, allergies: [...formData.allergies, suggestion] });
                        setCurrentAllergy("");
                        setAllergySuggestions([]);
                      }}
                      className="w-full text-left px-5 py-3 text-[0.85rem] font-bold text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border-b border-gray-50 last:border-none"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
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
              <Button onClick={() => setStep(3)} variant="secondary" className="px-6 h-[56px]">Back</Button>
              <Button onClick={handleNext} fullWidth className="h-[56px] flex justify-between px-6">
                <span>Continue</span>
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold tracking-widest uppercase text-[#0F766E]">Emergency Contact</h2>
            <Input
              label="Contact Name"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              placeholder="e.g. John Doe (Son)"
            />
            <Input
              label="Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              placeholder="+1 234 567 890"
            />
            
            <div className="flex gap-4 pt-4">
              <Button onClick={() => setStep(4)} variant="secondary" className="px-6 h-[56px]">Back</Button>
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
