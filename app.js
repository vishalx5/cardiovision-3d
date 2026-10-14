/**
 * CardioVision 3D - Core Engine
 * Three.js 3D Anatomical Cardiac Digital Twin & Multimodal Risk Model
 */

// Global State
const state = {
    patient: {
        id: "PT-84092",
        age: 58,
        sex: "male",
        trestbps: 155,
        thalach: 98,
        chol: 284,
        hdl: 36,
        fbs: true,
        smoking: true,
        cp: 3, // Typical angina
        restecg: 1, // ST-T wave
        oldpeak: 2.8,
        exang: true
    },
    results: {
        cadRisk: 86,
        ascvdRisk: 34.2,
        ladStenosis: 88,
        rcaStenosis: 45,
        lcxStenosis: 35
    },
    viewMode: "anatomical", // anatomical, wireframe
    isPulsing: true,
    cameraTarget: new THREE.Vector3(0, 0, 0),
    selectedArtery: null
};

// Three.js References
let scene, camera, renderer, controls;
let heartGroup, ventricleMesh, aortaMesh, pulmonaryMesh, cavaMesh;
let ladMesh, rcaMesh, lcxMesh;
let ladMaterial, rcaMaterial, lcxMaterial;
let raycaster, mouse;
let clock;

// Preset Data
const PRESETS = {
    critical: {
        age: 58, sex: "male", trestbps: 155, thalach: 98,
        chol: 284, hdl: 36, fbs: true, smoking: true,
        cp: 3, restecg: 1, oldpeak: 2.8, exang: true
    },
    moderate: {
        age: 54, sex: "female", trestbps: 138, thalach: 76,
        chol: 228, hdl: 44, fbs: true, smoking: false,
        cp: 1, restecg: 0, oldpeak: 1.1, exang: false
    },
    healthy: {
        age: 32, sex: "male", trestbps: 116, thalach: 64,
        chol: 172, hdl: 58, fbs: false, smoking: false,
        cp: 0, restecg: 0, oldpeak: 0.0, exang: false
    }
};

// Initialize Application
window.addEventListener("DOMContentLoaded", () => {
    initThreeScene();
    bindUIEvents();
    recalculateRisk();
    animate();
});

// -------------------------------------------------------------
// 1. THREE.JS 3D SCENE & PROCEDURAL ANATOMICAL HEART
// -------------------------------------------------------------
function initThreeScene() {
    const container = document.getElementById("canvas-container");
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a13, 0.035);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 11);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 3.5;
    controls.target.set(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00d2ff, 0.8);
    dirLight2.position.set(-6, -4, -5);
    scene.add(dirLight2);

    const redRimLight = new THREE.PointLight(0xef4444, 2.0, 15);
    redRimLight.position.set(0, -3, 3);
    scene.add(redRimLight);

    // Create Anatomical Cardiac Group
    heartGroup = new THREE.Group();
    scene.add(heartGroup);

    buildAnatomicalHeart();
    buildCoronaryTree();
    buildAmbientParticles();

    // Raycaster & Mouse for interactive artery clicking
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    clock = new THREE.Clock();

    window.addEventListener("resize", onWindowResize);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onSceneClick);
}

// Build 3D Ventricles and Myocardium
function buildAnatomicalHeart() {
    // 1. Main Ventricular Muscle (Cone / Ellipsoid heart shape)
    const heartShape = new THREE.Shape();
    const x = -0.0, y = -0.0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
    heartShape.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
    heartShape.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
    heartShape.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    // Extruded & Rounded Myocardium
    const extrudeSettings = {
        depth: 2.2,
        bevelEnabled: true,
        bevelSegments: 16,
        steps: 8,
        bevelSize: 0.8,
        bevelThickness: 0.8
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    heartGeo.scale(2.2, -2.6, 1.8);
    heartGeo.rotateZ(0.2);

    const myocardiumMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.45,
        metalness: 0.15,
        bumpScale: 0.05
    });

    ventricleMesh = new THREE.Mesh(heartGeo, myocardiumMat);
    ventricleMesh.userData = { name: "Myocardium (Cardiac Muscle)", desc: "Left and Right Ventricles, primary pumping chambers of the heart." };
    heartGroup.add(ventricleMesh);

    // 2. Aortic Arch (Great Vessel)
    const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.1, 1.2, 0.2),
        new THREE.Vector3(0.2, 2.4, 0.4),
        new THREE.Vector3(-0.4, 3.2, 0.1),
        new THREE.Vector3(-1.3, 2.9, -0.4),
        new THREE.Vector3(-1.4, 1.5, -0.8)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.52, 16, false);
    const aortaMat = new THREE.MeshStandardMaterial({
        color: 0xbf360c,
        roughness: 0.35,
        metalness: 0.1
    });
    aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    aortaMesh.userData = { name: "Aorta & Aortic Arch", desc: "Main systemic artery supplying oxygenated blood to the entire body." };
    heartGroup.add(aortaMesh);

    // 3. Brachiocephalic Arterial Branches from Aorta
    const branch1Curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.2, 3.1, 0.2), new THREE.Vector3(-0.1, 3.8, 0.2)]);
    const branch2Curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.6, 3.1, 0.0), new THREE.Vector3(-0.6, 3.9, -0.1)]);
    const branch3Curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.0, 2.9, -0.3), new THREE.Vector3(-1.1, 3.7, -0.4)]);
    
    [branch1Curve, branch2Curve, branch3Curve].forEach(curve => {
        const branchGeo = new THREE.TubeGeometry(curve, 10, 0.15, 8, false);
        const branchMesh = new THREE.Mesh(branchGeo, aortaMat);
        heartGroup.add(branchMesh);
    });

    // 4. Pulmonary Trunk (Artery to Lungs)
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.6, 1.0, 0.7),
        new THREE.Vector3(-0.3, 1.9, 0.7),
        new THREE.Vector3(0.5, 2.3, 0.1)
    ]);
    const pulmonaryGeo = new THREE.TubeGeometry(pulmonaryCurve, 30, 0.46, 16, false);
    const pulmonaryMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.4,
        metalness: 0.1
    });
    pulmonaryMesh = new THREE.Mesh(pulmonaryGeo, pulmonaryMat);
    pulmonaryMesh.userData = { name: "Pulmonary Trunk", desc: "Transports deoxygenated venous blood to the pulmonary circulation." };
    heartGroup.add(pulmonaryMesh);

    // 5. Superior Vena Cava
    const cavaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.1, 0.8, -0.4),
        new THREE.Vector3(1.2, 2.5, -0.2)
    ]);
    const cavaGeo = new THREE.TubeGeometry(cavaCurve, 20, 0.42, 16, false);
    cavaMesh = new THREE.Mesh(cavaGeo, pulmonaryMat);
    cavaMesh.userData = { name: "Superior Vena Cava", desc: "Returns deoxygenated blood from the upper body into the right atrium." };
    heartGroup.add(cavaMesh);
}

// Build 3D Coronary Arterial System (LAD, RCA, LCx)
function buildCoronaryTree() {
    // 1. LAD (Left Anterior Descending) - "Widowmaker"
    const ladCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 1.2, 1.1),
        new THREE.Vector3(-0.1, 0.5, 1.3),
        new THREE.Vector3(0.1, -0.4, 1.35),
        new THREE.Vector3(0.3, -1.3, 1.25),
        new THREE.Vector3(0.5, -2.1, 0.95),
        new THREE.Vector3(0.65, -2.6, 0.6)
    ]);

    const ladGeo = new THREE.TubeGeometry(ladCurve, 50, 0.12, 12, false);
    ladMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.3
    });
    ladMesh = new THREE.Mesh(ladGeo, ladMaterial);
    ladMesh.userData = {
        name: "LAD (Left Anterior Descending)",
        code: "LAD",
        desc: "Supplies 50% of the left ventricle and anterior septum. Occlusion is classically termed the 'Widowmaker'."
    };
    heartGroup.add(ladMesh);

    // Diagonal Branch of LAD
    const ladDiagCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.1, -0.4, 1.35),
        new THREE.Vector3(0.7, -0.7, 1.2),
        new THREE.Vector3(1.2, -1.2, 0.9)
    ]);
    const ladDiagGeo = new THREE.TubeGeometry(ladDiagCurve, 20, 0.08, 8, false);
    const ladDiagMesh = new THREE.Mesh(ladDiagGeo, ladMaterial);
    ladDiagMesh.userData = ladMesh.userData;
    heartGroup.add(ladDiagMesh);

    // 2. RCA (Right Coronary Artery)
    const rcaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, 1.1, 0.7),
        new THREE.Vector3(1.2, 0.5, 0.8),
        new THREE.Vector3(1.5, -0.3, 0.5),
        new THREE.Vector3(1.4, -1.2, -0.1),
        new THREE.Vector3(0.9, -1.9, -0.6)
    ]);
    const rcaGeo = new THREE.TubeGeometry(rcaCurve, 40, 0.11, 12, false);
    rcaMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.2
    });
    rcaMesh = new THREE.Mesh(rcaGeo, rcaMaterial);
    rcaMesh.userData = {
        name: "RCA (Right Coronary Artery)",
        code: "RCA",
        desc: "Supplies the right ventricle, inferior left ventricular wall, and Sinoatrial (SA) pacemaker node."
    };
    heartGroup.add(rcaMesh);

    // 3. LCx (Left Circumflex Artery)
    const lcxCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4, 1.1, 0.8),
        new THREE.Vector3(-1.1, 0.6, 0.6),
        new THREE.Vector3(-1.4, -0.2, 0.1),
        new THREE.Vector3(-1.3, -1.0, -0.5)
    ]);
    const lcxGeo = new THREE.TubeGeometry(lcxCurve, 30, 0.10, 12, false);
    lcxMaterial = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.2
    });
    lcxMesh = new THREE.Mesh(lcxGeo, lcxMaterial);
    lcxMesh.userData = {
        name: "LCx (Left Circumflex Artery)",
        code: "LCx",
        desc: "Curves along the coronary sulcus, perfusing the lateral and posterolateral left ventricular walls."
    };
    heartGroup.add(lcxMesh);
}

// Background Floating Corpuscles / Medical Grid
function buildAmbientParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 30;
        positions[i + 1] = (Math.random() - 0.5) * 30;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.08,
        transparent: true,
        opacity: 0.4
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// -------------------------------------------------------------
// 2. MULTIMODAL RISK COMPUTATION ENGINE
// -------------------------------------------------------------
function recalculateRisk() {
    const p = state.patient;

    // 1. Composite CAD Risk Score Model (Logistic Estimation)
    let score = 0;

    // Age & Sex
    if (p.sex === "male") score += (p.age - 30) * 0.9;
    else score += (p.age - 35) * 0.75;

    // Systolic Blood Pressure
    if (p.trestbps > 140) score += (p.trestbps - 140) * 0.45;
    else if (p.trestbps > 125) score += (p.trestbps - 125) * 0.2;

    // Cholesterol / HDL ratio
    const cholRatio = p.chol / Math.max(p.hdl, 20);
    score += (cholRatio - 3.5) * 7.0;

    // Lifestyle & Diabetes
    if (p.smoking) score += 14;
    if (p.fbs) score += 12;

    // ECG & Stress
    score += p.cp * 8.5; // Typical angina gets +25.5
    score += p.oldpeak * 9.0; // ST depression
    if (p.exang) score += 16;
    if (p.restecg === 1) score += 8;
    if (p.restecg === 2) score += 12;

    // Normalize to 5% - 98%
    const cadRisk = Math.min(Math.max(Math.round(score), 5), 98);
    state.results.cadRisk = cadRisk;

    // ASCVD 10-Yr Risk
    state.results.ascvdRisk = +(cadRisk * 0.42).toFixed(1);

    // Artery-Specific Stenosis Estimation
    // LAD is sensitive to ST-depression, angina type 3, and high cholesterol
    const ladEst = Math.min(Math.round(cadRisk * 0.95 + (p.oldpeak * 4.5)), 95);
    // RCA is sensitive to smoking, age, and systemic BP
    const rcaEst = Math.min(Math.round(cadRisk * 0.58 + (p.smoking ? 12 : 0)), 88);
    // LCx is sensitive to diabetes and cholesterol
    const lcxEst = Math.min(Math.round(cadRisk * 0.48 + (p.fbs ? 10 : 0)), 82);

    state.results.ladStenosis = Math.max(ladEst, 10);
    state.results.rcaStenosis = Math.max(rcaEst, 8);
    state.results.lcxStenosis = Math.max(lcxEst, 6);

    updateUI();
    updateArteryMaterials();
}

// Update 3D Arteries Color & Glow based on Stenosis %
function updateArteryMaterials() {
    function getColorForStenosis(pct) {
        if (pct >= 70) {
            return { color: 0xef4444, emissive: 0xef4444, intensity: 0.8, className: "critical" };
        } else if (pct >= 35) {
            return { color: 0xf59e0b, emissive: 0xf59e0b, intensity: 0.4, className: "moderate" };
        } else {
            return { color: 0x10b981, emissive: 0x10b981, intensity: 0.2, className: "safe" };
        }
    }

    const ladStyle = getColorForStenosis(state.results.ladStenosis);
    ladMaterial.color.setHex(ladStyle.color);
    ladMaterial.emissive.setHex(ladStyle.emissive);
    ladMaterial.emissiveIntensity = ladStyle.intensity;

    const rcaStyle = getColorForStenosis(state.results.rcaStenosis);
    rcaMaterial.color.setHex(rcaStyle.color);
    rcaMaterial.emissive.setHex(rcaStyle.emissive);
    rcaMaterial.emissiveIntensity = rcaStyle.intensity;

    const lcxStyle = getColorForStenosis(state.results.lcxStenosis);
    lcxMaterial.color.setHex(lcxStyle.color);
    lcxMaterial.emissive.setHex(lcxStyle.emissive);
    lcxMaterial.emissiveIntensity = lcxStyle.intensity;
}

// -------------------------------------------------------------
// 3. UI SYNC & CLINICAL EXPLAINABILITY
// -------------------------------------------------------------
function updateUI() {
    const r = state.results;
    const p = state.patient;

    // Numeric Labels
    document.getElementById("val-age").textContent = p.age;
    document.getElementById("val-trestbps").textContent = p.trestbps;
    document.getElementById("val-thalach").textContent = p.thalach;
    document.getElementById("val-chol").textContent = p.chol;
    document.getElementById("val-hdl").textContent = p.hdl;
    document.getElementById("val-oldpeak").textContent = Number(p.oldpeak).toFixed(1);

    // Live Heartbeat Sync
    document.getElementById("live-bpm").textContent = `${p.thalach} BPM`;

    // Circular SVG Gauge
    document.getElementById("risk-percentage").textContent = `${r.cadRisk}%`;
    const circle = document.getElementById("score-meter");
    const circumference = 2 * Math.PI * 42; // r=42 -> 263.89
    const offset = circumference - (r.cadRisk / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Color code gauge
    const badge = document.getElementById("risk-status-badge");
    if (r.cadRisk >= 70) {
        circle.style.stroke = "var(--color-danger)";
        badge.className = "risk-status-badge high";
        badge.textContent = "HIGH ISCHEMIC RISK";
    } else if (r.cadRisk >= 40) {
        circle.style.stroke = "var(--color-warn)";
        badge.className = "risk-status-badge moderate";
        badge.textContent = "INTERMEDIATE RISK";
    } else {
        circle.style.stroke = "var(--color-safe)";
        badge.className = "risk-status-badge low";
        badge.textContent = "LOW RISK (OPTIMAL)";
    }

    document.getElementById("ascvd-text").innerHTML = `10-Yr ASCVD Risk: <strong>${r.ascvdRisk}% (${r.cadRisk >= 70 ? 'Severe' : r.cadRisk >= 40 ? 'Moderate' : 'Mild'})</strong>`;

    // Arteries HUD
    updateHudItem("lad", r.ladStenosis, "Left Anterior Descending", "Widowmaker Zone");
    updateHudItem("rca", r.rcaStenosis, "Right Coronary Artery", "Inferior Wall");
    updateHudItem("lcx", r.lcxStenosis, "Left Circumflex", "Posterolateral Wall");

    // Dynamic Clinical Narrative
    generateClinicalNarrative();
}

function updateHudItem(key, pct, name, zone) {
    document.getElementById(`${key}-pct`).textContent = `${pct}%`;
    const bar = document.getElementById(`${key}-bar`);
    bar.style.width = `${pct}%`;

    let statusText = "";
    if (pct >= 70) {
        bar.className = "hud-fill critical";
        statusText = `Critical Occlusion (>70%) • ${zone}`;
    } else if (pct >= 35) {
        bar.className = "hud-fill moderate";
        statusText = `Moderate Calcification • ${zone}`;
    } else {
        bar.className = "hud-fill safe";
        statusText = `Patent / Low Plaque • ${zone}`;
    }
    document.getElementById(`${key}-status`).textContent = statusText;
}

function generateClinicalNarrative() {
    const p = state.patient;
    const r = state.results;

    let narrative = "";
    let recs = [];

    if (r.cadRisk >= 70) {
        narrative = `Critical CAD likelihood (${r.cadRisk}%). Patient demonstrates an aggressive confluence of risk drivers: Systolic BP of ${p.trestbps} mmHg, exercise ST-depression of ${p.oldpeak}mm, and an adverse Chol/HDL ratio (${(p.chol / p.hdl).toFixed(1)}). The 3D model projects imminent flow-limiting ischemia primarily in the Left Anterior Descending (LAD) vessel (${r.ladStenosis}% estimated luminal stenosis).`;
        recs = [
            `<li><i class="fa-solid fa-circle-exclamation text-danger"></i> <strong>Immediate Invasive Angiography</strong>: Urgent catheterization lab referral to evaluate LAD stenosis.</li>`,
            `<li><i class="fa-solid fa-pills text-warning"></i> <strong>Intensive Medical Therapy</strong>: Immediate Atorvastatin 80mg + Aspirin 81mg daily.</li>`,
            `<li><i class="fa-solid fa-heart-circle-bolt text-info"></i> <strong>Rate Control</strong>: Titrate beta-blocker to suppress resting tachycardia below 70 BPM.</li>`
        ];
    } else if (r.cadRisk >= 40) {
        narrative = `Moderate cardiovascular risk profile (${r.cadRisk}%). Moderate coronary plaque burden detected, primarily localized to RCA (${r.rcaStenosis}%) and LCx (${r.lcxStenosis}%). Sub-clinical atherosclerotic progression accelerated by metabolic factors.`;
        recs = [
            `<li><i class="fa-solid fa-stethoscope text-warning"></i> <strong>Coronary CT Angiography (CCTA)</strong>: Non-invasive anatomical imaging to evaluate plaque morphology.</li>`,
            `<li><i class="fa-solid fa-apple-whole text-info"></i> <strong>Metabolic & Lifestyle Optimization</strong>: Target LDL reduction < 70 mg/dL with dietary guidance.</li>`,
            `<li><i class="fa-solid fa-calendar-check text-info"></i> <strong>Follow-up Stress Echo</strong>: Schedule 6-month repeat evaluation.</li>`
        ];
    } else {
        narrative = `Optimal cardiovascular health index. Framingham and CAD predictive indices place the patient in the lowest risk decile (${r.cadRisk}%). Arterial branches (LAD, RCA, LCx) demonstrate normal patent vascular lumen with minimal calcification.`;
        recs = [
            `<li><i class="fa-solid fa-heart-circle-check text-info"></i> <strong>Routine Preventative Maintenance</strong>: Annual cardiovascular risk screening.</li>`,
            `<li><i class="fa-solid fa-person-running text-info"></i> <strong>Aerobic Conditioning</strong>: Maintain 150 minutes of weekly moderate aerobic activity.</li>`,
            `<li><i class="fa-solid fa-shield-halved text-info"></i> <strong>Nutritional Support</strong>: Adhere to Mediterranean cardiac-protective dietary guidelines.</li>`
        ];
    }

    document.getElementById("ai-narrative").innerHTML = narrative;
    document.getElementById("recommendation-list").innerHTML = recs.join("");
}

// -------------------------------------------------------------
// 4. ANIMATION LOOP & CARDIAC PULSING PHYSICS
// -------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Orbit Controls Damping
    controls.update();

    // Gentle Auto-Rotation of Heart
    heartGroup.rotation.y += 0.003;

    // Heartbeat Pulsing Contraction (Dual-phase Systole & Diastole)
    if (state.isPulsing) {
        // Beats per second based on patient heart rate (thalach)
        const bps = state.patient.thalach / 60.0;
        const cycle = (elapsedTime * bps * Math.PI * 2) % (Math.PI * 2);

        // Ventricular Systolic Squeeze curve
        const pulseFactor = Math.sin(cycle);
        const doubleBeat = Math.pow(Math.max(0, pulseFactor), 4) * 0.07;
        const scaleVal = 1.0 + doubleBeat;

        ventricleMesh.scale.set(2.2 * scaleVal, -2.6 * scaleVal, 1.8 * scaleVal);

        // Occluded arteries pulse with increased emissive glow on systole!
        if (state.results.ladStenosis >= 70) {
            ladMaterial.emissiveIntensity = 0.5 + doubleBeat * 6.0;
        }
    }

    renderer.render(scene, camera);
}

// -------------------------------------------------------------
// 5. EVENT HANDLERS & USER INTERACTIONS
// -------------------------------------------------------------
function bindUIEvents() {
    // Presets
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetBtn = e.currentTarget;
            document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
            targetBtn.classList.add("active");

            const presetKey = targetBtn.getAttribute("data-preset");
            applyPreset(PRESETS[presetKey]);
        });
    });

    // Sliders
    bindSlider("input-age", "age");
    bindSlider("input-trestbps", "trestbps");
    bindSlider("input-thalach", "thalach");
    bindSlider("input-chol", "chol");
    bindSlider("input-hdl", "hdl");
    bindSlider("input-oldpeak", "oldpeak", parseFloat);

    // Selects
    document.getElementById("input-sex").addEventListener("change", (e) => {
        state.patient.sex = e.target.value;
        recalculateRisk();
    });
    document.getElementById("input-cp").addEventListener("change", (e) => {
        state.patient.cp = parseInt(e.target.value);
        recalculateRisk();
    });
    document.getElementById("input-restecg").addEventListener("change", (e) => {
        state.patient.restecg = parseInt(e.target.value);
        recalculateRisk();
    });

    // Checkboxes
    document.getElementById("input-fbs").addEventListener("change", (e) => {
        state.patient.fbs = e.target.checked;
        recalculateRisk();
    });
    document.getElementById("input-smoking").addEventListener("change", (e) => {
        state.patient.smoking = e.target.checked;
        recalculateRisk();
    });
    document.getElementById("input-exang").addEventListener("change", (e) => {
        state.patient.exang = e.target.checked;
        recalculateRisk();
    });

    // Camera Presets
    document.querySelectorAll(".cam-btn[data-view]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cam-btn[data-view]").forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            setCameraView(e.currentTarget.getAttribute("data-view"));
        });
    });

    // Pulse Toggle
    const pulseBtn = document.getElementById("btn-toggle-pulse");
    pulseBtn.addEventListener("click", () => {
        state.isPulsing = !state.isPulsing;
        pulseBtn.innerHTML = state.isPulsing ? `<i class="fa-solid fa-heart"></i> Pulse: ON` : `<i class="fa-solid fa-heart-crack"></i> Pulse: OFF`;
        pulseBtn.classList.toggle("pulse-active", state.isPulsing);
    });

    // Wireframe Toggle
    const wireframeBtn = document.getElementById("btn-wireframe");
    wireframeBtn.addEventListener("click", () => {
        const isWire = !ventricleMesh.material.wireframe;
        ventricleMesh.material.wireframe = isWire;
        aortaMesh.material.wireframe = isWire;
        pulmonaryMesh.material.wireframe = isWire;
        wireframeBtn.classList.toggle("active", isWire);
    });

    // Clinical Report Print/PDF
    document.getElementById("btn-export-pdf").addEventListener("click", () => {
        window.print();
    });
}

function bindSlider(id, key, parser = parseInt) {
    const el = document.getElementById(id);
    el.addEventListener("input", (e) => {
        state.patient[key] = parser(e.target.value);
        recalculateRisk();
    });
}

function applyPreset(data) {
    Object.assign(state.patient, data);

    document.getElementById("input-age").value = data.age;
    document.getElementById("input-sex").value = data.sex;
    document.getElementById("input-trestbps").value = data.trestbps;
    document.getElementById("input-thalach").value = data.thalach;
    document.getElementById("input-chol").value = data.chol;
    document.getElementById("input-hdl").value = data.hdl;
    document.getElementById("input-oldpeak").value = data.oldpeak;
    document.getElementById("input-cp").value = data.cp;
    document.getElementById("input-restecg").value = data.restecg;
    document.getElementById("input-fbs").checked = data.fbs;
    document.getElementById("input-smoking").checked = data.smoking;
    document.getElementById("input-exang").checked = data.exang;

    recalculateRisk();
}

function setCameraView(view) {
    switch (view) {
        case "front":
            smoothCameraMove(0, 1.5, 11, 0, 0, 0);
            break;
        case "lad":
            smoothCameraMove(1.5, -0.5, 7.5, 0.2, -0.8, 1.0);
            break;
        case "rca":
            smoothCameraMove(6.5, 0.5, 5.0, 1.0, -0.5, 0.2);
            break;
        case "lcx":
            smoothCameraMove(-6.5, 1.0, 5.0, -0.8, -0.2, 0.2);
            break;
    }
}

function smoothCameraMove(x, y, z, tx, ty, tz) {
    camera.position.set(x, y, z);
    controls.target.set(tx, ty, tz);
}

function onWindowResize() {
    const container = document.getElementById("canvas-container");
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(heartGroup.children, true);

    const tooltip = document.getElementById("anatomical-tooltip");

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData && obj.userData.name) {
            document.getElementById("tooltip-title").textContent = obj.userData.name;
            let extra = obj.userData.desc;
            if (obj.userData.code === "LAD") extra += ` [Current Stenosis: ${state.results.ladStenosis}%]`;
            if (obj.userData.code === "RCA") extra += ` [Current Stenosis: ${state.results.rcaStenosis}%]`;
            if (obj.userData.code === "LCx") extra += ` [Current Stenosis: ${state.results.lcxStenosis}%]`;
            document.getElementById("tooltip-desc").textContent = extra;
            tooltip.style.display = "block";
            return;
        }
    }
    tooltip.style.display = "block";
}

function onSceneClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([ladMesh, rcaMesh, lcxMesh], true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.code === "LAD") setCameraView("lad");
        if (obj.userData.code === "RCA") setCameraView("rca");
        if (obj.userData.code === "LCx") setCameraView("lcx");
    }
}
