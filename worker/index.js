const SITE_ORIGIN = "https://devdebt1.github.io";
const MAX_BODY_BYTES = 8192;

function response(body, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
  if (origin === SITE_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = SITE_ORIGIN;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function readJson(request) {
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Request body is too large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function validWebhookUrl(value) {
  try {
    const url = new URL(value);
    return (url.hostname === "discord.com" || url.hostname === "ptb.discord.com")
      && url.protocol === "https:"
      && !url.username
      && !url.password
      && (!url.port || url.port === "443")
      && /^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(url.pathname)
      && !url.search
      && !url.hash;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      if (origin !== SITE_ORIGIN) return response({ error: "Origin not allowed" }, 403, origin);
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": SITE_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") return response({ error: "Method not allowed" }, 405, origin);
    if (origin !== SITE_ORIGIN) return response({ error: "Origin not allowed" }, 403, origin);
    if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
      return response({ error: "Expected a JSON request" }, 415, origin);
    }

    if (!env.CONTACT_LIMITER || typeof env.CONTACT_LIMITER.limit !== "function") {
      console.error("Contact rate limiter binding is missing");
      return response({ error: "Request service is unavailable" }, 503, origin);
    }

    const clientIp = request.headers.get("CF-Connecting-IP");
    if (!clientIp) return response({ error: "Could not verify request source" }, 400, origin);

    try {
      const { success } = await env.CONTACT_LIMITER.limit({ key: clientIp });
      if (!success) return response({ error: "Too many requests. Please try again later." }, 429, origin);
    } catch (error) {
      console.error("Contact rate limiter failed:", error);
      return response({ error: "Request service is unavailable" }, 503, origin);
    }

    let data;
    try {
      data = await readJson(request);
    } catch (error) {
      const tooLarge = error instanceof RangeError;
      return response({ error: tooLarge ? "Request is too large" : "Invalid JSON" }, tooLarge ? 413 : 400, origin);
    }

    const discordUsername = cleanText(data?.["discord-username"], 32);
    const discordId = cleanText(data?.["discord-id"], 20);
    const robloxUsername = cleanText(data?.["roblox-username"], 20) || "Not provided";
    const car = cleanText(data?.["car-request"], 120);
    const details = cleanText(data?.details, 1000);

    if (discordUsername.length < 2 || !/^\d{17,20}$/.test(discordId) || !car || !details) {
      return response({ error: "Please check the required form fields" }, 400, origin);
    }
    if (!env.DISCORD_WEBHOOK_URL || !validWebhookUrl(env.DISCORD_WEBHOOK_URL)) {
      console.error("Discord webhook secret is missing or invalid");
      return response({ error: "Request service is not configured" }, 503, origin);
    }

    const payload = {
      username: "devdebt1 Requests",
      allowed_mentions: { parse: [] },
      embeds: [{
        title: "New car import request",
        color: 0xc6f36b,
        fields: [
          { name: "Discord username", value: discordUsername, inline: true },
          { name: "Discord ID", value: discordId, inline: true },
          { name: "Roblox username", value: robloxUsername, inline: true },
          { name: "Car / brand", value: car },
          { name: "Details", value: details }
        ],
        footer: { text: "Request sent from devdebt1.github.io" }
      }]
    };

    try {
      const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });
      if (!discordResponse.ok) {
        console.error("Discord webhook request failed with status", discordResponse.status);
        return response({ error: "Could not deliver the request" }, 502, origin);
      }
      return response({ ok: true }, 200, origin);
    } catch (error) {
      console.error("Discord webhook request failed:", error);
      return response({ error: "Could not deliver the request" }, 502, origin);
    }
  }
};
