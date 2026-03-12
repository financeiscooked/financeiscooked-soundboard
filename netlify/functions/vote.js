import { getStore } from "@netlify/blobs";

const STORE_NAME = "votes";

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    const prefix = url.searchParams.get("prefix");

    // Single key lookup
    if (key) {
      const data = await store.get(key, { type: "json" });
      return Response.json(data || { up: 0, down: 0 });
    }

    // Batch lookup by prefix (e.g. all votes for an episode)
    if (prefix) {
      const { blobs } = await store.list({ prefix });
      const results = {};
      for (const blob of blobs) {
        const data = await store.get(blob.key, { type: "json" });
        if (data) results[blob.key] = data;
      }
      return Response.json(results);
    }

    return Response.json({});
  }

  if (req.method === "POST") {
    const { key, direction } = await req.json();

    if (!key || !direction || !["up", "down"].includes(direction)) {
      return new Response(JSON.stringify({ error: "Invalid request. Need key and direction (up/down)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read current counts
    const current = (await store.get(key, { type: "json" })) || { up: 0, down: 0 };
    current[direction] += 1;

    // Write back
    await store.setJSON(key, current);

    return Response.json({ ok: true, votes: current });
  }

  return new Response("Method not allowed", { status: 405 });
};
