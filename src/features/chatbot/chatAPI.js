import { aiService } from "../../services/ai";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export const chatAPI = {
  // Send a question to the AI chatbot (Llama 3)
  askQuestion: async (question, userContext = "") => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    // 1. Get AI Response from Llama
    const response = await aiService.askAI(question, userContext);

    // 2. Save the interaction to Firestore
    const chatRef = collection(db, "chats");
    await addDoc(chatRef, {
      userId,
      question,
      answer: response,
      timestamp: new Date().toISOString()
    });

    return { data: { answer: response } };
  },
  
  // Get chat history for current user from Firestore
  getChatHistory: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { data: { history: [] } };

    try {
      // Removed orderBy for now because it requires a manual Composite Index in Firebase Console
      const q = query(
        collection(db, "chats"),
        where("userId", "==", userId),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort locally instead

      return { data: { history } };
    } catch (error) {
      console.error("Firestore History Error:", error);
      return { data: { history: [] } };
    }
  },
  
  // Clear chat history in Firestore
  clearChatHistory: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const q = query(collection(db, "chats"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, "chats", d.id)));
    await Promise.all(deletePromises);

    return { data: { success: true } };
  },
  
  // Get suggested questions based on user context
  getSuggestedQuestions: async () => {
    // This could be dynamic based on user profile
    return { data: { suggestions: [
      "Are there any interactions with my medications?",
      "What should I do if I miss a dose?",
      "How do I use the SOS feature?",
      "Can you explain my current prescriptions?"
    ] } };
  },
};