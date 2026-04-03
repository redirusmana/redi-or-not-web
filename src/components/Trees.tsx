'use client';

import { useMemo } from 'react';
import { TREE_POSITIONS, COLORS } from '@/utils/constants';

// Pre-compute scales for each tree position to avoid Math.random() during render
const TREE_SCALES = [1.1, 0.9, 1.3, 1, 0.85, 1.15, 1.05];

function Tree({ position, scale }: Readonly<{ position: [number, number, number]; scale: number }>) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial color={COLORS.treeTrunk} />
      </mesh>

      {/* Foliage layers */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.8, 2.5, 8]} />
        <meshStandardMaterial color={COLORS.treeLeaves} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.4, 2, 8]} />
        <meshStandardMaterial color="#43A047" />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
    </group>
  );
}

export default function Trees() {
  const trees = useMemo(
    () =>
      TREE_POSITIONS.map((pos, i) => ({
        position: pos,
        scale: TREE_SCALES[i % TREE_SCALES.length],
      })),
    []
  );

  return (
    <group>
      {trees.map((tree) => (
        <Tree key={`tree-${tree.position[0]}-${tree.position[2]}`} position={tree.position} scale={tree.scale} />
      ))}
    </group>
  );
}
