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

export const vitalsAPI = {
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
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  },
  
  // Get vitals history for charts
  getVitalsHistory: async (type, days = 7) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "vitals"), 
      where("userId", "==", userId),
      where("type", "==", type),
      orderBy("timestamp", "desc"),
      limit(days * 24) // Rough estimate for hourly readings
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
