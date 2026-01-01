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
      .map(({ ID号, 聚居地, 字辈用字, 备注 }) => {
        const 字辈 = splitChars(字辈用字);
        return { ID号, 聚居地, 字辈用字, 备注, 字辈 };
      })
      .filter(({ 字辈 }) =>
        need.every(k => 字辈.includes(k))
      );
  };

  /* ---------- 严格连续顺序查询 ---------- */
  const queryStrict = (src, kw) => {
    if (!kw) return [];
    const pattern = kw.replace(/\s+/g, '');
    const reg = new RegExp(pattern);
    return src
      .map(({ ID号, 聚居地, 字辈用字, 备注 }) => {
        const 字辈 = splitChars(字辈用字);
        return { ID号, 聚居地, 字辈用字, 备注, 字辈 };
      })
      .filter(({ 字辈 }) => reg.test(字辈.join('')));
  };

  /* ---------- 自动挂载（双按钮版） ---------- */
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
        const res = await fetch('https://datagate.271776169.workers.dev/zibeiyugaikuang.json?v=' + Date.now());
        if (!res.ok) throw new Error('网络错误 ' + res.status);
        const data = await res.json();

        const kwArr = Array.from(kw.replace(/\s+/g, ''));
        const hit   = strict
                    ? Zibeichaxun.queryStrict(data, kw)
                    : Zibeichaxun.query(data, kwArr);

        if (!hit.length) return (result.innerHTML = '<p>查不到相关数据</p>');

        const countHtml = `<p style="margin:4px 0;color:#555;">共查到 <strong>${hit.length}</strong> 条记录</p>`;
        /* 关键修复：先把字符串拆成数组再 map */
        const highlight = str => 
          Array.from(str).map(ch =>
            kwArr.includes(ch) ? `<span class="highlight-key">${ch}</span>` : ch
          );

        let html = countHtml +
          '<table border="1" cellpadding="6">' +
          '<tr><th>ID号</th><th>聚居地</th><th>字辈用字</th><th>备注</th></tr>';
        hit.forEach(({ ID号, 聚居地, 字辈用字, 备注 }) => {
          const highlighted = highlight(字辈用字).join('');
          html += `<tr>
                     <td>${ID号}</td>
                     <td>${聚居地}</td>
                     <td>${highlighted}</td>
                     <td>${备注||''}</td>
                   </tr>`;
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