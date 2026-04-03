'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import {
  FIELD_LENGTH,
  FIELD_WIDTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
  START_LINE_Z,
  FINISH_LINE_Z,
  COLORS,
} from '@/utils/constants';

export default function Trackfield() {
  const groundRef = useRef<Mesh>(null);

  return (
    <group>
      {/* Ground */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[FIELD_WIDTH + 10, FIELD_LENGTH + 40]} />
        <meshStandardMaterial color={COLORS.ground} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-(FIELD_WIDTH / 2) - WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FIELD_LENGTH + 20]} />
        <meshStandardMaterial color={COLORS.arenaWall} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[(FIELD_WIDTH / 2) + WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FIELD_LENGTH + 20]} />
        <meshStandardMaterial color={COLORS.arenaWall} />
      </mesh>

      {/* Edge lines (no walls — can walk through front/back) */}
      {/* Back edge line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, -(FIELD_LENGTH / 2) - 2]}
      >
        <planeGeometry args={[FIELD_WIDTH, 0.15]} />
        <meshStandardMaterial color="rgba(255,255,255,0.3)" opacity={0.3} transparent />
      </mesh>

      {/* Front edge line (beyond finish) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, (FIELD_LENGTH / 2) + 2]}
      >
        <planeGeometry args={[FIELD_WIDTH, 0.15]} />
        <meshStandardMaterial color="rgba(255,255,255,0.3)" opacity={0.3} transparent />
      </mesh>

      {/* Start Line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, START_LINE_Z]}
      >
        <planeGeometry args={[FIELD_WIDTH, 0.3]} />
        <meshStandardMaterial color={COLORS.startFinishLine} />
      </mesh>

      {/* Start Line Text Markers (dashes on sides) */}
      {[-1, 1].map((side) => (
        <mesh
          key={`start-marker-${side}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (FIELD_WIDTH / 2 - 1), 0.01, START_LINE_Z]}
        >
          <planeGeometry args={[1.5, 0.15]} />
          <meshStandardMaterial color={COLORS.startFinishLine} />
        </mesh>
      ))}

      {/* Finish Line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, FINISH_LINE_Z]}
      >
        <planeGeometry args={[FIELD_WIDTH, 0.3]} />
        <meshStandardMaterial color={COLORS.startFinishLine} />
      </mesh>

      {/* Finish Line Checkered Pattern */}
      {Array.from({ length: 20 }).map((_, i) => {
        const xPos = -FIELD_WIDTH / 2 + (i * FIELD_WIDTH) / 20 + FIELD_WIDTH / 40;
        return (
          <mesh
            key={`checker-${xPos}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            -FIELD_WIDTH / 2 + (i * FIELD_WIDTH) / 20 + FIELD_WIDTH / 40,
            0.015,
            FINISH_LINE_Z,
          ]}
        >
          <planeGeometry args={[FIELD_WIDTH / 20 - 0.05, 0.5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? COLORS.startFinishLine : '#333333'}
          />
        </mesh>
        );
      })}

      {/* Doll Platform */}
      <mesh position={[0, 0.5, FINISH_LINE_Z + 5]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.5, 1, 32]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}
