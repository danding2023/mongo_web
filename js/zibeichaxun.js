document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const keywordInput = document.getElementById("searchKeyword");
  const resultDiv = document.getElementById("result");

  searchBtn.addEventListener("click", async () => {
    const keyword = keywordInput.value.trim();
    resultDiv.innerHTML = "查询中...";

    if (!keyword) {
      resultDiv.innerHTML = "<p style='color:red;'>请输入关键字</p>";
      return;
    }

    try {
      const response = await fetch("../data/zibei.json");
      if (!response.ok) {
        throw new Error(`无法加载 JSON: ${response.status}`);
      }
      const data = await response.json();

      // 筛选包含关键字的行
      const filtered = data.filter(item => item.聚集地.includes(keyword));

      if (filtered.length === 0) {
        resultDiv.innerHTML = "<p>没有找到相关数据。</p>";
      } else {
        // 生成 HTML 表格
        let tableHtml = "<table border='1' cellpadding='5'><tr><th>ID</th><th>聚集地</th></tr>";
        filtered.forEach(item => {
          tableHtml += `<tr><td>${item.ID}</td><td>${item.聚集地}</td></tr>`;
        });
        tableHtml += "</table>";
        resultDiv.innerHTML = tableHtml;
      }

    } catch (err) {
      resultDiv.innerHTML = `<p style="color:red;">查询出错：${err.message}</p>`;
      console.error(err);
    }
  });
});
