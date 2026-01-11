Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/ping") {
    return new Response(
      JSON.stringify({ ok: true, source: "deno-api" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("API running");
});
