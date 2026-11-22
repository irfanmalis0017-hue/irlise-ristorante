export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const sessionId = String(body.session_id || "");
    if (!/^[a-f0-9-]{36}$/i.test(sessionId)) return Response.json({ error: "Sesi tidak valid." }, { status: 400 });
    await env.DB.prepare(
      "UPDATE sessions SET ended_at=datetime('now'), last_seen_at=datetime('now') WHERE id=? AND ended_at IS NULL"
    ).bind(sessionId).run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Tidak dapat mengakhiri sesi." }, { status: 500 });
  }
}
