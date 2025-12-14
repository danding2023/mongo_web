document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const keywordInput = document.getElementById('searchKeyword');
  const resultDiv = document.getElementById('result');

  searchBtn.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
      resultDiv.innerHTML = '<p style="color:red;">请输入一个汉字</p>';
      return;
    }
    if (keyword.length > 1) {
      resultDiv.innerHTML = '<p style="color:red;">一次只能查一个汉字</p>';
      return;
    }

    resultDiv.textContent = '查询中...';
    try {
      const res = await fetch('../data/zibei.json');
      if (!res.ok) throw new Error('网络错误 ' + res.status);
      const data = await res.json();

      // 旧（会报错）
// const hit = data.filter(item => item.字辈.includes(keyword));

// 新（用中间件实时拆字）
const hit = Chaifengzhibei.query(data, keyword);

      if (hit.length === 0) {
        resultDiv.innerHTML = '<p>查不到相关数据</p>';
        return;
      }

      let html = '<table border="1" cellpadding="6"><tr><th>ID</th><th>地区</th><th>字辈序列</th></tr>';
      hit.forEach(item => {
        html += `<tr>
                   <td>${item.ID}</td>
                   <td>${item.地区}</td>
                   <td>${item.字辈.join('，')}</td>
                 </tr>`;
      });
      html += '</table>';
      resultDiv.innerHTML = html;
    } catch (e) {
      resultDiv.innerHTML = `<p style="color:red;">查询出错：${e.message}</p>`;
    }
  });
});