'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore, getRandomDuration } from '@/store/gameStore';
import {
  GameState,
  GamePhase,
  COLORS,
  GRACE_PERIOD,
} from '@/utils/constants';
import Trackfield from './Trackfield';
import Player from './Player';
import Doll from './Doll';
import SignalPoles from './SignalPoles';
import Trees from './Trees';
import Camera from './Camera';
import NPCRunners from './NPCRunners';

export default function Scene() {
  const phaseTimerRef = useRef(0);
  const currentDurationRef = useRef(5);
  const graceTimerRef = useRef(0);
  const timerRef = useRef(0);
  const initializedRef = useRef(false);

  useFrame((_, delta) => {
    const store = useGameStore.getState();

    if (store.gameState !== GameState.GAME_ACTIVE) {
      // Reset so the game loop re-initializes on next GAME_ACTIVE entry
      initializedRef.current = false;
      return;
    }

    // Initialize on first frame of GAME_ACTIVE
    if (!initializedRef.current) {
      initializedRef.current = true;
      phaseTimerRef.current = 0;
      currentDurationRef.current = getRandomDuration(store.timeRemaining, 'green');
      store.setGamePhase(GamePhase.GREEN);
      timerRef.current = 0;
    }

    // Update game timer
    timerRef.current += delta;
    const newTime = Math.max(0, store.timeRemaining - delta);
    store.setTimeRemaining(newTime);

    // Time's up!
    if (newTime <= 0) {
      store.eliminatePlayer();
      initializedRef.current = false;
      return;
    }

    // Update grace period
    if (store.graceActive) {
      graceTimerRef.current += delta;
      if (graceTimerRef.current >= GRACE_PERIOD) {
        store.setGraceActive(false);
        graceTimerRef.current = 0;
      }
    }

    // Doll cycle timer
    phaseTimerRef.current += delta;

    if (phaseTimerRef.current >= currentDurationRef.current) {
      phaseTimerRef.current = 0;

      // Advance to next phase
      switch (store.gamePhase) {
        case GamePhase.GREEN:
          store.setGamePhase(GamePhase.YELLOW_WARNING);
          currentDurationRef.current = getRandomDuration(newTime, 'yellowWarning');
          break;

        case GamePhase.YELLOW_WARNING:
          store.setGamePhase(GamePhase.RED);
          store.setGraceActive(true);
          graceTimerRef.current = 0;
          currentDurationRef.current = getRandomDuration(newTime, 'red');
          break;

        case GamePhase.RED:
        case GamePhase.YELLOW_TRANSITION:
          // Go directly from RED/YELLOW back to GREEN (instant turn, like the show)
          store.setGamePhase(GamePhase.GREEN);
          currentDurationRef.current = getRandomDuration(newTime, 'green');
          break;
      }
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#B0C4DE" />
      <directionalLight
        position={[20, 30, -10]}
        intensity={1.2}
        color="#FFF8E7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={150}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <directionalLight position={[-10, 20, 10]} intensity={0.3} color="#87CEEB" />

      {/* Fog */}
      <fog attach="fog" args={[COLORS.fog, 40, 120]} />

      {/* Sky color */}
      <color attach="background" args={[COLORS.sky]} />

      {/* 3D Elements */}
      <Trackfield />
      <Doll />
      <Player />
      <NPCRunners />
      <SignalPoles />
      <Trees />
      <Camera />
    </>
  );
}
