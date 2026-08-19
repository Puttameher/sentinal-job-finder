import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SentinelMask3DProps {
  height?: string;
  /** If true, renders a tiny non-interactive static version for the logo */
  mini?: boolean;
}

export const SentinelMask3D: React.FC<SentinelMask3DProps> = ({ height = '160px', mini = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || (mini ? 48 : 320);
    const h = container.clientHeight || (mini ? 48 : 160);

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const fov = mini ? 28 : 36;
    const camera = new THREE.PerspectiveCamera(fov, width / h, 0.1, 1000);
    camera.position.set(0, 0.2, mini ? 6.5 : 5.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.shadowMap.enabled = !mini;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization fallback', e);
      return;
    }

    // Master Sentinel Mask 3D Model Group
    const maskGroup = new THREE.Group();
    maskGroup.position.set(0, -0.2, 0);
    scene.add(maskGroup);

    // 2. High-Fidelity 3D Materials — More opaque, richer depth, stronger specular
    const matPrimaryOrange = new THREE.MeshStandardMaterial({
      color: 0xe2761b,
      roughness: 0.18,
      metalness: 0.55,
      flatShading: true,
    });
    const matHighlightOrange = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.12,
      metalness: 0.6,
      flatShading: true,
    });
    const matDeepAmber = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.2,
      metalness: 0.65,
      flatShading: true,
    });
    const matDarkObsidian = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      roughness: 0.12,
      metalness: 0.9,
      flatShading: true,
    });
    const matGoldTrim = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.92,
      flatShading: true,
    });
    const matWhiteChin = new THREE.MeshStandardMaterial({
      color: 0xf4eee2,
      roughness: 0.25,
      metalness: 0.15,
      flatShading: true,
    });
    const matGlowingVisor = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00d2ee,
      emissiveIntensity: 1.2,
      roughness: 0.05,
      metalness: 0.35,
      flatShading: true,
    });
    const matCoreGlow = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.4,
      roughness: 0.05,
      metalness: 0.2,
    });
    // Dark back panel material to eliminate transparency
    const matBackPanel = new THREE.MeshStandardMaterial({
      color: 0x1a1208,
      roughness: 0.3,
      metalness: 0.7,
      flatShading: true,
      side: THREE.BackSide,
    });

    // Helper: Build faceted 3D geometry with normals
    const createFacetedMesh = (vertices: number[], indices: number[], material: THREE.Material) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // --- 3D COMPACT MASK GEOMETRY MODELING ---

    // 0. Solid Back Panel (fills the mask from behind so it's NOT transparent/see-through)
    const backPanelVertices = [
      -1.5, 2.8, -0.4,   // 0: top-left
       1.5, 2.8, -0.4,   // 1: top-right
       1.3, -0.9, -0.2,  // 2: bottom-right
      -1.3, -0.9, -0.2,  // 3: bottom-left
       0.0, 1.0, -0.1,   // 4: center depth
    ];
    const backPanelIndices = [
      0, 4, 1,
      0, 3, 4,
      1, 4, 2,
      3, 2, 4,
    ];
    maskGroup.add(createFacetedMesh(backPanelVertices, backPanelIndices, matBackPanel));

    // Interior fill plate (front-facing dark interior for depth illusion)
    const interiorVertices = [
      -0.55, 0.7, 0.5,   // 0
       0.55, 0.7, 0.5,   // 1
       0.35, -0.4, 0.6,  // 2
      -0.35, -0.4, 0.6,  // 3
    ];
    maskGroup.add(createFacetedMesh(interiorVertices, [0, 3, 1, 1, 3, 2], matDarkObsidian));

    // 1. Forehead Crest & Crown Plates
    const crownVertices = [
      0, 1.8, 0.4,       // 0: Crown Apex Point
      -0.65, 1.3, 0.55,  // 1: Left Crown Notch
      0.65, 1.3, 0.55,   // 2: Right Crown Notch
      0, 1.0, 0.9,       // 3: Center Brow Jewel Node
      -0.45, 0.75, 1.0,  // 4: Left Brow Point
      0.45, 0.75, 1.0,   // 5: Right Brow Point
      0, 1.45, 0.1,      // 6: Crown Rear Ridge
    ];
    const crownIndices = [
      0, 1, 3,  0, 3, 2,
      1, 4, 3,  2, 3, 5,
      0, 6, 1,  0, 2, 6,
    ];
    maskGroup.add(createFacetedMesh(crownVertices, crownIndices, matHighlightOrange));

    // Crown rear fill (close the back)
    const crownRearVertices = [
      0, 1.8, 0.4,        // 0
      -0.65, 1.3, 0.55,   // 1
      0.65, 1.3, 0.55,    // 2
      0, 1.45, 0.1,       // 3
      -0.45, 0.75, 1.0,   // 4
      0.45, 0.75, 1.0,    // 5
    ];
    maskGroup.add(createFacetedMesh(crownRearVertices, [3, 1, 4, 3, 4, 5, 3, 5, 2], matDeepAmber));

    // Forehead Quantum Diamond Jewel
    const jewelVertices = [
      0, 1.2, 0.98,
      -0.14, 1.02, 1.04,
      0.14, 1.02, 1.04,
      0, 0.85, 1.04,
      0, 1.02, 1.16,
    ];
    maskGroup.add(createFacetedMesh(jewelVertices, [0, 1, 4, 0, 4, 2, 1, 3, 4, 2, 4, 3], matCoreGlow));

    // 2. High-Tech Glowing Cyber Telemetry Visor
    const visorVertices = [
      -0.85, 0.7, 0.8,
      -0.3, 0.75, 1.05,
      0.3, 0.75, 1.05,
      0.85, 0.7, 0.8,
      0.7, 0.45, 0.9,
      0.25, 0.48, 1.1,
      -0.25, 0.48, 1.1,
      -0.7, 0.45, 0.9,
      0, 0.62, 1.18,
    ];
    const visorIndices = [
      0, 1, 7,  1, 6, 7,
      1, 8, 6,  1, 2, 8,
      2, 5, 8,  2, 3, 5,
      3, 4, 5,  6, 8, 5,
    ];
    maskGroup.add(createFacetedMesh(visorVertices, visorIndices, matGlowingVisor));

    // 3. Cheek Shield Plates & Side Armor (thicker / more prominent)
    const leftCheekVertices = [
      -0.7, 0.45, 0.9,
      -1.3, 0.35, 0.4,
      -0.4, -0.05, 1.05,
      -0.95, -0.3, 0.5,
      -0.7, 0.75, 0.35,
    ];
    maskGroup.add(createFacetedMesh(leftCheekVertices, [0, 1, 2, 1, 3, 2, 0, 4, 1], matPrimaryOrange));

    // Left cheek side fill
    const leftSideFillVertices = [
      -1.3, 0.35, 0.4,
      -0.95, -0.3, 0.5,
      -1.1, -0.3, 0.0,
      -1.3, 0.35, -0.1,
    ];
    maskGroup.add(createFacetedMesh(leftSideFillVertices, [0, 1, 2, 0, 2, 3], matDeepAmber));

    const rightCheekVertices = [
      0.7, 0.45, 0.9,
      0.4, -0.05, 1.05,
      1.3, 0.35, 0.4,
      0.95, -0.3, 0.5,
      0.7, 0.75, 0.35,
    ];
    maskGroup.add(createFacetedMesh(rightCheekVertices, [0, 1, 2, 2, 1, 3, 0, 2, 4], matPrimaryOrange));

    // Right cheek side fill
    const rightSideFillVertices = [
      1.3, 0.35, 0.4,
      0.95, -0.3, 0.5,
      1.1, -0.3, 0.0,
      1.3, 0.35, -0.1,
    ];
    maskGroup.add(createFacetedMesh(rightSideFillVertices, [0, 2, 1, 0, 3, 2], matDeepAmber));

    // 4. Center Face Plate & Chin Guard
    const chinVertices = [
      0, 0.48, 1.15,
      -0.4, -0.05, 1.05,
      0.4, -0.05, 1.05,
      0, -0.5, 1.25,
      0, -0.85, 0.9,
      -0.3, -0.6, 0.8,
      0.3, -0.6, 0.8,
      0, -0.15, 1.22,
    ];
    const chinIndices = [
      0, 1, 7,  0, 7, 2,
      1, 3, 7,  2, 7, 3,
      1, 5, 3,  2, 3, 6,
      3, 5, 4,  3, 4, 6,
    ];
    maskGroup.add(createFacetedMesh(chinVertices, chinIndices, matDarkObsidian));

    // White Chin Highlight Triangle (MetaMask style chin facet)
    const chinWhiteVertices = [
      0, -0.5, 1.26,
      -0.2, -0.72, 0.88,
      0.2, -0.72, 0.88,
      0, -0.86, 0.91,
    ];
    maskGroup.add(createFacetedMesh(chinWhiteVertices, [0, 1, 2, 1, 3, 2], matWhiteChin));

    // Gold trim line across nose bridge
    const noseBridgeVertices = [
      -0.2, 0.48, 1.18,
       0.2, 0.48, 1.18,
       0.15, 0.38, 1.2,
      -0.15, 0.38, 1.2,
    ];
    maskGroup.add(createFacetedMesh(noseBridgeVertices, [0, 3, 1, 1, 3, 2], matGoldTrim));

    // 5. Pointed Angular Antenna Horns / Ears
    // Left Ear
    const leftHornVertices = [
      -0.65, 1.3, 0.55,
      -1.2, 0.85, 0.2,
      -1.45, 2.7, -0.2,
      -0.5, 1.5, -0.15,
      -0.95, 1.9, 0.12,
    ];
    maskGroup.add(createFacetedMesh(leftHornVertices, [0, 1, 4, 1, 2, 4, 0, 4, 2], matHighlightOrange));
    maskGroup.add(createFacetedMesh(leftHornVertices, [1, 3, 2], matDeepAmber));
    // Left ear inner face
    maskGroup.add(createFacetedMesh(leftHornVertices, [0, 4, 3, 4, 2, 3], matPrimaryOrange));

    // Right Ear
    const rightHornVertices = [
      0.65, 1.3, 0.55,
      1.45, 2.7, -0.2,
      1.2, 0.85, 0.2,
      0.5, 1.5, -0.15,
      0.95, 1.9, 0.12,
    ];
    maskGroup.add(createFacetedMesh(rightHornVertices, [0, 4, 2, 4, 1, 2, 0, 1, 4], matHighlightOrange));
    maskGroup.add(createFacetedMesh(rightHornVertices, [2, 1, 3], matDeepAmber));
    // Right ear inner face
    maskGroup.add(createFacetedMesh(rightHornVertices, [0, 3, 4, 4, 3, 1], matPrimaryOrange));

    // 6. Enhanced 4-Point Studio Lighting for depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(5, 7, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf97316, 1.6);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f2fe, 1.8);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // Extra top highlight for crown dimension
    const topLight = new THREE.DirectionalLight(0xfde68a, 1.0);
    topLight.position.set(0, 10, 2);
    scene.add(topLight);

    // 7. Cursor Tracking Physics (disabled for mini logo version)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let targetRotationZ = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (mini) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / (window.innerWidth / 2)) * 0.75;
      mouseY = (y / (window.innerHeight / 2)) * 0.5;
    };

    if (!mini) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 8. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();

      if (mini) {
        // Gentle idle bobbing rotation for the mini logo version
        maskGroup.rotation.y = Math.sin(now * 0.001) * 0.15;
        maskGroup.rotation.x = Math.sin(now * 0.0008) * 0.05;
      } else {
        targetRotationY += (mouseX - targetRotationY) * 0.08;
        targetRotationX += (mouseY - targetRotationX) * 0.08;
        targetRotationZ = -targetRotationY * 0.12;

        maskGroup.rotation.y = targetRotationY;
        maskGroup.rotation.x = targetRotationX;
        maskGroup.rotation.z = targetRotationZ;
      }

      const breath = Math.sin(now * 0.0025) * (mini ? 0.01 : 0.02);
      maskGroup.position.y = -0.2 + breath;

      const pulse = 1.0 + Math.sin(now * 0.004) * 0.3;
      matGlowingVisor.emissiveIntensity = pulse;
      matCoreGlow.emissiveIntensity = 1.2 + Math.sin(now * 0.003) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const ch = container.clientHeight || (mini ? 48 : 160);
      camera.aspect = w / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(w, ch);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (!mini) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, [mini]);

  return (
    <div
      ref={mountRef}
      style={{ height }}
      className={`flex items-center justify-center select-none overflow-visible pointer-events-auto ${
        mini ? 'w-full' : 'w-full cursor-grab active:cursor-grabbing'
      }`}
    />
  );
};
