import { createAdminCookie } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_SECRET) return Response.json({ error: "ADMIN_SECRET belum disetel di Cloudflare." }, { status: 503 });
  try {
    const body = await request.json();
    const password = String(body.password || "");
    if (password.length < 1 || password.length > 256 || password !== env.ADMIN_SECRET) {
      return Response.json({ error: "Password admin salah." }, { status: 401 });
    }
    const token = await createAdminCookie(env.ADMIN_SECRET);
    return Response.json({ ok: true }, {
      headers: {
        "Set-Cookie": "irlise_admin=" + token + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return Response.json({ error: "Login gagal." }, { status: 400 });
  }
}
