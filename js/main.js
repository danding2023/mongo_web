const studentList = document.getElementById('studentList');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const gradeInput = document.getElementById('gradeInput');
const addBtn = document.getElementById('addBtn');

let students = [];

// 读取 students.json
async function loadStudents() {
  try {
    const res = await fetch('./data/students.json');
    students = await res.json();
    renderStudents();
  } catch (err) {
    console.error('读取数据失败:', err);
  }
}

// 渲染学生列表
function renderStudents() {
  studentList.innerHTML = '';
  students.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name} (${s.age}岁, ${s.grade})`;

    // 删除按钮
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.onclick = () => {
      students = students.filter(st => st.id !== s.id);
      renderStudents();
    };

    li.appendChild(delBtn);
    studentList.appendChild(li);
  });
}

// 添加新学生（只更新前端内存）
addBtn.onclick = () => {
  const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = {
    id: newId,
    name: nameInput.value.trim(),
    age: parseInt(ageInput.value),
    grade: gradeInput.value.trim()
  };
  if (!newStudent.name || !newStudent.age || !newStudent.grade) return alert('请完整填写信息');

  students.push(newStudent);
  renderStudents();

  // 清空输入框
  nameInput.value = '';
  ageInput.value = '';
  gradeInput.value = '';
};

loadStudents();
