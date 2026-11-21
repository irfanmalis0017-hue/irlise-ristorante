# IRLISE AI Headquarters — backend setup

This branch now includes an optional Cloudflare Pages Functions API and a D1 migration. The browser dashboard remains in local-only mode until every step below is configured.

## Required Cloudflare setup

1. Create a Cloudflare D1 database for the office.
2. Apply `migrations/0001_tasks.sql` to that database.
3. In the Cloudflare Pages project connected to this repository, add a D1 binding named `DB` pointing to the new database (both Preview and Production environments only if intentionally needed).
4. Add a Cloudflare Zero Trust Access application protecting the office hostname and its `/api/*` routes. Restrict access to the CEO and explicitly approved team members.
5. Add Pages environment variables:
   - `ACCESS_TEAM_DOMAIN`: your Zero Trust team domain, for example `example.cloudflareaccess.com` (domain only).
   - `ACCESS_AUD`: the audience tag for the Access application.
6. Deploy the office branch as a Pages preview and verify that unauthenticated requests to `/api/tasks` return HTTP 401. Do not expose the API publicly without Access.
7. Sign in through Access, then verify GET, create, and status update from the office UI.

## API

- `GET /api/tasks`: list the latest 200 tasks.
- `POST /api/tasks` with `{"action":"create","task":"...","team":"Programmer"}`: create a task.
- `POST /api/tasks` with `{"action":"update","id":"...","status":"Dikerjakan"}`: update a task status.

Supported team names: Game Designer, 3D Artist, Programmer, QA Tester, Performance Engineer, Release Manager.

The API verifies the Cloudflare Access JWT signature, issuer, expiry, and audience before accessing D1. No API key is placed in browser code.

## Important limitations

- This API stores and synchronizes task records; it does **not** run AI agents or execute code.
- GitHub write actions, test runners, and AI execution are separate later phases and must use narrowly scoped credentials on the server.
- Main game branch is not modified. Do not merge this branch into `main` to publish the office.
