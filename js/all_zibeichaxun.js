fetch('../data/zibeiyugaikuang.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#zibeiTable tbody');
    tbody.innerHTML = '';

    // ===== 高性能随机抽样（不打乱整个数组）=====
    function getRandomItems(arr, count) {
      const result = [];
      const used = new Set();

      // 防止 count > 数据量
      const max = Math.min(count, arr.length);

      while (result.length < max) {
        const index = Math.floor(Math.random() * arr.length);
        if (!used.has(index)) {
          used.add(index);
          result.push(arr[index]);
        }
      }
      return result;
    }

    // 只取随机2条
    const randomTwo = getRandomItems(data, 2);

    // 渲染
    randomTwo.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.ID号 || ''}</td>
        <td>${item.聚居地 || ''}</td>
        <td>${item.字辈用字 || ''}</td>
        <td>${item.备注 || ''}</td>`;
      tbody.appendChild(tr);
    });

    // 如果数据为空兜底
    if (randomTwo.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4">暂无数据</td></tr>';
    }
  })
  .catch(err => {
    console.error('加载字辈数据失败:', err);
    document.querySelector('#zibeiTable tbody').innerHTML =
      '<tr><td colspan="4">数据加载失败，请稍后再试</td></tr>';
  });