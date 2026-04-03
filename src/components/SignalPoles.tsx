"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Color } from "three";
import { useGameStore } from "@/store/gameStore";
import {
  GamePhase,
  GameState,
  SIGNAL_POLE_HEIGHT,
  SIGNAL_POLE_POSITIONS,
  COLORS,
} from "@/utils/constants";

function SignalPole({
  position,
}: Readonly<{ position: [number, number, number] }>) {
  const orbRef = useRef<Mesh>(null);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const gameState = useGameStore((s) => s.gameState);

  const getSignalColor = () => {
    if (gameState !== GameState.GAME_ACTIVE) return COLORS.signalGreen;
    switch (gamePhase) {
      case GamePhase.GREEN:
        return COLORS.signalGreen;
      case GamePhase.YELLOW_WARNING:
      case GamePhase.YELLOW_TRANSITION:
        return COLORS.signalYellow;
      case GamePhase.RED:
        return COLORS.signalRed;
      default:
        return COLORS.signalGreen;
    }
  };

  useFrame(() => {
    if (!orbRef.current) return;
    const material = orbRef.current.material as THREE.MeshStandardMaterial;
    const targetColor = new Color(getSignalColor());
    material.color.lerp(targetColor, 0.1);
    material.emissive.lerp(targetColor, 0.1);
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, SIGNAL_POLE_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, SIGNAL_POLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Orb */}
      <mesh ref={orbRef} position={[0, SIGNAL_POLE_HEIGHT + 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={getSignalColor()}
          emissive={getSignalColor()}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Point light from orb */}
      <pointLight
        position={[0, SIGNAL_POLE_HEIGHT + 0.5, 0]}
        color={getSignalColor()}
        intensity={5}
        distance={20}
      />

      {/* Bracket */}
      <mesh position={[0, SIGNAL_POLE_HEIGHT - 0.2, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Need to import THREE for the material type
import * as THREE from "three";

export default function SignalPoles() {
  return (
    <group>
      {SIGNAL_POLE_POSITIONS.map((pos, i) => (
        <SignalPole key={i} position={pos} />
      ))}
    </group>
  );
}
