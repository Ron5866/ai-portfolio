import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RibbonGlobeMeshProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  isMobile: boolean;
}

const RibbonGlobeMesh = ({ mousePosition, scrollProgress, isMobile }: RibbonGlobeMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  // Create ribbon bands data with blue → purple gradient
  const ribbons = useMemo(() => {
    const numRibbons = isMobile ? 6 : 10;
    return Array.from({ length: numRibbons }).map((_, i) => {
      const t = i / (numRibbons - 1);
      // Blue to purple gradient
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#3b82f6'), // Blue
        new THREE.Color('#a855f7'), // Purple
        t
      );
      
      return {
        radius: 1.4 + (i * 0.08),
        tubeRadius: 0.04 + Math.random() * 0.02,
        rotation: [
          (Math.random() - 0.5) * Math.PI * 0.6,
          (Math.random() - 0.5) * Math.PI * 0.8,
          (Math.random() - 0.5) * Math.PI * 0.4,
        ] as [number, number, number],
        color: color,
        opacity: 0.6 + Math.random() * 0.3,
        arc: Math.PI * (0.4 + Math.random() * 0.4), // Partial arc for ribbon effect
        arcOffset: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
      };
    });
  }, [isMobile]);

  // Create starfield
  const stars = useMemo(() => {
    const numStars = isMobile ? 40 : 80;
    return Array.from({ length: numStars }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8 - 5
      ),
      size: 0.015 + Math.random() * 0.025,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, [isMobile]);

  // Animation with scroll-controlled rotation and mouse parallax
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Base slow rotation + scroll-controlled speed boost
    const baseSpeed = 0.002;
    const scrollBoost = scrollProgress * 0.01;
    
    // Mouse parallax
    targetRotation.current.x = mousePosition.y * 0.2;
    targetRotation.current.y = mousePosition.x * 0.3;
    
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.y += baseSpeed + scrollBoost;
    
    // Subtle vertical drift
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.1;
    
    // Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.003;
      coreRef.current.rotation.x += 0.001;
    }
    
    // Glow pulse based on mouse proximity
    if (glowRef.current) {
      const mouseDist = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
      const glowIntensity = 0.15 + (1 - Math.min(mouseDist, 1)) * 0.15;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowIntensity;
    }
  });

  // Create curved ribbon geometry
  const createRibbonGeometry = (radius: number, arc: number, offset: number, tubeRadius: number) => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 20 }).map((_, i) => {
        const angle = offset + (i / 19) * arc;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.5) * 0.3, // Slight wave
          Math.sin(angle) * radius
        );
      }),
      false,
      'catmullrom',
      0.5
    );
    return new THREE.TubeGeometry(curve, isMobile ? 20 : 32, tubeRadius, 8, false);
  };

  return (
    <group ref={groupRef}>
      {/* Starfield background */}
      {stars.map((star, i) => (
        <mesh key={`star-${i}`} position={star.position}>
          <sphereGeometry args={[star.size, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={star.opacity} />
        </mesh>
      ))}
      
      {/* Dark glossy core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.0, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
        <meshStandardMaterial
          color="#0a0a1a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Core inner glow */}
      <mesh>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshBasicMaterial
          color="#1e1b4b"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Mouse-proximity glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Glass-material ribbon bands */}
      {ribbons.map((ribbon, index) => (
        <group key={index} rotation={ribbon.rotation}>
          <mesh geometry={createRibbonGeometry(ribbon.radius, ribbon.arc, ribbon.arcOffset, ribbon.tubeRadius)}>
            <meshPhysicalMaterial
              color={ribbon.color}
              metalness={0.1}
              roughness={0.1}
              transparent
              opacity={ribbon.opacity}
              transmission={0.4}
              thickness={0.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1}
            />
          </mesh>
          
          {/* Ribbon edge glow */}
          <mesh geometry={createRibbonGeometry(ribbon.radius, ribbon.arc, ribbon.arcOffset, ribbon.tubeRadius * 1.3)}>
            <meshBasicMaterial
              color={ribbon.color}
              transparent
              opacity={0.1}
            />
          </mesh>
        </group>
      ))}
      
      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const RibbonGlobe = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (event.clientX - centerX) / (rect.width / 2);
        const y = (event.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({ 
          x: Math.max(-1, Math.min(1, x)), 
          y: Math.max(-1, Math.min(1, y)) 
        });
      }
    };

    // Scroll handler for rotation speed control
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] lg:min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#e0e7ff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#c4b5fd" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#818cf8" />
        <pointLight position={[2, 2, 2]} intensity={0.4} color="#a78bfa" />
        <RibbonGlobeMesh 
          mousePosition={mousePosition} 
          scrollProgress={scrollProgress}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};

export default RibbonGlobe;