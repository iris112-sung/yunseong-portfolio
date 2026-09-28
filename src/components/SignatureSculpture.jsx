import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export default function SignatureSculpture({ reduced, onReady }) {
  const host = useRef(null);
  const readyRef = useRef(onReady);
  const [failed, setFailed] = useState(false);
  readyRef.current = onReady;

  useEffect(() => {
    const element = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); readyRef.current(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setClearColor(0x100e15, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(environment, 0.04);
    scene.environment = envTarget.texture;
    const geometry = new THREE.TorusKnotGeometry(2.05, 0.48, 240, 28, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc2aecf, metalness: 1, roughness: 0.19,
      iridescence: 0.8, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 380],
      clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 2.2
    });
    const sculpture = new THREE.Mesh(geometry, material);
    sculpture.rotation.set(0.45, 0.1, -0.3);
    scene.add(sculpture);
    const key = new THREE.DirectionalLight(0xe4ceff, 5);
    key.position.set(4, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xbaaaff, 4);
    rim.position.set(-4, -2, 1); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xa9efe4, 2);
    fill.position.set(0, 4, -4); scene.add(fill);
    const pointer = { x: 0, y: 0 };
    let visible = true, frame = 0, last = 0, elapsed = 0;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = 12 / Math.min(1, camera.aspect);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const move = e => {
      const bounds = element.getBoundingClientRect();
      pointer.x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 0.5;
      pointer.y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 0.3;
    };
    const tick = time => {
      frame = 0;
      if (!visible || document.hidden) return;
      const delta = Math.min((time - last) / 1000 || 0, 0.05); last = time;
      if (!reduced) {
        elapsed += delta;
        sculpture.rotation.y = elapsed * 0.16 + pointer.x;
        sculpture.rotation.x = 0.45 + Math.sin(elapsed * 0.24) * 0.13 + pointer.y;
        sculpture.rotation.z = -0.3 + Math.sin(elapsed * 0.18) * 0.1;
      }
      renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); } };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); });
    observer.observe(element);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element);
    element.addEventListener('pointermove', move);
    document.addEventListener('visibilitychange', wake);
    resize(); wake();
    element.dataset.ready = 'true';
    readyRef.current();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      element.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', wake);
      geometry.dispose(); material.dispose(); envTarget.dispose(); environment.dispose(); pmrem.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [reduced]);
  return <div className="signature-sculpture" ref={host} aria-hidden="true">{failed && <span className="sculpture-fallback">YB</span>}</div>;
}
