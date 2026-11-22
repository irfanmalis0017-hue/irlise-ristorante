export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().replace(/\\s+/g, " ").slice(0, 24);
    const playerKey = String(body.player_key || "").slice(0, 64);
    if (body.consent !== true) return Response.json({ error: "Persetujuan diperlukan." }, { status: 400 });
    if (name.length < 2 || !/^[\\p{L}\\p{N} _.-]+$/u.test(name)) return Response.json({ error: "Nama harus 2–24 karakter." }, { status: 400 });
    if (!/^[a-zA-Z0-9-]{16,64}$/.test(playerKey)) return Response.json({ error: "Identitas sesi tidak valid." }, { status: 400 });
    const player = await env.DB.prepare(
      "INSERT INTO players (player_key, display_name, consent_at, last_seen_at) VALUES (?, ?, datetime('now'), datetime('now')) ON CONFLICT(player_key) DO UPDATE SET display_name=excluded.display_name, last_seen_at=datetime('now') RETURNING id"
    ).bind(playerKey, name).first();
    const sessionId = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO sessions (id, player_id) VALUES (?, ?)").bind(sessionId, player.id).run();
    return Response.json({ ok: true, session_id: sessionId }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Tidak dapat memulai sesi." }, { status: 500 });
  }
}
