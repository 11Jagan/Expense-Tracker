import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    const materials = {
      coin: new THREE.MeshBasicMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.4, wireframe: true }),
      wallet: new THREE.MeshBasicMaterial({ color: 0x2196F3, transparent: true, opacity: 0.4, wireframe: true }),
      card: new THREE.MeshBasicMaterial({ color: 0xF44336, transparent: true, opacity: 0.4, wireframe: true }),
      graph: new THREE.MeshBasicMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.35, wireframe: true })
    };

    const objects = [];
    const objectCount = 25;
    
    for (let i = 0; i < objectCount; i++) {
      let geometry, material;
      const type = i % 4;
      
      switch (type) {
        case 0: // Coin
          geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 6);
          material = materials.coin;
          break;
        case 1: // Wallet
          geometry = new THREE.BoxGeometry(0.7, 0.45, 0.12);
          material = materials.wallet;
          break;
        case 2: // Card
          geometry = new THREE.PlaneGeometry(0.9, 0.55);
          material = materials.card;
          break;
        default: // Graph
          geometry = new THREE.ConeGeometry(0.35, 0.7, 4);
          material = materials.graph;
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Distributed positioning to avoid UI areas
      const angle = (i / objectCount) * Math.PI * 2;
      const radius = 12 + Math.random() * 8;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = (Math.random() - 0.5) * 12;
      mesh.position.z = -5 - Math.random() * 15;
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      mesh.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005, z: (Math.random() - 0.5) * 0.005 },
        floatSpeed: Math.random() * 0.008 + 0.003,
        initialY: mesh.position.y,
        floatRange: 0.8 + Math.random() * 0.4
      };
      
      scene.add(mesh);
      objects.push(mesh);
    }

    camera.position.set(0, 0, 5);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rotSpeed.x;
        obj.rotation.y += obj.userData.rotSpeed.y;
        obj.rotation.z += obj.userData.rotSpeed.z;
        
        obj.position.y = obj.userData.initialY + Math.sin(time * obj.userData.floatSpeed) * obj.userData.floatRange;
      });
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-50 pointer-events-none" />;
};

export default AnimatedBackground;