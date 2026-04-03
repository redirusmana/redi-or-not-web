import { create } from 'zustand';
import {
  GameState,
  GamePhase,
  GAME_DURATION,
  DIFFICULTY_TIERS,
  PLAYER_START_POSITION,
  NPC_POSITIONS,
  NPC_COUNT,
} from '@/utils/constants';

// --- NPC State ---
export interface NPCState {
  id: number;
  position: [number, number, number];
  alive: boolean;
  speed: number;
  eliminateAtTime?: number; // scripted elimination time
}

// --- Store Interface ---
interface GameStore {
  // Game state
  gameState: GameState;
  gamePhase: GamePhase;
  timeRemaining: number;
  isFrozen: boolean;
  playerPosition: [number, number, number];
  playerAlive: boolean;
  hasStartedRunning: boolean;

  // Doll cycle
  phaseTimer: number;
  currentPhaseDuration: number;
  graceActive: boolean;

  // NPCs
  npcs: NPCState[];

  // Actions
  startGame: () => void;
  resetGame: () => void;
  setGameState: (state: GameState) => void;
  setGamePhase: (phase: GamePhase) => void;
  setTimeRemaining: (time: number) => void;
  toggleFreeze: () => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setHasStartedRunning: (v: boolean) => void;
  eliminatePlayer: () => void;
  winGame: () => void;
  setPhaseTimer: (t: number) => void;
  setCurrentPhaseDuration: (d: number) => void;
  setGraceActive: (v: boolean) => void;
  updateNPC: (id: number, updates: Partial<NPCState>) => void;
  eliminateNPC: (id: number) => void;
}

// --- Helper: get random duration for current difficulty ---
export function getRandomDuration(
  timeRemaining: number,
  type: 'green' | 'red' | 'yellowWarning' | 'yellowTransition'
): number {
  const tier = DIFFICULTY_TIERS.find((t) => timeRemaining >= t.timeThreshold) || DIFFICULTY_TIERS.at(-1)!;

  switch (type) {
    case 'green':
      return tier.greenMin + Math.random() * (tier.greenMax - tier.greenMin);
    case 'red':
      return tier.redMin + Math.random() * (tier.redMax - tier.redMin);
    case 'yellowWarning':
      return tier.yellowWarning;
    case 'yellowTransition':
      return tier.yellowTransition;
  }
}

// --- Helper: initialize NPCs ---
function createNPCs(): NPCState[] {
  return Array.from({ length: NPC_COUNT }, (_, i) => {
    let eliminateAtTime: number | undefined;
    if (i === 0) {
      eliminateAtTime = 35 + Math.random() * 5; // nosonar
    } else if (i === 2) {
      eliminateAtTime = 12 + Math.random() * 5; // nosonar
    }
    
    return {
      id: i,
      position: [...NPC_POSITIONS[i]] as [number, number, number],
      alive: true,
      speed: 3.5 + Math.random() * 2, // nosonar
      // Scripted: NPC 0 gets caught around 35s remaining, NPC 2 around 15s
      eliminateAtTime,
    };
  });
}

// --- The Store ---
export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  gameState: GameState.MENU,
  gamePhase: GamePhase.GREEN,
  timeRemaining: GAME_DURATION,
  isFrozen: false,
  playerPosition: [...PLAYER_START_POSITION],
  playerAlive: true,
  hasStartedRunning: false,
  phaseTimer: 0,
  currentPhaseDuration: 5,
  graceActive: false,
  npcs: createNPCs(),

  // Actions
  startGame: () =>
    set({
      gameState: GameState.PLAYING,
      gamePhase: GamePhase.GREEN,
      timeRemaining: GAME_DURATION,
      isFrozen: false,
      playerPosition: [...PLAYER_START_POSITION],
      playerAlive: true,
      hasStartedRunning: false,
      phaseTimer: 0,
      currentPhaseDuration: 5,
      graceActive: false,
      npcs: createNPCs(),
    }),

  resetGame: () =>
    set({
      gameState: GameState.MENU,
      gamePhase: GamePhase.GREEN,
      timeRemaining: GAME_DURATION,
      isFrozen: false,
      playerPosition: [...PLAYER_START_POSITION],
      playerAlive: true,
      hasStartedRunning: false,
      phaseTimer: 0,
      currentPhaseDuration: 5,
      graceActive: false,
      npcs: createNPCs(),
    }),

  setGameState: (state) => set({ gameState: state }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  toggleFreeze: () => set((s) => ({ isFrozen: !s.isFrozen })),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setHasStartedRunning: (v) => set({ hasStartedRunning: v }),
  eliminatePlayer: () => set({ playerAlive: false, gameState: GameState.GAME_OVER }),
  winGame: () => set({ gameState: GameState.WIN }),
  setPhaseTimer: (t) => set({ phaseTimer: t }),
  setCurrentPhaseDuration: (d) => set({ currentPhaseDuration: d }),
  setGraceActive: (v) => set({ graceActive: v }),
  updateNPC: (id, updates) =>
    set((s) => ({
      npcs: s.npcs.map((npc) => (npc.id === id ? { ...npc, ...updates } : npc)),
    })),
  eliminateNPC: (id) =>
    set((s) => ({
      npcs: s.npcs.map((npc) => (npc.id === id ? { ...npc, alive: false } : npc)),
    })),
}));
