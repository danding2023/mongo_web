import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // API 测试接口
  if (url.pathname === "/ping") {
    return new Response(
      JSON.stringify({ ok: true, source: "deno-api" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // 其余请求，交给静态页面
  return serveDir(req, {
    fsRoot: "pages",
    urlRoot: "",
    index: "zibeichaxun.html",
  });
});
