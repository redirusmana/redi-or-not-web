"use client";

import { useGameStore } from "@/store/gameStore";
import { COLORS } from "@/utils/constants";

export default function GameOverScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.75)",
        zIndex: 10,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        animation: "fadeIn 0.5s ease",
      }}
    >
      {/* Red glow effect */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: `radial-gradient(circle, ${COLORS.signalRed}33 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* X mark */}
      <div
        style={{
          fontSize: "80px",
          marginBottom: "10px",
          opacity: 0.8,
        }}
      >
        ☠️
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "64px",
          fontWeight: 900,
          color: COLORS.signalRed,
          textTransform: "uppercase",
          letterSpacing: "10px",
          marginBottom: "12px",
          textShadow: `0 0 40px ${COLORS.signalRed}66`,
        }}
      >
        Game Over
      </h1>

      {/* Message */}
      <p
        style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "40px",
          letterSpacing: "2px",
        }}
      >
        You were caught moving!
      </p>

      {/* Retry Button */}
      <button
        id="retry-button"
        onClick={startGame}
        style={{
          background: "transparent",
          color: "white",
          border: `2px solid ${COLORS.uiAccent}`,
          padding: "16px 50px",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "6px",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.uiAccent;
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Retry
      </button>
    </div>
  );
}
