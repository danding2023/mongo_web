// 用纯 fetch 连 TiDB Serverless (MySQL-over-HTTPS)
export default {
  async fetch(request: Request, env: { DATABASE_URL: string }) {
    // 1. 拼 SQL
    const sql = encodeURIComponent('SELECT NOW() as now, "hello TiDB" as msg');
    // 2. 发 GET
    const res = await fetch(`${env.DATABASE_URL}&sql=${sql}`);
    // 3. 回给浏览器
    const data = await res.json();
    return Response.json(data);
  }
}
