const prices = { "Laptop": 20000000, "Smartphone": 10000000, "Tablet": 5000000 };

const form = document.getElementById('orderForm');
const productSelect = document.getElementById('product');
const qtyInput = document.getElementById('quantity');
const noteInput = document.getElementById('note');
const confirmModal = document.getElementById('confirmModal');

// --- 1. TÍNH TỔNG TIỀN TỰ ĐỘNG ---
function updateTotal() {
    const product = productSelect.value;
    const qty = parseInt(qtyInput.value) || 0;
    const price = prices[product] || 0;
    const total = price * qty;
    document.getElementById('totalPrice').innerText = total.toLocaleString("vi-VN");
}

productSelect.addEventListener('change', updateTotal);
qtyInput.addEventListener('input', updateTotal);

// --- 2. ĐẾM KÝ TỰ REALTIME ---
noteInput.addEventListener('input', function() {
    const len = this.value.length;
    const countDisplay = document.getElementById('charCount');
    countDisplay.innerText = `${len}/200`;
    
    if (len > 200) {
        countDisplay.style.color = 'red';
        showError('note', 'Ghi chú không được vượt quá 200 ký tự');
    } else {
        countDisplay.style.color = 'inherit';
        clearError('note');
    }
});

// --- 3. VALIDATE CHI TIẾT ---
function validateOrder() {
    let isValid = true;

    // Sản phẩm
    if (!productSelect.value) {
        showError('product', 'Vui lòng chọn sản phẩm');
        isValid = false;
    } else clearError('product');

    // Số lượng
    const qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1 || qty > 99) {
        showError('quantity', 'Số lượng từ 1 đến 99');
        isValid = false;
    } else clearError('quantity');

    // Ngày giao hàng
    const dateVal = document.getElementById('deliveryDate').value;
    if (!dateVal) {
        showError('deliveryDate', 'Vui lòng chọn ngày giao');
        isValid = false;
    } else {
        const selectedDate = new Date(dateVal).setHours(0,0,0,0);
        const today = new Date().setHours(0,0,0,0);
        const maxDate = new Date().setDate(new Date().getDate() + 30);

        if (selectedDate < today) {
            showError('deliveryDate', 'Không được chọn ngày trong quá khứ');
            isValid = false;
        } else if (selectedDate > maxDate) {
            showError('deliveryDate', 'Không được quá 30 ngày từ hôm nay');
            isValid = false;
        } else clearError('deliveryDate');
    }

    // Địa chỉ
    const address = document.getElementById('address').value.trim();
    if (address.length < 10) {
        showError('address', 'Địa chỉ phải ít nhất 10 ký tự');
        isValid = false;
    } else clearError('address');

    // Thanh toán
    if (!document.querySelector('input[name="payment"]:checked')) {
        showError('payment', 'Vui lòng chọn phương thức thanh toán');
        isValid = false;
    } else clearError('payment');

    return isValid;
}

// --- 4. XỬ LÝ SUBMIT & XÁC NHẬN ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateOrder()) {
        // Hiển thị tóm tắt đơn hàng
        const summary = `
            <p>Sản phẩm: ${productSelect.value}</p>
            <p>Số lượng: ${qtyInput.value}</p>
            <p>Tổng tiền: ${document.getElementById('totalPrice').innerText}đ</p>
            <p>Ngày giao: ${document.getElementById('deliveryDate').value}</p>
        `;
        document.getElementById('orderSummary').innerHTML = summary;
        confirmModal.style.display = 'block';
    }
});

document.getElementById('btnFinalConfirm').onclick = () => {
    alert("🎉 Đặt hàng thành công!");
    location.reload();
};

document.getElementById('btnCancel').onclick = () => {
    confirmModal.style.display = 'none';
};

// Hàm showError/clearError tương tự Bài 2.1
function showError(id, msg) {
    document.getElementById(`error-${id}`).innerText = msg;
}
function clearError(id) {
    document.getElementById(`error-${id}`).innerText = "";
}