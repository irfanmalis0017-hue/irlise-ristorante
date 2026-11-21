# IRLISE RISTORANTE 2.0 — Visual Upgrade Roadmap

## Direction
Modern Premium Realistic: warm interior lighting, natural wood and stone surfaces, restrained metal reflections, readable gameplay silhouettes, and balanced frame performance.

## Compatibility rules
- Keep the current Three.js 0.160.0 runtime for this upgrade phase.
- Do not change customer, staff, cooking, delivery, economy, progression, input, or collision logic as part of visual-only commits.
- Preserve the existing localStorage save key and save schema. Do not bump SAVE_VERSION unless a future gameplay/data migration truly requires it.
- Keep the 1.9.0 release on `main`; this branch is a preview and must not publish a 2.0.0 status version before acceptance.
- Prefer self-contained assets and graceful fallbacks. Avoid making the game depend on large remote model/texture downloads.

## Phased implementation

### Phase 1 — Surface materials and lighting (started)
- Add small procedural CanvasTextures for wood, stone, ceramic tile, painted wall, and brushed steel.
- Add subtle roughness maps to selected surfaces.
- Tune the existing hemisphere and directional lights; improve shadow bias/range.
- Add a small number of non-shadow-casting warm point lights for dining-room fill.
- Keep ACES tone mapping and the current renderer pipeline.

### Phase 2 — Interior and kitchen detail
- Improve visible table, chair, counter, stove, fridge, and prep-surface details.
- Use shared geometries/materials where possible.
- Do not alter object positions used by interactions or collision checks without a dedicated gameplay regression test.

### Phase 3 — Environment and reflections
- Add a lightweight environment map with PMREM only after measuring memory and load cost.
- Improve windows, exterior storefronts, vegetation, road and pedestrian surroundings.
- Keep a fallback when environment assets fail to load.

### Phase 4 — Characters and animation
- Improve character proportions, clothing details, and animation transitions.
- Preserve character names, interaction radii, staff roles, and movement targets.

### Phase 5 — Post-processing and quality controls
- Consider subtle ambient occlusion and restrained bloom; avoid heavy effects by default.
- Add Low / Medium / High settings with sensible device-aware defaults.
- Keep the existing renderer as the fallback path.

### Phase 6 — Acceptance and release
- Verify restaurant loading, movement, collision, customer queues, cooking, serving, staff shifts, upgrades, expansion, pause/settings, language, and mobile controls.
- Verify old 1.9.0 localStorage saves load unchanged and export/import still works.
- Check browser console for errors and compare frame pacing on integrated/mobile GPUs.
- Only after acceptance, update visible game version and status.json to 2.0.0.

## Phase 1 implementation notes
- Textures are generated in-browser from Canvas; no external image downloads were introduced.
- Existing gameplay and save code were not intentionally modified.
- The initial lighting pass keeps local lights non-shadow-casting to limit GPU cost.
- This is a source-level implementation preview. Visual quality and frame-rate still require browser/device testing before merging.
