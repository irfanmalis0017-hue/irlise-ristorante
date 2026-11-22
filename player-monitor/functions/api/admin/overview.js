import { isAdmin } from "../../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  if (!await isAdmin(request, env.ADMIN_SECRET || "")) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const online = await env.DB.prepare(
      "SELECT COUNT(DISTINCT player_id) AS total FROM sessions WHERE ended_at IS NULL AND last_seen_at >= datetime('now','-90 seconds')"
    ).first();
    const today = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM sessions WHERE date(started_at)=date('now')"
    ).first();
    const players = await env.DB.prepare("SELECT COUNT(*) AS total FROM players").first();
    const active = await env.DB.prepare(
      "SELECT s.id, p.display_name, s.started_at, s.last_seen_at, CAST((julianday('now')-julianday(s.started_at))*86400 AS INTEGER) AS duration_seconds FROM sessions s JOIN players p ON p.id=s.player_id WHERE s.ended_at IS NULL AND s.last_seen_at >= datetime('now','-90 seconds') ORDER BY s.last_seen_at DESC LIMIT 100"
    ).all();
    const recent = await env.DB.prepare(
      "SELECT p.display_name, s.started_at, s.ended_at, s.last_seen_at, CAST((julianday(COALESCE(s.ended_at,s.last_seen_at))-julianday(s.started_at))*86400 AS INTEGER) AS duration_seconds FROM sessions s JOIN players p ON p.id=s.player_id ORDER BY s.started_at DESC LIMIT 20"
    ).all();
    return Response.json({
      online: online?.total || 0,
      sessions_today: today?.total || 0,
      players_total: players?.total || 0,
      active_players: active.results || [],
      recent_sessions: recent.results || [],
      generated_at: new Date().toISOString()
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Gagal membaca database." }, { status: 500 });
  }
}
