/**
 * _worker.js
 * Cloudflare Pages Functions 入口文件
 * 路径：/functions/_worker.js  （必须放在这个位置）
 * 提供：
 *   - GET/POST /api/ping   → 空 JSON，用于竞速测速
 *   - POST      /api/query → 连接 TiDB Serverless，读取 lishizibei.zibeiyugaikuang 全表
 */

// 使用 Cloudflare 内置的 @tidb-cloud/serverless 驱动（无需 npm install）
import { connect } from '@tidb-cloud/serverless';

// 读取环境变量（在 Pages 控制台 Settings → Environment variables 添加 DATABASE_URL）
const TIDB_URL = globalThis.env?.DATABASE_URL || globalThis.DATABASE_URL;

// CORS 头，允许任意前端跨域
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 空 JSON 响应
const emptyJSON = () => new Response('{}', {
  headers: { 'content-type': 'application/json; charset=utf-8', ...CORS }
});

// 成功返回 JSON 数据
const jsonOK = (data) => new Response(JSON.stringify(data), {
  headers: { 'content-type': 'application/json; charset=utf-8', ...CORS }
});

// 错误响应
const jsonErr = (msg, status = 500) => new Response(JSON.stringify({ error: msg }), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...CORS }
});

// 处理 OPTIONS 预检请求
const handleOptions = () => new Response(null, { headers: CORS });

// 测速接口：直接空 JSON
const handlePing = () => emptyJSON();

// 查询接口：SELECT * 全表（数据量大时自行加 LIMIT 或分页）
const handleQuery = async () => {
  if (!TIDB_URL) return jsonErr('DATABASE_URL not set', 500);
  try {
    const conn = connect({ url: TIDB_URL });
    // 只读、限 1 万行，防止全表扫描拖垮 TiKV
    const [rows] = await conn.execute('SELECT * FROM lishizibei.zibeiyugaikuang LIMIT 10000');
    return jsonOK(rows);
  } catch (e) {
    return jsonErr(e.message);
  }
};

// 路由分发
const router = (request) => {
  const url = new URL(request.url);
  switch (url.pathname) {
    case '/api/ping':
      return handlePing();
    case '/api/query':
      return handleQuery();
    default:
      return new Response('Not Found', { status: 404 });
  }
};

// Worker 默认导出
export default {
  async fetch(request, env, ctx) {
    // 把 env 挂到全局，方便 connect 读取
    globalThis.env = env;

    // 预检请求
    if (request.method === 'OPTIONS') return handleOptions();

    // 只允许 GET/POST
    if (!['GET', 'POST'].includes(request.method))
      return jsonErr('Method Not Allowed', 405);

    return router(request);
  }
};