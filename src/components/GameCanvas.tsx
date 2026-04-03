'use client';

import { Canvas } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/utils/constants';
import Scene from '@/components/Scene';
import MainMenu from '@/ui/MainMenu';
import GameHUD from '@/ui/GameHUD';
import ControlsHint from '@/ui/ControlsHint';
import GameOverScreen from '@/ui/GameOverScreen';
import WinScreen from '@/ui/WinScreen';

export default function GameCanvas() {
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [2, 6, -55], fov: 60, near: 0.1, far: 200 }}
        style={{ background: '#B0BEC5' }}
      >
        <Scene />
      </Canvas>

      {/* UI Overlays */}
      {gameState === GameState.MENU && <MainMenu />}
      {(gameState === GameState.PLAYING || gameState === GameState.GAME_ACTIVE) && (
        <>
          <GameHUD />
          <ControlsHint />
        </>
      )}
      {gameState === GameState.GAME_OVER && <GameOverScreen />}
      {gameState === GameState.WIN && <WinScreen />}
    </div>
  );
}
