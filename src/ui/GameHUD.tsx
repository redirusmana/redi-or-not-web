"use client";

import { useGameStore } from "@/store/gameStore";
import {
  GameState,
  GamePhase,
  COLORS,
  FINISH_LINE_Z,
  START_LINE_Z,
} from "@/utils/constants";

export default function GameHUD() {
  const gameState = useGameStore((s) => s.gameState);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const isFrozen = useGameStore((s) => s.isFrozen);
  const playerPosition = useGameStore((s) => s.playerPosition);

  if (gameState !== GameState.GAME_ACTIVE && gameState !== GameState.PLAYING)
    return null;

  // Calculate progress
  const totalDistance = FINISH_LINE_Z - START_LINE_Z;
  const currentDistance = Math.max(0, playerPosition[2] - START_LINE_Z);
  const progress = Math.min(1, currentDistance / totalDistance);

  // Signal color
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

  const getPhaseText = () => {
    if (gameState !== GameState.GAME_ACTIVE) return "WALK TO START LINE";
    switch (gamePhase) {
      case GamePhase.GREEN:
        return "GO!";
      case GamePhase.YELLOW_WARNING:
        return "WARNING!";
      case GamePhase.RED:
        return "STOP!";
      case GamePhase.YELLOW_TRANSITION:
        return "WAIT...";
      default:
        return "";
    }
  };

  const isUrgent = timeRemaining <= 15;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        zIndex: 5,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "16px 24px",
        }}
      >
        {/* Timer */}
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            borderRadius: "8px",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backdropFilter: "blur(10px)",
            border: isUrgent
              ? "1px solid rgba(255,23,68,0.5)"
              : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Signal dot */}
          {gameState === GameState.GAME_ACTIVE && (
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: getSignalColor(),
                boxShadow: `0 0 12px ${getSignalColor()}`,
                transition: "all 0.3s ease",
              }}
            />
          )}

          {/* Timer text */}
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: isUrgent ? COLORS.signalRed : "#FFFFFF",
              fontVariantNumeric: "tabular-nums",
              minWidth: "70px",
              textAlign: "center",
              animation: isUrgent ? "pulse 1s infinite" : "none",
            }}
          >
            {Math.ceil(timeRemaining)}s
          </span>
        </div>

        {/* Phase text */}
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            borderRadius: "8px",
            padding: "8px 16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: getSignalColor(),
              letterSpacing: "2px",
            }}
          >
            {getPhaseText()}
          </span>
        </div>
      </div>

      {/* Freeze Indicator */}
      {isFrozen && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(33, 150, 243, 0.8)",
            borderRadius: "6px",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(33, 150, 243, 0.5)",
          }}
        >
          <span style={{ fontSize: "18px" }}>❄️</span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "3px",
            }}
          >
            FROZEN
          </span>
        </div>
      )}

      {/* Progress Bar (bottom) */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            padding: "6px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
              padding: "0 4px",
            }}
          >
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
              START
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
              {Math.round(progress * 100)}%
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
              FINISH
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.signalGreen}, ${COLORS.uiAccent})`,
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
