'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCampfireBackground({ isPlaying = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any stale canvas elements
    container.innerHTML = '';

    const MAX_PARTICLES = 320;
    const EMIT_PER_FRAME = 3;
    const WIND_MAX = 2.0;
    const BUOYANCY = 1.4;
    const BASE_RADIUS = 0.32;

    // Warm Campfire Amber/Orange Palette
    const COLOR_STOPS = [
      new THREE.Color(0xffd54f), // 0.0: warm amber core
      new THREE.Color(0xffa726), // 0.2: golden orange
      new THREE.Color(0xf57c00), // 0.45: rich fire orange
      new THREE.Color(0xd84315), // 0.75: deep campfire red
      new THREE.Color(0x2d140e)  // 1.0: dark ember smoke
    ];

    let renderer, scene, camera;
    let campfireGroup;
    let fireMesh;
    let fireLight;
    let torchSpotLight, torchPointLight, torchTarget;
    let particles = [];
    let starPoints;
    let animationFrameId;

    // 3D Raycasting & Cursor Tracking (aligned with campfire ground plane at y = -2.85)
    const mouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2.85);
    const cursor3D = new THREE.Vector3(0, -2.85, 4);
    const windVector = new THREE.Vector3(0, 0, 0);
    const fireOrigin = new THREE.Vector3(0, -2.85, 0);

    let flickerSeed = Math.random() * 1000;
    const dummy = new THREE.Object3D();
    const tmpColor = new THREE.Color();

    let lastTime = performance.now();
    let elapsedTime = 0;

    function createSoftParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.25, 'rgba(255, 240, 200, 0.85)');
      gradient.addColorStop(0.55, 'rgba(255, 160, 50, 0.35)');
      gradient.addColorStop(0.85, 'rgba(255, 80, 20, 0.06)');
      gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function buildTorch() {
      torchTarget = new THREE.Object3D();
      torchTarget.position.set(0, -2.85, 4);
      scene.add(torchTarget);

      // Flashlight spotlight with broad lantern spread cone aimed at cursor ground position
      torchSpotLight = new THREE.SpotLight(0xffecd0, 22, 60, Math.PI / 3.8, 0.7, 1);
      torchSpotLight.castShadow = true;
      torchSpotLight.shadow.mapSize.width = 1024;
      torchSpotLight.shadow.mapSize.height = 1024;
      torchSpotLight.target = torchTarget;
      scene.add(torchSpotLight);

      // Wide ambient point light following cursor position with larger surface spread
      torchPointLight = new THREE.PointLight(0xffa555, 5.0, 18, 1.6);
      scene.add(torchPointLight);
    }

    function buildStars() {
      const count = 1500;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const elevation = (-8 + Math.random() * 82) * (Math.PI / 180);
        const r = 45 + Math.random() * 55;
        const horizR = Math.cos(elevation) * r;
        positions[i * 3] = horizR * Math.cos(theta);
        positions[i * 3 + 1] = Math.sin(elevation) * r;
        positions[i * 3 + 2] = horizR * Math.sin(theta);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.32,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });

      starPoints = new THREE.Points(geo, mat);
      scene.add(starPoints);
    }

    function buildEnvironment() {
      campfireGroup = new THREE.Group();
      campfireGroup.position.set(0, -2.8, 0);
      scene.add(campfireGroup);

      // Dark, natural ground beneath campfire that receives torch and fire shadows
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(42, 64),
        new THREE.MeshStandardMaterial({ color: 0x16120e, roughness: 0.92 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.05;
      ground.receiveShadow = true;
      campfireGroup.add(ground);

      scene.add(new THREE.HemisphereLight(0x1a2333, 0x050608, 0.25));

      // Natural campfire glow
      fireLight = new THREE.PointLight(0xff8010, 6.0, 22, 1.8);
      fireLight.position.set(0, 1.2, 0);
      fireLight.castShadow = true;
      campfireGroup.add(fireLight);

      // Wooden logs
      const logMat = new THREE.MeshStandardMaterial({ color: 0x2e1b10, roughness: 0.95 });
      const logGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.8, 10);
      [0.4, -0.5, 1.9].forEach((rotY) => {
        const log = new THREE.Mesh(logGeo, logMat);
        log.rotation.z = Math.PI / 2;
        log.rotation.y = rotY;
        log.position.set(0, 0.18, 0);
        log.castShadow = true;
        log.receiveShadow = true;
        campfireGroup.add(log);
      });

      // Rock ring
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x2b2826, roughness: 0.95 });
      const rockGeo = new THREE.DodecahedronGeometry(0.42, 0);
      const rockCount = 14;
      for (let i = 0; i < rockCount; i++) {
        const a = (i / rockCount) * Math.PI * 2;
        const r = 2.2 + Math.random() * 0.25;
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(Math.cos(a) * r, 0.18, Math.sin(a) * r);
        rock.scale.setScalar(0.6 + Math.random() * 0.5);
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        rock.castShadow = true;
        rock.receiveShadow = true;
        campfireGroup.add(rock);
      }
    }

    function fireColorAt(t, target) {
      const segments = COLOR_STOPS.length - 1;
      const scaled = Math.min(Math.max(t, 0), 1) * segments;
      const i = Math.min(Math.floor(scaled), segments - 1);
      const localT = scaled - i;
      return target.copy(COLOR_STOPS[i]).lerp(COLOR_STOPS[i + 1], localT);
    }

    function buildFireParticles() {
      const geo = new THREE.PlaneGeometry(1, 1);
      const softTexture = createSoftParticleTexture();
      
      const mat = new THREE.MeshBasicMaterial({
        map: softTexture,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      
      fireMesh = new THREE.InstancedMesh(geo, mat, MAX_PARTICLES);
      fireMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const colors = new Float32Array(MAX_PARTICLES * 3);
      fireMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
      fireMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

      for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push({
          alive: false,
          pos: new THREE.Vector3(0, -100, 0),
          vel: new THREE.Vector3(0, 0, 0),
          age: 0,
          life: 1,
          size: 1
        });
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        fireMesh.setMatrixAt(i, dummy.matrix);
        fireMesh.setColorAt(i, tmpColor.setRGB(0, 0, 0));
      }
      fireMesh.instanceMatrix.needsUpdate = true;
      fireMesh.instanceColor.needsUpdate = true;
      campfireGroup.add(fireMesh);
    }

    function spawnParticle(p) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.30;
      p.pos.set(Math.cos(a) * r, 0.25 + Math.random() * 0.16, Math.sin(a) * r);
      
      p.vel.set(
        (Math.random() - 0.5) * 0.20 + windVector.x * 0.25,
        1.3 + Math.random() * 0.9,
        (Math.random() - 0.5) * 0.20 + windVector.z * 0.25
      );
      p.age = 0;
      p.life = 0.70 + Math.random() * 0.40;
      p.size = BASE_RADIUS * (0.8 + Math.random() * 0.55);
      p.alive = true;
    }

    function updateCursor3D() {
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.ray.intersectPlane(groundPlane, cursor3D);

      if (!hit) {
        cursor3D.set(0, -2.85, 4);
      }

      // Flashlight spotlight and point light follow cursor
      if (torchSpotLight && torchTarget && torchPointLight) {
        torchSpotLight.position.copy(camera.position);
        torchTarget.position.copy(cursor3D);
        torchPointLight.position.copy(cursor3D).add(new THREE.Vector3(0, 0.4, 0));
      }

      windVector.subVectors(cursor3D, fireOrigin);
      windVector.y = 0;
      
      const distance = windVector.length();
      if (distance > 0.001) {
        windVector.normalize();
        const strength = Math.min(distance * 0.18, WIND_MAX);
        windVector.multiplyScalar(strength);
      } else {
        windVector.set(0, 0, 0);
      }
    }

    function updateFire(dt, time) {
      updateCursor3D();

      for (let n = 0; n < EMIT_PER_FRAME; n++) {
        const dead = particles.find((p) => !p.alive);
        if (dead) spawnParticle(dead);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.alive) continue;

        p.vel.x += windVector.x * dt * 2.0;
        p.vel.z += windVector.z * dt * 2.0;
        p.vel.y += BUOYANCY * dt;

        p.pos.addScaledVector(p.vel, dt);
        p.age += dt;

        const t = p.age / p.life;

        if (t >= 1) {
          p.alive = false;
          dummy.position.set(0, -100, 0);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          fireMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }

        const growIn = Math.min(t / 0.15, 1);
        const shrinkOut = 1 - Math.max((t - 0.5) / 0.5, 0);
        const scale = p.size * growIn * shrinkOut * (1 + t * 0.4);

        dummy.position.copy(p.pos);
        dummy.quaternion.copy(camera.quaternion);
        dummy.scale.setScalar(Math.max(scale * 1.8, 0.0001));
        dummy.updateMatrix();
        
        fireMesh.setMatrixAt(i, dummy.matrix);
        fireMesh.setColorAt(i, fireColorAt(t, tmpColor));
      }

      fireMesh.instanceMatrix.needsUpdate = true;
      if (fireMesh.instanceColor) fireMesh.instanceColor.needsUpdate = true;

      if (fireLight) {
        fireLight.intensity = 5.5 + Math.sin(time * 9 + flickerSeed) * 1.2 + Math.sin(time * 23.7) * 0.5 + (Math.random() - 0.5) * 0.5;
        fireLight.position.x = Math.sin(time * 1.7) * 0.08;
        fireLight.position.z = Math.cos(time * 1.3) * 0.08;
      }
    }

    function onResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerMove(e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0]);
      }
    }

    // Initialize Three.js WebGL Scene with Transparent Alpha
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0.6, 12);
    camera.lookAt(0, -1.8, 0);

    buildEnvironment();
    buildTorch();
    buildStars();
    buildFireParticles();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    function animate(currentTime = performance.now()) {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      elapsedTime += dt;

      // Orbit camera gently
      const orbitR = 12;
      camera.position.x = Math.sin(elapsedTime * 0.03) * orbitR;
      camera.position.z = Math.cos(elapsedTime * 0.03) * orbitR;
      camera.position.y = 0.6 + Math.sin(elapsedTime * 0.05) * 0.12;
      camera.lookAt(0, -1.8, 0);

      // Rotate stars slowly
      if (starPoints) {
        starPoints.rotation.y = elapsedTime * 0.008;
      }

      updateFire(dt, elapsedTime);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
