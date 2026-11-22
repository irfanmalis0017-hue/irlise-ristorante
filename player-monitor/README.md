# IRLISE PLAYER MONITOR

Standalone admin web app (PWA) for monitoring IRLISE RISTORANTE play sessions. This project lives in its own folder and is deployed separately from the game.

## Current MVP
- Admin password login using the Cloudflare Pages secret `ADMIN_SECRET`.
- D1 database for player names, consent timestamps, and play sessions.
- Player API endpoints: start, heartbeat, end.
- Admin overview: online players, sessions today, total players, recent sessions.
- PWA manifest and service worker. API requests are never cached.

## Cloudflare Pages setup
Create a **separate Cloudflare Pages project** connected to this repository:
- Production branch: `feature/player-monitor-web` while testing.
- Root directory: `player-monitor`.
- Build command: leave empty.
- Build output directory: `public`.
- Functions directory: `functions` (relative to the project root).

Create a D1 database, then bind it to the Pages project with the binding name **DB**. Apply `schema.sql` to that database using the Cloudflare D1 console or Wrangler.

Add one Cloudflare Pages secret named **ADMIN_SECRET**. Use a long, random password (at least 32 characters). Do not put its value in GitHub or source files. The same secret signs the admin session cookie.

## API contract for the game integration
All player tracking is opt-in. The game should show a clear notice and ask the player to enter a display name and agree before sending data.

- `POST /api/player/start` JSON: `{"name":"Nama pemain","player_key":"random-stable-id","consent":true}`
  - Returns `{"ok":true,"session_id":"..."}`.
- `POST /api/player/heartbeat` JSON: `{"session_id":"..."}` every 30 seconds while playing.
- `POST /api/player/end` JSON: `{"session_id":"..."}` when the player exits or chooses to stop tracking.
- Admin: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/overview`.

The player key should be generated randomly by the game and stored locally; do not collect device fingerprints, precise location, or unrelated personal data. Online status is inferred from heartbeats in the last 90 seconds. A player who closes the tab without ending a session will automatically become offline after the timeout.

## Important next steps before public launch
1. Add rate limiting and abuse protection to public player endpoints.
2. Add retention/deletion controls for player records.
3. Add proper 192x192 and 512x512 PNG icons if required by target install browsers.
4. Test login, D1 binding, consent flow, offline timeout, and PWA install on real devices.
5. Integrate the opt-in form and heartbeat calls into the game only after the dashboard is deployed and tested.

No game files in the repository root are modified by this branch.
