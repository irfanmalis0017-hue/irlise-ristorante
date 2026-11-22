export async function onRequestPost() {
  return Response.json({ ok: true }, {
    headers: { "Set-Cookie": "irlise_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0" }
  });
}
