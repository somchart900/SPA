function test() {
    Swal.fire('Hello!', 'เรียกฟังก์ชันสําหรับทดสอบ', 'info')
}






document.addEventListener("DOMContentLoaded", () => {
    //--ดึงปีปัจจุบัน
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // เปิดูระหัสผ่านที่พิมพ์ลงไปแล้ว
    if (document.getElementById("password")) {
        const togglePassword = document.getElementById("togglePassword");
        const passwordInput = document.getElementById("password");


        // toggle ช่องรหัสผ่าน
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.innerHTML = type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        });
    }
    if (document.getElementById("confirm-password")) {
        const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
        const confirmPasswordInput = document.getElementById("confirm-password");
        //toggle ช่องยืนยันรหัสผ่าน
        toggleConfirmPassword.addEventListener("click", () => {
            const type = confirmPasswordInput.type === "password" ? "text" : "password";
            confirmPasswordInput.type = type;
            toggleConfirmPassword.innerHTML = type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        });
    }
});



