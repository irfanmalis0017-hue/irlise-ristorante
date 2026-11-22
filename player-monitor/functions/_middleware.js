const DEFAULT_GAME_ORIGIN = "https://irlise-ristorante.pages.dev";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/player/")) return context.next();

  const origin = request.headers.get("Origin");
  const allowedOrigin = context.env.GAME_ORIGIN || DEFAULT_GAME_ORIGIN;
  const cors = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };

  if (request.method === "OPTIONS") {
    if (origin !== allowedOrigin) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: cors });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  if (origin === allowedOrigin) {
    for (const [key, value] of Object.entries(cors)) headers.set(key, value);
  }
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
