/**
 * chaifengzhibei.js
 * 纯前端中间件：把原始“聚集地”实时拆成单字数组，并返回命中项
 */
const Chaifengzhibei = (() => {
  // 通用拆字：去掉标点、括号、空格 → 单字数组
  function splitChars(s) {
    if (!s) return [];               // ① 空内容直接给空数组
    return s.replace(/[，；。、（）\s]/g, '').split('').filter(Boolean);
  }

  // 核心 API
  function query(src, kw) {
    if (!kw) return [];
    return src
      .map(item => {
        const [地区, 字辈句] = item.聚集地.split('：');
        const 字辈 = splitChars(字辈句 || ''); // ② 确保必为数组
        return { ID: item.ID, 地区, 字辈 };
      })
      .filter(it => it.字辈.includes(kw));     // ③ 现在绝不会 undefined
  }

  return { query };
})();