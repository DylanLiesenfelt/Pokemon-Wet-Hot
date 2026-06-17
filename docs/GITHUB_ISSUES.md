# GitHub Milestones & Issues

Each roadmap milestone maps to one GitHub Milestone; each bullet maps to one issue. Labels and acceptance criteria included. Run `create-github-issues.sh` to create everything via the GitHub CLI.

**Label set:** `type:infra` `type:feature` `type:content` `type:docs` `type:polish` `area:engine` `area:render` `area:ui` `area:battle` `area:pokemon` `area:world` `area:data` `area:save` `area:economy` `area:story`

---

## Milestone M0: Project Setup & Foundation

#### [M0.1] Repository and base docs
`type:infra` `type:docs`
- [ ] GPLv3 LICENSE committed
- [ ] README and CONTRIBUTING present
- [ ] .gitignore for Node/Vite

#### [M0.2] Static-site scaffold with game canvas
`type:infra` `area:render`
- [ ] Vite + React + TypeScript + Tailwind builds and runs
- [ ] App mounts a full-window canvas reachable by the engine

#### [M0.3] Dev log dropdown in nav bar
`type:feature` `area:ui`
- [ ] Nav bar dropdown toggles open/close
- [ ] Timestamped log messages render

---

## Milestone M1: Overworld Core

#### [M1.1] Canvas viewport (16:10, 32x20, integer scaling)
`area:render`
- [ ] Internal buffer 1024x640 (32x20 tiles at 32px)
- [ ] Integer-only upscale, nearest-neighbor
- [ ] 16:10 preserved on resize

#### [M1.2] Tileset loading and layered tilemap rendering
`area:render` `area:world`
- [ ] Tileset image loads and indexes 32x32 tiles
- [ ] ground / above / collision layers
- [ ] Offscreen tiles culled

#### [M1.3] Player-centered view
`area:render`
- [ ] Camera centers on player
- [ ] Clamped to map bounds
- [ ] Tracks interpolated position

#### [M1.4] Grid movement with smooth interpolation
`area:engine` `area:world`
- [ ] Whole-tile logic position
- [ ] Visual lerp between tiles (~130 ms), input locked mid-step
- [ ] Collision layer blocks movement

#### [M1.5] requestAnimationFrame loop with delta time
`area:engine`
- [ ] update(dt) and render split
- [ ] Frame-rate-independent timing
- [ ] Start/stop control

#### [M1.6] Game clock with selectable speeds
`area:engine`
- [ ] In-game time advances on the clock
- [ ] 1x / 2x / 3x toggle
- [ ] Exposed to other systems

#### [M1.7] Dev tools: tile painter and coordinate readout
`type:infra` `area:render`
- [ ] Paint tiles onto a chosen layer
- [ ] Live tile and pixel coordinate display
- [ ] Export current map arrays

---

## Milestone M2: Menu & UI Shell

#### [M2.1] Pause/main menu framework
`area:ui`
- [ ] Overlay opens/closes and pauses the overworld
- [ ] Keyboard and pointer navigation

#### [M2.2] Placeholder screens
`area:ui`
- [ ] Bag, Party, PC Boxes, Player Card, Pokédex, Map/Story reachable
- [ ] Placeholder layout with back navigation

---

## Milestone M3: Battle Engine Foundation

#### [M3.1] Battle engine module (TypeScript)
`area:battle`
- [ ] Pure, deterministic state-machine scaffold
- [ ] Seedable RNG
- [ ] Emits an ordered list of battle events

#### [M3.2] Pokemon class and data loading
`area:pokemon` `area:data`
- [ ] Typed species/move/type JSON loaders
- [ ] Instance with stat calc (base/IV/EV/nature/level)
- [ ] Current HP, status, moves, held item

#### [M3.3] Type-effectiveness chart
`area:battle` `area:data`
- [ ] Full matrix in JSON
- [ ] Dual-type multiplier lookup

#### [M3.4] Wild-encounter generation
`area:pokemon`
- [ ] Level, IVs, EVs, nature, ability
- [ ] Shiny roll
- [ ] Level-based movepool

#### [M3.5] Core battle loop (single battles)
`area:battle`
- [ ] Turn order (priority then speed)
- [ ] Move resolution, damage, faint
- [ ] Win / loss / flee outcomes

#### [M3.6] Catching mechanics
`area:battle`
- [ ] Catch math by ball, HP, status
- [ ] Shake checks
- [ ] Route caught Pokemon to party or PC

---

## Milestone M4: Party & Storage Services

#### [M4.1] Party management
`area:pokemon` `area:ui`
- [ ] Up to 6, reorder, view stats
- [ ] Lead / send-out selection

#### [M4.2] PC box services
`area:pokemon` `area:ui`
- [ ] Deposit / withdraw across multiple boxes
- [ ] Move between party and boxes

#### [M4.3] Save system (JSON to local machine)
`area:save`
- [ ] Serialize full save with a version field
- [ ] Write/read via File System Access API
- [ ] Download/upload fallback and autosave hooks

---

## Milestone M5: Progression Systems

#### [M5.1] EXP, leveling, and evolution services
`area:pokemon`
- [ ] Per-growth-rate EXP curves and gain
- [ ] Level-up stat recalc
- [ ] Evolution by level, item, trade, friendship

#### [M5.2] Movesets and level-up learning
`area:pokemon`
- [ ] Learn moves at the right level
- [ ] 4-move limit with replace prompt

#### [M5.3] Held items, status conditions, friendship
`area:battle` `area:pokemon`
- [ ] Held item slot and effect hook
- [ ] Status effects in battle (par/brn/psn/slp/frz)
- [ ] Friendship tracked

---

## Milestone M6: Trainers, Gyms & Economy

#### [M6.1] Trainer battles
`area:battle`
- [ ] Scripted trainer teams with AI move/switch
- [ ] Multi-Pokemon battles
- [ ] Money reward on win

#### [M6.2] Gym battles and 8-badge system
`area:battle` `area:world`
- [ ] 8 gyms challengeable in any order
- [ ] Badge awarded and stored on win

#### [M6.3] Healing loop (Pokécenter, Pokémart, items)
`area:economy` `area:ui`
- [ ] Pokécenter full heal
- [ ] Pokémart buy/sell
- [ ] Field and battle healing items

---

## Milestone M7: Content Buildout

#### [M7.1] All base species and evolutions with base sprites
`type:content` `area:data`
- [ ] ~100 base forms (roughly 300 with evolutions) defined in JSON
- [ ] Base sprite for each

#### [M7.2] Starter lines, gym rosters, regional variants
`type:content` `area:data`
- [ ] Three starter lines defined
- [ ] Gym-leader rosters defined
- [ ] Regional variants defined

#### [M7.3] Expanded move and item sets
`type:content` `area:data`
- [ ] Moves required by all rosters present
- [ ] Item set expanded

#### [M7.4] Heavy battle playtest and balance pass
`area:battle` `type:polish`
- [ ] Full battle playthrough tested
- [ ] Damage and level balance tuned

---

## Milestone M8: Overworld Buildout

#### [M8.1] Color palette lock and tileset finalization
`area:render` `type:content`
- [ ] Palette locked
- [ ] Final tileset assembled

#### [M8.2] Full region layout (start area to Gym 2 first)
`area:world` `type:content`
- [ ] Start area, Gym 1, Gym 2, and connecting routes built
- [ ] Map transitions work

#### [M8.3] Encounter zones and Pokédex-to-area mapping
`area:world` `area:data`
- [ ] Encounter tables per zone
- [ ] Species mapped to areas in data

#### [M8.4] Day/night cycle
`area:world` `area:engine`
- [ ] ~1h dawn / 3h day / 1h dusk / 3h night
- [ ] Palette and encounter tables shift by phase

#### [M8.5] Travel methods
`area:world` `type:feature`
- [ ] Running, rentable scooter, Surf
- [ ] Fast-travel: Fly, Train, Bus, Ride-share

#### [M8.6] Expanded dev map menu
`type:infra` `area:world`
- [ ] Map list, warp, and inspection tools

---

## Milestone M9: Story Integration

#### [M9.1] League challenge framing and progression gates
`area:story`
- [ ] League framing in place
- [ ] Story gates tied to badges and flags

#### [M9.2] Team Paradise arc and Paradise Island finale
`area:story` `area:world`
- [ ] Team Paradise encounters across the region
- [ ] Paradise Island finale (post-Gym 7/8, pre-Elite Four)

#### [M9.3] Elite Four (double battles) and Champion
`area:battle` `area:story`
- [ ] Four members as double battles
- [ ] Champion fight

#### [M9.4] Legendary encounters
`area:story` `area:pokemon`
- [ ] Legendary encounter(s) implemented
- [ ] Catch and flee handling

---

## Milestone M10: Polish & 1.0

#### [M10.1] Final sprites and regional forms
`type:content` `type:polish`
- [ ] Final sprites including regional forms

#### [M10.2] Full playtest, balance, and bug pass
`type:polish`
- [ ] End-to-end playthrough
- [ ] Bugs triaged and fixed

#### [M10.3] Battle/menu UI finalization
`area:ui` `type:polish`
- [ ] Battle UI finalized
- [ ] Menu UI finalized

#### [M10.4] Save robustness, accessibility, performance
`type:polish` `area:save`
- [ ] Save migration tested
- [ ] Accessibility pass
- [ ] First-load and runtime performance reviewed

#### [M10.5] Release candidate to 1.0
`type:polish`
- [ ] RC tagged
- [ ] 1.0 released
