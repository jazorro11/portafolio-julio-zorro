'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Particle field — Deep Space Amber colors
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Deep Space Amber: #FF8C42 and #3B82F6
    const amber = new THREE.Color('#FF8C42');
    const blue  = new THREE.Color('#3B82F6');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Mix: mostly white/dim, some amber, few blue
      const r = Math.random();
      const c = r < 0.05 ? amber : r < 0.12 ? blue : white;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular sprite texture — avoids square default
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 32;
    spriteCanvas.height = 32;
    const ctx = spriteCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.001,
      depthWrite: false,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Resize handler
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.0008;
      particles.rotation.y = t + mouseX;
      particles.rotation.x = mouseY * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden
    />
  );
}
