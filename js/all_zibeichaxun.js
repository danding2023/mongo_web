fetch('../data/zibei.json')
.then(res => res.json())
.then(data => {
    const tbody = document.getElementById('zibeiTable').querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.id}</td><td>${s.name}</td>`;
        tbody.appendChild(tr);
    });
})
.catch(err => console.error('加载字辈数据失败:', err));
