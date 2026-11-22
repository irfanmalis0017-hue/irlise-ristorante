export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const sessionId = String(body.session_id || "");
    if (!/^[a-f0-9-]{36}$/i.test(sessionId)) return Response.json({ error: "Sesi tidak valid." }, { status: 400 });
    const result = await env.DB.prepare(
      "UPDATE sessions SET last_seen_at=datetime('now') WHERE id=? AND ended_at IS NULL"
    ).bind(sessionId).run();
    if (!result.meta.changes) return Response.json({ error: "Sesi tidak ditemukan." }, { status: 404 });
    await env.DB.prepare(
      "UPDATE players SET last_seen_at=datetime('now') WHERE id=(SELECT player_id FROM sessions WHERE id=?)"
    ).bind(sessionId).run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Heartbeat gagal." }, { status: 500 });
  }
}
