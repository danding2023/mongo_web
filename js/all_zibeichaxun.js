fetch('../data/zibeiyugaikuang.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#zibeiTable tbody');
    tbody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.ID号}</td>
        <td>${item.聚居地}</td>
        <td>${item.字辈用字}</td>
        <td>${item.备注}</td>`;
      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error('加载字辈数据失败:', err);
    document.querySelector('#zibeiTable tbody').innerHTML =
      '<tr><td colspan="2">数据加载失败，请稍后再试</td></tr>';
  });