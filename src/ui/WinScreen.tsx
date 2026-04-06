"use client";

import { useGameStore } from "@/store/gameStore";
import { GAME_DURATION } from "@/utils/constants";

export default function WinScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const timeTaken = Math.round(GAME_DURATION - timeRemaining);

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
        background: "rgba(0, 0, 0, 0.7)",
        zIndex: 10,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        animation: "fadeIn 0.5s ease",
      }}
    >
      {/* Gold glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Trophy */}
      <div
        style={{
          fontSize: "80px",
          marginBottom: "10px",
        }}
      >
        💰
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 900,
          color: "#FFD700",
          textTransform: "uppercase",
          letterSpacing: "6px",
          marginBottom: "12px",
          textShadow: "0 0 40px rgba(255,215,0,0.4)",
        }}
      >
        Congratulations!
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "18px",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "8px",
        }}
      >
        You survived Red Light, Green Light
      </p>

      {/* Time */}
      <p
        style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "40px",
          letterSpacing: "2px",
        }}
      >
        Time: {timeTaken}s
      </p>

      {/* Play Again Button */}
      <button
        id="play-again-button"
        onClick={startGame}
        style={{
          background: "#FFD700",
          color: "#1A2634",
          border: "none",
          padding: "16px 50px",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "6px",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "all 0.3s ease",
          boxShadow: "0 0 30px rgba(255,215,0,0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 50px rgba(255,215,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.3)";
        }}
      >
        Play Again
      </button>
    </div>
  );
}
