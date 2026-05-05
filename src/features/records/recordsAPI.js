import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../services/firebase";

export const recordsAPI = {
  // --- Clinical Reports ---
  
  getReports: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "reports"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in memory to avoid needing a composite index
    return reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  uploadReport: async (file, name, type) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    // 1. Upload file to Firebase Storage
    const storageRef = ref(storage, `reports/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Save metadata to Firestore
    const reportData = {
      userId,
      name,
      fileName: file.name,
      fileUrl: downloadURL,
      type, // PDF, DICOM, Image, etc.
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      status: "READY",
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "reports"), reportData);
    return { id: docRef.id, ...reportData };
  },

  // --- Chronic Conditions ---

  getConditions: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const q = query(
      collection(db, "conditions"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  addCondition: async (conditionData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const data = {
      ...conditionData,
      userId,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "conditions"), data);
    return { id: docRef.id, ...data };
  }
};
