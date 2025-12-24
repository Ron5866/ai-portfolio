import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Generate sphere points with connections
const generateSphereNetwork = () => {
  const points: THREE.Vector3[] = [];
  const connections: [number, number][] = [];
  
  // Create points on a sphere using fibonacci sphere distribution
  const numPoints = 120;
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  
  for (let i = 0; i < numPoints; i++) {
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    
    const radius = 2;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    points.push(new THREE.Vector3(x, y, z));
  }
  
  // Create connections between nearby points
  const maxDistance = 1.2;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = points[i].distanceTo(points[j]);
      if (distance < maxDistance && Math.random() > 0.3) {
        connections.push([i, j]);
      }
    }
  }
  
  return { points, connections };
};

interface NetworkMeshProps {
  mousePosition: { x: number; y: number };
}

const NetworkMesh = ({ mousePosition }: NetworkMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { points, connections } = useMemo(() => generateSphereNetwork(), []);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    connections.forEach(([i, j]) => {
      positions.push(points[i].x, points[i].y, points[i].z);
      positions.push(points[j].x, points[j].y, points[j].z);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [points, connections]);
  
  // Smooth rotation animation with mouse parallax
  useFrame((state) => {
    if (groupRef.current) {
      targetRotation.current.x = mousePosition.y * 0.2;
      targetRotation.current.y = mousePosition.x * 0.3;
      
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.y += 0.002;
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.001;
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Inner glow sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#1e90ff"
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Core glow */}
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Connection lines */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.4}
          />
        </lineSegments>
        
        {/* Nodes - bright glowing points */}
        {points.map((point, i) => (
          <mesh key={i} position={point}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        
        {/* Larger glowing nodes at key positions */}
        {points.filter((_, i) => i % 8 === 0).map((point, i) => (
          <mesh key={`glow-${i}`} position={point}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
        ))}
        
        {/* Orbital ring 1 */}
        <mesh rotation={[Math.PI / 6, 0, Math.PI / 12]}>
          <torusGeometry args={[2.8, 0.015, 16, 100, Math.PI * 1.3]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
        </mesh>
        
        {/* Orbital ring 2 */}
        <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[2.6, 0.012, 16, 100, Math.PI * 0.8]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
        </mesh>
      </group>
      
      {/* Base glow effect */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial
          color="#1e90ff"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Base glow ring */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.2, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
};

const NeuralNetwork3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (event.clientX - centerX) / (rect.width / 2);
        const y = (event.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] lg:min-h-[420px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#60a5fa" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        <NetworkMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork3D;
