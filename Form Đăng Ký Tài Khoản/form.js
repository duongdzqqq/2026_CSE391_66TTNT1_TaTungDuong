const form = document.getElementById('registerForm');
const successArea = document.getElementById('successMsg');

// --- HÀM TIỆN ÍCH ---
function showError(fieldId, message) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    errorSpan.innerText = message;
    document.getElementById(fieldId)?.classList.add('invalid');
}

function clearError(fieldId) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    errorSpan.innerText = '';
    document.getElementById(fieldId)?.classList.remove('invalid');
}

// --- CÁC HÀM VALIDATE TỪNG TRƯỜNG ---

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]{3,}$/; // Chữ cái, khoảng trắng, >= 3 ký tự
    if (val === "") { showError('fullname', 'Họ tên không được để trống'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên tối thiểu 3 ký tự và chỉ chứa chữ cái'); return false; }
    clearError('fullname'); return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng'); return false; }
    clearError('email'); return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/; // Bắt đầu bằng 0, tổng 10 số
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0'); return false; }
    clearError('phone'); return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    // Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) { showError('password', 'Mật khẩu yếu (cần 8 ký tự, có A, a, 1)'); return false; }
    clearError('password'); return true;
}

function validateConfirm() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm !== pass || confirm === "") { 
        showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; 
    }
    clearError('confirmPassword'); return true;
}

function validateGender() {
    const checked = document.querySelector('input[name="gender"]:checked');
    if (!checked) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender'); return true;
}

function validateTerms() {
    const isChecked = document.getElementById('terms').checked;
    if (!isChecked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms'); return true;
}

// --- GẮN SỰ KIỆN ---

// Validate Realtime (Blur & Input)
const inputs = ['fullname', 'email', 'phone', 'password', 'confirmPassword'];
inputs.forEach(id => {
    const element = document.getElementById(id);
    // Khi rời ô: Kiểm tra lỗi
    element.addEventListener('blur', () => {
        if (id === 'fullname') validateFullname();
        if (id === 'email') validateEmail();
        if (id === 'phone') validatePhone();
        if (id === 'password') validatePassword();
        if (id === 'confirmPassword') validateConfirm();
    });
    // Khi gõ: Xóa lỗi ngay lập tức
    element.addEventListener('input', () => clearError(id));
});

// Xử lý Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Sử dụng bitwise & để đảm bảo TẤT CẢ các hàm validate đều chạy (để hiện lỗi toàn bộ form)
    const isNameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirm();
    const isGenderValid = validateGender();
    const isTermsValid = validateTerms();

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid && isGenderValid && isTermsValid) {
        const name = document.getElementById('fullname').value;
        form.style.display = 'none';
        successArea.style.display = 'block';
        successArea.innerHTML = `Đăng ký thành công! 🎉 <br> Chào mừng, ${name}!`;
    }
});