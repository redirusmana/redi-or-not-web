'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { useGameStore } from '@/store/gameStore';
import { GamePhase, GameState, COLORS, DOLL_SCALE, DOLL_POSITION, DOLL_HEAD_TURN_SPEED } from '@/utils/constants';

export default function Doll() {
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const gameState = useGameStore((s) => s.gameState);

  // Target rotation based on phase
  const targetRotation = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.GREEN:
        return 0; // facing away toward trees (+Z)
      case GamePhase.YELLOW_WARNING:
        return Math.PI * 0.5; // turning toward players
      case GamePhase.RED:
        return Math.PI; // facing players (-Z)
      case GamePhase.YELLOW_TRANSITION:
        return Math.PI * 0.5; // turning back toward trees
      default:
        return 0;
    }
  }, [gamePhase]);

  useFrame((_, delta) => {
    if (!headRef.current) return;
    if (gameState !== GameState.GAME_ACTIVE) {
      headRef.current.rotation.y = 0; // default facing away (toward trees)
      return;
    }

    // Smoothly rotate the head
    headRef.current.rotation.y = MathUtils.lerp(
      headRef.current.rotation.y,
      targetRotation,
      delta * DOLL_HEAD_TURN_SPEED
    );
  });

  const scale = DOLL_SCALE;

  return (
    <group ref={bodyRef} position={DOLL_POSITION}>
      {/* Body - Dress (cylinder) */}
      <mesh position={[0, 1.8 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.25 * scale, 0.4 * scale, 1.2 * scale, 16]} />
        <meshStandardMaterial color={COLORS.dollDress} />
      </mesh>

      {/* Arms */}
      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          <mesh
            position={[side * 0.35 * scale, 1.9 * scale, 0]}
            rotation={[0, 0, side * 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.06 * scale, 0.06 * scale, 0.8 * scale, 8]} />
            <meshStandardMaterial color={COLORS.dollDress} />
          </mesh>
          {/* Hands */}
          <mesh position={[side * 0.42 * scale, 1.5 * scale, 0]}>
            <sphereGeometry args={[0.07 * scale, 8, 8]} />
            <meshStandardMaterial color={COLORS.dollSkin} />
          </mesh>
        </group>
      ))}

      {/* Legs */}
      {[-1, 1].map((side) => (
        <mesh
          key={`leg-${side}`}
          position={[side * 0.12 * scale, 0.6 * scale, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.08 * scale, 0.08 * scale, 1.2 * scale, 8]} />
          <meshStandardMaterial color={COLORS.dollSkin} />
        </mesh>
      ))}

      {/* Shoes */}
      {[-1, 1].map((side) => (
        <mesh
          key={`shoe-${side}`}
          position={[side * 0.12 * scale, 0.05 * scale, 0.03 * scale]}
          castShadow
        >
          <boxGeometry args={[0.12 * scale, 0.1 * scale, 0.18 * scale]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      ))}

      {/* Head Group (rotates independently) */}
      <group ref={headRef} position={[0, 2.7 * scale, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.35 * scale, 16, 16]} />
          <meshStandardMaterial color={COLORS.dollSkin} />
        </mesh>

        {/* Face - Eyes */}
        {[-1, 1].map((side) => (
          <mesh
            key={`eye-${side}`}
            position={[side * 0.12 * scale, 0.05 * scale, 0.32 * scale]}
          >
            <sphereGeometry args={[0.04 * scale, 8, 8]} />
            <meshStandardMaterial color={COLORS.dollEyes} />
          </mesh>
        ))}

        {/* Face - Mouth (small curve) */}
        <mesh position={[0, -0.08 * scale, 0.33 * scale]}>
          <boxGeometry args={[0.1 * scale, 0.02 * scale, 0.01 * scale]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>

        {/* Face - Nose */}
        <mesh position={[0, 0, 0.34 * scale]}>
          <sphereGeometry args={[0.025 * scale, 8, 8]} />
          <meshStandardMaterial color={COLORS.dollSkin} />
        </mesh>

        {/* Hair - Top */}
        <mesh position={[0, 0.15 * scale, -0.05 * scale]} castShadow>
          <sphereGeometry args={[0.36 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={COLORS.dollHair} />
        </mesh>

        {/* Pigtails (cones on sides) */}
        {[-1, 1].map((side) => (
          <group key={`pigtail-${side}`}>
            {/* Pigtail tie */}
            <mesh position={[side * 0.35 * scale, 0.1 * scale, -0.05 * scale]}>
              <sphereGeometry args={[0.08 * scale, 8, 8]} />
              <meshStandardMaterial color={COLORS.dollHair} />
            </mesh>
            {/* Pigtail dangle */}
            <mesh
              position={[side * 0.4 * scale, -0.15 * scale, -0.05 * scale]}
              rotation={[0, 0, side * 0.3]}
            >
              <cylinderGeometry args={[0.06 * scale, 0.03 * scale, 0.4 * scale, 8]} />
              <meshStandardMaterial color={COLORS.dollHair} />
            </mesh>
          </group>
        ))}

        {/* Hair band */}
        <mesh position={[0, 0.2 * scale, 0]}>
          <torusGeometry args={[0.36 * scale, 0.02 * scale, 8, 32]} />
          <meshStandardMaterial color={COLORS.dollDress} />
        </mesh>
      </group>
    </group>
  );
}
