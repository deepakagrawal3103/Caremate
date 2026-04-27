# CareMate (MedSafe AI) - Detailed Feature Blueprint

This document provides a deep dive into every feature identified in the CareMate frontend, mapped to its implementation requirements.

## 1. Dashboard & Health Overview
*   **Dynamic Adherence Score**: A circular progress bar that calculates compliance based on logged vs. scheduled doses.
*   **Next Dose Tracker**: A real-time countdown timer to the next scheduled medication.
*   **Active Meds Feed**: Horizontal scroll of all currently active medications with status tags.
*   **Live Vitals Monitor**: Real-time visualization of Heart Rate (BPM) and Oxygen (SPO2) with trend indicators.
*   **Contextual Schedule**: Lists doses filtered by time of day (Morning, Midday, Evening, Night).

## 2. Medication Management System
*   **AI Smart Scan (OCR)**: Camera-based feature to scan medicine packaging/prescriptions to auto-fill data.
*   **Manual Entry Flow**: Multi-step form for medication name, dosage strength, form (tablet/liquid), and inventory count.
*   **Granular Scheduling**: Precise timing selection with food instructions (Before/After/With food).
*   **Inventory & Stock Alerts**: Automatic tracking of remaining doses with visual "Low Stock" warnings.
*   **Dose Logging**: Ability to mark doses as "Taken" or "Missed" with historical timestamps.

## 3. Clinical Patient Records
*   **Clinical Timeline**: A scrollable history of all medical events, prescriptions, and ER visits.
*   **Digital Reports Vault**: Secure access to downloadable PDF clinical summaries and DICOM (X-ray/MRI) reports.
*   **Chronic Condition Tracker**: Management of long-term conditions (e.g., Hypertension, Diabetes) with status monitoring.
*   **Lab Results Hub**: Specific view for blood work and diagnostic metrics.
*   **Health Record Assistant**: AI feature that generates a summary of the last 48 hours for clinical review.

## 4. AI Clinical Engine (MedSafe AI)
*   **Molecular Interaction Analysis**: Checks for dangerous contraindications between newly added and existing drugs.
*   **Conflict Visualization**: Visual "Mechanism of Action" breakdown explaining why two drugs conflict (e.g., Warfarin vs. Aspirin).
*   **AI Rationale**: Detailed medical explanation of risks provided by a clinical AI model.
*   **Clinical Evidence**: Links to real medical journals and FDA safety alerts for doctor reference.
*   **Personal Safety Score**: A 0-100 score reflecting the overall pharmacological safety of the patient's current regimen.

## 5. Emergency & SOS Ecosystem
*   **SOS Panic Button**: Immediate switch to a high-visibility, high-contrast emergency UI.
*   **Public Profile QR**: A QR code that, when scanned by a doctor/responder, opens a publicly accessible (but anonymized) version of the medical profile.
*   **Emergency Mode Marquee**: A scrolling banner at the bottom of the screen highlighting critical allergies and life-saving instructions.
*   **One-Touch Emergency Contacts**: Instant call buttons for primary contacts and operating doctors.
*   **Medical ID**: Display of Blood Group, Age, and Critical Conditions (e.g., Pacemaker) for first responders.

## 6. AI Health Assistant (Chatbot)
*   **MedQuery Chatbot**: An AI conversational interface for asking questions about medication side effects, dosage advice, or general health tips.
*   **Clinical Grounding**: The assistant uses the patient's records as context for personalized health advice.

## 7. Global Components
*   **Digital Atelier UI**: A premium, high-fidelity design system using tonal layering, Inter/Noto Serif typography, and fluid micro-animations.
*   **Mobile-First Navigation**: Persistent bottom navigation and a central hamburger menu for quick module switching.
