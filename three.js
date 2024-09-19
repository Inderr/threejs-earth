import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, sphere, controls, cloudMesh;
let particlescene;
const containerId = "canvas-container";
const clock = new THREE.Clock(); // Add this line to create a clock

let spotLight;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 1, 1000);

    // Set background color
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Replace with your preferred color and alpha value
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.add( new THREE.HemisphereLight( 0x8d7c7c, 0x494966, 3 ) );

    spotLight = new THREE.SpotLight( 0xffffde, 1 );
    spotLight.position.set( 3.5, 0, 7 );
    scene.add( spotLight );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 15;
    spotLight.shadow.camera.fov = 40;
    spotLight.shadow.bias = - 0.5;


    // Append the renderer's DOM element to the specified container
    const container = document.getElementById(containerId);
    container.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 20;
    controls.enabled = true;
    controls.enableZoom = true;

    // Load textures
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('./earth-hd.jpg', function (texture) {
        var geometry = new THREE.SphereGeometry(5, 32, 32);
        var material = new THREE.MeshPhongMaterial();
        var earthMesh = new THREE.Mesh(geometry, material);
        earthMesh.rotation.y = 15.9;
        earthMesh.rotation.x = 0.4;
        material.map = texture;
        material.bumpMap = textureLoader.load('./earthbump1k.jpg');
        material.bumpScale = 1;

        material.specularMap = textureLoader.load('./earthspec1k.jpg');
        material.specular = new THREE.Color('black');

        // Create a canvas for the cloud texture
        const canvasCloud = document.createElement('canvas');
        const cloudContext = canvasCloud.getContext('2d');
        canvasCloud.width = 1024; // Set the desired width
        canvasCloud.height = 512; // Set the desired height

        // Load the two cloud images
        const earthCloudMapImage = new Image();
        const earthCloudMapTransImage = new Image();

        // Wait for the images to load
        earthCloudMapImage.onload = function () {
            earthCloudMapTransImage.onload = function () {
                // Draw the base cloud map image on the canvas
                cloudContext.drawImage(earthCloudMapImage, 0, 0, canvasCloud.width, canvasCloud.height);

                // Get the image data from the canvas
                const imageData = cloudContext.getImageData(0, 0, canvasCloud.width, canvasCloud.height);

                // Get the image data from the black and white transparent cloud map
                const transImageData = getImageDataFromImage(earthCloudMapTransImage, canvasCloud.width, canvasCloud.height);

                // Manipulate the alpha channel of the cloud map based on the black and white image
                for (let i = 0; i < imageData.data.length; i += 4) {
                    // Use the alpha value from the black and white image
                    imageData.data[i + 3] = transImageData.data[i];
                }

                // Put the modified image data back to the canvas
                cloudContext.putImageData(imageData, 0, 0);

                // Create the cloud texture
                const cloudTexture = new THREE.Texture(canvasCloud);
                cloudTexture.needsUpdate = true;

                // Create the cloud material
                const cloudMaterial = new THREE.MeshPhongMaterial({
                    map: cloudTexture,
                    side: THREE.DoubleSide,
                    opacity: 0.1,
                    transparent: true,
                    depthWrite: false,
                });

                // Use the cloud material to create the cloud mesh
                const cloudGeometry = new THREE.SphereGeometry(5.1, 32, 32); // Adjust the radius
                cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

                // Add the cloud mesh to the earth mesh
                earthMesh.add(cloudMesh);
            };

            // Set the source of the black and white transparent cloud map
            earthCloudMapTransImage.src = './earthcloudmaptrans.jpg';
        };

        // Set the source of the blue-colored cloud map
        earthCloudMapImage.src = './cloudmap-transparent.png';

        // Function to get image data from an image
        function getImageDataFromImage(image, width, height) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, width, height);
            return context.getImageData(0, 0, width, height);
        }


        if (sphere) {
            scene.remove(sphere);
        }

        sphere = earthMesh;
        scene.add(sphere);
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    updateRotation();
    renderer.render(scene, camera);
}

function updateRotation() {
    setTimeout(function () {
        sphere.rotation.y -= 0.001;
    }, 5000);
    const cloudRotationSpeed = 0.09;
    const delta = clock.getDelta();
    const now = clock.getElapsedTime();
    if (cloudMesh) {
        cloudMesh.rotation.y += cloudRotationSpeed * delta;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, true);

init();
animate();
