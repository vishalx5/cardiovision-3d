# 🫀 CardioVision 3D
### Multimodal AI Cardiovascular Risk Prediction & Interactive 3D Anatomical Twin

[![Track A](https://img.shields.io/badge/Hackathon-Multimodal%20AI%202026-blue.svg)](https://github.com)
[![Challenge](https://img.shields.io/badge/Track-Track%20A%20Cardiac%20Visualization-red.svg)](https://github.com)
[![WebGL](https://img.shields.io/badge/Graphics-Three.js%20WebGL-cyan.svg)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Submission for Multimodal AI Hackathon 2026 • Track A: Cardiovascular Risk Visualization & Prediction**  
> *"Build an interactive 3D visualization system that predicts coronary artery disease and overall cardiac risk from patient physiological and clinical data, mapping predictions onto an interactive 3D human anatomical model."*

---

## 🌟 Executive Summary

Cardiovascular disease is the #1 cause of death worldwide, claiming over 18 million lives each year. Yet, modern cardiac risk assessment remains locked in fragmented, abstract laboratory tables (e.g. ST-depression 2.8mm, Total/HDL ratio 7.8, resting BP 155 mmHg) that patients struggle to comprehend and busy clinicians take valuable minutes to synthesize.

**CardioVision 3D** solves this by fusing multimodal clinical inputs into an **interactive 3D anatomical cardiac digital twin**. It calculates overall coronary artery disease (CAD) probability and 10-year ASCVD risk, then maps arterial stenosis and ischemic vulnerability directly onto patient-specific coronary branches:
- **LAD (Left Anterior Descending)** - "The Widowmaker"
- **RCA (Right Coronary Artery)**
- **LCx (Left Circumflex Artery)**

The 3D heart physically pulses at the patient's resting heart rate in real time, with occluded arterial branches glowing in warning colors with dynamic systolic glow intensification.

---

## 🚀 Key Features

- **🫀 Interactive 3D Anatomical Digital Twin (Three.js WebGL)**
  - Procedural cardiac anatomy featuring ventricles, aortic arch, brachiocephalic branches, pulmonary trunk, and superior vena cava.
  - Dual-phase systolic contraction and diastolic relaxation animation physics.
  - Pulse synchronization dynamically responding to patient heart rate (BPM).
  - OrbitControls: smooth 360° rotation, panning, and zooming.
  - Wireframe and anatomical shading modes.

- **📊 Multimodal Risk Prediction Engine**
  - **Physiological Modality**: Age, gender, resting systolic BP, maximum heart rate.
  - **Biochemical Modality**: Total cholesterol, HDL cholesterol, fasting blood sugar.
  - **Electrophysiological Modality**: Resting ECG waveform, ST-segment depression (mm), exercise-induced angina.
  - Real-time 10-year ASCVD Framingham score and composite CAD likelihood scoring.

- **🎯 Spatial Stenosis Localization**
  - Specific occlusion percentages computed for LAD, RCA, and LCx arteries.
  - Dynamic color heatmapping:
    - 🟢 **Patent / Healthy**: < 30% stenosis
    - 🟡 **Moderate Calcification**: 30% - 70% stenosis
    - 🔴 **Critical Occlusion**: > 70% stenosis (Widowmaker alert)
  - One-click camera targeting: anterior overview, LAD focus, RCA focus, LCx focus.
  - 3D Raycasting: hover/click any vessel or chamber to view detailed perfusion metrics.

- **🩺 Explainable AI & Clinical Directives**
  - Automated plain-language narrative explaining key biomarker risk contributors.
  - Actionable clinical triage directives (e.g., immediate catheterization lab referral, high-dose statin + DAPT therapy, beta-blocker rate control).
  - One-click print-ready clinical PDF export.

- **📽️ Presentation & Video Package Included**
  - Built-in full-screen interactive presentation deck (`presentation.html`).
  - Second-by-second 2-minute video pitch & recording script (`VIDEO_SCRIPT.md`).
  - Markdown slide deck (`pitch_deck.md`).

---

## 🏗️ System Architecture

```
[ Multimodal Patient Data ]
  ├── Physiological (Age, Sex, Resting BP, Heart Rate)
  ├── Biochemical   (Cholesterol, HDL, Fasting Blood Sugar)
  ├── Electro-phys  (Resting ECG, ST-Depression, Angina)
            │
            ▼
┌──────────────────────────────────────────────┐
│       Multimodal AI Prediction Engine        │
│  - Framingham 10-Yr ASCVD Estimator          │
│  - Composite CAD Risk Probability            │
│  - Vessel-Specific Stenosis Logic            │
│    (LAD, RCA, LCx Occlusion Percentages)     │
└──────────────────────┬───────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   Three.js 3D WebGL Twin  │   │  Explainable Diagnostics  │
│ - Dual-Phase Heart Pulse  │   │ - Automated AI Narrative  │
│ - Emissive Shaders        │   │ - Triage Action Plan      │
│ - 3D Artery Raycasting    │   │ - Printable Medical PDF   │
│ - Dynamic Stenosis Colors │   └───────────────────────────┘
└───────────────────────────┘
```

---

## ⚡ Quickstart & Local Setup

### Option 1: One-Line Python Server (Zero Dependencies)
Clone the repository and run:
```bash
python server.py
```
This automatically starts a local server on port 8000 and opens `http://localhost:8000` directly in your default browser.

### Option 2: Standard Python HTTP Server
```bash
python -m http.server 8000
```
Then navigate to:
- **Main 3D App:** `http://localhost:8000/index.html`
- **Presentation Deck (PPT):** `http://localhost:8000/presentation.html`

### Option 3: Direct Browser File
You can also directly double-click `index.html` or `presentation.html` to open in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 📂 Repository Structure

```
cardiovision-3d/
├── index.html          # Main application UI and 3D WebGL viewport
├── app.js              # Three.js cardiac scene, pulse physics, risk engine, raycasting
├── styles.css          # Glassmorphic medical dark dashboard styling
├── presentation.html   # 7-slide interactive hackathon pitch deck (PPT)
├── pitch_deck.md       # Markdown slide content and talk track
├── VIDEO_SCRIPT.md     # 2-minute second-by-second recording script with visual cues
├── server.py           # Zero-dependency local python launcher
└── README.md           # Comprehensive project documentation
```

---

## 🧪 Clinical Simulation Presets

| Preset Case | Demographics & Vitals | Lipid & ECG Markers | Model Output | 3D Twin Response |
| :--- | :--- | :--- | :--- | :--- |
| **High Risk (CAD Acute)** | 58M, BP 155 mmHg, HR 98 BPM | Chol 284, HDL 36, ST-dep 2.8mm, Angina | **86% CAD Risk**, 34% ASCVD | LAD glows critical red (88% stenosis); rapid pulsing (98 BPM) |
| **Moderate Risk (Diabetic)** | 54F, BP 138 mmHg, HR 76 BPM | Chol 228, HDL 44, ST-dep 1.1mm, Diabetic | **48% CAD Risk**, 16% ASCVD | RCA & LCx show yellow calcification (~45%) |
| **Low Risk (Healthy)** | 32M, BP 116 mmHg, HR 64 BPM | Chol 172, HDL 58, ST-dep 0.0mm, No angina | **12% CAD Risk**, 4% ASCVD | All arteries green and patent (<15%); calm resting rhythm |

---

## 🏆 Hackathon Submission Checklist

- [x] **Problem Statement**: Track A - Cardiovascular Risk Visualization & Prediction
- [x] **Working 3D Application**: Real-time Three.js WebGL anatomical heart twin
- [x] **Multimodal AI Risk Engine**: Integrates vitals, blood panels, and ECG waveforms
- [x] **Presentation Deck**: Full-screen slide deck (`presentation.html`)
- [x] **Pitch & Video Script**: 2-minute recording script with visual cues (`VIDEO_SCRIPT.md`)
- [x] **Complete Git Repository**: Clean codebase, zero setup friction, production ready

---

## 📄 License
This project is licensed under the MIT License. Developed for the Multimodal AI Hackathon 2026.
