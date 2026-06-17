# Pokémon: Wet-Hot — Technical Specification

**Version:** 0

Vision, roadmap, story, and licensing live in the README. This document covers only the technical design.

---

## 1. Architecture

Single language end to end: TypeScript. React owns the DOM (menus, HUD, dev log, overlays) and hosts one `<canvas>`. The game engine is plain framework-agnostic TS that renders to that canvas and runs its own loop. JSON files supply all content.
```
┌──────────────────────── Browser / Desktop App ─────────────────────────┐
│                                                                        │
│  React (DOM)                         Game Engine (plain TS)            │
│  ┌──────────────────────┐            ┌──────────────────────────────┐  │
│  │ Menus, HUD, dialog   │  state     │ Loop (rAF) + scene manager   │  │
│  │ Dev log, overlays    │  store     │ Canvas renderer + camera     │  │
│  │ Title / settings     │            │ Tilemap, sprites, input      │  │
│  └──────────────────────┘            │ World, collision, encounters │  │
│           │                          │ Battle state machine         │  │
│           │                          │ Pokémon model + progression  │  │
│           ▼                          └──────────────────────────────┘  │
│   Shared game state (store)                      |                     │
│           └───────────────┬──────────────────────┘                     │
│                           ▼                                            │
│              JSON data: species, moves, types, maps,                   │
│              encounters, trainers, gyms                                │
└────────────────────────────────────────────────────────────────────────┘
```

**Decoupling rule:** the engine never depends on React, and the game loop runs through `requestAnimationFrame`, not React renders. React reads engine state through a shared store and writes player intent back (menu actions, battle commands). This keeps 60 fps rendering independent of React's render cycle.

**Build:** Vite, React, TypeScript, Tailwind.

---

## 2. Rendering

**Resolution.** Internal buffer is fixed at **1024x640** (32x20 tiles, 32px each, 16:10). CSS upscales by integer factors only, nearest-neighbor (`image-rendering: pixelated`, `imageSmoothingEnabled = false`). The renderer picks the largest integer scale that fits the window.

**Tilemaps.** Each map is parallel 2D index arrays into a shared tileset:
- `ground`: base terrain, always drawn
- `above`: overhang tiles drawn over the player for depth
- `collision`: non-rendered walkability and encounter metadata

**Culling.** Only the visible tile window plus a one-tile margin is drawn per frame.

**Loop.** `update(dt)` then `render()`. No logic in the render pass.

**Movement.** Grid-authoritative, visually interpolated. Logic position is always a whole tile; the visual position lerps between tiles over roughly 120 to 140 ms with input locked during the step. Camera centers on the interpolated position, clamped to `[0, mapPixels - viewport]`.

---

## 3. Battle Engine (TypeScript)

Pure, deterministic, framework-free. Invoked when an encounter starts; returns ordered events the renderer animates.

**Modules:**
- `model`: Pokémon instance (stats from base + IV + EV + nature + level, current HP, status, moves, held item)
- `generate`: wild and trainer creation (level, IVs, EVs, nature, ability, shiny roll, level-based movepool)
- `damage`: STAB, type multipliers, crit, random factor, weather and terrain hooks
- `battle`: turn order (priority then speed), action resolution, end-of-turn effects, win/loss/caught/fled
- `ai`: opponent move and switch selection, scaled by trainer tier
- `capture`: catch math by ball, HP, and status
- `progression`: EXP, level-up, evolution (level, item, trade-equivalent, friendship)

**Turn contract:**
```ts
resolveTurn(state: BattleState, action: BattleAction): BattleResult
// BattleResult = { events: BattleEvent[]; state: BattleState; finished: boolean; outcome: Outcome }
```

**RNG** is centralized and seedable for reproducible tests.

**Doubles** are supported from the start (target selection, spread-move reduction, redirection); single battles are the one-slot case. Elite Four battles use doubles.

---

## 4. Save System

Saves are JSON written to a local folder. On the web build this uses the File System Access API where available, with download/upload of a `.json` as the fallback. The later desktop build writes directly to disk.

Every save carries a `version` with a forward migration path. Autosave fires on heal, area change, and post-battle.

---

## 5. Data Schemas (illustrative)

**Species**
```json
{
  "id": "trapinch",
  "dex_no": 51,
  "name": "Trapinch",
  "types": ["ground", "bug"],
  "base_stats": { "hp": 45, "atk": 100, "def": 45, "spa": 45, "spd": 45, "spe": 10 },
  "abilities": ["hyper_cutter"],
  "hidden_ability": "sheer_force",
  "catch_rate": 180,
  "base_exp": 58,
  "growth_rate": "medium_slow",
  "ev_yield": { "atk": 1 },
  "gender_ratio": 0.6, # male to female; 60% male 40% female
  "egg_groups": ["bug"],
  "evolves_to": [{ "id": "vibrava", "method": "level", "value": 35 }],
  "learnset": [{ "level": 1, "move": "bite" }, { "level": 9, "move": "sand_attack" }],
  "encounter_areas": ["Route 1"],
  "sprite": {
    "front" : "sprites/trapinch-front.png",
    "back" : "sprites/trapinch-back.png",
    "party" : "sprites/trapinch-party.png"}
}
```

**Move**
```json
{
  "id": "earthquake", "name": "Earthquake", "type": "ground",
  "category": "physical", "power": 100, "accuracy": 100, "pp": 10,
  "priority": 0, "target": "all_adjacent", "effects": []
}
```

**Pokémon instance**
```json
{
  "species": "trapinch", "nickname": null, "level": 12, "exp": 1450,
  "nature": "adamant", "ability": "hyper_cutter",
  "ivs": { "hp": 31, "atk": 28, "def": 12, "spa": 5, "spd": 18, "spe": 22 },
  "evs": { "atk": 12 },
  "moves": [{ "id": "bite", "pp": 25 }],
  "hp_current": 30, "status": null, "held_item": null, "shiny": false,
  "friendship": 70, "ot": { "name": "Player", "id": 12345 },
  "met": { "level": 5, "location": "pine_scrub_route" }
}
```

**Save**
```json
{
  "save_id": 1,
  "player": { "name": "Red", "map": "home_town", "x": 12, "y": 8, "facing": "down", "money": 3000 },
  "badges": ["bug", "psychic"],
  "party": ["<instance>"],
  "boxes": [["<instance>"]],
  "pokedex": { "seen": ["trapinch"], "caught": ["trapinch"] },
  "bag": { "items": {}, "balls": {}, "key_items": [] },
  "flags": { "met_pete": false, "train_unlocked": false },
  "clock": { "in_game_minutes": 480 },
  "playtime_seconds": 0,
  "game_version" : v0.0.0
}
```

The type chart is a JSON matrix shared by the renderer (UI hints) and the battle engine.

---

## 6. Game Systems

**Encounters.** Tile-tagged zones roll per step against a weighted, time-of-day-aware species table that feeds `generate`.

**Open-order gym scaling.** Ace species is fixed per leader; level and team size scale to badges currently held.
- Ace level = 13 + (7 x badges held), giving 13 at the first gym and 62 at the eighth.
- Team size grows from 3 to 6 across the run; support members sit 2 to 5 levels below the ace.
- Gym teams are hand written in the gymleaders JSON, selection is based solely based on number of badges

**Doubles** apply to the Elite Four. Each member needs spread moves, redirection (Follow Me / Rage Powder), and Protect to play correctly.

**Progression.** Per-growth-rate EXP curves; evolution by level, item, trade-equivalent, and friendship.

**Day/night** drives palette and encounter tables, tied to the in-game clock. checked and updated after leaving menu, going outside, or exiting a battle in the overworld

**Travel.** On-foot, running, rentable scooter, Surf, plus fast-travel (Fly, Train unlocked at gym 2 town, Bus, Ride-share).

---

## 7. Content Scope

- About 100 base-form species (roughly 300 counting evolutions), each with a base sprite. Regional sprites can follow.
- Three starter lines forming a type triangle, Electric beats Water beats Ground/Bug beats Electric:
  - **Coalossal** (Rolycoly, Carkol, Coalossal): Rock/Electric, Regional Variant, Nuclear power/ Uranium Themed
  - **Mantine** (Mantyke, Mantine, new third stage Regional Variant): Water/Flying
  - **Flygon** (Trapinch, Vibrava, Flygon): Ground/Bug type Regional Variant\

Full dex, gym rosters, and story beats live in their respective design docs.

---

## 8. Project Structure (proposed)

```
/
  index.html
  package.json  tsconfig.json  vite.config.ts  tailwind.config.js
  /src
    main.tsx  App.tsx
    /ui            React: menus, HUD, dialog, dev log, overlays
    /state         shared store, React bindings
    /game
      /engine      loop, scene manager, input, clock
      /render      canvas renderer, tilemap, camera, sprites
      /world       maps, collision, NPCs, encounter triggers
      /battle      state machine, damage, types, ai, capture
      /pokemon     model, generation, progression
      /save        serialize, file read/write, migrations
    /data          *.json (species, moves, types, maps, encounters, trainers, gyms)
    /assets        sprites/, tilesets/, audio/
  LICENSE  README.md  SPECIFICATION.md  CONTRIBUTING.md
```

---

## 9. Performance Budget

First load is dominated by assets. Compress sprites and audio, lazy-load areas and audio, and lean on CDN caching for repeat visits. Cull offscreen tiles, keep the battle engine pure, and never run heavy work inside React renders.

---

## 10. Distribution

Static web build now. A downloadable desktop build follows later as a thin wrapper ( Electron) reusing the same TS codebase, gaining direct filesystem saves.

---