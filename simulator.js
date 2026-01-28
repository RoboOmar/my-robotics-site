// Three.js Scene Setup (Tesla Optimus Style with Annotations)
// v2.2 - Added Neural Network Visualizer

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x0a0a0a, 5, 30);

// Main Camera (User Views Robot)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.2, 3.5);

// FPV Camera (Robot Vision)
const cameraFPV = new THREE.PerspectiveCamera(90, 300 / 200, 0.1, 100);
// We will attach it to the head later

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer) {
    canvasContainer.appendChild(renderer.domElement);
} else {
    console.error("Canvas Container not found!");
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 500);
spotLight.position.set(2, 5, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1;
spotLight.castShadow = true;
scene.add(spotLight);

const rimLight = new THREE.PointLight(0x00d4ff, 200);
rimLight.position.set(-2, 2, -2);
scene.add(rimLight);

const robotGroup = new THREE.Group();
scene.add(robotGroup);

// Materials
const silverMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
});

const blackMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.5,
    roughness: 0.4,
});

const cyanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff
});

// --- HELPER FUNCTIONS ---
function createCapsule(radius, length, material) {
    const group = new THREE.Group();
    const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
    const cylinder = new THREE.Mesh(cylinderGeo, material);
    cylinder.castShadow = true;
    group.add(cylinder);

    const sphereGeo = new THREE.SphereGeometry(radius, 32, 16);
    const topSphere = new THREE.Mesh(sphereGeo, material);
    topSphere.position.y = length / 2;
    group.add(topSphere);
    const bottomSphere = new THREE.Mesh(sphereGeo, material);
    bottomSphere.position.y = -length / 2;
    group.add(bottomSphere);
    return group;
}

// --- ROBOT BODY ---

// 1. Torso
const torsoGroup = new THREE.Group();
torsoGroup.position.y = 1.1;
robotGroup.add(torsoGroup);

const chestGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.7, 32);
const chest = new THREE.Mesh(chestGeo, silverMat);
chest.scale.z = 0.6;
chest.castShadow = true;
chest.position.y = 0.35;
torsoGroup.add(chest);

const absGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 32);
const abs = new THREE.Mesh(absGeo, blackMat);
abs.position.y = -0.2;
abs.scale.z = 0.6;
torsoGroup.add(abs);

const hipGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.4, 32);
const hips = new THREE.Mesh(hipGeo, silverMat);
hips.position.y = -0.6;
hips.scale.z = 0.6;
torsoGroup.add(hips);

// 2. Head
const headGroup = new THREE.Group();
headGroup.position.y = 2.0;
robotGroup.add(headGroup);

const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 32);
const neck = new THREE.Mesh(neckGeo, blackMat);
neck.position.y = -0.15;
headGroup.add(neck);

const skullGeo = new THREE.SphereGeometry(0.25, 32, 32);
const skull = new THREE.Mesh(skullGeo, blackMat);
skull.scale.set(1, 1.25, 1.1);
headGroup.add(skull);

const eyeBoxGeo = new THREE.BoxGeometry(0.3, 0.05, 0.1);
const eyeBox = new THREE.Mesh(eyeBoxGeo, cyanGlowMat);
eyeBox.position.set(0, 0.05, 0.22);
headGroup.add(eyeBox);

// Attach FPV Camera to Head
cameraFPV.position.set(0, 0, 0.3);
headGroup.add(cameraFPV);

// 3. Arms
function createArm(isLeft) {
    const xMult = isLeft ? -1 : 1;
    const armGroup = new THREE.Group();
    armGroup.position.set(0.6 * xMult, 1.7, 0);

    const shoulderGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, silverMat);
    armGroup.add(shoulder);

    const upperArm = new THREE.Group();
    upperArm.position.y = -0.4;
    upperArm.add(createCapsule(0.12, 0.5, blackMat));

    const plateGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32, 1, false, 0, Math.PI);
    const plate = new THREE.Mesh(plateGeo, silverMat);
    plate.rotation.y = isLeft ? -Math.PI / 2 : Math.PI / 2;
    plate.scale.set(1.3, 1.8, 1.3);
    upperArm.add(plate);

    armGroup.add(upperArm);

    const elbowGeo = new THREE.SphereGeometry(0.14, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, blackMat);
    elbow.position.y = -0.8;
    armGroup.add(elbow);

    const forearm = createCapsule(0.1, 0.6, silverMat);
    forearm.position.y = -1.25;
    armGroup.add(forearm);

    const handGeo = new THREE.BoxGeometry(0.1, 0.2, 0.15);
    const hand = new THREE.Mesh(handGeo, blackMat);
    hand.position.y = -1.7;
    armGroup.add(hand);

    armGroup.rotation.z = 0.2 * xMult;
    return armGroup;
}
const leftArm = createArm(true);
robotGroup.add(leftArm);
const rightArm = createArm(false);
robotGroup.add(rightArm);

// 4. Legs
function createLeg(isLeft) {
    const xMult = isLeft ? -1 : 1;
    const legGroup = new THREE.Group();
    legGroup.position.set(0.25 * xMult, 0.5, 0); // Attached to hips

    const hipJointGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const hipJoint = new THREE.Mesh(hipJointGeo, blackMat);
    legGroup.add(hipJoint);

    const thigh = createCapsule(0.16, 0.8, silverMat);
    thigh.position.y = -0.5;
    legGroup.add(thigh);

    const kneeGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const knee = new THREE.Mesh(kneeGeo, blackMat);
    knee.position.y = -1.0;
    legGroup.add(knee);

    const shin = createCapsule(0.14, 0.8, silverMat);
    shin.position.y = -1.5;
    legGroup.add(shin);

    const footGeo = new THREE.BoxGeometry(0.2, 0.1, 0.4);
    const foot = new THREE.Mesh(footGeo, blackMat);
    foot.position.y = -2.0;
    foot.position.z = 0.1;
    legGroup.add(foot);

    return legGroup;
}
const leftLeg = createLeg(true);
robotGroup.add(leftLeg);
const rightLeg = createLeg(false);
robotGroup.add(rightLeg);

const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x111111);
gridHelper.position.y = -1.5;
scene.add(gridHelper);

// --- ANNOTATIONS SYSTEM ---
const labelsContainer = document.getElementById('labels-container');
const labels = [];

function createLabel(text, parent, localPos) {
    if (!labelsContainer) return;

    const div = document.createElement('div');
    div.className = 'annotation-label';
    div.innerHTML = `<div class="annotation-dot"></div><div class="annotation-text">${text}</div>`;
    labelsContainer.appendChild(div);

    labels.push({
        element: div,
        parent: parent,
        localPos: localPos.clone(),
        worldPos: new THREE.Vector3()
    });
}

createLabel("Visual Cortex (Lidar/Cameras)", headGroup, new THREE.Vector3(0, 0.3, 0));
createLabel("Main CPU Core (i7-630m)", torsoGroup, new THREE.Vector3(0, 0.5, 0.35));
createLabel("Upper Actuator Link (351mm)", leftArm, new THREE.Vector3(0, -0.4, 0));
createLabel("Hydraulic Knee System", leftLeg, new THREE.Vector3(0, -1.0, 0));
createLabel("Stabilization Gyro", hips, new THREE.Vector3(0, 0, 0.4));


// --- NEURAL NETWORK VISUALIZATION ---
const neuralCanvas = document.getElementById('neural-canvas');
const ctx = neuralCanvas ? neuralCanvas.getContext('2d') : null;
let neuralData = new Array(50).fill(0); // 50 data points history

function updateNeuralVis() {
    if (!ctx) return;

    // Resize buffer if needed (simple approach)
    neuralCanvas.width = neuralCanvas.clientWidth;
    neuralCanvas.height = neuralCanvas.clientHeight;

    const w = neuralCanvas.width;
    const h = neuralCanvas.height;

    // Shift data
    neuralData.shift();

    // Generate new data point based on robot activity
    // Higher activity if dancing or waving
    let activityLevel = 0.1; // Base idle
    if (config.animationMode === 'dance') activityLevel = 0.8;
    if (config.animationMode === 'wave') activityLevel = 0.5;
    if (config.animationMode === 'manual') activityLevel = 0.3;

    // Random spike 
    const spike = (Math.random() > 0.8) ? Math.random() * activityLevel : 0;
    const value = (Math.random() * 0.2 + spike) * h;

    neuralData.push(value);

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < w; i += 20) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i < h; i += 20) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    // Draw Line
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d4ff';

    ctx.beginPath();
    const step = w / (neuralData.length - 1);
    for (let i = 0; i < neuralData.length; i++) {
        const x = i * step;
        const y = h - neuralData[i] - 10; // Offset from bottom
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
}


// --- GUI Control Panel ---
let gui;
const guiContainer = document.getElementById('gui-container');
if (typeof lil !== 'undefined' && guiContainer) {
    gui = new lil.GUI({
        title: 'Robot Control Panel',
        container: guiContainer
    });
}

const config = {
    animationMode: 'idle', // 'idle', 'wave', 'dance', 'manual'
    headRotateY: 0,
    headRotateX: 0,
    armLeftRotate: 0.2,
    armRightRotate: -0.2,
    torsoRotate: 0,

    // Actions
    setIdle: function () { this.animationMode = 'idle'; },
    setWave: function () { this.animationMode = 'wave'; },
    setDance: function () { this.animationMode = 'dance'; },

    resetHelper: function () {
        this.animationMode = 'idle';
        this.headRotateY = 0;
        this.headRotateX = 0;
        this.armLeftRotate = 0.2;
        this.armRightRotate = -0.2;
        this.torsoRotate = 0;

        // Reset actual rotation
        headGroup.rotation.y = 0;
        headGroup.rotation.x = 0;
        leftArm.rotation.z = 0.2;
        rightArm.rotation.z = -0.2;
        torsoGroup.rotation.y = 0;
    }
};

function checkManualOverride() {
    if (config.animationMode !== 'manual') {
        config.animationMode = 'manual';
    }
}

if (gui) {
    const animFolder = gui.addFolder('Pre-set Animations');
    animFolder.add(config, 'setIdle').name('Idle Mode');
    animFolder.add(config, 'setWave').name('👋 Wave Hand');
    animFolder.add(config, 'setDance').name('🕺 Robot Dance');

    const headFolder = gui.addFolder('Head Control');
    headFolder.add(config, 'headRotateY', -1, 1).name('Rotate Y').listen().onChange((val) => {
        checkManualOverride();
        headGroup.rotation.y = val;
    });
    headFolder.add(config, 'headRotateX', -0.5, 0.5).name('Rotate X').listen().onChange((val) => {
        checkManualOverride();
        headGroup.rotation.x = val;
    });

    const armFolder = gui.addFolder('Arm Control');
    armFolder.add(config, 'armLeftRotate', 0, 2.5).name('Left Arm Raise').listen().onChange((val) => {
        checkManualOverride();
        leftArm.rotation.z = val;
    });
    armFolder.add(config, 'armRightRotate', -2.5, 0).name('Right Arm Raise').listen().onChange((val) => {
        checkManualOverride();
        rightArm.rotation.z = val;
    });

    const bodyFolder = gui.addFolder('Body Control');
    bodyFolder.add(config, 'torsoRotate', -1, 1).name('Torso Twist').listen().onChange((val) => {
        checkManualOverride();
        torsoGroup.rotation.y = val;
    });

    gui.add(config, 'resetHelper').name('Reset Pose');
}


// --- ANIMATION FRAME ---
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    try {
        if (config.animationMode === 'idle') {
            // Robot Idle Anim
            torsoGroup.position.y = 1.1 + Math.sin(time) * 0.02;
            headGroup.position.y = 2.0 + Math.sin(time) * 0.02;
            headGroup.rotation.y = Math.sin(time * 0.5) * 0.1;

            leftArm.rotation.z = 0.2;
            leftArm.rotation.x = Math.sin(time) * 0.05;

            rightArm.rotation.z = -0.2;
            rightArm.rotation.x = -Math.sin(time) * 0.05;

            torsoGroup.rotation.y = 0;

        } else if (config.animationMode === 'wave') {
            // Wave Animation
            torsoGroup.position.y = 1.1;
            rightArm.rotation.z = -2.5;
            rightArm.rotation.x = Math.sin(time * 10) * 0.5;

            leftArm.rotation.z = 0.2;
            leftArm.rotation.x = Math.sin(time) * 0.05;

            headGroup.rotation.y = -0.5;
            headGroup.rotation.x = -0.2;
            torsoGroup.rotation.y = -0.2;

        } else if (config.animationMode === 'dance') {
            // Dance Animation
            const danceSpeed = time * 5;
            torsoGroup.position.y = 1.1 + Math.abs(Math.sin(danceSpeed)) * 0.1;
            headGroup.position.y = 2.0 + Math.abs(Math.sin(danceSpeed)) * 0.1;
            leftArm.rotation.z = 0.5 + Math.sin(danceSpeed) * 0.5;
            rightArm.rotation.z = -0.5 - Math.sin(danceSpeed) * 0.5;
            torsoGroup.rotation.y = Math.sin(danceSpeed * 0.5) * 0.3;
            headGroup.rotation.y = Math.sin(danceSpeed * 0.5) * -0.2;
        } else {
            // Manual Mode: Floating effect
            torsoGroup.position.y = 1.1 + Math.sin(time) * 0.02;
            headGroup.position.y = 2.0 + Math.sin(time) * 0.02;
        }

        // Legs always animate for balance
        leftLeg.rotation.x = Math.sin(time * 0.5) * 0.02;
        rightLeg.rotation.x = -Math.sin(time * 0.5) * 0.02;

        updateLabels();
        updateNeuralVis(); // Update chart

        // --- RENDER LOGIC ---

        // 1. Render Main Full View
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        // 2. Render Robot Camera (PIP)
        const piWidth = 300;
        const piHeight = 200;
        const margin = 20;

        renderer.setScissorTest(true);
        renderer.setScissor(window.innerWidth - piWidth - margin, margin, piWidth, piHeight);
        renderer.setViewport(window.innerWidth - piWidth - margin, margin, piWidth, piHeight);

        renderer.render(scene, cameraFPV);


    } catch (e) {
        console.error("Animation Error:", e);
    }
}

function updateLabels() {
    if (!labelsContainer) return;

    labels.forEach(label => {
        if (!label.parent) return;

        // Get true world position
        label.worldPos.copy(label.localPos);
        label.worldPos.applyMatrix4(label.parent.matrixWorld);

        // Project
        const tempV = label.worldPos.clone();
        tempV.project(camera);

        const x = (tempV.x * .5 + .5) * window.innerWidth;
        const y = (tempV.y * -.5 + .5) * window.innerHeight;

        label.element.style.transform = `translate(${x}px, ${y}px)`;

        // Hide if behind camera
        if (tempV.z > 1) {
            label.element.style.opacity = 0;
        } else {
            label.element.style.opacity = 1;
        }
    });
}

// --- INPUTS ---
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
document.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaMove = { x: e.offsetX - previousMousePosition.x };
        robotGroup.rotation.y += deltaMove.x * 0.005;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});
document.addEventListener('wheel', (e) => {
    camera.position.z += e.deltaY * 0.005;
    camera.position.z = Math.max(2, Math.min(camera.position.z, 8));
});
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();
