import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { aiService, AI_MODELS } from "../../services/ai";

export const vitalsAPI = {
  // Analyze vitals for anomalies using Local AI
  analyzeVitals: async (vitalsReading) => {
    return await aiService.askAI(
      "Analyze this vitals reading for clinical anomalies.",
      JSON.stringify(vitalsReading),
      AI_MODELS.ANOMALY_ENGINE
    );
  },
  // Add new vitals reading
  addVitals: async (vitalsData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const data = {
      ...vitalsData,
      userId,
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "vitals"), data);
    return { id: docRef.id, ...data };
  },
  
  // Get latest vitals for dashboard
  getLatestVitals: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "vitals"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const vitals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    vitals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return vitals[0];
  },
  
  // Get vitals history for charts
  getVitalsHistory: async (type, days = 7) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "vitals"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const vitals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return vitals
      .filter(v => v.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, days * 24);
  },
};
