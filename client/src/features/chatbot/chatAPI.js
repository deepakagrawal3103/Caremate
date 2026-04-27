import api from "../../services/api";

export const chatAPI = {
  // Send a question to the AI chatbot
  askQuestion: (question) => api.post("/chat", { question }),
  
  // Get chat history for current user
  getChatHistory: () => api.get("/chat/history"),
  
  // Clear chat history
  clearChatHistory: () => api.delete("/chat/history"),
  
  // Get suggested questions based on user's medicines
  getSuggestedQuestions: () => api.get("/chat/suggestions"),
};