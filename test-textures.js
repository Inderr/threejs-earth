import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, sphere, controls;
const containerId = "canvas-container";

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.9, 1000);

    // Set background color
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Replace with your preferred color and alpha value
    renderer.setSize(window.innerWidth, window.innerHeight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
        
    // Append the renderer's DOM element to the specified container
    const container = document.getElementById(containerId);
    container.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 20;
    controls.enableDamping = false;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enabled = true;
    controls.maxAzimuthAngle = Math.PI * 0.2;
    controls.minAzimuthAngle = Math.PI * 1.7;
    controls.maxPolarAngle = 1.7;
    controls.minPolarAngle = 1.2;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2;

    loadTexture(); // Call loadTexture without passing a texture path
    
}

var textureLoader = new THREE.TextureLoader();
textureLoader.load('./earthmap1k.jpg', function (texture) {
    material.map = texture;
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshPhongMaterial();
    var earthMesh = new THREE.Mesh(geometry, material);
    
    
    material.map = new THREE.TextureLoader().load('../wp-content/themes/customtheme/assets/images/earthtextures/earthmap1k.jpg');
    material.bumpMap = new THREE.TextureLoader().load('../wp-content/themes/customtheme/assets/images/earthtextures/earthbump1k.jpg');
    material.bumpScale = 0.05;

    material.specularMap = new THREE.TextureLoader().load('../wp-content/themes/customtheme/assets/images/earthtextures/earthspec1k.jpg');
    material.specular = new THREE.Color('grey');

    var cloudGeometry = new THREE.SphereGeometry(0.51, 32, 32);
    var cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../wp-content/themes/customtheme/assets/images/earthtextures/earthcloudmap.jpg'),
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
        depthWrite: false,
    });
    var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthMesh.add(cloudMesh); // Fix the variable name here

    if (sphere) {
        scene.remove(sphere);
    }

    sphere = earthMesh;
    scene.add(sphere);
});

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addGSAPAnimation() {
    // Add your animation logic here using GSAP
}

window.addEventListener("resize", onWindowResize, false);

init();
animate