import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true // Required for client-side usage in Vite
});

const SYSTEM_PROMPT = `You are CareMate AI, a specialized clinical assistant for medication safety. 
Your primary goal is to help patients understand their medications, check for interactions, and provide emergency guidance.

CRITICAL RULES:
1. If a user describes life-threatening symptoms (chest pain, difficulty breathing), ALWAYS tell them to use the SOS button or call emergency services immediately.
2. Use the user's current medication list (which will be provided in context) to give specific advice.
3. Be empathetic but professional.
4. Never prescribe new medication; only explain existing ones.
5. If checking for interactions between two drugs, be precise about molecular conflicts (e.g., Warfarin and Aspirin increase bleeding risk).`;

export const aiService = {
  askAI: async (prompt, userContext = "") => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `User Context: ${userContext}\n\nUser Question: ${prompt}`,
          },
        ],
        model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B on Groq (Gemma replacement)
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stop: null,
        stream: false,
      });

      return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
      console.error("Groq AI Error Detail:", error);
      if (!import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY === "your_groq_api_key_here") {
        return "AI Key Error: Please add a valid VITE_GROQ_API_KEY to your .env file.";
      }
      return `AI Error: ${error.message || "Failed to connect to Groq."}`;
    }
  }
};
