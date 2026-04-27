# CareMate (MedSafe AI) 🏥

CareMate is a high-fidelity, AI-powered medication management and clinical safety platform designed with a premium **"Digital Atelier"** aesthetic. It provides patients and clinicians with a unified interface to track medications, analyze drug-drug interactions, and manage emergency profiles.

![CareMate Dashboard](https://img.freepik.com/premium-photo/futuristic-medical-technology-concept-3d-render_1150-51234.jpg)

## ✨ Features

### 📱 Unified Mobile Experience
- **Global Navigation**: Centralized hamburger menu and persistent bottom navigation for quick access to all modules.
- **Responsive Design**: Editorial-grade layouts optimized for both desktop clinical views and mobile patient views.
- **Smart Headers**: Context-aware headers with universal SOS access and intuitive back navigation.

### 💊 Advanced Medication Tracking
- **AI Smart Scan**: Simulated OCR scanning of prescriptions and medicine packaging for 3x faster data entry.
- **Intelligent Scheduling**: Granular control over dosage, frequency (Morning, Midday, Night), and treatment duration.
- **Adherence Visualization**: Circular progress metrics and historical trends to monitor medication compliance.

### 🛡️ Clinical Safety & Emergency
- **Interaction Analysis**: AI-driven conflict analysis (e.g., Warfarin vs. Aspirin) with real-time risk scoring.
- **Emergency SOS Mode**: Immediate access to patient QR profiles, emergency contacts, and critical first-aid protocols.
- **Health Resume**: A comprehensive clinical dossier summarizing medical history, active conditions, and biological vitals.

## 🛠️ Technology Stack

- **Frontend**: React.js with Vite for lightning-fast development and optimized production builds.
- **Styling**: Tailwind CSS for high-density layouts and custom Vanilla CSS for the "Digital Atelier" editorial aesthetic.
- **Icons**: Lucide React for consistent, high-fidelity iconography.
- **State Management**: React Context API for global UI states (Mobile Menu, User Session).
- **Navigation**: React Router DOM for seamless transitions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deepakagrawal3103/Caremate.git
   cd Caremate/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy: Digital Atelier
CareMate follows the **Digital Atelier** design system:
- **Tonal Layering**: Uses subtle ambient shadows and whitespace to create a sense of professional trust.
- **Typography**: Employs bold, high-contrast headings for clear informational hierarchy.
- **Vibrant Accents**: Utilizes a specific "CareMate Teal" (#0F4D4A) to signify clinical excellence and reliability.

---
Developed with ❤️ by the MedSafe AI Team.
