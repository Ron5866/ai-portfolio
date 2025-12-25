import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpiralProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

const Spiral = ({ scrollProgress, mousePosition }: SpiralProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions, colors } = useMemo(() => {
    const arms = 4;
    const pointsPerArm = 200;
    const totalPoints = arms * pointsPerArm;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);
    const linePositions: number[] = [];

    const colorA = new THREE.Color('#6366f1');
    const colorB = new THREE.Color('#8b5cf6');
    const colorC = new THREE.Color('#06b6d4');

    for (let arm = 0; arm < arms; arm++) {
      const armOffset = (arm / arms) * Math.PI * 2;

      for (let i = 0; i < pointsPerArm; i++) {
        const index = (arm * pointsPerArm + i) * 3;
        const t = i / pointsPerArm;
        const radius = t * 2.5 + 0.3;
        const angle = armOffset + t * Math.PI * 3;

        // Add some organic variation
        const wobble = Math.sin(t * 10 + arm) * 0.1;
        const heightVar = Math.sin(t * 5 + arm * 2) * 0.15;

        positions[index] = Math.cos(angle) * radius + wobble;
        positions[index + 1] = heightVar;
        positions[index + 2] = Math.sin(angle) * radius + wobble;

        // Color gradient from center to edge
        const color = new THREE.Color();
        if (t < 0.5) {
          color.lerpColors(colorA, colorB, t * 2);
        } else {
          color.lerpColors(colorB, colorC, (t - 0.5) * 2);
        }
        colors[index] = color.r;
        colors[index + 1] = color.g;
        colors[index + 2] = color.b;

        // Connect nearby points with lines
        if (i > 0 && i % 3 === 0) {
          const prevIndex = (arm * pointsPerArm + i - 3) * 3;
          linePositions.push(
            positions[prevIndex], positions[prevIndex + 1], positions[prevIndex + 2],
            positions[index], positions[index + 1], positions[index + 2]
          );
        }
      }
    }

    return { 
      positions, 
      linePositions: new Float32Array(linePositions), 
      colors 
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation + scroll influence
      const baseSpeed = 0.003;
      const scrollSpeed = scrollProgress * 0.01;
      groupRef.current.rotation.y += baseSpeed + scrollSpeed;
      
      // Mouse influence
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.3,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mousePosition.x * 0.1,
        0.05
      );
    }

    // Animate point sizes
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.size = 0.04 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main spiral points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connecting lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>

      {/* Outer ring accents */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 3) * Math.PI]}>
          <torusGeometry args={[2 + i * 0.3, 0.01, 8, 64]} />
          <meshBasicMaterial 
            color="#06b6d4" 
            transparent 
            opacity={0.15 - i * 0.04} 
          />
        </mesh>
      ))}
    </group>
  );
};

const SpiralGalaxy = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <Spiral scrollProgress={scrollProgress} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default SpiralGalaxy;
