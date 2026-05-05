import Groq from "groq-sdk";
import { localAiService, LOCAL_MODELS } from "./localAi";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
});

export const AI_MODELS = {
  // Cloud LLM Models
  CHAT: "CHAT",
  INTERACTION: "INTERACTION",
  CLINICAL: "CLINICAL",
  TRIAGE: "TRIAGE",
  RECORDS: "RECORDS",
  
  // Local Edge Models
  ...LOCAL_MODELS
};

const SYSTEM_PROMPTS = {
  [AI_MODELS.CHAT]: `You are CareMate AI, a specialized clinical assistant for medication safety. 
Your primary goal is to help patients understand their medications and provide health guidance.
1. If user describes life-threatening symptoms, ALWAYS tell them to use the SOS button or call emergency services.
2. Use the provided medication list context for specific advice.
3. Be empathetic but professional. Never prescribe new medication.`,

  [AI_MODELS.INTERACTION]: `You are a Clinical Pharmacist specializing in drug-drug and drug-disease interactions.
Analyze the provided medications and patient conditions. Identify molecular conflicts, metabolic pathway competitions (e.g., CYP450), and contraindications.
Return ONLY a structured JSON response with status (safe/warning/danger) and detailed effects.`,

  [AI_MODELS.CLINICAL]: `You are a Pharmaceutical Data Specialist. 
Your task is to normalize medicine names to their generic equivalents, identify their pharmacological class, and list common clinical uses.
Return ONLY JSON data.`,

  [AI_MODELS.TRIAGE]: `You are an Emergency Medical Triage Assistant.
Assess the severity of symptoms provided. If symptoms are critical (Chest Pain, Stroke signs, Severe Bleeding), prioritize immediate SOS/911 instructions.
For non-critical issues, provide first-aid guidance and clinical next steps.`,

  [AI_MODELS.RECORDS]: `You are a Clinical Health Record Analyst.
Review patient medical history, chronic conditions, and lab results. 
Identify health trends, risks, and provide summaries that help doctors and patients understand their health trajectory.`
};

export const aiService = {
  /**
   * Unified AI Interface
   * Routes to Groq (Cloud) or Local Models based on modelKey
   */
  askAI: async (prompt, userContext = "", modelKey = AI_MODELS.CHAT) => {
    // Route to Local Edge Models if applicable
    if (Object.values(LOCAL_MODELS).includes(modelKey)) {
      return await localAiService.predict(modelKey, { prompt, context: userContext });
    }

    // Otherwise, route to Cloud LLM (Groq)
    try {
      const systemPrompt = SYSTEM_PROMPTS[modelKey] || SYSTEM_PROMPTS[AI_MODELS.CHAT];
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User Context: ${userContext}\n\nUser Question/Task: ${prompt}` },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: modelKey === AI_MODELS.CLINICAL ? 0.1 : 0.5,
        max_tokens: 1024,
        top_p: 1,
      });

      return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
      console.error(`Groq AI Error [${modelKey}]:`, error);
      if (!import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY === "your_groq_api_key_here") {
        return "AI Key Error: Please add a valid VITE_GROQ_API_KEY to your .env file.";
      }
      return `AI Error: ${error.message || "Failed to connect to AI service."}`;
    }
  }
};
