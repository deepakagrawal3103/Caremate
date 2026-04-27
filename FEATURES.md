# CareMate Frontend Feature & Backend Requirements List

This document outlines all current frontend features of the CareMate (MedSafe AI) platform and defines the necessary backend services and database schemas required to make the platform fully functional.

## 1. User Authentication & Profile
**Frontend Features:**
- Login / Registration (Onboarding flow).
- User Profile management (Age, Gender, Blood Group, Height, Weight).
- Secure session management (JWT).

**Backend/Database Requirements:**
- **Collection: `Users`**
  - Fields: `name`, `email`, `password` (hashed), `age`, `gender`, `bloodGroup`, `height`, `weight`, `bmi`, `emergencyContacts` (Array), `avatarUrl`.
- **API Endpoints:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `PUT /api/auth/profile`

## 2. Medication Management
**Frontend Features:**
- **Add Medicine**: AI Smart Scan (OCR) and Manual Entry.
- **Medicine List**: Active medications with status (Safe, Warning, Interaction).
- **Inventory Tracking**: Dosage remaining, refill alerts.
- **Scheduling**: Granular timing (Morning, Midday, Evening, Night) with specific food instructions.

**Backend/Database Requirements:**
- **Collection: `Medicines`**
  - Fields: `userId` (ref), `name`, `genericName`, `strength`, `form` (Tablet/Syringe), `dosageValue`, `schedule` (Array), `instructions` (e.g., "After Food"), `duration` (days), `totalInventory`, `remainingInventory`, `startDate`.
- **API Endpoints:**
  - `GET /api/medicines` (List all for user)
  - `POST /api/medicines` (Add new)
  - `PUT /api/medicines/:id` (Update)
  - `DELETE /api/medicines/:id` (Delete)
  - `POST /api/medicines/scan` (OCR processing endpoint)

## 3. Medication Adherence (Log & History)
**Frontend Features:**
- **Daily Log**: Mark doses as "Taken" or "Missed".
- **History View**: Calendar view or list of past adherence.
- **Adherence Score**: Percentage-based compliance visualization.

**Backend/Database Requirements:**
- **Collection: `AdherenceLogs`**
  - Fields: `userId` (ref), `medicineId` (ref), `scheduledTime`, `loggedTime`, `status` (Taken/Missed/Pending).
- **API Endpoints:**
  - `GET /api/adherence/stats` (Calculate percentage for dashboard)
  - `POST /api/adherence/log` (Record a dose)
  - `GET /api/adherence/history`

## 4. Clinical Safety & AI Analysis
**Frontend Features:**
- **Drug Interaction Analysis**: Real-time check between new and existing meds.
- **Risk Scoring**: Global safety score (0-100) based on clinical data.
- **Normalization**: Mapping brand names to generic molecules for accurate analysis.

**Backend/Database Requirements:**
- **Services:**
  - **Interaction Engine**: Integration with a medical database (e.g., DrugBank, OpenFDA) or a fine-tuned LLM.
  - **Normalization Engine**: Brand-to-Generic mapping service.
- **API Endpoints:**
  - `POST /api/medicines/normalize`
  - `POST /api/medicines/:id/check-interaction`
  - `GET /api/safety/risk-score`

## 5. Health Records & Vitals
**Frontend Features:**
- **Health Resume**: Clinical summary of medical history and conditions.
- **Vitals Tracking**: Real-time visualization of Heart Rate (BPM) and Oxygen (SPO2).
- **Trends**: Daily/Weekly charts of health metrics.

**Backend/Database Requirements:**
- **Collection: `HealthRecords`**
  - Fields: `userId` (ref), `conditions` (Array), `allergies` (Array), `surgeries` (Array).
- **Collection: `Vitals`**
  - Fields: `userId` (ref), `type` (HR/SPO2), `value`, `timestamp`.
- **API Endpoints:**
  - `GET /api/health-resume`
  - `POST /api/vitals`
  - `GET /api/vitals/trends`

## 6. Emergency & SOS System
**Frontend Features:**
- **SOS Button**: Quick access to emergency mode.
- **QR Profile**: Publicly accessible medical profile for first responders.
- **Emergency Mode**: High-visibility UI with critical data.

**Backend/Database Requirements:**
- **API Endpoints:**
  - `GET /api/public/profile/:qrToken` (Publicly accessible, no auth required)
  - `POST /api/emergency/trigger` (Alert emergency contacts via SMS/Email)

## 7. AI Health Assistant (Chatbot)
**Frontend Features:**
- Conversational interface for medication queries and health advice.

**Backend/Database Requirements:**
- **Service**: LLM Integration (OpenAI/Vertex AI) with medical knowledge grounding.
- **API Endpoints:**
  - `POST /api/chatbot/query`
