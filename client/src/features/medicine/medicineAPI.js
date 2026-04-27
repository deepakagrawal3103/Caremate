import api from "../../services/api";

export const medicineAPI = {
  // Get all medicines for current user
  getAllMedicines: () => api.get("/medicines"),
  
  // Get single medicine by ID
  getMedicine: (id) => api.get(`/medicines/${id}`),
  
  // Add new medicine
  addMedicine: (medicineData) => api.post("/medicines", medicineData),
  
  // Update existing medicine
  updateMedicine: (id, medicineData) => api.put(`/medicines/${id}`, medicineData),
  
  // Delete medicine
  deleteMedicine: (id) => api.delete(`/medicines/${id}`),
  
  // Normalize medicine name (brand → generic)
  normalizeMedicine: (name) => api.post("/medicines/normalize", { name }),
  
  // Check interaction for new medicine
  checkInteraction: (medicineId) => api.post(`/medicines/${medicineId}/check-interaction`),
};