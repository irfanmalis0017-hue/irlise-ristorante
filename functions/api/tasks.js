const ALLOWED_TEAMS = new Set(["Game Designer", "3D Artist", "Programmer", "QA Tester", "Performance Engineer", "Release Manager"]);
const ALLOWED_STATUSES = new Set(["Menunggu", "Dikerjakan", "Perlu review", "Selesai", "Terhambat"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function verifyAccess(request, env) {
  const assertion = request.headers.get("cf-access-jwt-assertion");
  if (!assertion || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const parts = assertion.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
    const domain = String(env.ACCESS_TEAM_DOMAIN).replace("https://", "").replace("http://", "").replace(/\/$/, "");
    const issuer = "https://" + domain;
    const now = Math.floor(Date.now() / 1000);
    if (header.alg !== "RS256" || payload.iss !== issuer || !payload.exp || payload.exp <= now) return null;
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(env.ACCESS_AUD)) return null;
    const response = await fetch(issuer + "/cdn-cgi/access/certs", { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!response.ok) return null;
    const jwks = await response.json();
    const jwk = (jwks.keys || []).find(key => key.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decodeBase64Url(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
    return valid ? String(payload.email || "authorized-user").slice(0, 254) : null;
  } catch {
    return null;
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET" && request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const email = await verifyAccess(request, env);
  if (!email) return json({ error: "Akses ditolak. Login melalui Cloudflare Access terlebih dahulu." }, 401);
  if (!env.DB) return json({ error: "Database D1 belum dikonfigurasi." }, 503);

  try {
    if (request.method === "GET") {
      const { results = [] } = await env.DB.prepare(
        "SELECT id, task_text AS text, team, status, created_at AS created FROM office_tasks ORDER BY created_at DESC LIMIT 200"
      ).all();
      return json({ tasks: results });
    }

    const body = await request.json();
    if (body.action === "create") {
      const task = String(body.task || "").trim();
      const team = String(body.team || "");
      if (!task || task.length > 3000 || !ALLOWED_TEAMS.has(team)) return json({ error: "Data tiket tidak valid." }, 400);
      const id = crypto.randomUUID();
      const created = new Date().toISOString();
      await env.DB.prepare(
        "INSERT INTO office_tasks (id, task_text, team, status, created_at, updated_at, created_by) VALUES (?, ?, ?, 'Menunggu', ?, ?, ?)"
      ).bind(id, task, team, created, created, email).run();
      return json({ task: { id, text: task, team, status: "Menunggu", created } }, 201);
    }

    if (body.action === "update") {
      const id = String(body.id || "");
      const status = String(body.status || "");
      if (!id || id.length > 64 || !ALLOWED_STATUSES.has(status)) return json({ error: "Perubahan tiket tidak valid." }, 400);
      const result = await env.DB.prepare("UPDATE office_tasks SET status = ?, updated_at = ? WHERE id = ?")
        .bind(status, new Date().toISOString(), id).run();
      if (!result.meta?.changes) return json({ error: "Tiket tidak ditemukan." }, 404);
      return json({ ok: true });
    }

    return json({ error: "Aksi tidak dikenal." }, 400);
  } catch {
    return json({ error: "Terjadi kesalahan saat memproses tiket." }, 500);
  }
}
