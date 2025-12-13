console.log("【1】zibeichaxun.js 已加载");

document.addEventListener("DOMContentLoaded", () => {
  console.log("【2】DOM 已加载完成");

  const input = document.getElementById("queryInput");
  const button = document.getElementById("queryButton");
  const resultsDiv = document.getElementById("results");

  button.addEventListener("click", async () => {
    const query = input.value.trim();
    console.log("【3】查询关键词：", query);

    if (!query) {
      resultsDiv.innerHTML = "<p>请输入查询内容</p>";
      return;
    }

    try {
      const response = await fetch("../data/zibei.json");
      const data = await response.json();
      console.log("【4】原始数据：", data);

      const filtered = data.filter(item =>
        item["聚集地"] && item["聚集地"].includes(query)
      );
      console.log("【5】过滤后结果：", filtered);

      if (filtered.length === 0) {
        resultsDiv.innerHTML = "<p>未找到匹配结果</p>";
        return;
      }

      // 渲染结果
      resultsDiv.innerHTML = "";
      filtered.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `ID: ${item.ID}, 聚集地: ${item.聚集地}`;
        resultsDiv.appendChild(p);
      });
    } catch (err) {
      console.error("【6】查询失败：", err);
      resultsDiv.innerHTML = `<p>查询出错：${err.message}</p>`;
    }
  });
});
