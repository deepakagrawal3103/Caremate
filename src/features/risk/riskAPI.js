import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc,
  doc, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export const riskAPI = {
  // Get overall risk score for current user
  getRiskScore: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { data: { score: 0 } };
    return { data: { score: docSnap.data().safetyScore || 0 } };
  },
  
  // Get risk breakdown by factors
  getRiskBreakdown: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    // In a real app, this might come from an AI service or a dedicated collection
    const docRef = doc(db, "riskBreakdowns", userId);
    const docSnap = await getDoc(docRef);
    return { data: docSnap.exists() ? docSnap.data() : { factors: [] } };
  },
  
  // Get risk history over time
  getRiskHistory: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "riskHistory"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data: { history } };
  },
  
  // Recalculate risk after changes
  recalculateRisk: async () => {
    // This would typically trigger a Cloud Function or an AI service
    // For now, we'll return a mock successful trigger
    return { data: { status: "calculation_triggered" } };
  },
};