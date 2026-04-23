import { PATTERNS } from "./constants";

/**
 * Validate email format
 * @param {string} email 
 * @returns {string | null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!PATTERNS.EMAIL.test(email)) return "Please enter a valid email address";
  return null;
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {string | null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

/**
 * Validate name (no numbers, special chars, min 2 chars)
 * @param {string} name 
 * @returns {string | null}
 */
export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!PATTERNS.NAME.test(name)) return "Name can only contain letters and spaces";
  return null;
};

/**
 * Validate age (number, between 0 and 120)
 * @param {number|string} age 
 * @returns {string | null}
 */
export const validateAge = (age) => {
  if (!age && age !== 0) return null; // optional field
  const num = Number(age);
  if (isNaN(num)) return "Age must be a number";
  if (num < 0 || num > 120) return "Age must be between 0 and 120";
  return null;
};

/**
 * Validate medicine name (non-empty, min 2 chars)
 * @param {string} name 
 * @returns {string | null}
 */
export const validateMedicineName = (name) => {
  if (!name || name.trim().length === 0) return "Medicine name is required";
  if (name.trim().length < 2) return "Medicine name must be at least 2 characters";
  return null;
};

/**
 * Validate dosage format (e.g., 500mg, 1 tablet)
 * @param {string} dosage 
 * @returns {string | null}
 */
export const validateDosage = (dosage) => {
  if (!dosage || dosage.trim().length === 0) return "Dosage is required";
  // Allow formats like: 500mg, 1 tablet, 2 capsules, 5ml
  const dosagePattern = /^[\d\s]+(mg|g|ml|tablet|tablets|capsule|capsules|drop|drops)?$/i;
  if (!dosagePattern.test(dosage.trim())) {
    return "Dosage format: e.g., 500mg, 1 tablet, 5ml";
  }
  return null;
};

/**
 * Validate time format (HH:MM 24hr)
 * @param {string} time 
 * @returns {boolean}
 */
export const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

/**
 * Validate that at least one time slot is selected
 * @param {Array} times 
 * @returns {string | null}
 */
export const validateTimeSlots = (times) => {
  if (!times || times.length === 0) return "At least one time slot is required";
  for (const t of times) {
    if (!isValidTime(t)) return `Invalid time format: ${t}`;
  }
  return null;
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone 
 * @returns {string | null}
 */
export const validatePhone = (phone) => {
  if (!phone) return null; // optional
  if (!PATTERNS.PHONE.test(phone)) return "Enter a valid 10-digit mobile number";
  return null;
};

/**
 * Generic required field validator
 * @param {any} value 
 * @param {string} fieldName 
 * @returns {string | null}
 */
export const required = (value, fieldName = "This field") => {
  if (value === undefined || value === null || value === "") {
    return `${fieldName} is required`;
  }
  if (typeof value === "string" && value.trim() === "") {
    return `${fieldName} is required`;
  }
  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate form data against a schema
 * @param {Object} data - Form data object
 * @param {Object} schema - Key-value pairs of validator functions
 * @returns {Object} Errors object with field names and messages
 */
export const validateForm = (data, schema) => {
  const errors = {};
  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(data[field]);
    if (error) errors[field] = error;
  }
  return errors;
};