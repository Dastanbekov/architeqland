'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeJsAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Colors
    const primaryColor = new THREE.Color('#6366f1');

    // Grid / Architecture Base
    const gridHelper = new THREE.GridHelper(20, 20, 0xdddddd, 0xeeeeee);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Agents
    const agents: THREE.Mesh[] = [];
    const agentGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const agentMaterial = new THREE.MeshPhongMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < 4; i++) {
      const agent = new THREE.Mesh(agentGeometry, agentMaterial);
      agent.position.set(Math.random() * 6 - 3, 1, Math.random() * 6 - 3);
      agent.userData = {
        target: new THREE.Vector3(Math.random() * 6 - 3, 1, Math.random() * 6 - 3),
        speed: 0.02 + Math.random() * 0.02,
      };
      scene.add(agent);
      agents.push(agent);
    }

    // Architectural Blocks
    const blocks: THREE.Mesh[] = [];
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const blockMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });

    function createBlock(pos: THREE.Vector3) {
      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.copy(pos);
      block.scale.set(0.1, 0.1, 0.1);
      scene.add(block);
      blocks.push(block);
      return block;
    }

    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);

    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      agents.forEach((agent) => {
        agent.position.lerp(agent.userData.target, agent.userData.speed);

        (agent.material as THREE.MeshPhongMaterial).emissiveIntensity =
          0.5 + Math.sin(time * 4) * 0.3;

        if (agent.position.distanceTo(agent.userData.target) < 0.2) {
          if (Math.random() > 0.7 && blocks.length < 15) {
            createBlock(agent.position.clone().floor());
          }
          agent.userData.target.set(Math.random() * 8 - 4, 1, Math.random() * 8 - 4);
        }
      });

      blocks.forEach((block) => {
        if (block.scale.x < 1) {
          block.scale.addScalar(0.01);
        }
        block.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      agentGeometry.dispose();
      agentMaterial.dispose();
      blockGeometry.dispose();
      blockMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
