/**
 * Local AI Service
 * This service interfaces with the specialized ML models (.pkl and .keras)
 * typically served via a Python backend (FastAPI/Flask).
 */

const LOCAL_API_URL = import.meta.env.VITE_LOCAL_AI_API_URL || "http://localhost:8000/api/v1/models";

export const LOCAL_MODELS = {
  FALL_DETECTOR: "fall_detector",
  ANOMALY_ENGINE: "anomaly_engine",
  CRISIS_FORECASTER: "crisis_forecaster",
  ALERT_RANKER: "alert_ranker",
  BEHAVIOR_PREDICTOR: "behavior_predictor"
};

export const localAiService = {
  /**
   * Run a prediction against a specific local model
   * @param {string} modelKey - One of LOCAL_MODELS
   * @param {Object} data - The input data for the model
   */
  predict: async (modelKey, data) => {
    try {
      const response = await fetch(`${LOCAL_API_URL}/${modelKey}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Local AI API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Local AI Prediction Error [${modelKey}]:`, error);
      // Return a structured error so the UI can handle it gracefully
      return { 
        status: "error", 
        message: "Failed to connect to local AI model server.",
        model: modelKey 
      };
    }
  },

  /**
   * Health check for the local AI server
   */
  checkHealth: async () => {
    try {
      const response = await fetch(`${LOCAL_API_URL}/health`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
};
