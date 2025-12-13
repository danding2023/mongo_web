document.getElementById('queryBtn').addEventListener('click', () => {
    const key = document.getElementById('queryInput').value.trim();
    fetch('../data/zibei.json')
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById('resultTable').querySelector('tbody');
        tbody.innerHTML = '';
        data.filter(item => item.聚集地.includes(key))
            .forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.ID}</td><td>${item.聚集地}</td>`;
                tbody.appendChild(tr);
            });
    })
    .catch(err => console.error('加载自备数据失败:', err));
});
