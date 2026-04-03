// ============================================
// SQUID GAME: READY OR NOT — Game Constants
// ============================================

// --- Field Dimensions ---
export const FIELD_LENGTH = 100;
export const FIELD_WIDTH = 30;
export const WALL_HEIGHT = 12;
export const WALL_THICKNESS = 0.5;

// --- Lines ---
export const START_LINE_Z = -(FIELD_LENGTH / 2) + 5;
export const FINISH_LINE_Z = (FIELD_LENGTH / 2) - 10;

// --- Player ---
export const PLAYER_SPEED = 5;
export const PLAYER_SPRINT_MULTIPLIER = 1.5;
export const PLAYER_START_POSITION: [number, number, number] = [0, 0, START_LINE_Z - 3];
export const PLAYER_SCALE = 0.8;

// --- NPC ---
export const NPC_COUNT = 3;
export const NPC_SPEED_MIN = 3.5;
export const NPC_SPEED_MAX = 5.5;
export const NPC_POSITIONS: [number, number, number][] = [
  [-6, 0, START_LINE_Z - 4],
  [5, 0, START_LINE_Z - 2],
  [-3, 0, START_LINE_Z - 5],
];

// --- Doll ---
export const DOLL_POSITION: [number, number, number] = [0, 0, FINISH_LINE_Z + 5];
export const DOLL_SCALE = 5;
export const DOLL_HEAD_TURN_SPEED = 3; // radians per second

// --- Timer ---
export const GAME_DURATION = 60; // seconds

// --- Doll Cycle Difficulty (based on time remaining) ---
export interface DifficultyTier {
  timeThreshold: number; // seconds remaining (above this threshold)
  greenMin: number;
  greenMax: number;
  redMin: number;
  redMax: number;
  yellowWarning: number;
  yellowTransition: number;
}

export const DIFFICULTY_TIERS: DifficultyTier[] = [
  // Relaxed: 60-40s remaining
  {
    timeThreshold: 40,
    greenMin: 2,
    greenMax: 4.5,
    redMin: 3,
    redMax: 6,
    yellowWarning: 0.8,
    yellowTransition: 0.6,
  },
  // Tense: 40-20s remaining
  {
    timeThreshold: 20,
    greenMin: 1.5,
    greenMax: 3,
    redMin: 3,
    redMax: 5.5,
    yellowWarning: 0.6,
    yellowTransition: 0.5,
  },
  // Frantic: 20-0s remaining
  {
    timeThreshold: 0,
    greenMin: 1,
    greenMax: 2,
    redMin: 2.5,
    redMax: 5,
    yellowWarning: 0.4,
    yellowTransition: 0.3,
  },
];

// --- Grace Period ---
export const GRACE_PERIOD = 0.2; // seconds after yellow→red before detection kicks in

// --- Signal Poles ---
export const SIGNAL_POLE_HEIGHT = 15;
export const SIGNAL_POLE_POSITIONS: [number, number, number][] = [
  [-(FIELD_WIDTH / 2) - 1, 0, FINISH_LINE_Z],
  [(FIELD_WIDTH / 2) + 1, 0, FINISH_LINE_Z],
];

// --- Trees ---
export const TREE_POSITIONS: [number, number, number][] = [
  [-12, 0, FINISH_LINE_Z + 12],
  [-6, 0, FINISH_LINE_Z + 15],
  [0, 0, FINISH_LINE_Z + 18],
  [6, 0, FINISH_LINE_Z + 15],
  [12, 0, FINISH_LINE_Z + 12],
  [-9, 0, FINISH_LINE_Z + 20],
  [9, 0, FINISH_LINE_Z + 20],
];

// --- Colors (Squid Game Inspired) ---
export const COLORS = {
  uiAccent: '#E91E7B',
  uiBackground: '#1A2634',
  uiBackgroundAlpha: 'rgba(26, 38, 52, 0.9)',
  playerGreen: '#2D8B4E',
  npcGreen1: '#3A9D5C',
  npcGreen2: '#258040',
  npcGreen3: '#47A86A',
  arenaWall: '#8B8680',
  ground: '#C4B89C',
  startFinishLine: '#FFFFFF',
  signalGreen: '#00E676',
  signalYellow: '#FFD600',
  signalRed: '#FF1744',
  dollDress: '#FFB74D',
  dollHair: '#2C1810',
  dollSkin: '#FFCCBC',
  dollEyes: '#1A1A1A',
  treeTrunk: '#5D4037',
  treeLeaves: '#388E3C',
  sky: '#B0BEC5',
  fog: '#B0BEC5',
} as const;

// --- Game Phases ---
export enum GamePhase {
  GREEN = 'GREEN',
  YELLOW_WARNING = 'YELLOW_WARNING',
  RED = 'RED',
  YELLOW_TRANSITION = 'YELLOW_TRANSITION',
}

// --- Game States ---
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_ACTIVE = 'GAME_ACTIVE',
  GAME_OVER = 'GAME_OVER',
  WIN = 'WIN',
}
