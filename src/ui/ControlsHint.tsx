'use client';

import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/utils/constants';

export default function ControlsHint() {
  const gameState = useGameStore((s) => s.gameState);

  if (gameState !== GameState.PLAYING && gameState !== GameState.GAME_ACTIVE) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '60px',
        left: '20px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '10px',
        padding: '14px 18px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        opacity: 0.9,
        zIndex: 5,
        cursor: 'default',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {['W', 'A', 'S', 'D'].map((key) => (
              <span
                key={key}
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'white',
                  minWidth: '20px',
                  textAlign: 'center' as const,
                }}
              >
                {key}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Move</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '4px',
            padding: '2px 7px',
            fontSize: '12px',
            fontWeight: 700,
            color: 'white',
          }}>
            SHIFT
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Sprint</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(33, 150, 243, 0.3)',
            border: '1px solid rgba(33, 150, 243, 0.5)',
            borderRadius: '4px',
            padding: '2px 7px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#90CAF9',
          }}>
            SPACE
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Freeze / Unfreeze</span>
        </div>
      </div>
    </div>
  );
}
