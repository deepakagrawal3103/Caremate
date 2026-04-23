import api from "../../services/api";

export const riskAPI = {
  // Get overall risk score for current user
  getRiskScore: () => api.get("/risk/score"),
  
  // Get risk breakdown by factors
  getRiskBreakdown: () => api.get("/risk/breakdown"),
  
  // Get risk history over time
  getRiskHistory: () => api.get("/risk/history"),
  
  // Recalculate risk after changes
  recalculateRisk: () => api.post("/risk/recalculate"),
};