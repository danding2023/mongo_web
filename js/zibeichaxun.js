/**
 * zibeichaxun.js
 * 字辈查询中间件（零依赖，自动挂载）
 * 1. 对外暴露 Zibeichaxun.query(data, kw) 方法
 * 2. 自动绑定页面按钮 #searchBtn，输入框 #searchKeyword，结果区 #result
 */
const Zibeichaxun = (() => {
  /* ---------- 工具函数 ---------- */
  const splitChars = s =>
    (typeof s === 'string' ? Array.from(s.replace(/[，；。、（）\s]/g, '')) : []);

/* ---------- 核心查询（替换原 query 函数） ---------- */
const query = (src, kw) => {
  if (!kw) return [];
  const need = kw.split(/\s+/);          // ['字A','字B',...]
  return src
    .map(({ ID, 聚集地, 字辈与概况 }) => {
      const 字辈 = splitChars(字辈与概况);
      return { ID, 聚集地, 字辈 };
    })
    .filter(({ 字辈 }) =>
      need.every(k => 字辈.includes(k))   // 每个关键字都必须出现
    );
};

  /* ---------- 页面交互 ---------- */
  const initUI = () => {
    const btn = document.getElementById('searchBtn');
    const input = document.getElementById('searchKeyword');
    const result = document.getElementById('result');
    if (!btn || !input || !result) return;   // 元素缺失时不报错

    btn.addEventListener('click', async () => {
      const kw = input.value.trim();
      if (!kw) return (result.innerHTML = '<p style="color:red;">请输入一个汉字</p>');
    /*   if (kw.length > 1) return (result.innerHTML = '<p style="color:red;">一次只能查一个汉字</p>'); */


      result.textContent = '查询中...';
      try {
        const res = await fetch('../data/zibei.json');
        if (!res.ok) throw new Error('网络错误 ' + res.status);
        const data = await res.json();

        const hit = query(data, kw);
        if (!hit.length) return (result.innerHTML = '<p>查不到相关数据</p>');

        let html = '<table border="1" cellpadding="6"><tr><th>ID</th><th>聚集地</th><th>字辈序列</th></tr>';
        hit.forEach(({ ID, 聚集地, 字辈 }) => {
          html += `<tr><td>${ID}</td><td>${聚集地}</td><td>${字辈.join('，')}</td></tr>`;
        });
        result.innerHTML = html + '</table>';
      } catch (e) {
        result.innerHTML = `<p style="color:red;">查询出错：${e.message}</p>`;
      }
    });
  };

  /* ---------- 自动挂载 ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  /* ---------- 对外暴露 ---------- */
  return { query };
})();