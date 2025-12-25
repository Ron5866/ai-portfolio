import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const HelixStructure = () => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const connectorsRef = useRef<THREE.InstancedMesh>(null);

  const { nodePositions, connectorData } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const connectors: { start: THREE.Vector3; end: THREE.Vector3; midpoint: THREE.Vector3 }[] = [];
    
    const turns = 3;
    const pointsPerTurn = 12;
    const totalPoints = turns * pointsPerTurn;
    const radius = 1.2;
    const height = 4;
    
    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      
      // First strand
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      nodes.push(new THREE.Vector3(x1, y, z1));
      
      // Second strand (offset by PI)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      nodes.push(new THREE.Vector3(x2, y, z2));
      
      // Connector between strands
      if (i % 2 === 0) {
        connectors.push({
          start: new THREE.Vector3(x1, y, z1),
          end: new THREE.Vector3(x2, y, z2),
          midpoint: new THREE.Vector3((x1 + x2) / 2, y, (z1 + z2) / 2)
        });
      }
    }
    
    return { nodePositions: nodes, connectorData: connectors };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (nodesRef.current) {
      const dummy = new THREE.Object3D();
      const time = state.clock.elapsedTime;
      
      nodePositions.forEach((pos, i) => {
        const pulse = 1 + Math.sin(time * 2 + i * 0.3) * 0.15;
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.08 * pulse);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* DNA Nodes */}
        <instancedMesh ref={nodesRef} args={[undefined, undefined, nodePositions.length]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </instancedMesh>

        {/* Backbone strands */}
        {nodePositions.map((pos, i) => {
          if (i < nodePositions.length - 2 && i % 2 === 0) {
            const nextPos = nodePositions[i + 2];
            if (nextPos) {
              return (
                <line key={`strand1-${i}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([pos.x, pos.y, pos.z, nextPos.x, nextPos.y, nextPos.z])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#60a5fa" transparent opacity={0.6} />
                </line>
              );
            }
          }
          if (i < nodePositions.length - 2 && i % 2 === 1) {
            const nextPos = nodePositions[i + 2];
            if (nextPos) {
              return (
                <line key={`strand2-${i}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([pos.x, pos.y, pos.z, nextPos.x, nextPos.y, nextPos.z])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#a78bfa" transparent opacity={0.6} />
                </line>
              );
            }
          }
          return null;
        })}

        {/* Connector rungs */}
        {connectorData.map((conn, i) => (
          <line key={`connector-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  conn.start.x, conn.start.y, conn.start.z,
                  conn.end.x, conn.end.y, conn.end.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={i % 2 === 0 ? "#34d399" : "#f472b6"} 
              transparent 
              opacity={0.5} 
            />
          </line>
        ))}

        {/* Center glow core */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 4, 16]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

const DNAHelix = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color="#60a5fa"
        />
        <HelixStructure />
      </Canvas>
    </div>
  );
};

export default DNAHelix;
