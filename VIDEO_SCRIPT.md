# CardioVision 3D - 3 to 5 Minute Demo Video Script
> **Official Hackathon Rule:** Video must be between **3 to 10 minutes on YouTube** (Unlisted is fine).  
> **Track:** Track A - Cardiovascular Risk Visualization & Prediction  
> **Speaker Role:** Lead Developer & Presenter  

---

## ⏱️ Video Timeline (Target: ~3 Minutes 30 Seconds)

### [0:00 - 0:45] 1. The Global Challenge & Problem Space
* **Screen Action:** Show the 3D heart pulsing on screen. Rotate it slowly in full-screen mode.
* **Narration:**
  > *"Hello judges, welcome to our demonstration of **CardioVision 3D** for Track A of the Multimodal AI Hackathon 2026.  
  > Cardiovascular disease is the leading cause of death globally, taking over 18 million lives every single year.  
  > In clinical practice today, when a patient undergoes evaluation, their data is locked in disparate tabular reports: blood pressures, lipid panels, ECG strips, and echocardiography notes.  
  > For patients, these abstract numbers—like ST-depression 2.8mm or a cholesterol ratio of 7.8—mean nothing. Over 75% of high-risk patients fail to follow critical therapies simply because they don't grasp the danger.  
  > For emergency clinicians, synthesizing these numbers under acute triage pressure costs life-saving minutes before catheterization. We built CardioVision 3D to solve this."*

---

### [0:45 - 1:30] 2. Multimodal Data Ingestion & Clinical Presets
* **Screen Action:** Move mouse to the left sidebar. Walk through the inputs (Demographics, Blood Pressure, Heart Rate, Lipid profile, ECG abnormalities).
* **Narration:**
  > *"CardioVision 3D is a true multimodal platform. It bridges three distinct modalities based on the benchmark Z-Alizadeh Sani clinical dataset:  
  > First, physiological vital signs: Age, Sex, Resting Blood Pressure, and Heart Rate.  
  > Second, biochemical metabolic markers: Total Cholesterol, HDL, and Fasting Blood Sugar.  
  > Third, electrophysiological data: Resting ECG waveforms, ST-segment depression, and exercise-induced angina.  
  > Let's test our clinical presets. When we load a 'Low Risk Healthy' individual, our model predicts optimal status—under 12% CAD likelihood—and all coronary vessels remain green and patent.  
  > Now, watch what happens when we switch to our 'High Risk Acute CAD Patient'..."*

---

### [1:30 - 2:30] 3. The 3D Anatomical Digital Twin & Vessel-Level Localization
* **Screen Action:** Click **"High Risk (CAD Acute)"**. The gauge turns red (86%). Adjust the **Heart Rate slider** up and down to show the 3D heart physically beating faster. Click **"Focus LAD"**, then hover over LAD, RCA, and LCx.
* **Narration:**
  > *"Instantly, our predictive engine calculates an 86% CAD risk and a 34% 10-year ASCVD risk.  
  > But here is our core innovation: CardioVision 3D translates this prediction into **spatial anatomical grounding**.  
  > In real time, the 3D digital twin synchronizes its dual-phase systolic contractions to the patient's resting heart rate—pulsing at 98 BPM.  
  > Rather than giving a generic black-box score, our model predicts stenosis individually for the three major coronary branches:  
  > First, the Left Anterior Descending (LAD) artery—clinically known as the 'Widowmaker'—which supplies over 50% of the left ventricle. Our model flags an 88% critical occlusion, causing the LAD vessel to glow in pulsing crimson.  
  > Second, the Right Coronary Artery (RCA), showing 45% moderate calcification in yellow.  
  > Third, the Left Circumflex (LCx), at 35%.  
  > Clinicians can interactively rotate, zoom, switch to wireframe mode, and click directly on any vessel to inspect localized perfusion metrics."*

---

### [2:30 - 3:00] 4. Explainable AI (SHAP) & Actionable Clinical Triage
* **Screen Action:** Scroll to the bottom diagnostic bar. Point to the SHAP feature attribution bars and clinical directives. Click **"Clinical Report"** at the top.
* **Narration:**
  > *"To ensure clinical interpretability, our dashboard features a SHAP feature attribution breakdown. It shows that the patient's severe 2.8mm ST-depression and 7.88 Total/HDL ratio contributed over 50% of the predictive weight.  
  > It immediately generates prioritized triage directives: urgent catheterization lab activation, high-intensity statin plus dual-antiplatelet therapy, and beta-blocker rate control.  
  > Clinicians can export this as an official printable clinical report with one click.  
  > And prominently displayed is our clinical safety disclaimer, ensuring compliance with medical decision-support guidelines."*

---

### [3:00 - 3:30] 5. Architecture, Tech Stack & Conclusion
* **Screen Action:** Open the **Presentation (PPT)** tab (`presentation.html`), show Slide 4 (Architecture) and Slide 7 (Roadmap), then return to the 3D heart.
* **Narration:**
  > *"Under the hood, CardioVision 3D is powered by a high-performance Three.js WebGL graphics pipeline, integrated with an ensemble classifier trained on the Z-Alizadeh Sani benchmark achieving an ROC-AUC of 0.92.  
  > The entire solution runs client-side with zero latency and zero hardware barrier.  
  > Our future roadmap includes integrating automated 3D vessel reconstruction directly from DICOM coronary CT scans and WebXR for surgical planning.  
  > CardioVision 3D transforms silent cardiovascular data into life-saving visual intelligence. Thank you!"*
