---
name: Squid Game Ready or Not
overview: Build a 3D "Red Light, Green Light" game inspired by Netflix's Squid Game using React Three Fiber. Single-player, low-poly aesthetic, with faithful trackfield recreation, giant doll mechanics, freeze/move gameplay, and polished UI.
todos:
  - id: project-setup
    content: Initialize Next.js + TypeScript project with Bun, React Three Fiber, Drei, and Zustand
    status: pending
  - id: download-assets
    content: "Download & place 3D assets: low-poly character, giant doll, trees, and field elements into public/models/"
    status: pending
  - id: game-state
    content: Create Zustand game store for state management (menu, playing, frozen, gameover, win)
    status: pending
  - id: trackfield
    content: "Build the trackfield scene: open field with side walls, start line, finish line, ground, and sky"
    status: pending
  - id: doll
    content: "Create the giant doll with head rotation mechanic (facing away → turning → facing player)"
    status: pending
  - id: player
    content: "Implement player character with WASD movement, Shift sprint, and Space freeze toggle"
    status: pending
  - id: game-logic
    content: "Core game loop: doll cycle timing, movement detection during red light, death/win conditions"
    status: pending
  - id: signal-indicator
    content: "Add visual signal system (colored beacon lights on tall poles) showing green/yellow/red state"
    status: pending
  - id: ui-overlays
    content: "Build UI screens: main menu, controls hint, game over, and congratulations overlays"
    status: pending
  - id: lighting-atmosphere
    content: Add dramatic lighting, fog, shadows, and ambient audio cues for tension
    status: pending
  - id: trees-aesthetics
    content: Place decorative trees behind the doll and environmental props for atmosphere
    status: pending
  - id: polish
    content: "Final polish: death animation (character falls), camera work, timer, transitions"
    status: pending
isProject: false
---

# Squid Game: Ready or Not — Implementation Plan

## Concept

A single-player 3D web game recreating the iconic **"Red Light, Green Light"** (무궁화 꽃이 피었습니다) from Netflix's Squid Game. The player must reach the finish line within **60 seconds** by moving only when the giant doll is facing away, and freezing when she turns around. Getting caught moving = instant elimination. 2-3 NPC runners add atmosphere without impacting performance.

The wow factor comes from **faithful recreation of the trackfield**, **tense doll mechanics with progressive difficulty**, and **polished game feel** — all running in the browser with React Three Fiber.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework (App Router) |
| **Bun** | Package manager & runtime |
| **React + TypeScript** | UI & component framework |
| **@react-three/fiber** | React renderer for Three.js |
| **@react-three/drei** | Helpers (OrbitControls, Sky, Text, useGLTF, etc.) |
| **Zustand** | Lightweight game state management |
| **Three.js** | 3D engine (via R3F) |

---

## 3D Assets Needed

### 1. Player Character & NPCs (GLB Models)
- **Source**: Same low-poly humanoid from the indoor explorer plan (GLB model)
- Recommended: Simple low-poly character from **Kenney** (kenney.nl/assets/mini-characters) or **Poly Pizza** (search "low poly character")
- Player + 2-3 NPCs use the **same model** (reuse geometry for performance)
- Player colored in **green tracksuit**, NPCs in slightly different shades for distinction
- Walk animation: procedural (bob up/down while moving) — keeps it lightweight

### 2. Giant Doll ("Younghee") — Built from Primitives
- **Built in code** using Three.js shapes — no GLB needed
- Cylinder body, sphere head, cone pigtails, simple dress shape
- Large scale (~5-8x player size) on a small platform
- Key: **head is a separate group** so it can rotate independently
- This is actually **more faithful** to the show's minimalist doll design
- Position: Near the finish line, elevated on a small platform

### 3. Trees
- **Source**: Kenney Nature Kit or Poly Pizza "low poly tree"
- Place 5-10 trees behind the doll to create the forest backdrop from the show
- Purely decorative

### 4. Trackfield (Built with Code)
- Long rectangular field (~100 units long × 30 units wide)
- Side walls (tall, concrete-colored) — like the show's arena walls
- Ground: flat, dusty/sandy color
- **Start line**: white painted line on the ground at one end
- **Finish line**: white painted line near the doll

### 5. Signal Poles (Built with Code)
- Two tall poles on each side of the field (like stadium light poles)
- Each has a **large glowing orb/light** at the top
- Color changes: 🟢 Green → 🟡 Yellow → 🔴 Red
- This replaces the traffic light idea — looks more cinematic and fits the arena aesthetic

---

## Game States & Flow

```
┌─────────────┐
│  MAIN MENU  │ ──── "Ready or Not" title + Start button
└──────┬──────┘
       │ Click Start
       ▼
┌─────────────┐
│   PLAYING   │ ──── Player spawns at start area
└──────┬──────┘
       │ Cross start line
       ▼
┌─────────────┐
│  GAME ACTIVE│ ──── Doll cycle begins, timer starts
└──────┬──────┘
       │
       ├── Caught moving on Red ──► GAME OVER (character falls, "Game Over" + Retry)
       │
       └── Reach finish line ────► WIN ("Congratulations!" + Play Again)
```

---

## Core Mechanics — Detailed

### Player Controls

| Key | Action | Notes |
|-----|--------|-------|
| **W** | Move forward | Toward the doll/finish line |
| **A** | Move left | Strafe |
| **S** | Move backward | Away from finish line |
| **D** | Move right | Strafe |
| **Shift** | Sprint | 2x speed, higher risk |
| **Space** | Toggle Freeze | **Locks all movement input** until Space pressed again. This prevents accidental key presses. Visual indicator shows freeze state. |

### Freeze Mechanic (Space Toggle)
- When Space is pressed: player enters **freeze mode**
  - All WASD + Shift inputs are **ignored**
  - Character plays idle/frozen pose
  - UI shows a ❄️ freeze indicator
- Press Space again to **unfreeze** and regain control
- This is the core skill: freeze at the right moment, unfreeze to move during green

### Doll Cycle

The doll runs a repeating cycle with **randomized timings** that **speed up as time runs out**:

**Progressive Difficulty (based on time remaining, NOT distance):**
| Time Remaining | Green Phase | Red Phase | Feel |
|---|---|---|---|
| 60-40s | 4-7s | 2-5s | Relaxed, learn the rhythm |
| 40-20s | 3-5s | 2-4s | Getting tense |
| 20-0s | 2-3s | 1.5-3s | Frantic, barely time to move |

```
Phase 1: GREEN LIGHT (variable — see table above)
├── Doll faces AWAY (toward trees)
├── Signal poles glow GREEN
├── Players/NPCs can move safely
│
Phase 2: YELLOW WARNING (0.8-1.5 seconds)
├── Doll head starts TURNING (slow rotation)
├── Signal poles glow YELLOW
├── ⚠️ Warning — stop moving NOW
│
Phase 3: RED LIGHT (variable — see table above)
├── Doll faces TOWARD players
├── Signal poles glow RED
├── Any player movement = ELIMINATION
│
Phase 4: YELLOW TRANSITION (0.5-1 second)
├── Doll head starts turning BACK
├── Signal poles glow YELLOW
├── Still dangerous — don't move yet
│
└── Back to Phase 1
```

### NPC Runners (2-3 AI Characters)
- Run alongside the player for atmosphere
- Simple AI: move during green, stop during red
- Some NPCs intentionally get caught (move slightly into red phase) → fall over → adds drama
- **Lightweight**: reuse same GLB model, simple state machine, no complex pathfinding
- Spread across the field width so the arena feels populated

### Movement Detection (Red Light)
- During RED phase: if any WASD/Shift key is pressed AND player is NOT in freeze mode → **ELIMINATION**
- Detection is binary: any movement input = caught (simple, fair, clear)
- Small grace period (~200ms) after yellow→red transition to be forgiving

### Death / Elimination
- Player/NPC character **falls over** (simple: rotate the model 90° on X axis and drop Y position)
- Brief pause (~1.5 seconds)
- Show **"GAME OVER"** overlay with **Retry** button
- No shooting animation needed — just the fall

### Win Condition
- Player's position crosses the finish line Z coordinate
- Show **"Congratulations!"** overlay with **Play Again** button

### Timer
- **60 seconds** countdown from when the doll cycle begins (after crossing start line)
- Timer runs out = **GAME OVER** (same as getting caught)

---

## Scene Layout (Top-Down View)

```
     [TREES] [TREES] [TREES] [TREES] [TREES]
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║  ☉ Signal    [GIANT DOLL]    ☉ Signal     ║
    ║    Pole     (on platform)      Pole       ║
    ║                                           ║
    ║ ──────────── FINISH LINE ──────────────── ║
    ║                                           ║
    ║            (100 units of field)            ║
    ║                    ↑                       ║
    ║                    ↑                       ║
    ║              player moves                  ║
    ║                this way                    ║
    ║                    ↑                       ║
    ║                    ↑                       ║
    ║                                           ║
    ║ ──────────── START LINE ───────────────── ║
    ║                                           ║
    ║             👤 PLAYER SPAWN               ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
```

---

## Camera

- **Third-person follow camera** behind and above the player
- Slight offset to the right so the doll is always visible ahead
- Camera follows the player as they advance up the field
- On elimination: camera pulls out slightly to show the fall
- On win: camera sweeps to a cinematic angle

---

## UI Overlays

### 1. Main Menu Screen
- Dark overlay with the title **"READY OR NOT"** in bold, stylized text
- Subtitle: *"Inspired by Squid Game"*
- Large **[START]** button (pink/magenta, matching Squid Game aesthetics)
- Minimal, clean design — Squid Game's pink + dark teal color scheme

### 2. Controls Hint (During Gameplay)
- Small semi-transparent panel in bottom-left corner:
  ```
  W A S D  — Move
  SHIFT    — Sprint
  SPACE    — Freeze / Unfreeze
  ```
- Fades out after a few seconds, reappears on hover

### 3. Game HUD (During Active Game)
- **Timer**: 60-second countdown at the top center
- **Freeze indicator**: ❄️ icon + "FROZEN" text when in freeze mode
- **Signal color**: small colored dot near the timer showing current phase
- **Distance**: progress bar showing distance to finish line

### 4. Game Over Screen
- Dark overlay
- **"GAME OVER"** in large red text
- **[RETRY]** button
- Optional: "You were caught moving!" message

### 5. Win Screen
- **"CONGRATULATIONS!"** in large gold text
- **[PLAY AGAIN]** button
- Optional: show time taken

---

## Lighting & Atmosphere

### Lighting Setup
- **Directional light**: warm, slightly angled (afternoon sun feel)
- **Ambient light**: low intensity, slightly blue (creates tension)
- **Signal pole lights**: emissive point lights that change color with the game phase
- **Fog**: light fog at distance for depth and atmosphere

### Color Palette (Squid Game Inspired)
| Element | Color |
|---------|-------|
| UI accent / buttons | `#E91E7B` (Squid Game pink) |
| UI background | `#1A2634` (dark teal) |
| Player tracksuit | `#2D8B4E` (green) |
| Arena walls | `#8B8680` (concrete gray) |
| Ground | `#C4B89C` (sandy/dusty) |
| Start/Finish lines | `#FFFFFF` (white) |
| Green signal | `#00E676` |
| Yellow signal | `#FFD600` |
| Red signal | `#FF1744` |
| Doll — dress | `#FFB74D` (orange/yellow) |
| Sky | Overcast / slightly desaturated |

---

## File Structure

```
3d-redi-or-not-main/
├── public/
│   └── models/
│       ├── character.glb        # Player + NPC character (same model)
│       └── tree.glb             # Low-poly trees
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page (renders the game)
│   │   └── globals.css          # Global styles
│   ├── store/
│   │   └── gameStore.ts         # Zustand store (game state, phase, timer)
│   ├── components/
│   │   ├── GameCanvas.tsx       # 'use client' — R3F Canvas wrapper
│   │   ├── Scene.tsx            # Main 3D scene (lights, fog, sky)
│   │   ├── Trackfield.tsx       # Ground, walls, start/finish lines
│   │   ├── Player.tsx           # Player character + movement + freeze
│   │   ├── NPCRunners.tsx       # 2-3 AI runners (reuse character model)
│   │   ├── Doll.tsx             # Giant doll built from primitives + head rotation
│   │   ├── SignalPoles.tsx      # Signal light poles (green/yellow/red)
│   │   ├── Trees.tsx            # Decorative trees behind doll
│   │   └── Camera.tsx           # Third-person follow camera
│   ├── ui/
│   │   ├── MainMenu.tsx         # Start screen
│   │   ├── GameHUD.tsx          # Timer, freeze indicator, signal dot
│   │   ├── ControlsHint.tsx     # WASD/Shift/Space overlay
│   │   ├── GameOverScreen.tsx   # Game over + retry
│   │   └── WinScreen.tsx        # Congratulations + play again
│   └── utils/
│       └── constants.ts         # Game constants (timings, dimensions, colors)
├── package.json
├── tsconfig.json
├── next.config.ts
└── bun.lock
```

> **Note**: All R3F components must be marked `'use client'` since Three.js requires browser APIs. The `GameCanvas.tsx` wrapper handles this — `page.tsx` stays as a server component and just renders `<GameCanvas />`. The doll has **no GLB file** — she's built entirely from code primitives.

---

## Implementation Order

### Phase 1: Foundation
1. **Project setup** — Next.js + TS + R3F + Drei + Zustand (installed with Bun)
2. **Game store** — State management with all game phases
3. **Basic scene** — Canvas, lighting, ground plane

### Phase 2: Core 3D
4. **Trackfield** — Field, walls, lines
5. **Player** — Character GLB + WASD + Shift + Space freeze
6. **Doll** — Built from primitives + head rotation mechanic
7. **Camera** — Third-person follow
8. **NPCs** — 2-3 AI runners with simple behavior

### Phase 3: Gameplay
9. **Doll cycle** — Green→Yellow→Red timing loop with progressive difficulty (based on time remaining)
10. **Detection** — Movement during red = elimination
11. **Death animation** — Character/NPC falls over
12. **Win detection** — Cross finish line
13. **Timer** — 60-second countdown, runs out = game over
14. **NPC elimination** — Some NPCs get caught for dramatic effect

### Phase 4: Polish
15. **Signal poles** — Color-changing light poles
16. **Trees** — Behind the doll
17. **UI overlays** — Menu, HUD, game over, win screen
18. **Controls hint** — Key binding display
19. **Lighting & atmosphere** — Fog, shadows, color tuning
20. **Transitions** — Smooth state changes, camera movements

---

## Asset Sources (Priority Order)

1. **Kenney Mini Characters** (kenney.nl/assets/mini-characters) — Player character
2. **Poly Pizza** (poly.pizza) — Search "tree", "girl", "doll"
3. **Kenney Nature Kit** (kenney.nl/assets/nature-kit) — Trees
4. **Build from primitives** — Doll can be built from Three.js shapes if no good model found (actually more faithful to the show's minimalist design)
5. **Sketchfab** — Search "squid game doll", "low poly doll" (check license)

---

## Key Design Decisions

### Why Signal Poles instead of Traffic Light?
A traffic light would feel out of place in the arena. Tall signal poles on each side of the field are more like **stadium lighting** — they fit the arena aesthetic, are visible from anywhere on the field, and the color-changing orbs are dramatic and clear.

### Why Space Toggle instead of Hold?
Pressing Space **locks** all movement input until Space is pressed again. This prevents accidental key presses when trying to freeze — a real gameplay skill becomes timing your freeze, not fumbling with keys.

### Why Build Doll from Primitives?
The Squid Game doll has a very simple, iconic design. Building her from Three.js primitives (cylinders, spheres, cones for pigtails) is actually **more faithful** than a random low-poly character model, avoids licensing issues, and keeps the app lightweight.

### Why Difficulty Scales with Time, Not Distance?
Scaling with time remaining creates consistent pressure regardless of play style. A cautious player who barely moves still feels the squeeze as time runs out. This matches the show's tension arc — calm start, panicked finish.

### Why Only 2-3 NPCs?
Keeps the app lightweight while still making the field feel populated. NPCs reuse the same character GLB (shared geometry/materials) and use simple state machines — no pathfinding, no physics. Some get "caught" at scripted moments for cinematic drama.

### No Audio?
Keeping the app lightweight by avoiding audio files. All tension comes from visual cues: the doll's head turning, signal colors changing, timer counting down, and NPCs falling.

---

## Quick Start

```bash
# 1. Init project with Next.js (using Bun)
bunx create-next-app@latest ./ --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind --turbopack

# 2. Install dependencies  
bun add three @react-three/fiber @react-three/drei zustand
bun add -d @types/three

# 3. Start dev server
bun run dev
```
