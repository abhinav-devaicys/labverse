import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return true;
  }
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
    grad.addColorStop(0, 'rgba(23, 28, 36, 0.35)');
    grad.addColorStop(0.55, 'rgba(23, 28, 36, 0.12)');
    grad.addColorStop(1, 'rgba(23, 28, 36, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(85, 120, 245, 0.7)');
    grad.addColorStop(1, 'rgba(85, 120, 245, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Hero3DSculpture: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const prefersReduced = useReducedMotionPref();
  const [webglFailed, setWebglFailed] = useState(false);

  const handleResetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      camera.position.set(0, 1.35, 6.4);
      controls.target.set(0, 0.1, 0);
      controls.update();
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialWidth = container.clientWidth || 600;
    const initialHeight = container.clientHeight || 450;
    renderer.setSize(initialWidth, initialHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0xefece4;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, initialWidth / initialHeight, 0.1, 50);
    camera.position.set(0, 1.35, 6.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0.1, 0);
    controls.update();
    controlsRef.current = controls;

    // Studio 3-point lighting
    const hemiLight = new THREE.HemisphereLight(0xeef3ff, 0xd9d2c3, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(4.5, 6.5, 5.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5578f5, 1.45);
    rimLight.position.set(-5.0, 2.0, -4.5);
    scene.add(rimLight);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    // Ground contact shadow
    const shadowTex = createRadialShadowTexture();
    textures.push(shadowTex);
    const shadowGeo = new THREE.PlaneGeometry(5.6, 5.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    geometries.push(shadowGeo);
    materials.push(shadowMat);
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.05;
    scene.add(shadowMesh);

    // Master Sculpture Group
    const sculpture = new THREE.Group();
    sculpture.position.y = 0.15;
    scene.add(sculpture);

    // Materials
    const brushedBrassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a35e,
      metalness: 0.92,
      roughness: 0.22,
      anisotropy: 0.75,
      clearcoat: 0.25,
    });

    const anodizedCharcoalMat = new THREE.MeshStandardMaterial({
      color: 0x222936,
      metalness: 0.75,
      roughness: 0.35,
    });

    const cobaltCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x4369f2,
      metalness: 0.08,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      ior: 1.8,
      transmission: isSoftwareGl ? 0 : 0.72,
      thickness: 1.2,
      transparent: true,
      opacity: isSoftwareGl ? 0.85 : 1.0,
    });

    const alabasterGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf7f5ef,
      metalness: 0.05,
      roughness: 0.18,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });

    const pearlSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f2,
      metalness: 0.12,
      roughness: 0.16,
      clearcoat: 0.85,
    });

    materials.push(
      brushedBrassMat,
      anodizedCharcoalMat,
      cobaltCrystalMat,
      alabasterGlassMat,
      pearlSphereMat
    );

    // 1. Central Crystalline Core + Outer Glass Shell
    const coreGroup = new THREE.Group();
    const octaGeo = new THREE.OctahedronGeometry(0.56, 0);
    const outerShellGeo = new THREE.IcosahedronGeometry(0.82, 1);
    const innerRingGeo = new THREE.TorusGeometry(0.68, 0.018, 16, 72);
    geometries.push(octaGeo, outerShellGeo, innerRingGeo);

    const corePrism = new THREE.Mesh(octaGeo, cobaltCrystalMat);
    corePrism.castShadow = !isSoftwareGl;
    const outerShell = new THREE.Mesh(outerShellGeo, alabasterGlassMat);
    outerShell.renderOrder = 2;
    const innerHaloRing = new THREE.Mesh(innerRingGeo, brushedBrassMat);
    innerHaloRing.rotation.x = Math.PI / 3;

    coreGroup.add(corePrism, outerShell, innerHaloRing);
    sculpture.add(coreGroup);

    // 2. Three Precision Orbital Gimbal Rings
    const gimbalOuterGeo = new THREE.TorusGeometry(1.88, 0.026, 20, 120);
    const gimbalMidGeo = new THREE.TorusGeometry(1.52, 0.022, 18, 100);
    const gimbalInnerGeo = new THREE.TorusGeometry(1.18, 0.02, 18, 90);
    geometries.push(gimbalOuterGeo, gimbalMidGeo, gimbalInnerGeo);

    const gimbalOuterGroup = new THREE.Group();
    const gimbalOuterMesh = new THREE.Mesh(gimbalOuterGeo, brushedBrassMat);
    gimbalOuterMesh.castShadow = !isSoftwareGl;
    gimbalOuterGroup.add(gimbalOuterMesh);

    // Degree tick marks around outer ring via InstancedMesh
    const tickGeo = new THREE.BoxGeometry(0.015, 0.07, 0.02);
    geometries.push(tickGeo);
    const tickCount = 36;
    const tickInstanced = new THREE.InstancedMesh(tickGeo, anodizedCharcoalMat, tickCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < tickCount; i++) {
      const a = (i / tickCount) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 1.88, Math.sin(a) * 1.88, 0);
      dummy.rotation.set(0, 0, a + Math.PI / 2);
      dummy.updateMatrix();
      tickInstanced.setMatrixAt(i, dummy.matrix);
    }
    tickInstanced.instanceMatrix.needsUpdate = true;
    gimbalOuterGroup.add(tickInstanced);
    gimbalOuterGroup.rotation.set(0.55, 0.25, 0.1);

    const gimbalMidGroup = new THREE.Group();
    const gimbalMidMesh = new THREE.Mesh(gimbalMidGeo, anodizedCharcoalMat);
    gimbalMidGroup.add(gimbalMidMesh);
    gimbalMidGroup.rotation.set(-0.62, 0.4, 0.35);

    const gimbalInnerGroup = new THREE.Group();
    const gimbalInnerMesh = new THREE.Mesh(gimbalInnerGeo, brushedBrassMat);
    gimbalInnerGroup.add(gimbalInnerMesh);
    gimbalInnerGroup.rotation.set(0.95, -0.5, 0.2);

    sculpture.add(gimbalOuterGroup, gimbalMidGroup, gimbalInnerGroup);

    // 3. Orbiting Molecular & Planetary Nodes mounted on the gimbals
    const nodeGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const smallNodeGeo = new THREE.SphereGeometry(0.075, 20, 20);
    const crystalNodeGeo = new THREE.OctahedronGeometry(0.12, 0);
    const strutGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.42, 12);
    geometries.push(nodeGeo, smallNodeGeo, crystalNodeGeo, strutGeo);

    const outerNodeA = new THREE.Mesh(crystalNodeGeo, cobaltCrystalMat);
    outerNodeA.position.set(1.88, 0, 0);
    const outerNodeB = new THREE.Mesh(nodeGeo, pearlSphereMat);
    outerNodeB.position.set(-1.88, 0, 0);
    gimbalOuterGroup.add(outerNodeA, outerNodeB);

    // Satellite pair on mid gimbal
    const midSatelliteA = new THREE.Group();
    const satCoreA = new THREE.Mesh(nodeGeo, pearlSphereMat);
    const satMoonA = new THREE.Mesh(smallNodeGeo, cobaltCrystalMat);
    satMoonA.position.set(0.24, 0.22, 0);
    const satStrutA = new THREE.Mesh(strutGeo, brushedBrassMat);
    satStrutA.position.set(0.12, 0.11, 0);
    satStrutA.rotation.z = -Math.PI / 4;
    midSatelliteA.add(satCoreA, satMoonA, satStrutA);
    midSatelliteA.position.set(0, 1.52, 0);
    gimbalMidGroup.add(midSatelliteA);

    const midSatelliteB = new THREE.Mesh(smallNodeGeo, brushedBrassMat);
    midSatelliteB.position.set(0, -1.52, 0);
    gimbalMidGroup.add(midSatelliteB);

    // Inner gimbal orbiting electron crystals
    const innerNodeA = new THREE.Mesh(smallNodeGeo, cobaltCrystalMat);
    innerNodeA.position.set(1.18, 0, 0);
    const innerNodeB = new THREE.Mesh(smallNodeGeo, pearlSphereMat);
    innerNodeB.position.set(-1.18, 0, 0);
    gimbalInnerGroup.add(innerNodeA, innerNodeB);

    // 4. Orbital Dust / Field Particles
    const particleCount = 110;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 1.45;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi) * 0.85;
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleTex = createParticleTexture();
    textures.push(particleTex);
    const particleMat = new THREE.PointsMaterial({
      size: 0.085,
      map: particleTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      color: 0x5578f5,
    });
    geometries.push(particleGeo);
    materials.push(particleMat);
    const particles = new THREE.Points(particleGeo, particleMat);
    sculpture.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop with software WebGL pacing & reduced motion support
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const renderOnce = () => {
      if (disposed) return;
      controls.update();
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderOnce();
      controls.addEventListener('change', renderOnce);
    } else {
      const tick = () => {
        if (disposed) return;
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();

        // Smooth counter-balanced mechanical & orbital motion
        corePrism.rotation.y += delta * 0.45;
        corePrism.rotation.x = Math.sin(elapsed * 0.6) * 0.25;
        outerShell.rotation.y -= delta * 0.18;
        innerHaloRing.rotation.z += delta * 0.5;

        gimbalOuterGroup.rotation.z += delta * 0.22;
        gimbalOuterGroup.rotation.y += delta * 0.08;

        gimbalMidGroup.rotation.z -= delta * 0.34;
        gimbalMidGroup.rotation.x += delta * 0.1;

        gimbalInnerGroup.rotation.z += delta * 0.58;
        gimbalInnerGroup.rotation.y -= delta * 0.24;

        midSatelliteA.rotation.z += delta * 0.9;
        particles.rotation.y += delta * 0.07;

        // Subtle sculptural levitation
        sculpture.position.y = 0.15 + Math.sin(elapsed * 1.1) * 0.06;

        controls.update();
        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      if (prefersReduced) {
        controls.removeEventListener('change', renderOnce);
      }
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  if (webglFailed) {
    return (
      <div className="w-full aspect-[4/3] bg-museum-grid flex items-center justify-center p-8 text-center">
        <p className="font-display text-base text-[#171C24]">
          Interactive 3D Scientific Sculpture
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-[#EFECE4] select-none">
      {/* Isolated WebGL canvas mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive animated 3D scientific orbital and molecular sculpture"
      />

      {/* Minimal non-occluding bottom-corner affordances (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute inset-x-3.5 bottom-3 flex items-center justify-between gap-2">
        <span className="px-2.5 py-1 rounded-md bg-[#FAF9F5]/90 border border-[#171C24]/10 text-[11px] font-medium text-[#4B5360]">
          Drag to orbit 3D model
        </span>

        <button
          type="button"
          onClick={handleResetView}
          aria-label="Reset 3D camera angle"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F5]/90 border border-[#171C24]/10 text-[11px] font-medium text-[#171C24] hover:border-[#5578F5] hover:text-[#5578F5] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
};
