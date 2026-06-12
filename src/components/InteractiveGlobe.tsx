import { useRef, useMemo, useEffect, useState, Component, ReactNode, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ---------- Error Boundary ---------- */
class GlobeErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[InteractiveGlobe] Render failed:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-primary/10 blur-2xl" />
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------- Globe dots on sphere ---------- */
const GlobeDots = () => {
  const { positions, colors } = useMemo(() => {
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color('#22d3ee');
    const blue = new THREE.Color('#3b82f6');
    const radius = 2;

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = Math.random() > 0.7 ? cyan : blue;
      const dim = 0.5 + Math.random() * 0.5;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

/* ---------- Latitude wireframe lines ---------- */
const GlobeGrid = () => {
  const lines = useMemo(() => {
    const group: { points: THREE.Vector3[] }[] = [];
    const radius = 2;
    // latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      const r = radius * Math.cos((lat * Math.PI) / 180);
      const y = radius * Math.sin((lat * Math.PI) / 180);
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      group.push({ points });
    }
    // longitude rings
    for (let lon = 0; lon < 180; lon += 30) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const v = new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
        v.applyAxisAngle(new THREE.Vector3(0, 1, 0), (lon * Math.PI) / 180);
        points.push(v);
      }
      group.push({ points });
    }
    return group;
  }, []);

  return (
    <group>
      {lines.map((l, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(l.points);
        return (
          <primitive
            key={i}
            object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#1e6fb8', transparent: true, opacity: 0.18 }))}
          />
        );
      })}
    </group>
  );
};

/* ---------- Arc connections ---------- */
const Arcs = () => {
  const arcsRef = useRef<THREE.Group>(null);

  const arcs = useMemo(() => {
    const radius = 2;
    const result: { curve: THREE.QuadraticBezierCurve3; color: string }[] = [];
    const colors = ['#22d3ee', '#60a5fa', '#38bdf8', '#818cf8'];
    const randPoint = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };
    for (let i = 0; i < 10; i++) {
      const start = randPoint();
      const end = randPoint();
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.45);
      result.push({
        curve: new THREE.QuadraticBezierCurve3(start, mid, end),
        color: colors[i % colors.length],
      });
    }
    return result;
  }, []);

  return (
    <group ref={arcsRef}>
      {arcs.map((arc, i) => (
        <mesh key={i}>
          <tubeGeometry args={[arc.curve, 40, 0.008, 6, false]} />
          <meshBasicMaterial color={arc.color} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      {arcs.map((arc, i) => {
        const p = arc.curve.getPoint(0);
        return (
          <mesh key={`p-${i}`} position={p}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={arc.color} transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};

/* ---------- Atmosphere glow shader ---------- */
const Atmosphere = () => (
  <mesh scale={1.18}>
    <sphereGeometry args={[2, 48, 48]} />
    <shaderMaterial
      transparent
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      uniforms={{ glowColor: { value: new THREE.Color('#22d3ee') } }}
      vertexShader={`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, -1.0)), 3.0);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;
        }
      `}
    />
  </mesh>
);

/* ---------- Ambient floating particles ---------- */
const Particles = () => {
  const positions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#7dd3fc" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

/* ---------- Rotating globe group ---------- */
const GlobeGroup = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0022;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.25, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.x * 0.08, 0.04);
  });

  return (
    <group ref={groupRef}>
      {/* Core dark sphere so back dots are occluded */}
      <mesh>
        <sphereGeometry args={[1.96, 48, 48]} />
        <meshStandardMaterial color="#06121f" metalness={0.2} roughness={0.9} transparent opacity={0.95} />
      </mesh>
      <GlobeDots />
      <GlobeGrid />
      <Arcs />
      <Atmosphere />
    </group>
  );
};

/* ---------- Main component ---------- */
const InteractiveGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    // Verify WebGL availability before mounting Canvas
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        console.error('[InteractiveGlobe] WebGL context unavailable');
        setWebglOk(false);
      }
    } catch (e) {
      console.error('[InteractiveGlobe] WebGL check failed:', e);
      setWebglOk(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!webglOk) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-primary/10 blur-2xl" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <GlobeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 3, 5]} intensity={1} color="#60a5fa" />
            <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#22d3ee" />
            <GlobeGroup mouse={mouse} />
            <Particles />
          </Suspense>
        </Canvas>
      </GlobeErrorBoundary>
    </div>
  );
};

export default InteractiveGlobe;
