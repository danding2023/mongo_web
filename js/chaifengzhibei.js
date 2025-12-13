const Chaifengzhibei = (() => {
  function splitChars(s) {
    if (!s || typeof s !== 'string') return [];
    return Array.from(s.replace(/[，；。、（）\s]/g, ''));
  }

  function query(src, kw) {
    if (!kw) return [];
    return src
      .map(item => {
        // 容错：没有“：”就把整句当字辈
        const [地区, 字辈句] = item.聚集地.includes('：')
          ? item.聚集地.split('：')
          : ['未知地区', item.聚集地];

        const 字辈 = splitChars(字辈句);
        // ===== 调试：一旦拆不出字就打印 =====
        if (字辈.length === 0) {
          console.warn('拆字失败 → ID:', item.ID, '聚集地:', item.聚集地);
        }

        return { ID: item.ID, 地区, 字辈 };
      })
      .filter(it => {
        // 最后一道保险：万一还是 undefined 就跳过
        if (!Array.isArray(it.字辈)) {
          console.error('字辈不是数组 → 被过滤掉', it);
          return false;
        }
        return it.字辈.includes(kw);
      });
  }

  return { query };
})();