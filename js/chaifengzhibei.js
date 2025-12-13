/**
 * chaifengzhibei.js
 * 前端中间件：实时拆字并返回命中项
 */
const Chaifengzhibei = (() => {
  // 拆字：保证返回数组，绝不会 undefined
  function splitChars(s) {
    if (!s || typeof s !== 'string') return [];
    return Array.from(s.replace(/[，；。、（）\s]/g, ''));
  }

  // 核心 API
  function query(src, kw) {
    if (!kw) return [];
    return src
      .map(item => {
        // 容错：没有“：”就把整句当字辈
        const [地区, 字辈句] = item.聚集地.includes('：')
          ? item.聚集地.split('：')
          : ['未知地区', item.聚集地];

        const 字辈 = splitChars(字辈句);
        return { ID: item.ID, 地区, 字辈 };
      })
      .filter(it => it.字辈.includes(kw));
  }

  return { query };
})();