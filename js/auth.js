// --auth.js

document.addEventListener('alpine:init', () => {
  Alpine.store('auth', {
    user: null,

    init() {
      this.user = JSON.parse(sessionStorage.getItem("users"));
    },

    logout() {
      this.user = null;
      sessionStorage.clear();

      Swal.fire({
        icon: 'success',
        title: 'ออกจากระบบสำเร็จ',
        text: 'คุณได้ออกจากระบบเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '/';
      });
    }
  });
});
//--เข้าสู่ระบบ

async function handleLogin(btn) {
  const loginForm = document.getElementById("login-form");
  const formData = new FormData(loginForm);

  // เปลี่ยนปุ่มเป็นกำลังโหลด
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> กำลังเข้าสู่ระบบ...`;

  try {
    const result = await fakeApiLogin(formData);

    // คืนค่าปุ่มกลับมา
    btn.disabled = false;
    btn.innerHTML = "เข้าสู่ระบบ";

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับกลับ!",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.href = "/profile.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: result.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  } catch (error) {
    // คืนค่าปุ่มกลับมา
    btn.disabled = false;
    btn.innerHTML = "เข้าสู่ระบบ";

    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
    });
  }
}

//--ลงทะเบียน


async function handleRegister(btn) {
  const registerForm = document.getElementById("register-form");

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // ตรวจสอบรหัสผ่านตรงกัน
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "รหัสผ่านไม่ตรงกัน",
      text: "กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน",
    });
    return;
  }

  const formData = new FormData(registerForm);

  // 🔄 เปลี่ยนปุ่มเป็นกำลังโหลด
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> กำลังสมัครสมาชิก...`;

  try {
    const result = await fakeApiRegister(formData);

    // คืนค่าปุ่มกลับมา
    btn.disabled = false;
    btn.innerHTML = "สมัครสมาชิก";

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
        timer: 2500,
        showConfirmButton: false,
      });
      window.location.href = "/login.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text: result.message || "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      });
    }
  } catch (error) {
    // คืนค่าปุ่มกลับมา
    btn.disabled = false;
    btn.innerHTML = "สมัครสมาชิก";

    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
    });
  }
}


// จำลอง API /api/login
function fakeApiLogin(formData) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        // ใช้ await เพราะ getUserByemail คืนค่าเป็น Promise
        const user = await getUserByemail(email);

        if (!user) {
          resolve({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
          return;
        }

        if (user.password !== password) {
          resolve({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
          return;
        }
        sessionStorage.setItem("users", JSON.stringify(user));
        resolve({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
      } catch (err) {
        resolve({ success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้" });
      }
    }, 1000);
  });
}


// จำลอง API /api/register
function fakeApiRegister(formData) {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");

      // เช็กว่ามี email อยู่แล้วหรือไม่
      const user = await getUserByemail(email);

      if (!user) {
        addUser(username, email, password);
        resolve({
          success: true,
          message: "สมัครสมาชิกสำเร็จ"
        });
      } else {
        resolve({
          success: false,
          message: "อีเมลถูกใช้ไปแล้ว"
        });
      }
    }, 1000); // หน่วงเวลาเหมือน API จริง
  });
}
