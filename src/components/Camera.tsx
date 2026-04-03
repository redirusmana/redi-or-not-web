'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/utils/constants';

export default function Camera() {
  const cameraOffset = useRef(new Vector3(2, 6, -10));
  const targetPosition = useRef(new Vector3());
  const gameState = useGameStore((s) => s.gameState);

  useFrame((state) => {
    const playerPos = useGameStore.getState().playerPosition;

    // Adjust camera based on game state
    if (gameState === GameState.GAME_OVER) {
      // Pull out slightly on death
      cameraOffset.current.lerp(new Vector3(3, 8, -12), 0.02);
    } else if (gameState === GameState.WIN) {
      // Cinematic sweep on win
      cameraOffset.current.lerp(new Vector3(8, 10, -5), 0.02);
    } else {
      cameraOffset.current.lerp(new Vector3(2, 6, -10), 0.05);
    }

    // Follow player
    targetPosition.current.set(
      playerPos[0] + cameraOffset.current.x,
      playerPos[1] + cameraOffset.current.y,
      playerPos[2] + cameraOffset.current.z
    );

    // Smooth camera follow
    state.camera.position.lerp(targetPosition.current, 0.05);

    // Look at player
    state.camera.lookAt(playerPos[0], playerPos[1] + 1, playerPos[2] + 5);
  });

  return null;
}
