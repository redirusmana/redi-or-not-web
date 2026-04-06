"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { useGameStore } from "@/store/gameStore";
import {
  GameState,
  GamePhase,
  PLAYER_SPEED,
  PLAYER_SPRINT_MULTIPLIER,
  START_LINE_Z,
  FINISH_LINE_Z,
  FIELD_WIDTH,
} from "@/utils/constants";
import { PersonModel } from "./PersonModel";

export default function Player() {
  const meshRef = useRef<Group>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const deathTimer = useRef(0);
  const [isWalking, setIsWalking] = useState(false);
  const [coucouTrigger, setCoucouTrigger] = useState(0);

  const gameState = useGameStore((s) => s.gameState);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const isFrozen = useGameStore((s) => s.isFrozen);
  const playerAlive = useGameStore((s) => s.playerAlive);
  const graceActive = useGameStore((s) => s.graceActive);
  const toggleFreeze = useGameStore((s) => s.toggleFreeze);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setHasStartedRunning = useGameStore((s) => s.setHasStartedRunning);
  const setGameState = useGameStore((s) => s.setGameState);
  const eliminatePlayer = useGameStore((s) => s.eliminatePlayer);
  const winGame = useGameStore((s) => s.winGame);

  // Keyboard handlers
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " ") {
        e.preventDefault();
        const state = useGameStore.getState();
        if (
          state.gameState === GameState.PLAYING ||
          state.gameState === GameState.GAME_ACTIVE
        ) {
          toggleFreeze();
        }
        return;
      }
      keysPressed.current.add(key);
    },
    [toggleFreeze],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Reset player position/rotation when game restarts
  useEffect(() => {
    if (
      (gameState === GameState.PLAYING || gameState === GameState.MENU) &&
      meshRef.current
    ) {
      const startPos = useGameStore.getState().playerPosition;
      meshRef.current.position.set(startPos[0], startPos[1], startPos[2]);
      meshRef.current.rotation.set(0, 0, 0);
      deathTimer.current = 0;
      keysPressed.current.clear();
      setIsWalking(false);
    }
  }, [gameState]);

  // Trigger coucou on win
  useEffect(() => {
    if (gameState === GameState.WIN) {
      setCoucouTrigger((prev) => prev + 1);
    }
  }, [gameState]);

  const checkGameProgression = (zPos: number) => {
    if (gameState === GameState.PLAYING && zPos >= START_LINE_Z) {
      setHasStartedRunning(true);
      setGameState(GameState.GAME_ACTIVE);
    } else if (gameState === GameState.GAME_ACTIVE && zPos >= FINISH_LINE_Z) {
      winGame();
    }
  };

  const handleMovement = (delta: number, isSprinting: boolean) => {
    if (!meshRef.current) return;

    const speed =
      PLAYER_SPEED * (isSprinting ? PLAYER_SPRINT_MULTIPLIER : 1) * delta;
    const pos = meshRef.current.position;

    if (keysPressed.current.has("w")) pos.z += speed;
    if (keysPressed.current.has("s")) pos.z -= speed;
    if (keysPressed.current.has("a")) pos.x += speed;
    if (keysPressed.current.has("d")) pos.x -= speed;

    pos.x = MathUtils.clamp(pos.x, -(FIELD_WIDTH / 2) + 1, FIELD_WIDTH / 2 - 1);
    pos.z = Math.max(pos.z, START_LINE_Z - 5);

    setPlayerPosition([pos.x, pos.y, pos.z]);
    setIsWalking(true);

    checkGameProgression(pos.z);
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!playerAlive) {
      deathTimer.current += delta;
      setIsWalking(false);
      return;
    }

    const isPlayable =
      gameState === GameState.PLAYING || gameState === GameState.GAME_ACTIVE;
    if (!isPlayable || isFrozen) {
      setIsWalking(false);
      return;
    }

    const moveKeys = ["w", "a", "s", "d"];
    const isMoving = moveKeys.some((key) => keysPressed.current.has(key));
    const isSprinting = keysPressed.current.has("shift");

    const isRedLightViolation =
      gameState === GameState.GAME_ACTIVE &&
      gamePhase === GamePhase.RED &&
      !graceActive &&
      isMoving;

    if (isRedLightViolation) {
      eliminatePlayer();
      return;
    }

    if (isMoving) {
      handleMovement(delta, isSprinting);
    } else {
      setIsWalking(false);
    }
  });

  const startPos = useGameStore.getState().playerPosition;

  return (
    <group ref={meshRef} position={startPos}>
      <PersonModel
        isWalking={isWalking}
        coucouTrigger={coucouTrigger}
        scale={0.7}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}
