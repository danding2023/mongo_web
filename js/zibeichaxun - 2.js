/**
 * zibeichaxun.js
 * 字辈查询中间件（零依赖，自动挂载）
 * 对外暴露 Zibeichaxun.query / Zibeichaxun.queryStrict
 */
const Zibeichaxun = (() => {
  const splitChars = s =>
    typeof s === 'string' ? Array.from(s.replace(/[，；。、（）\s]/g, '')) : [];

  /* 模糊查询 */
  const query = (src, kw) => {
    if (!kw) return [];
    const need = kw.split(/\s+/);
    return src
      .map(({ ID, 聚集地, 字辈与概况 }) => {
        const 字辈 = splitChars(字辈与概况);
        return { ID, 聚集地, 字辈 };
      })
      .filter(({ 字辈 }) => need.every(k => 字辈.includes(k)));
  };

  /* 严格连续顺序查询 */
  const queryStrict = (src, kw) => {
    if (!kw) return [];
    const pattern = kw.replace(/\s+/g, '');
    const reg = new RegExp(pattern, 'g');
    return src
      .map(({ ID, 聚集地, 字辈与概况 }) => {
        const 字辈 = splitChars(字辈与概况).join('');
        return { ID, 聚集地, 字辈 };
      })
      .filter(({ 字辈 }) => reg.test(字辈));
  };

  /* 自动挂载（默认挂载模糊查询，可手动调用 queryStrict） */
  const initUI = () => {
    const btn = document.getElementById('searchBtn');
    const input = document.getElementById('searchKeyword');
    const result = document.getElementById('result');
    if (!btn || !input || !result) return;

    btn.addEventListener('click', async () => {
      const kw = input.value.trim();
      if (!kw) return (result.innerHTML = '<p style="color:red;">请输入一个汉字</p>');
      result.textContent = '查询中...';
      try {
        const res = await fetch('../data/zibeiyugaikuang.json?v=' + Date.now());
        if (!res.ok) throw new Error('网络错误 ' + res.status);
        const data = await res.json();
        const hit = query(data, kw);   // 默认模糊
        if (!hit.length) return (result.innerHTML = '<p>查不到相关数据</p>');
        let html = '<table border="1" cellpadding="6"><tr><th>ID</th><th>聚集地</th><th>字辈与概况</th></tr>';
        hit.forEach(({ ID, 聚集地, 字辈 }) => {
          html += `<tr><td>${ID}</td><td>${聚集地}</td><td>${字辈.join('，')}</td></tr>`;
        });
        result.innerHTML = html + '</table>';
      } catch (e) {
        result.innerHTML = `<p style="color:red;">查询出错：${e.message}</p>`;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  return { query, queryStrict };
})();