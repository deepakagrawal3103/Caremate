import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { aiService } from "../../services/ai";

export const medicineAPI = {
  // Get all medicines for current user
  getAllMedicines: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(collection(db, "medicines"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const medicines = querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
    return { data: { medicines } };
  },
  
  // Get single medicine by ID
  getMedicine: async (id) => {
    const docRef = doc(db, "medicines", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Medicine not found");
    return { data: { medicine: { _id: docSnap.id, ...docSnap.data() } } };
  },
  
  // Add new medicine
  addMedicine: async (medicineData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const data = {
      ...medicineData,
      userId,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "medicines"), data);
    return { data: { medicine: { _id: docRef.id, ...data } } };
  },
  
  // Update existing medicine
  updateMedicine: async (id, medicineData) => {
    const docRef = doc(db, "medicines", id);
    await updateDoc(docRef, medicineData);
    return { data: { medicine: { _id: id, ...medicineData } } };
  },
  
  // Delete medicine
  deleteMedicine: async (id) => {
    const docRef = doc(db, "medicines", id);
    await deleteDoc(docRef);
    return { data: { success: true } };
  },
  
  // Normalize medicine name (brand → generic) using AI
  normalizeMedicine: async (name) => {
    const prompt = `Normalize this medicine name: "${name}". 
    Return a JSON object: { "brandName": string, "genericName": string, "class": string, "commonUses": string }`;
    
    const response = await aiService.askAI(prompt, "You are a pharmaceutical data specialist. Return ONLY JSON.");
    try {
      const jsonMatch = response.match(/\{.*\}/s);
      const data = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      return { data: { ...data, status: "normalized" } };
    } catch (e) {
      return { data: { name, genericName: name, status: "failed" } };
    }
  },
  
  // Check interaction for a medicine against current user's list
  checkInteraction: async (medicineId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    // 1. Get the medicine being checked
    const { data: { medicine } } = await medicineAPI.getMedicine(medicineId);
    
    // 2. Get all other medicines
    const { data: { medicines } } = await medicineAPI.getAllMedicines();
    const otherMeds = medicines.filter(m => m._id !== medicineId);
    
    if (otherMeds.length === 0) return { data: { status: "safe", interactions: [] } };

    // 3. AI Analysis
    const medList = otherMeds.map(m => m.name).join(", ");
    const prompt = `Check for drug-drug interactions between "${medicine.name}" and this list: [${medList}].
    Return JSON: { "status": "safe"|"warning"|"danger", "interactions": [ { "drug": string, "severity": string, "effect": string } ] }`;

    const response = await aiService.askAI(prompt, "You are a clinical pharmacist. Return ONLY JSON.");
    try {
      const jsonMatch = response.match(/\{.*\}/s);
      const interactionData = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      
      // Update the medicine doc with interaction status
      await updateDoc(doc(db, "medicines", medicineId), {
        interactionStatus: interactionData.status,
        interactions: interactionData.interactions
      });

      return { data: interactionData };
    } catch (e) {
      return { data: { status: "unknown", interactions: [] } };
    }
  },
};