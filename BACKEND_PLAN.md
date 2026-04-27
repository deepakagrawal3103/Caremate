# CareMate Backend Implementation Plan

This document outlines the phased approach to transforming the CareMate backend from a prototype state to a secure, production-ready health platform.

## Phase 1: Data Sanitization & Real-Time Sync
*Goal: Ensure the UI only displays real, user-owned data and handles empty states gracefully.*

- [x] **Data Cleanup**: Clear all existing "garbage" values from Firestore collections.
- [x] **Dynamic Dashboard Mapping**: Every stat is now derived from Firestore.
- [x] **Inventory Logic**: `handleLogDose` correctly decrements medication inventory.
- [x] **Add Vitals**: New UI for recording HR and SpO2 implemented.

## Phase 2: Security & Privacy Hardening
*Goal: Implement owner-level access control to protect sensitive medical information.*

- [x] **Firestore Security Rules**: `firestore.rules` file created and ready for deployment.
- [ ] **Auth State Persistence**: (Internal) Firebase handles this automatically.

## Phase 3: Advanced Queries & Analytics
*Goal: Power the "Safety Trends" and "History" views with real historical data.*

- [ ] **Firestore Indexes**: Create the following composite indexes in the Firebase Console:
    - `vitals`: `userId` (Ascending), `timestamp` (Descending)
    - `medication_logs`: `userId` (Ascending), `timestamp` (Descending)
    - `chats`: `userId` (Ascending), `timestamp` (Descending)
- [ ] **Safety Score Algorithm**: Refined AI logic for interaction checks.
- [x] **Vitals Aggregation**: Dynamic chart mapping in Dashboard implemented.

## Phase 4: Notification & Reminder Engine
*Goal: Proactively alert users about upcoming doses and clinical risks.*

- [ ] **Dose Reminders**: Implementation of a background checker using `App.jsx`.
- [ ] **SOS Trigger**: Fully dynamic Emergency Mode mapped to user contacts.
- [ ] **AI Daily Audit**: Optional clinical trend auditing.

---
> [!IMPORTANT]
> **Current Status**: All syntax errors resolved. Ready to begin **Phase 1**.
