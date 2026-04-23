import api from "../../services/api";

export const qrAPI = {
  // Generate emergency QR code and public link
  generateQR: () => api.post("/emergency/qr/generate"),
  
  // Get existing QR data (if already generated)
  getQRData: () => api.get("/emergency/qr/data"),
  
  // Regenerate QR (creates new link, invalidates old)
  regenerateQR: () => api.post("/emergency/qr/regenerate"),
  
  // Get public emergency profile by ID (no auth required)
  getPublicProfile: (publicId) => api.get(`/public/${publicId}`),
};