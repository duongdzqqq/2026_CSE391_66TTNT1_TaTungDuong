// --- 1. KHAI BÁO CÁC PHẦN TỬ ---
const form = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('togglePassword');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const nameInput = document.getElementById('fullname');
const nameCount = document.getElementById('nameCount');

// --- 2. TÍNH NĂNG NÂNG CAO (REALTIME) ---

// A. Đếm ký tự Họ tên
nameInput.addEventListener('input', function() {
    const len = this.value.length;
    nameCount.innerText = `${len}/50`;
    if (len >= 50) nameCount.style.color = 'red';
    else nameCount.style.color = 'inherit';
    clearError('fullname'); // Xóa lỗi khi đang gõ
});

// B. Hiện/Ẩn mật khẩu
toggleBtn.addEventListener('click', function() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    this.innerText = isPassword ? '🙈' : '👁️';
});

// C. Thanh mức độ mật khẩu (Password Strength)
passwordInput.addEventListener('input', function() {
    const val = this.value;
    let score = 0;

    if (val.length >= 8) score++; 
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++; 
    if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++; 

    // Reset class
    strengthBar.className = '';
    
    if (val.length === 0) {
        strengthText.innerText = '';
    } else if (score === 1) {
        strengthBar.classList.add('low');
        strengthText.innerText = 'Yếu 🔴';
        strengthText.style.color = '#ff4d4d';
    } else if (score === 2) {
        strengthBar.classList.add('medium');
        strengthText.innerText = 'Trung bình 🟡';
        strengthText.style.color = '#cca300';
    } else if (score === 3) {
        strengthBar.classList.add('high');
        strengthText.innerText = 'Mạnh 🟢';
        strengthText.style.color = '#2eb82e';
    }
});

// --- 3. LOGIC VALIDATION CƠ BẢN ---

function showError(fieldId, message) {
    document.getElementById(`error-${fieldId}`).innerText = message;
    document.getElementById(fieldId)?.classList.add('invalid');
}

function clearError(fieldId) {
    document.getElementById(`error-${fieldId}`).innerText = '';
    document.getElementById(fieldId)?.classList.remove('invalid');
}

const validate = {
    fullname: () => {
        const val = nameInput.value.trim();
        if (val.length < 3) { showError('fullname', 'Họ tên tối thiểu 3 ký tự'); return false; }
        clearError('fullname'); return true;
    },
    email: () => {
        const val = document.getElementById('email').value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(val)) { showError('email', 'Email không hợp lệ'); return false; }
        clearError('email'); return true;
    },
    phone: () => {
        const val = document.getElementById('phone').value.trim();
        if (!/^0\d{9}$/.test(val)) { showError('phone', 'SĐT phải 10 số, bắt đầu bằng 0'); return false; }
        clearError('phone'); return true;
    },
    confirm: () => {
        const pass = passwordInput.value;
        const confirm = document.getElementById('confirmPassword').value;
        if (confirm !== pass || !confirm) { showError('confirmPassword', 'Mật khẩu không khớp'); return false; }
        clearError('confirmPassword'); return true;
    }
};

// --- 4. XỬ LÝ SUBMIT ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Gọi tất cả hàm validate
    const isNameOk = validate.fullname();
    const isEmailOk = validate.email();
    const isPhoneOk = validate.phone();
    const isConfirmOk = validate.confirm();
    const isTermsOk = document.getElementById('terms').checked;
    
    if (!isTermsOk) showError('terms', 'Bạn chưa đồng ý điều khoản');
    else clearError('terms');

    if (isNameOk && isEmailOk && isPhoneOk && isConfirmOk && isTermsOk) {
        form.style.display = 'none';
        const success = document.getElementById('successMsg');
        success.style.display = 'block';
        success.innerHTML = `<h2>Đăng ký thành công! 🎉</h2><p>Chào mừng ${nameInput.value}</p>`;
    }
});