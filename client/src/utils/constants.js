// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  MEDICINES: {
    BASE: "/medicines",
    NORMALIZE: "/medicines/normalize",
    CHECK_INTERACTION: "/medicines/check-interaction",
  },
  RISK: {
    SCORE: "/risk/score",
    BREAKDOWN: "/risk/breakdown",
    HISTORY: "/risk/history",
    RECALCULATE: "/risk/recalculate",
  },
  HEALTH: {
    RESUME: "/health/resume",
    PDF: "/health/resume/pdf",
  },
  EMERGENCY: {
    GENERATE_QR: "/emergency/qr/generate",
    QR_DATA: "/emergency/qr/data",
    REGENERATE_QR: "/emergency/qr/regenerate",
  },
  CHAT: {
    ASK: "/chat",
    HISTORY: "/chat/history",
    SUGGESTIONS: "/chat/suggestions",
  },
  OCR: {
    SCAN: "/ocr/scan",
  },
  PUBLIC: {
    PROFILE: (id) => `/public/${id}`,
  },
};

// Risk levels and thresholds
export const RISK = {
  LOW: { min: 0, max: 30, label: "Low Risk", color: "green", severity: "safe" },
  MEDIUM: { min: 31, max: 69, label: "Medium Risk", color: "yellow", severity: "warning" },
  HIGH: { min: 70, max: 100, label: "High Risk", color: "red", severity: "danger" },
};

// Medicine frequency options
export const FREQUENCIES = [
  { value: "1/day", label: "Once a day" },
  { value: "2/day", label: "Twice a day" },
  { value: "3/day", label: "Three times a day" },
  { value: "4/day", label: "Four times a day" },
  { value: "as-needed", label: "As needed" },
];

// Time slots for reminders (24hr format)
export const DEFAULT_TIME_SLOTS = ["09:00", "21:00"];

// Common diseases list (for onboarding)
export const COMMON_DISEASES = [
  "Diabetes",
  "Hypertension (High BP)",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "Depression",
  "None",
];

// Common allergies list
export const COMMON_ALLERGIES = [
  "Penicillin",
  "Sulfa Drugs",
  "Aspirin",
  "Ibuprofen",
  "Naproxen",
  "Latex",
  "Pollen",
  "Dust",
  "Peanuts",
  "Shellfish",
  "None",
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

// App configuration
export const APP_CONFIG = {
  NAME: "Sanjeevani",
  VERSION: "1.0.0",
  SUPPORTED_LANGUAGES: ["en", "hi"],
  DEFAULT_LANGUAGE: "en",
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
  MAX_MEDICINES_PER_USER: 50,
  MAX_OCR_FILE_SIZE_MB: 5,
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
  PASSWORD: /^.{6,}$/,
  PHONE: /^[6-9]\d{9}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
};

// Interaction severity levels
export const INTERACTION_SEVERITY = {
  DANGER: { label: "Dangerous", color: "red", icon: "🔴", action: "Do not take together" },
  WARNING: { label: "Caution", color: "yellow", icon: "⚠️", action: "Consult doctor" },
  SAFE: { label: "Safe", color: "green", icon: "✅", action: "No known interaction" },
  UNKNOWN: { label: "Unknown", color: "gray", icon: "❓", action: "No data available" },
};

// Default user profile structure
export const DEFAULT_USER_PROFILE = {
  age: null,
  gender: "",
  diseases: [],
  allergies: [],
  emergencyContact: null,
};