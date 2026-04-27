import { 
  collection, 
  getDocs, 
  addDoc, 
  getDoc,
  doc,
  query, 
  where,
  updateDoc
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export const emergencyAPI = {
  // Trigger an SOS event
  triggerSOS: async (location = null) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    const sosData = {
      userId,
      timestamp: new Date().toISOString(),
      location,
      status: "active"
    };
    
    const docRef = await addDoc(collection(db, "sos_events"), sosData);
    
    // Also update user status to "Emergency"
    await updateDoc(doc(db, "users", userId), {
      inEmergency: true,
      lastSOS: sosData.timestamp
    });
    
    return { id: docRef.id, ...sosData };
  },
  
  // Resolve an SOS event
  resolveSOS: async (sosId) => {
    const userId = auth.currentUser?.uid;
    await updateDoc(doc(db, "sos_events", sosId), { status: "resolved", resolvedAt: new Date().toISOString() });
    await updateDoc(doc(db, "users", userId), { inEmergency: false });
  },

  // Get public medical profile (No Auth required on backend, but Firestore rules must allow read)
  getPublicProfile: async (userId) => {
    // This is used by the QR scan result page
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) throw new Error("Profile not found");
    
    const userData = userDoc.data();
    
    // Return only necessary emergency data
    return {
      name: userData.name,
      bloodGroup: userData.bloodGroup,
      allergies: userData.allergies || [],
      chronicConditions: userData.chronicConditions || [],
      emergencyContacts: userData.emergencyContacts || [],
      medications: userData.currentMedications || []
    };
  }
};
