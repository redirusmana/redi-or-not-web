'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { useGameStore, NPCState } from '@/store/gameStore';
import {
  GameState,
  GamePhase,
  FINISH_LINE_Z,
  FIELD_WIDTH,
} from '@/utils/constants';
import { PersonModel } from './PersonModel';

function NPCCharacter({ npc }: Readonly<{ npc: NPCState }>) {
  const meshRef = useRef<Group>(null);
  const [isWalking, setIsWalking] = useState(false);

  const gameState = useGameStore((s) => s.gameState);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const eliminateNPC = useGameStore((s) => s.eliminateNPC);
  const updateNPC = useGameStore((s) => s.updateNPC);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Death — just freeze in place (no falling)
    if (!npc.alive) {
      setIsWalking(false);
      return;
    }

    if (gameState !== GameState.GAME_ACTIVE) return;

    // Check scripted elimination
    if (npc.eliminateAtTime && timeRemaining <= npc.eliminateAtTime) {
      if (gamePhase === GamePhase.RED) {
        eliminateNPC(npc.id);
        return;
      }
    }

    // NPC AI: move during green, stop during red
    const shouldMove = gamePhase === GamePhase.GREEN;

    if (shouldMove) {
      const speed = npc.speed * delta;
      const pos = meshRef.current.position;
      pos.z = Math.min(pos.z + speed, FINISH_LINE_Z - 2);
      pos.x = MathUtils.clamp(pos.x, -(FIELD_WIDTH / 2) + 2, (FIELD_WIDTH / 2) - 2);

      updateNPC(npc.id, { position: [pos.x, pos.y, pos.z] });
      setIsWalking(true);
    } else {
      setIsWalking(false);
    }
  });

  return (
    <group ref={meshRef} position={npc.position}>
      <PersonModel
        isWalking={isWalking}
        scale={0.7}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

export default function NPCRunners() {
  const npcs = useGameStore((s) => s.npcs);

  return (
    <group>
      {npcs.map((npc) => (
        <NPCCharacter key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
