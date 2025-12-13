fetch('../data/students.json')
.then(res => res.json())
.then(data => {
    const tbody = document.getElementById('studentsTable').querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.id}</td><td>${s.name}</td><td>${s.age}</td>`;
        tbody.appendChild(tr);
    });
})
.catch(err => console.error('加载学生数据失败:', err));
