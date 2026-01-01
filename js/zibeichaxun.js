const Zibeichaxun = {
  query: function(data, kw) {
    const kwArr = Array.from(kw.replace(/\s+/g, ''));
    return data.filter(item => {
      const zibeiArr = item['×Ö±²ÓÃ×Ö'].split('£¬');
      return kwArr.some(k => zibeiArr.includes(k));
    });
  },
  queryStrict: function(data, kw) {
    const kwArr = Array.from(kw.replace(/\s+/g, ''));
    return data.filter(item => {
      const zibeiArr = item['×Ö±²ÓÃ×Ö'].split('£¬');
      return kwArr.every(k => zibeiArr.includes(k));
    });
  }
};
