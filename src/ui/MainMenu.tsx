'use client';

import { useGameStore } from '@/store/gameStore';
import { COLORS } from '@/utils/constants';

export default function MainMenu() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(180deg, rgba(26,38,52,0.95) 0%, rgba(26,38,52,0.85) 100%)',
      zIndex: 10,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Decorative circles (Squid Game shapes) */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        opacity: 0.6,
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: `3px solid ${COLORS.uiAccent}`,
        }} />
        <div style={{
          width: '40px',
          height: '40px',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          border: `3px solid ${COLORS.uiAccent}`,
          background: 'transparent',
          boxShadow: `inset 0 0 0 3px ${COLORS.uiAccent}`,
        }} />
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${COLORS.uiAccent}`,
        }} />
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '72px',
        fontWeight: 900,
        color: COLORS.uiAccent,
        textTransform: 'uppercase',
        letterSpacing: '8px',
        marginBottom: '8px',
        textShadow: `0 0 40px ${COLORS.uiAccent}66, 0 0 80px ${COLORS.uiAccent}33`,
        lineHeight: 1,
      }}>
        Ready
      </h1>
      <h1 style={{
        fontSize: '72px',
        fontWeight: 900,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: '8px',
        marginBottom: '16px',
        textShadow: '0 0 20px rgba(255,255,255,0.3)',
        lineHeight: 1,
      }}>
        Or Not
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '50px',
      }}>
        Inspired by Squid Game
      </p>

      {/* Start Button */}
      <button
        id="start-button"
        onClick={startGame}
        style={{
          background: COLORS.uiAccent,
          color: 'white',
          border: 'none',
          padding: '18px 60px',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          boxShadow: `0 0 30px ${COLORS.uiAccent}44`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = `0 0 50px ${COLORS.uiAccent}88`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = `0 0 30px ${COLORS.uiAccent}44`;
        }}
      >
        Start
      </button>

      {/* Instructions hint */}
      <p style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.3)',
        marginTop: '30px',
        letterSpacing: '2px',
      }}>
        WASD to move • SPACE to freeze • Reach the finish line
      </p>
    </div>
  );
}
