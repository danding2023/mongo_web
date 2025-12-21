/**
 * zibeichaxun.js
 * 字辈查询中间件（零依赖，自动挂载）
 * 对外暴露 Zibeichaxun.query / Zibeichaxun.queryStrict
 */
const Zibeichaxun = (() => {
  const splitChars = s =>
    typeof s === 'string' ? Array.from(s.replace(/[，；。、（）\s]/g, '')) : [];

  /* ---------- 模糊查询 ---------- */
const query = (src, kw) => {
  if (!kw) return [];
  const need = Array.isArray(kw) ? kw : kw.split(/\s+/);
  return src
    .map(({ ID, 聚集地, 字辈与概况 }) => {
      const 字辈 = splitChars(字辈与概况);
      return { ID, 聚集地, 字辈 };
    })
    .filter(({ 字辈 }) =>
      need.every(k => 字辈.includes(k))
    );
};

  /* ---------- 严格连续顺序查询 ---------- */
  const queryStrict = (src, kw) => {
    if (!kw) return [];
    const pattern = kw.replace(/\s+/g, '');        // 去空格
    const reg = new RegExp(pattern);               // 去掉 g，避免重复计数
    return src
      .map(({ ID, 聚集地, 字辈与概况 }) => {
        const 字辈 = splitChars(字辈与概况);       // 保持数组
        return { ID, 聚集地, 字辈 };
      })
      .filter(({ 字辈 }) => reg.test(字辈.join('')));
  };

  /* ---------- 自动挂载（默认用模糊查询） ---------- */
const initUI = () => {
  const strictBtn = document.getElementById('strictBtn');
  const fuzzyBtn  = document.getElementById('fuzzyBtn');
  const input     = document.getElementById('key1');
  const result    = document.getElementById('result');
  if (!strictBtn || !fuzzyBtn || !input || !result) return;

  const doQuery = async (strict = false) => {
    const kw = input.value.trim();
    if (!kw) return alert('请至少输入一个关键字！');
    result.textContent = '查询中...';
    try {
      const res = await fetch('../data/zibeiyugaikuang.json?v=' + Date.now());
      if (!res.ok) throw new Error('网络错误 ' + res.status);
      const data = await res.json();

      const kwArr = Array.from(kw.replace(/\s+/g, ''));
      const hit   = strict
                  ? Zibeichaxun.queryStrict(data, kw)
                  : Zibeichaxun.query(data, kwArr);

      if (!hit.length) return (result.innerHTML = '<p>查不到相关数据</p>');

      const countHtml = `<p style="margin:4px 0;color:#555;">共查到 <strong>${hit.length}</strong> 条记录</p>`;
      const kwArr     = Array.from(kw.replace(/\s+/g, ''));
      const highlight = arr => arr.map(ch =>
        kwArr.includes(ch) ? `<span class="highlight-key">${ch}</span>` : ch
      );

      let html = countHtml + '<table border="1" cellpadding="6"><tr><th>ID</th><th>聚集地</th><th>字辈与概况</th></tr>';
      hit.forEach(({ ID, 聚集地, 字辈 }) => {
        const highlighted = highlight(字辈).join('，');
        html += `<tr><td>${ID}</td><td>${聚集地}</td><td>${highlighted}</td></tr>`;
      });
      result.innerHTML = html + '</table>';
    } catch (e) {
      result.innerHTML = `<p style="color:red;">查询出错：${e.message}</p>`;
    }
  };

  strictBtn.addEventListener('click', () => doQuery(true));
  fuzzyBtn.addEventListener('click',  () => doQuery(false));
  input.addEventListener('keyup', e => { if (e.key === 'Enter') fuzzyBtn.click(); });
};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  return { query, queryStrict };
})();