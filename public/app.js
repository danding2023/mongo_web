async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const users = await res.json();
    const ul = document.getElementById('userList');
    ul.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.name} (${u.age}) - ${u.email}`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('userList').innerHTML = '<li>加载失败 — 请查看控制台</li>';
  }
}

document.getElementById('reload').addEventListener('click', loadUsers);
loadUsers();
