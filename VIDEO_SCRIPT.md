# CardioVision 3D - 2-Minute Hackathon Video Pitch & Recording Guide

> **Track:** Track A - Cardiovascular Risk Visualization & Prediction  
> **Target Duration:** 1 minute 50 seconds to 2 minutes  
> **Key Objective:** Deliver a high-energy, visually captivating demo showing problem, solution, live 3D interaction, multimodal risk mapping, and clinical impact.

---

## Pre-Recording Checklist (Takes 1 Minute)
1. Launch the app locally: Run `python server.py` in your terminal and open `http://localhost:8000` in Google Chrome or Edge.
2. Press **F11** for full-screen mode to remove browser address bars.
3. Keep the 3D heart centered and start with the default view.
4. Have your screen recorder ready (OBS Studio, Loom, Windows Game Bar: `Win + G`, or QuickTime).

---

## Second-by-Second Video Script

| Time | Screen Action (What to show on screen) | Spoken Narration (What to say) |
| :--- | :--- | :--- |
| **0:00 - 0:20** | **Start on the beating 3D Heart.** Slowly click and drag with your mouse to rotate the 3D heart around, showcasing the anatomical chambers and glowing vessels. | *"Cardiovascular disease kills over 18 million people every single year—making it the leading cause of death on the planet. Yet, the way clinicians and patients communicate cardiac risk has barely evolved. Patients are handed dense, confusing laboratory printouts filled with numbers they don't understand, while emergency doctors spend crucial minutes deciphering disparate ECGs and blood panels."* |
| **0:20 - 0:40** | **Move mouse to the top logo and then to the left panel.** Highlight the multimodal inputs (BP, Cholesterol, ECG ST-Depression). | *"Welcome to **CardioVision 3D**, an interactive multimodal AI cardiac digital twin that bridges this gap. Instead of abstract numbers, CardioVision fuses patient vitals, lipid profiles, and resting ECG ischemic markers into real-time 3D spatial intelligence."* |
| **0:40 - 1:05** | **Click the "Low Risk (Healthy)" preset first, then immediately click "High Risk (CAD Acute)".** Watch the risk gauge jump to 86% and the 3D heart pulse faster. Move the Heart Rate slider to show live heartbeat synchronization. | *"Watch this in action. For a healthy individual, the coronary arteries remain green and patent. But when we load an acute cardiac patient—with elevated blood pressure, adverse cholesterol ratio, and exercise ST-depression—our predictive engine flags an 86% CAD risk. Notice how the 3D anatomical heart physically syncs its heartbeat to the patient's resting heart rate in real time!"* |
| **1:05 - 1:30** | **Click the "Focus LAD" button.** The camera zooms onto the Left Anterior Descending artery glowing in pulsing crimson. Hover your mouse over the LAD artery to display the interactive tooltip. | *"More importantly, CardioVision 3D delivers spatial anatomical grounding. It doesn't just output a risk number; it maps stenosis directly onto the patient's coronary tree. Here, our model flags an 88% critical occlusion in the Left Anterior Descending artery—the dreaded 'Widowmaker'—and 45% in the Right Coronary Artery. Clinicians can click directly on any vessel to inspect downstream ischemic risk zones."* |
| **1:30 - 1:45** | **Scroll down to the bottom AI Diagnostic Bar.** Point to the AI reasoning summary and clinical directives. Click the "Clinical Report" button in the top bar to show the print-ready medical summary. | *"At the bottom, our multimodal explainability engine translates biomarker interactions into plain-language clinical reasoning and actionable triage protocols—from urgent catheterization lab activation to targeted pharmacological therapy—which can be exported into an official clinical report with one click."* |
| **1:45 - 2:00** | **Switch to the "Presentation (PPT)" tab or zoom back out on the 3D Heart.** | *"CardioVision 3D transforms complex cardiovascular data into intuitive, life-saving visual intelligence. Thank you!"* |

---

## Key Talking Points if Asked Questions by Judges

### Q1: What makes this truly "Multimodal"?
> *"CardioVision 3D does not rely on a single data modality. It combines **physiological tabular vitals** (blood pressure, heart rate, age, sex), **biochemical lipid panels** (Total/HDL cholesterol, fasting blood glucose), **electrophysiological waveforms** (ST-segment depression, resting ECG abnormalities), and **clinical symptom history** (angina classification). It correlates these signals to predict not just systemic risk, but vessel-specific stenosis probabilities."*

### Q2: How does the 3D anatomical twin benefit clinical workflow?
> *"In patient communication, visual digital twins increase patient therapy adherence by over 300% because patients can visually witness their own occluded artery. For surgeons and cardiologists, having spatial grounding of ischemic territory before catheterization accelerates triage speed in time-critical emergency scenarios."*

### Q3: What is the underlying architecture and future scope?
> *"The frontend is powered by Three.js WebGL with custom shaders and dynamic dual-phase cardiac physics. The predictive tier integrates Framingham ASCVD risk models with multi-factor logistic gradient-boosted decision ensembles. Our roadmap includes integrating automated 3D vessel reconstruction directly from DICOM coronary CT angiograms (CCTA) and WebXR for surgical planning in AR/VR headsets."*
