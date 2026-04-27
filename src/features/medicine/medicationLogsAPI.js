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

export const medicationLogsAPI = {
  // Log a dose event
  logDose: async (logData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const data = {
      ...logData,
      userId,
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "medication_logs"), data);
    return { data: { log: { id: docRef.id, ...data } } };
  },

  // Get logs for current user
  getLogs: async (max = 50) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "medication_logs"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(max)
    );
    
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { data: { logs } };
  }
};
