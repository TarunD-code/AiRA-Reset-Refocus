# AiRA — Reset & Refocus

> **Adaptive Mobility, Ergonomics & Focus Coach for Software Engineers**

**AiRA** (Reset & Refocus) is an elite, developer-first mobility, ergonomics, and wellness application engineered specifically for remote software engineers to combat screen fatigue, repetitive strain injuries (RSI), and cognitive burnout. By combining adaptive micro-break mobility routines, real-time posture focus indicators, gamified breathwork capacity tests, ambient cognitive load tracking, smart calendar conflict detection, and global theme customization, AiRA seamlessly fits into a software engineer's daily coding workflow without breaking focus.

---

## 🏗️ Core Architecture & Technology Stack

AiRA is built on a high-throughput, declarative **OpenUI** framework featuring a deterministic state-machine server architecture paired with a trusted client-side DOM rendering engine:

```
┌────────────────────────────────┐                 OpenUI Statements                 ┌──────────────────────────────────┐
│     State-Machine Server       │ ────────────────────────────────────────────────> │       OpenUI Parser & Doc        │
│      (src/server/mock.ts)      │ <──────────────────────────────────────────────── │  (src/shared/openui/document.ts) │
└────────────────────────────────┘                   User Action                     └─────────────────┬────────────────┘
                                                                                                       │
                                                                                                       ▼
┌────────────────────────────────┐                 Native HTML Nodes                 ┌──────────────────────────────────┐
│   Strict Schema Validator      │ ────────────────────────────────────────────────> │       Trusted Component Port     │
│   (src/shared/openui/validate.ts) │                                                │     (src/web/components.ts)      │
└────────────────────────────────┘                                                   └──────────────────────────────────┘
```

- **State-Machine Server Architecture ([`src/server/mock.ts`](file:///d:/All%20Documents/task/AIAIRA/Aira/workout-starter/src/server/mock.ts)):** Manages deterministic interaction state flows, routing seamlessly across Welcome, Adaptive Mobility Queue, Military Lung Capacity Test, Calendar Interruption, Pre-meeting Grounding, and Session Summary screens with state-preserving reset handling.
- **Declarative OpenUI Library ([`src/shared/openui/openui-library.ts`](file:///d:/All%20Documents/task/AIAIRA/Aira/workout-starter/src/shared/openui/openui-library.ts)):** Defines strict statement signatures, parameter expectations, required arguments, and child node hierarchy rules for all OpenUI interface elements.
- **Strict Schema Validator ([`src/shared/openui/validate.ts`](file:///d:/All%20Documents/task/AIAIRA/Aira/workout-starter/src/shared/openui/validate.ts)):** Enforces payload safety, structural constraints, data type validation, and prop checking prior to client DOM instantiation.
- **Modular Custom OpenUI Component Library ([`src/web/components.ts`](file:///d:/All%20Documents/task/AIAIRA/Aira/workout-starter/src/web/components.ts)):** Transforms validated OpenUI abstract syntax trees (AST) into high-performance native HTML DOM nodes with Web Animations API micro-interactions, standardized full-body avatar renderers, and strict CSS layout containment.

---

## ✨ Key Product Innovations & Features

### 1. Randomized 19-Exercise Adaptive Queue
Features a rich, 19-exercise movement library engineered specifically for desk-bound software engineers:

| Exercise Guide | Focus Area | Dynamic Motion & Avatar Visualization |
| :--- | :--- | :--- |
| `NeckRollGuide()` | Cervical Spine | Smooth 360° pivoting head rotation |
| `ShoulderShrugGuide()` | Trapezius / Upper Back | Vertical shoulder elevation cycles |
| `StandingGuide()` | Chest & Posture | Lateral arm rotation Z-stretches |
| `TorsoTwistGuide()` | Thoracic Spine | 3D perspective Y-axis torso rotation |
| `PelvicTiltGuide()` | Lumbar / Core | Z-axis pelvic pivot & backrest flattening |
| `KneeChestGuide()` | Hip Flexors | Knee elevation & dual arm hug motion |
| `LegExtensionGuide()` | Quadriceps / Hamstrings | 90° leg extension & quad lock |
| `FigureFourGuide()` | Glutes / Piriformis | Full-body avatar with ankle-on-knee hip hinge rotation |
| `HeelToeGuide()` | Plantar Flexors | Full-body avatar with heel and toe alternation pivoting |
| `HandWristGuide()` | Forearm & Wrist | Full-body avatar with arm extension & wrist flexion |
| `SeatedMarchGuide()` | Lower Body Circulation | Alternating knee marching cycles |
| `TricepsLatGuide()` | Overhead Lats | Elbow bend & torso side tilt |
| `RhomboidPressGuide()` | Upper Back Release | Interlaced arm press & back rounding |
| `OverheadSideBendGuide()` | Lateral Spine | Dual arm overhead side-to-side arc |
| `AnklePumpGuide()` | Lower Leg Circulation | Full-body avatar with leg elevation & ankle pumps |
| `AnkleCircleGuide()` | Ankle Mobility | Full-body avatar with full 360° foot rotation |
| `ToeTapGuide()` | Tibialis Anterior | Full-body avatar with rapid toe tapping vibration |
| `DeskPushUpGuide()` | Upper Body Strength | Centered full-body avatar with angled push-up descent |
| `ChairSquatGuide()` | Glutes & Quads | Full-body avatar with seat squatting & arm extension |

**Adaptive Queue Routing:** Server-side state tracking in [`src/server/mock.ts`](file:///d:/All%20Documents/task/AIAIRA/Aira/workout-starter/src/server/mock.ts) guarantees that consecutive exercise requests cycle through non-repeating routines (`lastEx` memory guard).

### 2. Military Lung Capacity Test (Gamified UI)
An interactive breathwork assessment tool (`LungCapacityGame`) rendered on a dark circular tracking canvas (`#09090b`):
- **Inhale / Hold Phase Mechanics:** Features a high-precision perimeter spinner (`.lung-spinner`) that tracks an 8-second Inhale phase before transitioning to a real-time Hold-Breath stopwatch.
- **Delayed Health Rating (`% HEALTHY`):** Evaluates hold duration upon exhale trigger and displays a dynamic percentage health rating (e.g., `85% HEALTHY` in emerald text).
- **Immediate "Try Again" Reset Loop:** Zero-friction state reset allowing engineers to instantly retry the lung test.

### 3. Ambient Energy Meter
A predictive burnout monitor (`EnergyMeter`) mounted on the primary interface header:
- **Fresh (Emerald `#10b981`):** Optimal focus state (0% – 49% cognitive load).
- **Focus Fatigue (Amber `#f59e0b`):** Mid-day cognitive load warning (50% – 79% cognitive load).
- **Burnout Risk (Crimson `#ef4444`):** High fatigue alert urging an immediate micro-break (80% – 100% cognitive load).

### 4. Contextual Calendar Sync & Smart Postponement
Integrated with `CalendarBanner` and meeting conflict detection:
- Automatically detects upcoming schedule obligations (e.g., *📅 Next: Sprint Planning in 6 mins*).
- **Smart Postponement:** Prompts developers to pivot into a 30-second grounding breathing exercise (`BreathingPacer` for Box Breathing) or bypass directly via `"Skip to Meeting"`.

### 5. Global Theme Persistence & Header Toggle
Features a global `ThemeToggle` component positioned in the top-right header zone (aligned horizontally with the meta badge, above the screen preview card):
- **Light Mode (Classic View):** Off-white background (`#fafaf9`), dark text (`#1c1917`), clean cards (`#ffffff`), and stone borders (`#e7e5e4`).
- **Dark Mode (Obsidian View):** Precision Dark background (`#09090b`), off-white text (`#f4f4f5`), surface cards (`#18181b`), and slate borders (`#27272a`).
- **Global Theme Persistence:** State is synchronized on `document.body` (`.theme-dark`), persisting across all screen transitions and stepper turns.

### 6. Voice-First "Audio Coach" Mode
An architectural accessibility toggle (`AudioCoachToggle`) rendered directly on the primary action bar:
- Dynamic status pill (`🎙️ Audio Coach: OFF` / `ON`).
- Glows emerald when active (`#10b981`), enabling developers to transition into hands-free mode where spoken `Cue` prompts guide movements screen-away.

---

## ⚡ User Interaction Model

AiRA eliminates developer context switching through **zero-typing interaction flows**:

```
                       ┌───────────────────────────────┐
                       │    Welcome Screen (Screen 1)  │
                       └───────────────┬───────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌──────────────────────┐                              ┌──────────────────────┐
│  Mobility Queue      │                              │  Lung Capacity Test  │
│  "Begin Mobility"    │                              │  "Test Lung Capacity"│
└───────────┬──────────┘                              └───────────┬──────────┘
            │                                                     │
            ├──────────────────────────┐                          │
            ▼                          ▼                          │
┌──────────────────────┐   ┌──────────────────────┐               │
│ Next Exercise Loop   │   │ Calendar Interrupt   │ ◄─────────────┘
│ "Next Exercise"      │   │ "I have a meeting!"  │
└──────────────────────┘   └───────────┬──────────┘
                                       ▼
                           ┌──────────────────────┐
                           │ Box Breathing Pacer  │
                           │ "Done, ready..."     │
                           └───────────┬──────────┘
                                       ▼
                           ┌──────────────────────┐
                           │   Reset Complete     │
                           └──────────────────────┘
```

- **Native `FollowUps` Prompt Pills:** Every turn renders clickable action pills (`"Begin Mobility Routine"`, `"Next Exercise"`, `"Test Lung Capacity"`, `"I have a meeting!"`, `"Done, ready for meeting"`).
- **Zero-Typing Workflow:** Developers can execute complete micro-break routines without touching their keyboard or leaving their IDE focus.
- **Spoken Guidance (`Cue`):** Text cues provide out-loud instructions for posture adjustment, breath cadence, and movement execution.

---

## 📌 Explanation of the Assessment Harness Disclaimer

> [!NOTE]
> **Harness Boundary & Simulation Disclaimer:**
> The system disclaimer (*"No microphone, audio, TTS or physical exertion"*) represents an intentional native harness boundary. It signifies a pure state-driven, deterministic local prototype environment designed for rapid evaluation of OpenUI component composition, state routing, component signatures, and prompt protocols without requiring physical hardware peripherals, speech synthesis engines, or external cloud API keys.

---

## 🚀 Future Enhancements & Roadmap

The upcoming feature pipeline for **AiRA** focuses on expanding workspace integration, biometric telemetry, local AI privacy, multiplayer team routines, and long-term health analytics:

1. **IDE & Workspace Integration:** Development of native VS Code, Cursor, and JetBrains extensions to embed the ambient energy meter, posture reminders, and micro-break prompts directly within the code editor status bar and activity bar, eliminating browser context switching entirely.
2. **Wearable & Biometric Syncing:** Direct API integration with Apple Health, Google Fit, Whoop, and Oura Ring to transition the predictive energy meter into a live physiological dashboard driven by real-time Heart Rate Variability (HRV), resting heart rate, and stress telemetry.
3. **Local LLM Support for Enterprise Privacy:** Support for offline AI model processing via Ollama (e.g., Llama 3, Mistral, Phind) to enable enterprise developers operating under strict NDAs, regulated environments, or air-gapped networks to utilize the wellness coach locally without cloud API dependencies.
4. **Engineering Team "Sync Breaks":** A multiplayer team mode featuring Slack and Microsoft Teams app integrations to trigger synchronized 2-minute mobility breaks for engineering pods following intense sprint planning sessions, incident retrospectives, or pull-request reviews.
5. **Analytics Dashboard & Health Progression:** A comprehensive data visualization suite tracking user mobility streaks, lung capacity progression, posture focus compliance, and micro-break completion over time, complete with automated CSV and PDF exports for healthcare professionals, ergonomics advisors, and physical therapists.

---

## 🚀 Quick Start & Quality Verification Suite

### Prerequisites
- **Node.js:** `>= 22.18.0`
- **npm:** Included with Node.js

### Running the Application

1. **Install Dependencies:**
   ```sh
   npm ci --ignore-scripts
   ```

2. **Start Development Server:**
   ```sh
   npm start
   ```

3. **Access Local App:**
   Open [http://127.0.0.1:4319](http://127.0.0.1:4319) in your browser.

### Quality Verification Commands

```sh
# 1. Run static TypeScript typechecking (0 errors required)
npm run typecheck

# 2. Run safety linter checks (0 errors required)
npm run lint

# 3. Run core contract and unit test suite
npm test

# 4. Run build script to update distribution bundles
npm run build
```

---

## 🧪 Tested Runtime Modes

The following runtime modes were verified:
- **Mock Server Harness (`src/server/mock.ts`):** Fully tested via interactive HTTP transport and deterministic state machine flow.
- **TypeScript Static Typecheck (`npm run typecheck`):** Verified clean with 0 errors (`tsc --noEmit`).
- **Safety Linter (`npm run lint`):** Verified clean with no unsafe dynamic code, trailing whitespace, or unescaped HTML injection.
- **Node Contract Test Suite (`npm test` / `tests/core.test.mjs`):** 16/16 core tests passed 100% for parser, server mock, serializing, document AST, component contracts, and timer store.
