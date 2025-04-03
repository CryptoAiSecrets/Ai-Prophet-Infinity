"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export function HexagonBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Create hexagon geometry
    const hexagonGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 6, 1)

    // Materials
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x00dc82, transparent: true, opacity: 0.2, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x36e4da, transparent: true, opacity: 0.1, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x00dc82, transparent: true, opacity: 0.05 }),
    ]

    // Create hexagon grid
    const hexagons: THREE.Mesh[] = []
    const gridSize = 10
    const spacing = 2.5

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        // Offset every other row
        const offset = j % 2 === 0 ? 0 : spacing / 2

        // Calculate position
        const x = i * spacing + offset
        const y = j * spacing * 0.866 // Hexagon height factor

        // Calculate distance from center for scaling and opacity
        const distance = Math.sqrt(x * x + y * y)

        // Skip hexagons that are too far from center
        if (distance > gridSize * 1.5) continue

        // Create hexagon
        const materialIndex = Math.floor(Math.random() * materials.length)
        const hexagon = new THREE.Mesh(hexagonGeometry, materials[materialIndex])

        // Position and rotate
        hexagon.position.set(x, y, (Math.random() - 0.5) * 5)
        hexagon.rotation.x = Math.PI / 2

        // Scale based on distance from center
        const scale = 1 - distance / (gridSize * 2)
        hexagon.scale.set(scale, scale, scale)

        // Add to scene and array
        scene.add(hexagon)
        hexagons.push(hexagon)
      }
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Animate hexagons
      hexagons.forEach((hexagon) => {
        hexagon.rotation.z += 0.001

        // Subtle floating animation
        hexagon.position.z = Math.sin(Date.now() * 0.001 + hexagon.position.x + hexagon.position.y) * 0.5
      })

      // Render
      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      hexagonGeometry.dispose()
      materials.forEach((material) => material.dispose())
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}

