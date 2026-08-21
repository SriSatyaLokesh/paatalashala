'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCampfireBackground({ isPlaying = true, fuelBurst = 0 }) {
  const containerRef = useRef(null);
  const fuelRef = useRef({ level: 0, lastBurst: 0 });

  useEffect(() => {
    if (fuelBurst > 0 && fuelBurst !== fuelRef.current.lastBurst) {
      fuelRef.current.lastBurst = fuelBurst;
      fuelRef.current.level = 1.0; // Trigger instant full petrol burst
    }
  }, [fuelBurst]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any stale canvas elements
    container.innerHTML = '';

    const MAX_PARTICLES = 480;
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
    let shootingStarMesh, shootingStarHead;
    let shootingStar = null;
    let nextShootingStarTime = 3.5 + Math.random() * 4.0;
    let animationFrameId;
    let mountainMeshes = [];

    // 3D Raycasting & Cursor Tracking (aligned with campfire ground plane and mountain geometries)
    const mouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2.85);
    const cursor3D = new THREE.Vector3(0, -2.85, 4);
    const windVector = new THREE.Vector3(0, 0, 0);
    const fireOrigin = new THREE.Vector3(0, -2.85, 0);

    // Mouse velocity and hard wind gust suppression state
    let lastMousePos = { x: 0, y: 0 };
    let lastMouseTime = 0;
    let hasPointerMoved = false;
    let mouseVelocity = 0;
    let smoothVelocity = 0;
    let gustSuppression = 0; // 0 = normal fire, 1 = suppressed/bent down by hard wind gust

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

      // Long-throw flashlight beam originating from camera that vividly illuminates the ground and distant mountains
      torchSpotLight = new THREE.SpotLight(0xffbe55, 38, 140, Math.PI / 3.8, 0.72, 0.85);
      torchSpotLight.castShadow = true;
      torchSpotLight.shadow.mapSize.width = 1024;
      torchSpotLight.shadow.mapSize.height = 1024;
      torchSpotLight.target = torchTarget;
      scene.add(torchSpotLight);

      // Wide warm lantern point light that follows cursor contact point in 3D space
      torchPointLight = new THREE.PointLight(0xff9922, 10.0, 35, 1.3);
      scene.add(torchPointLight);
    }

    function buildStars() {
      const count = 2200;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        // High elevation celestial sphere angle (-2 deg up to 88 deg) for maximum night sky density
        const elevation = (-2 + Math.random() * 90) * (Math.PI / 180);
        const r = 50 + Math.random() * 60;
        const horizR = Math.cos(elevation) * r;
        positions[i * 3] = horizR * Math.cos(theta);
        positions[i * 3 + 1] = Math.sin(elevation) * r;
        positions[i * 3 + 2] = horizR * Math.sin(theta);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.38,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });

      starPoints = new THREE.Points(geo, mat);
      scene.add(starPoints);

      // Luminous shooting star / comet trail (gradient fading line)
      const lineGeo = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(6); // 2 vertices (head to tail)
      lineGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 2,
        depthWrite: false,
      });
      shootingStarMesh = new THREE.Line(lineGeo, lineMat);
      shootingStarMesh.frustumCulled = false;
      scene.add(shootingStarMesh);

      // Glowing comet head
      const headGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const headMat = new THREE.MeshBasicMaterial({
        color: 0xfffae0,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      shootingStarHead = new THREE.Mesh(headGeo, headMat);
      scene.add(shootingStarHead);
    }

    function buildEnvironment() {
      campfireGroup = new THREE.Group();
      campfireGroup.position.set(0, -2.8, 0);
      scene.add(campfireGroup);

      // Natural campsite ground beneath campfire that catches warm moonlight, firelight, and torch glow
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(42, 64),
        new THREE.MeshStandardMaterial({ color: 0x2a231b, roughness: 0.86 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.05;
      ground.receiveShadow = true;
      campfireGroup.add(ground);

      // Single seamless rocky mountain mesh with steep slopes and smooth rounded peak (no mushroom or floating seams)
      function createSharpMountainWithRoundedTip(baseRadius, height, color) {
        // High quality single-mesh cone with 5 height subdivisions
        const radialSegments = 7;
        const heightSegments = 5;
        const geo = new THREE.ConeGeometry(baseRadius, height, radialSegments, heightSegments);
        
        // Procedurally round the top vertex layers smoothly
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          const ratio = (y + height / 2) / height; // 0 (bottom) to 1 (peak)
          if (ratio > 0.82) {
            // Soften apex curvature on highest vertices
            const pullDown = (ratio - 0.82) * 0.35;
            pos.setY(i, y - pullDown);
          }
        }
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.88,
          flatShading: true,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = -2.8 + height / 2;
        return mesh;
      }

      // Distant low-profile mountain horizon in far backdrop (r: 36m to 48m)
      // +20% scale boost with rhythmic star valleys for an expansive ridge silhouette
      const mountainCount = 28;
      for (let i = 0; i < mountainCount; i++) {
        // Natural star gap valleys between peaks
        const isStarGap = (i % 5 === 0 || i === 14 || i === 23);
        if (isStarGap) continue;

        const angle = (i / mountainCount) * Math.PI * 2 + (Math.sin(i * 1.7) * 0.08);
        const isFar = (i % 2 === 0);
        const radius = isFar ? (44 + Math.sin(i * 3.1) * 3) : (36 + Math.cos(i * 2.5) * 3);
        // +20% scale boost: height 4.1m - 5.8m, baseRadius 8.4m - 10.8m
        const height = isFar ? (5.8 + Math.sin(i * 2.2) * 1.4) : (4.1 + Math.cos(i * 1.9) * 1.1);
        const baseRadius = isFar ? (10.8 + Math.sin(i * 1.5) * 1.8) : (8.4 + Math.cos(i * 2.1) * 1.4);
        const color = isFar ? 0x121b27 : 0x0c131d;
        const mesh = createSharpMountainWithRoundedTip(baseRadius, height, color);
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.rotation.y = (i * 1.3) % (Math.PI * 2);
        mesh.receiveShadow = true;
        scene.add(mesh);
        mountainMeshes.push(mesh);
      }

      // Compact alpine pine tree (layered conic foliage + slim trunk)
      function createPineTree(scale = 1.0, foliageColor = 0x16231c) {
        const treeGroup = new THREE.Group();
        
        // Brown/dark wood trunk
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1c130d, roughness: 0.95 });
        const trunkGeo = new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 1.0 * scale, 6);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.5 * scale;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // 3-tiered dark grey-green coniferous foliage
        const foliageMat = new THREE.MeshStandardMaterial({
          color: foliageColor,
          roughness: 0.85,
          flatShading: true,
        });

        const tiers = [
          { r: 0.75 * scale, h: 0.9 * scale, y: 0.9 * scale },
          { r: 0.58 * scale, h: 0.75 * scale, y: 1.4 * scale },
          { r: 0.38 * scale, h: 0.6 * scale, y: 1.8 * scale }
        ];

        tiers.forEach((t) => {
          const coneGeo = new THREE.ConeGeometry(t.r, t.h, 6, 2);
          const cone = new THREE.Mesh(coneGeo, foliageMat);
          cone.position.y = t.y;
          cone.castShadow = true;
          cone.receiveShadow = true;
          treeGroup.add(cone);
        });

        treeGroup.position.y = -2.8;
        return treeGroup;
      }

      // Distribute compact pine trees in low middle-ground tree-line (r: 15m to 20m)
      const treeCount = 20;
      const treeColors = [0x15221b, 0x111b15, 0x18261e, 0x0f1813];
      for (let i = 0; i < treeCount; i++) {
        const angle = (i / treeCount) * Math.PI * 2 + (Math.sin(i * 2.1) * 0.12);
        const radius = (i % 2 === 0 ? 15.5 : 19.0) + (Math.sin(i * 1.8) * 1.5);
        const treeScale = 0.75 + Math.sin(i * 3.4) * 0.2;
        const color = treeColors[i % treeColors.length];
        
        const tree = createPineTree(treeScale, color);
        tree.position.x = Math.cos(angle) * radius;
        tree.position.z = Math.sin(angle) * radius;
        tree.rotation.y = Math.sin(i * 1.5) * Math.PI * 2;
        scene.add(tree);
      }

      // Ambient sky & ground illumination so the campsite surface is naturally visible
      scene.add(new THREE.HemisphereLight(0x334460, 0x1c1712, 0.52));
      scene.add(new THREE.AmbientLight(0xffa844, 0.28));

      // Natural campfire glow casting warm radiance across the ground
      fireLight = new THREE.PointLight(0xff8515, 7.0, 28, 1.6);
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
      const fuel = fuelRef.current ? fuelRef.current.level : 0;
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * (0.30 + fuel * 0.45);
      p.pos.set(Math.cos(a) * r, 0.25 + Math.random() * 0.16, Math.sin(a) * r);
      
      const upVel = (1.3 + Math.random() * 0.9) * (1.0 + fuel * 1.8);
      p.vel.set(
        (Math.random() - 0.5) * (0.20 + fuel * 0.6) + windVector.x * 0.25,
        upVel,
        (Math.random() - 0.5) * (0.20 + fuel * 0.6) + windVector.z * 0.25
      );
      p.age = 0;
      p.life = (0.70 + Math.random() * 0.40) * (1.0 + fuel * 0.5);
      p.size = BASE_RADIUS * (0.8 + Math.random() * 0.55) * (1.0 + fuel * 1.4);
      p.alive = true;
    }

    function updateCursor3D() {
      raycaster.setFromCamera(mouse, camera);

      // Check if cursor intersects any mountain mesh first
      const mountainIntersects = mountainMeshes.length > 0 ? raycaster.intersectObjects(mountainMeshes, false) : [];

      if (mountainIntersects.length > 0) {
        const hit = mountainIntersects[0];
        cursor3D.copy(hit.point);
        
        if (torchSpotLight && torchTarget && torchPointLight) {
          torchSpotLight.position.copy(camera.position);
          torchTarget.position.copy(hit.point);
          // Position warm point light slightly outward along the surface normal
          const normalOffset = hit.face ? hit.face.normal.clone().multiplyScalar(0.8) : new THREE.Vector3(0, 0.5, 0);
          torchPointLight.position.copy(hit.point).add(normalOffset);
          torchPointLight.intensity = 16.0; // Boost local brightness when shining on mountain slopes
          torchPointLight.distance = 45;
        }
      } else {
        const hitGround = raycaster.ray.intersectPlane(groundPlane, cursor3D);
        if (!hitGround) {
          // If aiming upward at sky, cast flashlight beam far into the distance
          const farTarget = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(50));
          cursor3D.copy(farTarget);
        }

        // Flashlight spotlight and point light follow ground cursor
        if (torchSpotLight && torchTarget && torchPointLight) {
          torchSpotLight.position.copy(camera.position);
          torchTarget.position.copy(cursor3D);
          torchPointLight.position.copy(cursor3D).add(new THREE.Vector3(0, 0.5, 0));
          torchPointLight.intensity = 10.0;
          torchPointLight.distance = 35;
        }
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

      // Track mouse velocity and detect hard/fast wind gusts
      smoothVelocity += (mouseVelocity - smoothVelocity) * Math.min(dt * 6.0, 1.0);
      mouseVelocity *= Math.max(0, 1.0 - dt * 3.5); // Natural velocity decay

      // Hard movement threshold: requires intentional fast swipe across screen (> 3.5 normalized units/sec)
      if (smoothVelocity > 3.5) {
        const gustForce = Math.min((smoothVelocity - 3.5) * 0.35, 1.0);
        gustSuppression = Math.min(1.0, gustSuppression + dt * 3.5 * (1.0 + gustForce));
      } else {
        // Smoothly recover back to baseline standard campfire height (no auto-explosion)
        gustSuppression = Math.max(0, gustSuppression - dt * 2.0);
      }

      // Decay fuel level smoothly over ~1.8 seconds back to normal (ONLY triggered by Fuel button)
      let fuel = 0;
      if (fuelRef.current) {
        if (fuelRef.current.level > 0) {
          fuelRef.current.level = Math.max(0, fuelRef.current.level - dt * 0.58);
        }
        fuel = fuelRef.current.level;
      }

      // During hard gust suppression, flame compresses and bends; during fuel button burst, emit up to 4x more particles
      const flameScaleFactor = Math.max(0.38, 1.0 - gustSuppression * 0.62) * (1.0 + fuel * 0.35);
      const currentEmitCount = Math.floor(Math.max(1, EMIT_PER_FRAME * (1.0 - gustSuppression * 0.45) + fuel * 9));
      for (let n = 0; n < currentEmitCount; n++) {
        const dead = particles.find((p) => !p.alive);
        if (dead) spawnParticle(dead);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.alive) continue;

        // Apply horizontal gust deflection during hard movement
        const windBoost = 1.0 + gustSuppression * 2.2;
        p.vel.x += windVector.x * dt * 2.0 * windBoost;
        p.vel.z += windVector.z * dt * 2.0 * windBoost;
        p.vel.y += BUOYANCY * dt * (1.0 + fuel * 0.8) * flameScaleFactor;

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
        const scale = p.size * growIn * shrinkOut * (1 + t * 0.4) * flameScaleFactor;

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
        const baseIntensity = 5.5 + Math.sin(time * 9 + flickerSeed) * 1.2 + Math.sin(time * 23.7) * 0.5 + (Math.random() - 0.5) * 0.5;
        const gustDimming = 1.0 - gustSuppression * 0.5;
        fireLight.intensity = (baseIntensity * gustDimming) + fuel * 28.0;
        fireLight.distance = (28 * (0.65 + gustDimming * 0.35)) + fuel * 32.0;
        fireLight.position.x = Math.sin(time * 1.7) * 0.08 + windVector.x * gustSuppression * 0.2;
        fireLight.position.z = Math.cos(time * 1.3) * 0.08 + windVector.z * gustSuppression * 0.2;
      }
    }

    function onResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerMove(e) {
      const now = performance.now();
      const newX = (e.clientX / window.innerWidth) * 2 - 1;
      const newY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!hasPointerMoved) {
        hasPointerMoved = true;
        lastMousePos.x = newX;
        lastMousePos.y = newY;
        lastMouseTime = now;
        mouse.x = newX;
        mouse.y = newY;
        return;
      }

      const dt = Math.max((now - lastMouseTime) / 1000, 0.005);
      const dx = newX - lastMousePos.x;
      const dy = newY - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const instantVelocity = dist / dt;

      // Only register velocity if cursor is actually in motion
      if (dist > 0.005) {
        mouseVelocity = Math.max(mouseVelocity * 0.6, instantVelocity);
      }

      lastMousePos.x = newX;
      lastMousePos.y = newY;
      lastMouseTime = now;

      mouse.x = newX;
      mouse.y = newY;
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

    function updateShootingStars(dt, time) {
      if (!shootingStarMesh || !shootingStarHead) return;

      // Spawn a new shooting star / comet when timer expires
      if (!shootingStar && time >= nextShootingStarTime) {
        // Pick a random sky origin high in the atmosphere
        const angle = Math.random() * Math.PI * 2;
        const dist = 38 + Math.random() * 25;
        const startY = 18 + Math.random() * 16;
        const startX = Math.cos(angle) * dist;
        const startZ = Math.sin(angle) * dist;

        // Trajectory: diagonal swift streak across sky with downward slope
        const dirAngle = angle + Math.PI * 0.75 + (Math.random() - 0.5) * 0.5;
        const speed = 42 + Math.random() * 24; // Fast shooting star speed
        const vel = new THREE.Vector3(
          Math.cos(dirAngle) * speed,
          -(8 + Math.random() * 12),
          Math.sin(dirAngle) * speed
        );

        shootingStar = {
          pos: new THREE.Vector3(startX, startY, startZ),
          vel: vel,
          tailLength: 7.5 + Math.random() * 4.5,
          age: 0,
          life: 0.65 + Math.random() * 0.45, // Lasts 0.65 - 1.1 seconds
        };
      }

      if (shootingStar) {
        shootingStar.age += dt;
        const progress = shootingStar.age / shootingStar.life;

        if (progress >= 1.0) {
          // Reset shooting star and schedule next one (every 5 to 11 seconds)
          shootingStar = null;
          nextShootingStarTime = time + 5.0 + Math.random() * 6.5;
          shootingStarMesh.material.opacity = 0;
          shootingStarHead.material.opacity = 0;
          shootingStarHead.position.set(0, -100, 0);
          return;
        }

        // Advance head position
        shootingStar.pos.addScaledVector(shootingStar.vel, dt);

        // Calculate tail position trailing behind
        const velNorm = shootingStar.vel.clone().normalize();
        const tailPos = shootingStar.pos.clone().sub(velNorm.multiplyScalar(shootingStar.tailLength));

        // Update line geometry buffer (head to tail)
        const posAttr = shootingStarMesh.geometry.attributes.position;
        posAttr.setXYZ(0, shootingStar.pos.x, shootingStar.pos.y, shootingStar.pos.z);
        posAttr.setXYZ(1, tailPos.x, tailPos.y, tailPos.z);
        posAttr.needsUpdate = true;

        // Fade in rapidly and fade out smoothly
        const fadeIn = Math.min(progress / 0.15, 1.0);
        const fadeOut = 1.0 - Math.max((progress - 0.6) / 0.4, 0);
        const alpha = fadeIn * fadeOut * 0.92;

        shootingStarMesh.material.opacity = alpha;
        shootingStarHead.material.opacity = alpha;
        shootingStarHead.position.copy(shootingStar.pos);
        shootingStarHead.scale.setScalar(0.7 + fadeIn * 0.6);
      }
    }

    function animate(currentTime = performance.now()) {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      elapsedTime += dt;

      // Smooth cinematic camera orbit around campsite (low camera height y: 0.85m framed to look across the fire into the starry sky)
      const orbitR = 10.5;
      camera.position.x = Math.sin(elapsedTime * 0.045) * orbitR;
      camera.position.z = Math.cos(elapsedTime * 0.045) * orbitR;
      camera.position.y = 0.85 + Math.sin(elapsedTime * 0.06) * 0.15;
      camera.lookAt(0, -1.4, 0);

      // Rotate stars slowly
      if (starPoints) {
        starPoints.rotation.y = elapsedTime * 0.008;
      }

      updateFire(dt, elapsedTime);
      updateShootingStars(dt, elapsedTime);

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
