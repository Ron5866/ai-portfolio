import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface EarthMeshProps {
  mousePosition: { x: number; y: number };
}

const EarthMesh = ({ mousePosition }: EarthMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  // Create orbital rings data
  const rings = useMemo(() => [
    { radius: 2.4, thickness: 0.08, rotation: [0.3, 0, 0.2], opacity: 0.9, color: '#e8d5c4' },
    { radius: 2.6, thickness: 0.06, rotation: [0.5, 0.3, -0.1], opacity: 0.7, color: '#d4c4b5' },
    { radius: 2.2, thickness: 0.05, rotation: [-0.2, 0.5, 0.3], opacity: 0.6, color: '#c9b8a8' },
    { radius: 2.8, thickness: 0.04, rotation: [0.1, -0.2, 0.4], opacity: 0.5, color: '#bfae9e' },
    { radius: 3.0, thickness: 0.035, rotation: [-0.4, 0.1, -0.2], opacity: 0.4, color: '#f0e6dc' },
  ], []);

  // Create scattered dots/particles around rings
  const ringParticles = useMemo(() => {
    const particles: { position: THREE.Vector3; size: number }[] = [];
    
    rings.forEach(ring => {
      const numParticles = 20;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + Math.random() * 0.5;
        const radiusOffset = (Math.random() - 0.5) * 0.3;
        const r = ring.radius + radiusOffset;
        
        const x = Math.cos(angle) * r;
        const y = (Math.random() - 0.5) * 0.2;
        const z = Math.sin(angle) * r;
        
        particles.push({
          position: new THREE.Vector3(x, y, z),
          size: 0.02 + Math.random() * 0.03
        });
      }
    });
    
    return particles;
  }, [rings]);
  
  // Smooth rotation animation with mouse parallax
  useFrame((state) => {
    if (groupRef.current) {
      targetRotation.current.x = mousePosition.y * 0.3;
      targetRotation.current.y = mousePosition.x * 0.4;
      
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.y += 0.003;
    }
    
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
      <group ref={groupRef}>
        {/* Main Earth sphere - gradient from blue to brown/tan */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <meshStandardMaterial
            color="#2a5a8a"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Earth gradient overlay - upper half lighter */}
        <mesh>
          <sphereGeometry args={[1.61, 64, 64]} />
          <shaderMaterial
            transparent
            uniforms={{
              colorTop: { value: new THREE.Color('#8b7355') },
              colorBottom: { value: new THREE.Color('#1a4a6e') },
            }}
            vertexShader={`
              varying vec3 vPosition;
              void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 colorTop;
              uniform vec3 colorBottom;
              varying vec3 vPosition;
              void main() {
                float gradient = (vPosition.y + 1.6) / 3.2;
                vec3 color = mix(colorBottom, colorTop, gradient);
                gl_FragColor = vec4(color, 0.6);
              }
            `}
          />
        </mesh>
        
        {/* Atmospheric glow */}
        <mesh>
          <sphereGeometry args={[1.75, 32, 32]} />
          <meshBasicMaterial
            color="#4a7ca8"
            transparent
            opacity={0.1}
          />
        </mesh>
        
        {/* Orbital rings with holes/segments */}
        {rings.map((ring, index) => (
          <group key={index} rotation={ring.rotation as [number, number, number]}>
            {/* Main ring */}
            <mesh>
              <torusGeometry args={[ring.radius, ring.thickness, 16, 100]} />
              <meshStandardMaterial
                color={ring.color}
                metalness={0.4}
                roughness={0.3}
                transparent
                opacity={ring.opacity}
              />
            </mesh>
            
            {/* Ring holes/cutouts - small dark spheres to create hole effect */}
            {Array.from({ length: 8 + index * 2 }).map((_, i) => {
              const angle = (i / (8 + index * 2)) * Math.PI * 2;
              const x = Math.cos(angle) * ring.radius;
              const z = Math.sin(angle) * ring.radius;
              return (
                <mesh key={i} position={[x, 0, z]}>
                  <sphereGeometry args={[ring.thickness * 1.5, 8, 8]} />
                  <meshBasicMaterial color="#0a1628" />
                </mesh>
              );
            })}
          </group>
        ))}
        
        {/* Scattered particles around rings */}
        {ringParticles.map((particle, i) => (
          <mesh key={i} position={particle.position}>
            <sphereGeometry args={[particle.size, 6, 6]} />
            <meshBasicMaterial color="#f5ebe0" transparent opacity={0.7} />
          </mesh>
        ))}
        
        {/* Inner glow core */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
      
      {/* Floating stars/particles in background */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 12;
        const y = (Math.random() - 0.5) * 12;
        const z = (Math.random() - 0.5) * 8 - 4;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.02, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4 + Math.random() * 0.4} />
          </mesh>
        );
      })}
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
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#4a7ca8" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#60a5fa" />
        <EarthMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork3D;
