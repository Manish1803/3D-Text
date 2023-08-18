import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * FontLoader
 */
const fontLoader = new FontLoader()

fontLoader.load('/fonts/optimer_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Manish', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    })

    textGeometry.center()
    const material = new THREE.MeshNormalMaterial({ wireframe: false })
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    gsap.from(camera.position, {
        x: -3,
        y: -2,
        delay: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        scrub: 2,
    })
    gsap.from(camera.position, {
        x: 3,
        y: 2,
        delay: 1,
        duration: 5,
        repeat: -1,
        yoyo: true,
        scrub: 2,
    })

    const geometry = new THREE.TorusKnotGeometry(0.03, 0.3, 19, 6, 15, 14)

    for (let i = 0; i < 101; i++) {
        const mesh = new THREE.Mesh(geometry, material)

        mesh.position.x = (Math.random() - 0.5) * 10
        mesh.position.y = (Math.random() - 0.5) * 10
        mesh.position.z = (Math.random() - 0.5) * 10

        mesh.rotation.x = Math.random() * Math.PI
        mesh.rotation.y = Math.random() * Math.PI

        scene.add(mesh)
    }
})

/**
 * Objects
 */

// Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
)
camera.position.set(0, 0, 4)
scene.add(camera)

// resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

/**
 * Animation
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTIme = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

/**
 * Full screen
 */
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})
