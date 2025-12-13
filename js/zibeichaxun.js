document.getElementById('searchBtn').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value.trim();
    fetch('../data/zibei.json')  // 路径根据项目结构调整
        .then(response => response.json())
        .then(data => {
            const results = data.filter(item => item.聚集地.includes(keyword));
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';
            if(results.length === 0){
                resultDiv.textContent = '没有匹配结果';
            } else {
                results.forEach(item => {
                    const p = document.createElement('p');
                    p.textContent = `${item.ID} - ${item.聚集地}`;
                    resultDiv.appendChild(p);
                });
            }
        })
        .catch(err => console.error(err));
});
