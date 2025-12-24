import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Generate icosahedron vertices and edges for neural network effect
const generateNetworkGeometry = () => {
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const positions = geometry.attributes.position.array;
  const vertices: THREE.Vector3[] = [];
  
  // Extract unique vertices
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const exists = vertices.some(v => v.distanceTo(vertex) < 0.01);
    if (!exists) vertices.push(vertex);
  }
  
  // Generate edges between nearby vertices
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dist = vertices[i].distanceTo(vertices[j]);
      if (dist < 1.8) {
        edges.push([vertices[i], vertices[j]]);
      }
    }
  }
  
  return { vertices, edges };
};

interface NetworkMeshProps {
  mousePosition: { x: number; y: number };
}

const NetworkMesh = ({ mousePosition }: NetworkMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { vertices, edges } = useMemo(() => generateNetworkGeometry(), []);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  // Create line geometry for edges
  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    edges.forEach(([start, end]) => {
      points.push(start.x, start.y, start.z);
      points.push(end.x, end.y, end.z);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [edges]);
  
  // Smooth rotation animation with mouse parallax
  useFrame((state) => {
    if (groupRef.current) {
      // Calculate target rotation based on mouse position
      targetRotation.current.x = mousePosition.y * 0.3;
      targetRotation.current.y = mousePosition.x * 0.3;
      
      // Smooth interpolation for mouse-driven rotation
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
      
      // Add subtle continuous rotation
      groupRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Glowing edges/lines */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial 
            color="#60a5fa" 
            transparent 
            opacity={0.6}
            linewidth={1}
          />
        </lineSegments>
        
        {/* Glowing nodes at vertices */}
        {vertices.map((vertex, index) => (
          <mesh key={index} position={[vertex.x, vertex.y, vertex.z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial 
              color="#3b82f6" 
              transparent 
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Outer glow spheres for nodes */}
        {vertices.map((vertex, index) => (
          <mesh key={`glow-${index}`} position={[vertex.x, vertex.y, vertex.z]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial 
              color="#60a5fa" 
              transparent 
              opacity={0.2}
            />
          </mesh>
        ))}
        
        {/* Wireframe icosahedron for structure */}
        <mesh>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial 
            color="#1e40af" 
            wireframe 
            transparent 
            opacity={0.15}
          />
        </mesh>
      </group>
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
        
        // Normalize mouse position relative to center (-1 to 1)
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
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <NetworkMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork3D;
