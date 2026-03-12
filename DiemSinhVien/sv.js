// 1. Khởi tạo dữ liệu
let students = []; 
let sortDirection = 0; // 0: mặc định, 1: tăng, -1: giảm

// DOM Elements
const nameInput = document.getElementById('txtName');
const scoreInput = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('studentTable');
const statsArea = document.getElementById('statsArea');
const searchInput = document.getElementById('searchName');
const rankSelect = document.getElementById('filterRank');
const sortBtn = document.getElementById('sortScore');
const sortIcon = document.getElementById('sortIcon');

// 2. Logic Xếp loại
const getRank = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
};

// 3. Hàm Thống kê
function updateStats(count, avg) {
    statsArea.innerText = `Tổng số sinh viên: ${count} | Điểm trung bình: ${Number(avg).toFixed(2)}`;
}

// 4. Hàm hiển thị (Render) - Nhận mảng nào vẽ mảng đó
function renderTable(dataToDisplay) {
    tableBody.innerHTML = '';
    
    if (dataToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có kết quả phù hợp</td></tr>';
        updateStats(0, 0);
        return;
    }

    let totalScore = 0;
    dataToDisplay.forEach((sv, index) => {
        totalScore += sv.score;
        const rank = getRank(sv.score);
        const rowClass = sv.score < 5 ? 'bg-yellow' : '';

        // Dùng students.indexOf(sv) để lấy đúng ID gốc trong mảng lớn khi xóa
        const row = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${sv.name}</td>
                <td>${sv.score}</td>
                <td>${rank}</td>
                <td><button class="btn-delete" data-origin-index="${students.indexOf(sv)}">Xóa</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    updateStats(dataToDisplay.length, totalScore / dataToDisplay.length);
}

// 5. Bộ lọc tổng hợp (Trái tim của ứng dụng)
function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const rankCriteria = rankSelect.value;

    // Bước 1: Filter
    let result = students.filter(sv => {
        const matchesName = sv.name.toLowerCase().includes(keyword);
        const matchesRank = rankCriteria === 'all' || getRank(sv.score) === rankCriteria;
        return matchesName && matchesRank;
    });

    // Bước 2: Sort
    if (sortDirection !== 0) {
        result.sort((a, b) => {
            return sortDirection === 1 ? a.score - b.score : b.score - a.score;
        });
    }

    renderTable(result);
}

// 6. Xử lý Thêm sinh viên
function addStudent() {
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập họ tên và điểm hợp lệ (0-10)!");
        return;
    }

    students.push({ name, score });
    
    // Reset form
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();

    applyFilters(); // Gọi applyFilters thay vì renderTable trực tiếp
}

// 7. Gắn sự kiện (Events)
btnAdd.addEventListener('click', addStudent);

scoreInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStudent();
});

searchInput.addEventListener('input', applyFilters);
rankSelect.addEventListener('change', applyFilters);

sortBtn.addEventListener('click', () => {
    sortDirection = (sortDirection === 0 || sortDirection === -1) ? 1 : -1;
    sortIcon.innerText = sortDirection === 1 ? '▲' : '▼';
    applyFilters();
});

// Event Delegation cho nút Xóa
tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const originIndex = e.target.getAttribute('data-origin-index');
        students.splice(originIndex, 1);
        applyFilters();
    }
});