import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SentinelMascot3D: React.FC<{ height?: string }> = ({ height = '220px' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const h = container.clientHeight || 220;

    // Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / h, 0.1, 1000);
    camera.position.set(0, 0.2, 5.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization fallback', e);
      return;
    }

    // Master Head Group (will rotate to look at mouse cursor)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, -0.6, 0); // centered nicely in view
    scene.add(headGroup);

    // Materials - MetaMask signature low-poly faceted orange and dark amber shades
    const matMainOrange = new THREE.MeshLambertMaterial({ color: 0xe2761b, flatShading: true });
    const matLightOrange = new THREE.MeshLambertMaterial({ color: 0xf6851b, flatShading: true });
    const matDarkOrange = new THREE.MeshLambertMaterial({ color: 0xb84f09, flatShading: true });
    const matShadowAmber = new THREE.MeshLambertMaterial({ color: 0x8a3804, flatShading: true });
    const matWhiteCheek = new THREE.MeshLambertMaterial({ color: 0xf4eee2, flatShading: true });
    const matNoseDark = new THREE.MeshLambertMaterial({ color: 0x1b1411, flatShading: true });
    const matGlowingEyes = new THREE.MeshBasicMaterial({ color: 0x00ffcc }); // cyber cyan sensors

    // Helper: Create custom faceted polygonal mesh from vertices and triangle indices
    const createFacetedMesh = (vertices: number[], indices: number[], material: THREE.Material) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, material);
    };

    // 1. Snout / Nose Bridge
    const snoutVertices = [
      0, 0.3, 1.4,      // 0: snout tip
      -0.4, 0.6, 0.7,   // 1: left snout top
      0.4, 0.6, 0.7,    // 2: right snout top
      0, 0.8, 0.6,      // 3: nose bridge top
      -0.3, 0.1, 0.7,   // 4: left snout bottom
      0.3, 0.1, 0.7,    // 5: right snout bottom
    ];
    const snoutIndices = [
      0, 1, 3,  // left bridge
      0, 3, 2,  // right bridge
      0, 4, 1,  // left cheek side
      0, 2, 5,  // right cheek side
      0, 5, 4,  // bottom snout
    ];
    headGroup.add(createFacetedMesh(snoutVertices, snoutIndices, matLightOrange));

    // Nose Tip (Dark polygon)
    const noseTipVertices = [
      0, 0.3, 1.41,
      -0.15, 0.42, 1.15,
      0.15, 0.42, 1.15,
      0, 0.22, 1.15,
    ];
    const noseTipIndices = [0, 1, 2, 0, 3, 1, 0, 2, 3];
    headGroup.add(createFacetedMesh(noseTipVertices, noseTipIndices, matNoseDark));

    // 2. Forehead & Center Brow
    const foreheadVertices = [
      0, 0.8, 0.6,      // 0: brow bottom
      -0.7, 1.1, 0.4,   // 1: left brow
      0.7, 1.1, 0.4,    // 2: right brow
      0, 1.5, 0.2,      // 3: forehead apex
      -0.5, 1.6, 0.0,   // 4: left top head
      0.5, 1.6, 0.0,    // 5: right top head
    ];
    const foreheadIndices = [
      0, 1, 3,  // left forehead
      0, 3, 2,  // right forehead
      1, 4, 3,  // left upper head
      2, 3, 5,  // right upper head
    ];
    headGroup.add(createFacetedMesh(foreheadVertices, foreheadIndices, matMainOrange));

    // 3. Glowing Cybernetic Eye Sensors
    const leftEyeVertices = [-0.35, 0.75, 0.65, -0.55, 0.85, 0.55, -0.3, 0.88, 0.58];
    const rightEyeVertices = [0.35, 0.75, 0.65, 0.3, 0.88, 0.58, 0.55, 0.85, 0.55];
    headGroup.add(createFacetedMesh(leftEyeVertices, [0, 1, 2], matGlowingEyes));
    headGroup.add(createFacetedMesh(rightEyeVertices, [0, 1, 2], matGlowingEyes));

    // 4. Cheeks (Low-poly White & Amber Facets)
    const leftCheekVertices = [
      -0.4, 0.6, 0.7,   // 0
      -0.3, 0.1, 0.7,   // 1
      -1.1, 0.3, 0.3,   // 2: left cheek wing
      -0.7, 1.1, 0.4,   // 3: left brow
    ];
    const leftCheekIndices = [0, 2, 1, 0, 3, 2];
    headGroup.add(createFacetedMesh(leftCheekVertices, leftCheekIndices, matWhiteCheek));

    const rightCheekVertices = [
      0.4, 0.6, 0.7,    // 0
      1.1, 0.3, 0.3,    // 1: right cheek wing
      0.3, 0.1, 0.7,    // 2
      0.7, 1.1, 0.4,    // 3: right brow
    ];
    const rightCheekIndices = [0, 1, 2, 0, 3, 1];
    headGroup.add(createFacetedMesh(rightCheekVertices, rightCheekIndices, matWhiteCheek));

    // 5. Pointed Origami Ears (The iconic MetaMask Fox/Sentinel Ears)
    // Left Ear
    const leftEarVertices = [
      -0.5, 1.6, 0.0,   // 0: base front
      -1.1, 0.9, 0.2,   // 1: base outer
      -1.0, 2.5, -0.3,  // 2: EAR TIP
      -0.3, 1.4, -0.4,  // 3: base back
    ];
    const leftEarIndices = [
      0, 1, 2, // front inner ear face (light)
      1, 3, 2, // outer ear face (dark)
      3, 0, 2, // back ear face (shadow)
    ];
    headGroup.add(createFacetedMesh(leftEarVertices, [0, 1, 2], matLightOrange));
    headGroup.add(createFacetedMesh(leftEarVertices, [1, 3, 2], matDarkOrange));
    headGroup.add(createFacetedMesh(leftEarVertices, [3, 0, 2], matShadowAmber));

    // Right Ear
    const rightEarVertices = [
      0.5, 1.6, 0.0,    // 0: base front
      1.0, 2.5, -0.3,   // 1: EAR TIP
      1.1, 0.9, 0.2,    // 2: base outer
      0.3, 1.4, -0.4,   // 3: base back
    ];
    const rightEarIndices = [
      0, 1, 2, // front inner ear face (light)
      2, 1, 3, // outer ear face (dark)
      3, 1, 0, // back ear face (shadow)
    ];
    headGroup.add(createFacetedMesh(rightEarVertices, [0, 1, 2], matLightOrange));
    headGroup.add(createFacetedMesh(rightEarVertices, [2, 1, 3], matDarkOrange));
    headGroup.add(createFacetedMesh(rightEarVertices, [3, 1, 0], matShadowAmber));

    // Lighting (Warm Key + Ambient + Rim Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.2);
    dirLight1.position.set(5, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff7700, 0.6);
    dirLight2.position.set(-5, 3, 4);
    scene.add(dirLight2);

    // Mouse Tracking Physics (Looking directly at user cursor with spring lerp damping)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / (rect.width / 2)) * 0.65; // max horizontal look angle
      mouseY = (y / (rect.height / 2)) * 0.45; // max vertical look angle
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      // Smooth Spring Lerp to cursor target
      targetRotationY += (mouseX - targetRotationY) * 0.08;
      targetRotationX += (mouseY - targetRotationX) * 0.08;

      headGroup.rotation.y = targetRotationY;
      headGroup.rotation.x = targetRotationX;

      // Subtle breathing idle animation
      const breath = Math.sin(now * 0.002) * 0.02;
      headGroup.position.y = -0.6 + breath;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 220;
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
    <div
      ref={mountRef}
      style={{ height }}
      className="w-full flex items-end justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto"
    />
  );
};
