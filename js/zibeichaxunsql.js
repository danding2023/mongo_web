/**
 * zibeichaxunsql.js
 * 双线（JSON 静态 vs TiDB Serverless）字辈查询核心库
 * 放到网站根目录 /JS/zibeichaxunsql.js 后直接 import 使用
 * 提供统一入口：query() / queryStrict()
 */
(() => {
  /* ---------- 配置 ---------- */
  const TIDB_API   = 'https://datagate.271776169.workers.dev/api/query'; // Cloudflare Worker 查询接口
  const JSON_URL   = 'https://datagate.271776169.workers.dev/zibeiyugaikuang.json'; // 原静态文件
  const STORE_KEY  = 'fast_channel';        // localStorage 优选线路标记
  const TIMEOUT    = 3000;                  // 竞速超时（ms）

  /* ---------- 工具 ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* 测速：返回 tidb | json */
  async function race() {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);

    const start = performance.now();
    try {
      // 测 TiDB 线路（POST 空体，Worker 直接返回空 JSON）
      const resT = await fetch(TIDB_API, { method: 'POST', signal: ctrl.signal, body: '{}' });
      clearTimeout(t);
      if (resT.ok) { localStorage.setItem(STORE_KEY, 'tidb'); return 'tidb'; }
    } catch (e) {}
    localStorage.setItem(STORE_KEY, 'json');
    return 'json';
  }

  /* 获取整条原始数据 */
  async function fetchData() {
    let ch = localStorage.getItem(STORE_KEY);
    if (!ch) ch = await race();

    // 优先线路失败自动回退
    try {
      if (ch === 'tidb') {
        const r = await fetch(TIDB_API, { method: 'POST', body: '{}' });
        if (!r.ok) throw new Error('tidb');
        return await r.json();
      }
    } catch (e) {}

    // 回退到 JSON 线路
    const r = await fetch(JSON_URL + '?v=' + Date.now());
    if (!r.ok) throw new Error('network');
    return r.json();
  }

  /* 普通模糊查询：关键字任意顺序出现即可 */
  function query(list, keyword) {
    const kw = Array.from(keyword.replace(/\s+/g, ''));
    if (!kw.length) return [];
    return list.filter(item =>
      kw.every(k => item.字辈用字.includes(k))
    );
  }

  /* 精准查询：关键字必须按输入顺序连续出现 */
  function queryStrict(list, keyword) {
    const kw = keyword.replace(/\s+/g, '');
    if (!kw) return [];
    return list.filter(item => item.字辈用字.includes(kw));
  }

  /* ---------- 对外暴露 ---------- */
  window.ZibeichaxunSQL = { fetchData, query, queryStrict };
})();