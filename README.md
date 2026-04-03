# Ready or Not — 3D Browser Game

A lightweight, responsive 3D web game inspired by the famous "Red Light, Green Light". Built using modern web technologies, this game brings frantic, skill-based movement entirely into your browser without needing any game engine installations.

## 🎮 Gameplay Features

- **Dynamic Pacing:** The game dynamically adjusts phase lengths (Green/Red light) based on the remaining time, increasing tension and difficulty as time runs out.
- **Aggressive Detection:** Moving during the Red Light phase immediately freezes the player and triggers an instant loss!
- **3D World & Avatars:** Custom humanoid avatars loaded dynamically via GLB models. The game features an open-ended runway, dynamic tree scaling, and fluid walk/idle/wave animations.
- **Scripted NPCs:** Compete alongside AI-driven characters who attempt to beat the timer alongside you. Some succeed, while others might fail...

## ⚙️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **3D Engine:** [React Three Fiber](https://r3f.docs.pmnd.rs/) (`@react-three/fiber`), `three.js`
- **Hooks & Loaders:** `@react-three/drei` (GLTF loaders, animations)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Game loop synchronization, phase transitions, and timer logic without prop drilling)
- **Styling:** CSS variables + React inline styling
- **Tooling:** Bun, ESLint, Prettier, SonarLint

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) installed.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install dependencies:

```bash
bun install
# or npm install / yarn install
```

3. Run the development server:

```bash
bun dev
# or npm run dev / yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to play the game!

## ⌨️ Controls

The hint panel is always visible in the bottom-left corner during gameplay.

- **W A S D**: Move around the field
- **SHIFT**: Sprint (Hold to move faster)
- **SPACE**: Freeze/Unfreeze (Safety lock button to guarantee you don't accidentally press a movement key during Red Light)

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js app initialization and global CSS
├── components/           # React Three Fiber components
│   ├── Doll.tsx          # The giant doll boss logic
│   ├── PersonModel.tsx   # Custom dynamic humanoid character model loader
│   ├── Player.tsx        # Player control handling, physics clamp, and camera
│   ├── NPCRunners.tsx    # AI competitors logic
│   ├── Trackfield.tsx    # Floor, runway, and environment lines
│   ├── Scene.tsx         # The core game loop evaluating Red/Green phases
│   └── Trees.tsx         # Environment decoration
├── store/
│   └── gameStore.ts      # Global Zustand state bridging React and R3F
├── ui/                   # Flat HTML/CSS UI Overlays overlaying the <Canvas>
│   ├── MainMenu.tsx      # Landing page / start screen
│   ├── ControlsHint.tsx  # Keyboard instructions
│   └── WinScreen.tsx     # Victory celebration UI
└── utils/
    └── constants.ts      # Tuning parameters (speed, time, colors, positioning)
```

## 🛠 Linter Configuration

This project is configured perfectly for strict ESLint and TypeScript compilation.
To prevent IDEs from reporting false-positive errors on React Three Fiber elements (e.g., `<mesh position={...}>`), a dedicated `sonar-project.properties` and `.vscode/settings.json` has been bundled to natively suppress JSX `Unknown Property` warnings (`javascript:S6759` / `typescript:S6759`), keeping the workspace clean.

## 📄 License

This project is intended for educational and portfolio purposes.
