fetch('https://allzibei.kongzhuanwang.site/?limit=2')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#zibeiTable tbody');
    tbody.innerHTML = '';

    const list = data;

    list.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.ID号 || ''}</td>
        <td>${item.聚居地 || ''}</td>
        <td>${item.字辈用字 || ''}</td>
        <td>${item.备注 || ''}</td>`;
      tbody.appendChild(tr);
    });

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">暂无数据</td></tr>';
    }
  })
  .catch(err => {
    console.error('加载失败:', err);
    document.querySelector('#zibeiTable tbody').innerHTML =
      '<tr><td colspan="4">数据加载失败</td></tr>';
  });