// js/zibeichaxun.js
console.log("【1】zibeichaxun.js 已成功加载");

document.addEventListener("DOMContentLoaded", () => {
    console.log("【2】DOM 已加载完成");

    const input = document.getElementById("keyword");
    const button = document.getElementById("searchBtn");
    const resultDiv = document.getElementById("result");

    if (!input || !button || !resultDiv) {
        console.error("【错误】页面元素未找到", { input, button, resultDiv });
        return;
    }

    console.log("【3】页面元素获取成功");

    button.addEventListener("click", () => {
        const keyword = input.value.trim();
        console.log("【4】点击查询，关键词 =", keyword);

        if (!keyword) {
            resultDiv.innerHTML = "请输入查询关键字";
            return;
        }

        fetch("../data/zibei.json")
            .then(response => {
                console.log("【5】fetch 返回状态：", response.status);
                if (!response.ok) {
                    throw new Error("HTTP 状态异常：" + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log("【6】成功读取 JSON 数据：", data);

                if (!Array.isArray(data)) {
                    console.error("【错误】JSON 不是数组");
                    resultDiv.innerHTML = "数据格式错误";
                    return;
                }

                const matched = data.filter(item =>
                    item["聚集地"] && item["聚集地"].includes(keyword)
                );

                console.log("【7】匹配结果：", matched);

                if (matched.length === 0) {
                    resultDiv.innerHTML = "没有找到匹配记录";
                    return;
                }

                let html = "<ul>";
                matched.forEach(row => {
                    html += `<li>${row.ID} - ${row["聚集地"]}</li>`;
                });
                html += "</ul>";

                resultDiv.innerHTML = html;
            })
            .catch(err => {
                console.error("【8】发生错误：", err);
                resultDiv.innerHTML = "查询失败，请查看控制台";
            });
    });
});
