# CardioVision 3D: Multimodal AI Cardiac Risk Prediction & Anatomical Twin
## Hackathon Pitch Deck Content (Slide-by-Slide)
**Track:** Multimodal AI Hackathon 2026 • Track A: Cardiovascular Risk Visualization & Prediction

---

### Slide 1: Title & Hook
- **Title:** CardioVision 3D
- **Subtitle:** Multimodal AI Cardiovascular Risk Prediction & Interactive 3D Anatomical Twin
- **Tagline:** Turning abstract clinical lab reports into life-saving 3D spatial intelligence.
- **Key Highlights:**
  - Multimodal fusion: Vitals, Lipid biomarkers, ECG waveforms, and Symptom history.
  - Interactive 3D WebGL anatomical heart with real-time heartbeat synchronization.
  - Spatial localization: Direct vessel stenosis mapping (LAD, RCA, LCx).

---

### Slide 2: The Critical Problem
- **The Global Crisis:** Cardiovascular Disease (CVD) is the world's #1 killer — taking 18+ million lives every single year.
- **The Data Comprehension Barrier:**
  - Diagnostic outputs are siloed in dense, cryptic tabular reports (e.g. ST-depression 2.8mm, Chol/HDL ratio 7.8).
  - Over 75% of high-risk patients fail to grasp the severity of abstract numbers, leading to poor lifestyle adherence and missed early intervention.
  - Emergency room clinicians lose critical triage minutes synthesizing disparate lab sheets before catheterization lab activation.

---

### Slide 3: Our Solution: CardioVision 3D
- **Visual Digital Twin:** Transforms abstract clinical indicators into a patient-specific 3D beating anatomical heart.
- **Real-Time Synchronized Dynamics:**
  - Heart contraction rate physically syncs to patient resting BPM.
  - Occluded arteries glow in warning colors: Green (Healthy <30%), Amber (Moderate 30-70%), and Pulsing Crimson (Severe >70%).
- **Doctor-Patient Bridge:** Patients immediately understand their disease when they see their own arterial blockage; clinicians gain immediate spatial localization of ischemic danger.

---

### Slide 4: Multimodal Architecture & Pipeline
1. **Multimodal Clinical Ingestion:**
   - Physiological: Age, Sex, Resting Blood Pressure, Heart Rate.
   - Biochemical: Total Cholesterol, HDL, Fasting Blood Sugar.
   - Electrophysiological: Resting ECG, ST-depression, Exercise-induced angina.
2. **Predictive Risk Engine:**
   - 10-Year ASCVD Framingham Score calculation.
   - Composite CAD probability modeling.
   - Vessel-specific stenosis estimation (LAD, RCA, LCx).
3. **WebGL 3D Anatomical Mapping:**
   - Three.js procedural cardiac muscle and coronary vascular geometry.
   - Dual-phase systolic/diastolic animation physics.
   - Raycasting interaction for anatomical inspection.
4. **Clinical Action Plan:**
   - Automated plain-language diagnostic explanation.
   - Prioritized clinical triage directives & PDF export.

---

### Slide 5: Core 3D Features
- **Dual-Phase Cardiac Pulsing:** Anatomically realistic systolic squeeze and diastolic relaxation synced to patient pulse.
- **Coronary Artery Raycasting:** Clickable LAD ("Widowmaker"), RCA, and LCx branches with live stenosis readouts and camera focus.
- **Wireframe & Dissection Views:** Switch between anatomical organic shading and translucent wireframe geometry.

---

### Slide 6: Clinical Case Study (Simulation)
- **Patient ID:** PT-84092 (58M, Active Smoker, BP 155/95 mmHg, Tachycardia 98 BPM)
- **Diagnostic Findings:**
  - Total Cholesterol: 284 mg/dL | HDL: 36 mg/dL (Ratio: 7.88)
  - ECG: 2.8mm ST-segment depression + typical retrosternal angina.
- **CardioVision 3D Output:**
  - CAD Risk: **86% (Critical)**
  - LAD Stenosis: **88% (Widowmaker alert)**
  - Action Directives: Urgent catheterization lab referral, immediate DAPT + Atorvastatin therapy, telemetry monitoring.

---

### Slide 7: Tech Stack, Feasibility & Roadmap
- **Tech Stack:** HTML5, CSS3 Glassmorphism, JavaScript (ES6+), Three.js (WebGL), Chart.js.
- **Zero-Dependency Deployment:** Instant browser execution via standard HTTP server.
- **Future Roadmap:**
  - Integration with Epic / Cerner EHR via HL7 FHIR APIs.
  - Automated 3D coronary mesh generation directly from DICOM CCTA scans.
  - WebXR spatial computing for holographic surgical planning in AR/VR headsets.
