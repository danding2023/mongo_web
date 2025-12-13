// public/app.js

// 获取用户列表容器
const userList = document.getElementById("userList");

// 从后端 API 获取用户数据
fetch("/api/users")
  .then(response => response.json())
  .then(data => {
    userList.innerHTML = ""; // 先清空
    data.forEach(item => {
      // 只显示 name 和 age
      userList.innerHTML += `<li>${item.name} (${item.age})</li>`;
    });
  })
  .catch(err => {
    console.error("获取用户列表失败:", err);
    userList.innerHTML = "<li>加载用户列表失败</li>";
  });
