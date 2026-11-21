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

### Phase 2 — Interior and kitchen detail (initial pass implemented)
- Added kitchen backsplash, extractor hood, stove controls, cabinet drawer fronts, and fridge shelves/interior light.
- Added counter trim/kickplate and small prep-area props.
- Added table plate rim, coaster, napkin, and cutlery details.
- Decorative additions reuse existing geometry helpers and do not intentionally change gameplay anchors, interaction points, or collision checks.
- Browser/device regression testing is still required.

### Phase 3 — Environment and reflections (initial pass implemented)
- Reworked street trees with shared bark/foliage materials, split branches, layered canopy clusters, and compact planted bases.
- Improved nearby building façades with shared physical glass, window mullions and sills, storefront glazing, sign bands, entrance framing, and canopies.
- Kept the existing road layout, traffic paths, building placement, and gameplay boundaries unchanged.
- PMREM/environment-map reflections remain deferred until memory and performance can be measured in a browser.
- Browser/device regression testing is still required.

### Phase 4 — Characters and animation (initial detail pass implemented)
- Added tailored shirt pockets, pocket flaps, subtle buttons, apron straps, apron pocket and seam details, and refined name-tag placement to the existing articulated character rig.
- Reused the existing body rig, limb groups, animation functions, character creation parameters, and movement system.
- Character identity/configuration, names, interaction radii, staff roles, and movement targets remain unchanged.
- Animation transition blending remains a later pass because it needs runtime validation against seated, walking, serving, and player-control states.
- Browser/device regression testing is still required.

### Phase 5 — Post-processing and quality controls (initial pass implemented)
- Added Low / Medium / High graphics presets in Settings, stored separately from gameplay saves.
- Added a device-aware default: touch-first / lower-core / lower-memory devices start at Low; other devices start at Medium.
- Presets adjust renderer pixel ratio, shadow-map resolution and radius, and tone-mapping exposure without changing the gameplay simulation.
- Kept the existing Three.js renderer and direct render loop as the fallback; no EffectComposer, SSAO, or bloom dependency was added in this pass to protect performance.
- Browser/device regression testing and frame-rate measurement are still required.

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
