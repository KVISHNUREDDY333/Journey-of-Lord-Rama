# System Architecture: Ramayana - The Epic Journey

## 1. Overview

The game follows a modular "Engine-System" architecture where the game logic is decoupled from the narrative and AI logic.

## 2. Core Components

### A. Game Engine (Client)

- **Renderer**: Uses HTML5 Canvas for high-performance 2D/3D rendering.
- **GameLoop**: A standard requestAnimationFrame loop running at 60FPS.
- **StoryEngine**: Manages level progression and state transitions between the 10 levels.
- **CombatSystem**: Mathematical model for bow mechanics, accuracy, and special divine abilities (Astras).

### B. Story Engine (Data Driven)

- Chapters and levels are defined in JSON, allowing for easy updates without changing code.
- State machine handles "Story Moments" vs "Gameplay Moments".

### C. AI Engine (The Brain)

- **Dynamic Dialogue**: Powered by Gemini/Groq. Each character has a "System Prompt" that defines their personality and knowledge boundary.
- **Context Memory**: The backend stores player decisions and dialogue history in MongoDB to ensure continuity.

### D. Backend (FastAPI)

- Handles authentication, persistence (saving game progress), and serves as a secure proxy to the LLM APIs.

## 3. Data Flow

1. **User Input** → InputHandler → GameLoop updates state.
2. **Interaction (NPC)** → Request to AI Dialogue API (FastAPI) → Gemini processes prompt → Character response returned.
3. **Decision Made** → ProgressAPI updates MongoDB.
4. **Level Complete** → LearningSystem pulls moral summary from `chapters.json`.

## 4. Visual Philosophy

- **Rich Aesthetics**: Traditional Indian patterns (Mandala, Rangoli) integrated into UI.
- **Cinematic Transitions**: Use of CSS filters and Canvas opacity for smooth level transitions.
