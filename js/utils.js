function test() {
    Swal.fire('Hello!', 'เรียกฟังก์ชันสําหรับทดสอบ', 'info')
}


document.addEventListener("click", (e) => {
    const btn = e.target.closest("#togglePassword");
    if (btn) {
        const input = document.getElementById("password");
        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";
        btn.innerHTML = isPassword
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';
    }

    const btn2 = e.target.closest("#toggleConfirmPassword");
    if (btn2) {
        const input = document.getElementById("confirm-password");
        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";
        btn2.innerHTML = isPassword
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';
    }
});








