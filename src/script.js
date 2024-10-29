import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

/**
 * Scene
 */
// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Font
 */
const fontLoader = new FontLoader();

console.time("start");

fontLoader.load("./fonts/optimer_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Manish", {
    font: font,
    size: 0.6,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.center();

  const material = new THREE.MeshNormalMaterial();

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const minDistance = 2;
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 200; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    const distance = donut.position.distanceTo(text.position);
    if (distance < minDistance) {
      i--; // Skip this donut and try again
      continue;
    }

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.max(Math.random(), 0.3);
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

console.timeEnd("start");

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.y = -2;
camera.position.z = 6;
scene.add(camera);

/**
 * Controls
 */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

gsap
  .to(camera.position, { x: 3, y: 3, duration: 2.5, delay: 1, repeat: -1 })
  .yoyo(true);

/**
 * Animate
 */

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Update renderer
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
