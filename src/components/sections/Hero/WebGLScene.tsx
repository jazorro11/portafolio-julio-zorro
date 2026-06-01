'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Subtle mouse distortion
    vec2 mouse = uMouse - 0.5;
    uv += mouse * 0.08 * (1.0 - length(uv));

    float t = uTime * 0.12;

    float n1 = fbm(uv * 2.8 + vec2(t, t * 0.6));
    float n2 = fbm(uv * 4.5 - vec2(t * 0.4, t * 0.25) + n1 * 0.7);
    float n3 = fbm(uv * 7.0 + n2 * 0.5 + vec2(t * 0.2));

    // Palette: #090d09 dark → #3a5a2a moss → #7aad5e lichen
    vec3 dark   = vec3(0.035, 0.051, 0.035);
    vec3 moss   = vec3(0.227, 0.353, 0.165);
    vec3 lichen = vec3(0.478, 0.678, 0.369);

    vec3 color = mix(dark, moss,   smoothstep(0.28, 0.55, n1));
    color      = mix(color, lichen, smoothstep(0.55, 0.85, n2) * 0.55);
    color      = mix(color, dark,   smoothstep(0.75, 1.0,  n3) * 0.3);

    // Radial vignette
    float vignette = 1.0 - smoothstep(0.4, 1.3, length(uv * 1.1));
    color *= vignette;

    // Breathing pulse: ±3% amplitude over ~6s
    float pulse = 1.0 + 0.03 * sin(uTime * 1.05);
    color *= pulse;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function WebGLScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x090d09, 1);
    el.appendChild(renderer.domElement);

    const uniforms = {
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onMouse = (e: MouseEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      uniforms.uResolution.value.set(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf: number;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      material.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
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
