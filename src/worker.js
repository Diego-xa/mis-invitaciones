

const COOKIE_NAME = "nc_session";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

function base64url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function firmar(texto, secreto) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return base64url(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(texto)
    )
  );
}

async function sesionValida(request, secreto) {
  const cookie = request.headers.get("Cookie") || "";
  const encontrada = cookie
    .split(";")
    .map(parte => parte.trim())
    .find(parte => parte.startsWith(`${COOKIE_NAME}=`));

  if (!encontrada) return false;

  const token = encontrada.slice(COOKIE_NAME.length + 1);
  const partes = token.split(".");
  if (partes.length !== 2) return false;

  const [expiracion, firma] = partes;
  if (!/^\d+$/.test(expiracion)) return false;
  if (Number(expiracion) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const esperada = await firmar(expiracion, secreto);

  const a = new TextEncoder().encode(firma);
  const b = new TextEncoder().encode(esperada);

  if (a.length !== b.length) return false;

  let diferencia = 0;
  for (let i = 0; i < a.length; i++) {
    diferencia |= a[i] ^ b[i];
  }

  return diferencia === 0;
}

function mismoOrigen(request) {
  return request.headers.get("Origin") === new URL(request.url).origin;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (!["GET", "POST"].includes(request.method)) {
      return json({ error: "Método no permitido" }, 405, {
        Allow: "GET, POST"
      });
    }

    if (request.method === "POST" && !mismoOrigen(request)) {
      return json({ error: "Origen no permitido" }, 403);
    }

    try {
      if (url.pathname === "/api/login") {
        if (request.method !== "POST") {
          return json({ error: "Método no permitido" }, 405);
        }

        const body = await request.json();
        if (
          typeof body.password !== "string" ||
          body.password.length > 200 ||
          body.password !== env.APP_PASSWORD
        ) {
          return json({ error: "Contraseña incorrecta" }, 401);
        }

        const expiracion =
          Math.floor(Date.now() / 1000) + SESSION_SECONDS;
        const firma = await firmar(
          String(expiracion),
          env.SESSION_SECRET
        );

        return json(
          { ok: true },
          200,
          {
            "Set-Cookie":
              `${COOKIE_NAME}=${expiracion}.${firma}; ` +
              `HttpOnly; Secure; SameSite=Strict; Path=/; ` +
              `Max-Age=${SESSION_SECONDS}`
          }
        );
      }

      if (!env.APP_PASSWORD || !env.SESSION_SECRET || !env.DB) {
        return json({ error: "Configuración incompleta" }, 503);
      }

      if (!(await sesionValida(request, env.SESSION_SECRET))) {
        return json({ error: "Inicia sesión para continuar" }, 401);
      }

      if (url.pathname === "/api/estado" && request.method === "GET") {
        const resultado = await env.DB
          .prepare(
            "SELECT pelicula_id, pendiente, vista, minuto FROM progreso"
          )
          .all();

        const estado = {};

        for (const fila of resultado.results || []) {
          estado[fila.pelicula_id] = {
            pendiente: Boolean(fila.pendiente),
            vista: Boolean(fila.vista),
            minuto: Number(fila.minuto)
          };
        }

        return json({ estado });
      }

      if (url.pathname === "/api/estado" && request.method === "POST") {
        const body = await request.json();

        if (
          (typeof body.id !== "string" && typeof body.id !== "number") ||
          String(body.id).length < 1 ||
          String(body.id).length > 100 ||
          typeof body.pendiente !== "boolean" ||
          typeof body.vista !== "boolean" ||
          !Number.isInteger(body.minuto) ||
          body.minuto < 0 ||
          body.minuto > 100000
        ) {
          return json({ error: "Datos inválidos" }, 400);
        }

        const pendiente = body.vista ? 0 : Number(body.pendiente);
        const vista = Number(body.vista);

        await env.DB.prepare(`
          INSERT INTO progreso
            (pelicula_id, pendiente, vista, minuto, actualizado)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(pelicula_id) DO UPDATE SET
            pendiente = excluded.pendiente,
            vista = excluded.vista,
            minuto = excluded.minuto,
            actualizado = CURRENT_TIMESTAMP
        `).bind(
          String(body.id),
          pendiente,
          vista,
          body.minuto
        ).run();

        return json({ ok: true });
      }

      if (url.pathname === "/api/logout") {
        return json(
          { ok: true },
          200,
          {
            "Set-Cookie":
              `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; ` +
              "Path=/; Max-Age=0"
          }
        );
      }

      return json({ error: "Ruta no encontrada" }, 404);
    } catch (error) {
      return json({ error: "Error interno del servidor" }, 500);
    }
  }
};

