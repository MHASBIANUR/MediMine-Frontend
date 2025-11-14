"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function HospitalModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Human.glb");

  useFrame((_, delta) => {
    if (group.current) {
      // Rotasi pelan
      group.current.rotation.y += delta * 0.15;
      // Napas kecil / getaran halus
      const s = 0.6 + Math.sin(Date.now() * 0.001) * 0.01;
      group.current.scale.set(s, s, s);
    }
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={0.6}
      position={[0, -55.0, 0]}
    />
  );
}

export default function AnimatedHeart3D() {
  return (
    <div className="w-full h-100 md:h-112 flex items-center justify-center">
      <Canvas camera={{ position: [10, 10, 135], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
        <HospitalModel />
      </Canvas>
    </div>
  );
}
