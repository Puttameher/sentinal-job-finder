import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Shield, Activity, Cpu } from 'lucide-react';

export const Sentinel3DHologram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization fallback", e);
      return;
    }

    // Master Group for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Holographic Core (Icosahedron Crystal)
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316, // MetaMask neon orange
      emissive: 0xea580c,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 2. Outer Wireframe Cage
    const wireGeo = new THREE.IcosahedronGeometry(1.55, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Inner Glowing Quantum Core (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(0.75);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan inner pulse
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 4. Concentric Gyroscope Orbit Rings (Torus)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.025, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    mainGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.9, 0.015, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 5;
    mainGroup.add(ring3);

    // 5. Orbiting Satellites (Pipeline Connector Nodes)
    const satelliteGroup = new THREE.Group();
    mainGroup.add(satelliteGroup);

    const satNodes: THREE.Mesh[] = [];
    const satColors = [0xf97316, 0x10b981, 0x6366f1, 0x06b6d4];
    for (let i = 0; i < 4; i++) {
      const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({ color: satColors[i] });
      const sat = new THREE.Mesh(satGeo, satMat);
      satelliteGroup.add(sat);
      satNodes.push(sat);
    }

    // 6. 3D Floating Particle Cloud
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const orangePoint = new THREE.PointLight(0xf97316, 4, 20);
    orangePoint.position.set(5, 5, 5);
    scene.add(orangePoint);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanPoint.position.set(-5, -5, 3);
    scene.add(cyanPoint);

    // Mouse Tracking Physics (MetaMask Fox Head style)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / (rect.width / 2)) * 0.7;
      mouseY = (y / (rect.height / 2)) * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Damped mouse tracking
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;

      mainGroup.rotation.y = targetRotationY + elapsedTime * 0.15;
      mainGroup.rotation.x = targetRotationX;

      // Rotate individual elements
      coreMesh.rotation.y = elapsedTime * 0.25;
      coreMesh.rotation.z = elapsedTime * 0.15;
      wireMesh.rotation.y = elapsedTime * 0.25;
      wireMesh.rotation.z = elapsedTime * 0.15;

      innerMesh.rotation.x = -elapsedTime * 0.5;
      innerMesh.rotation.y = -elapsedTime * 0.4;

      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.25;
      ring3.rotation.x = elapsedTime * 0.2;

      // Orbit satellites around core
      satNodes.forEach((node, idx) => {
        const angle = elapsedTime * 0.7 + (idx * Math.PI) / 2;
        const radius = 2.4;
        node.position.x = Math.cos(angle) * radius;
        node.position.y = Math.sin(angle) * (radius * 0.5);
        node.position.z = Math.sin(angle) * (radius * 0.7);
      });

      // Pulse core scale
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
      coreMesh.scale.set(scale, scale, scale);
      wireMesh.scale.set(scale, scale, scale);

      particleSystem.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbiting Glass Interactive Badges */}
      <div
        className="absolute top-6 left-2 sm:left-4 px-3.5 py-2 rounded-2xl mm-glass border border-orange-500/30 text-xs text-orange-300 flex items-center gap-2 shadow-lg shadow-orange-950/40 animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        <div className="w-2 h-2 rounded-full bg-orange-400 beacon-animate"></div>
        <span className="font-mono font-bold">API: RemoteOK</span>
      </div>

      <div
        className="absolute bottom-10 left-3 sm:left-6 px-3.5 py-2 rounded-2xl mm-glass border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 shadow-lg shadow-emerald-950/40 animate-bounce"
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      >
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono font-bold">Circuit: CLOSED</span>
      </div>

      <div
        className="absolute top-10 right-2 sm:right-4 px-3.5 py-2 rounded-2xl mm-glass border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2 shadow-lg shadow-indigo-950/40 animate-bounce"
        style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
      >
        <Activity className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-mono font-bold">RSS: WeWorkRemotely</span>
      </div>

      <div
        className="absolute bottom-8 right-3 sm:right-6 px-3.5 py-2 rounded-2xl mm-glass border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2 shadow-lg shadow-purple-950/40 animate-bounce"
        style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}
      >
        <Cpu className="w-3.5 h-3.5 text-purple-400" />
        <span className="font-mono font-bold">AI Schema Drift</span>
      </div>
    </div>
  );
};
