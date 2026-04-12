// ประกาศตัวแปร db ไว้ด้านนอก
let db;

// เปิดฐานข้อมูล
let request = indexedDB.open("ShopDB", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;

  // สร้างตาราง Users
  let usersStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
  usersStore.createIndex("name", "name", { unique: false });
  usersStore.createIndex("email", "email", { unique: true });
  usersStore.createIndex("password", "password", { unique: false });
  usersStore.createIndex("role", "role", { unique: false });
  usersStore.createIndex("dateadd", "dateadd", { unique: false });
  // สร้างตาราง Products
  let productsStore = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
  productsStore.createIndex("name", "name", { unique: false });
  productsStore.createIndex("price", "price", { unique: false });
  productsStore.createIndex("stock", "stock", { unique: false });
  productsStore.createIndex("category", "category", { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
//  console.log("Database opened successfully");
};

// ✅ CREATE (เพิ่มข้อมูล)
function addUser(name, email, password) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readwrite");
    let store = tx.objectStore("users");
    let request = store.add({ name: name, email: email, password: password ,role:"user",dateadd:new Date().toLocaleString()});

    request.onsuccess = () => resolve(request.result); // คืนค่า id ที่เพิ่ม
    request.onerror = () => reject("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
  });
}

// ✅ READ (อ่านข้อมูลทั้งหมด)
function getAllUsers() {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readonly");
    let store = tx.objectStore("users");
    let request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("เกิดข้อผิดพลาดในการอ่านข้อมูลทั้งหมด");
  });
}

// ✅ UPDATE (แก้ไขข้อมูล)
function updateUser(id, newName, newEmail) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readwrite");
    let store = tx.objectStore("users");
    let request = store.get(id);

    request.onsuccess = () => {
      let user = request.result;
      if (user) {
        user.name = newName;
        user.email = newEmail;
        let updateRequest = store.put(user);
        updateRequest.onsuccess = () => resolve(user);
        updateRequest.onerror = () => reject("เกิดข้อผิดพลาดในการอัปเดตผู้ใช้");
      } else {
        reject("ไม่พบผู้ใช้ที่ต้องการแก้ไข");
      }
    };
    request.onerror = () => reject("เกิดข้อผิดพลาดในการค้นหาผู้ใช้");
  });
}

// ✅ DELETE (ลบข้อมูลตาม id)
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readwrite");
    let store = tx.objectStore("users");
    let request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject("เกิดข้อผิดพลาดในการลบผู้ใช้");
  });
}

// ✅ DELETE (ลบตาม email)
function deleteUserByEmail(email) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readwrite");
    let store = tx.objectStore("users");
    let index = store.index("email");

    let request = index.get(email);
    request.onsuccess = () => {
      let user = request.result;
      if (user) {
        let deleteRequest = store.delete(user.id);
        deleteRequest.onsuccess = () => resolve(user);
        deleteRequest.onerror = () => reject("เกิดข้อผิดพลาดในการลบผู้ใช้");
      } else {
        resolve(null); // ไม่เจอ user
      }
    };
    request.onerror = () => reject("เกิดข้อผิดพลาดในการค้นหาผู้ใช้");
  });
}

// ✅ READ (อ่านตาม id)
function getUserById(id) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readonly");
    let store = tx.objectStore("users");
    let request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("เกิดข้อผิดพลาดในการค้นหาผู้ใช้ตาม id");
  });
}

// ✅ READ (อ่านตาม name)
function getUserByName(name) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readonly");
    let store = tx.objectStore("users");
    let index = store.index("name");

    let request = index.get(name);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("เกิดข้อผิดพลาดในการค้นหาผู้ใช้ตาม name");
  });
}


function getUserByemail(email) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("users", "readonly");
    let store = tx.objectStore("users");
    let index = store.index("email");

    let request = index.get(email);
    request.onsuccess = () => {
      resolve(request.result); // ถ้าไม่เจอจะได้ undefined
    };
    request.onerror = () => {
      reject("เกิดข้อผิดพลาดในการค้นหา");
    };
  });
}



// addUser("สมชาย", "somchai@example.com");
// addUser("สมหญิง", "somying@example.com");

// getAllUsers();

// getUserById(1);
// getUserByName("สมชาย");
//getUserByemail("somchai@example.com");
// updateUser(1, "สมชายใหม่", "new_somchai@example.com");

// deleteUserByName("สมหญิง");

// เก็บค่า sessionStorage
// sessionStorage.setItem("username", "somchai");
// sessionStorage.setItem("isLoggedIn", "true");
// // ดึงค่า
//let user = sessionStorage.getItem("username");
// let loggedIn = sessionStorage.getItem("isLoggedIn");

// console.log(user);       // "somchai"
// console.log(loggedIn);   // "true"
// // ลบค่าเฉพาะ key
// sessionStorage.removeItem("username");

// // ลบทั้งหมด
// sessionStorage.clear();

// เก็บค่าเป็น JSON
// let userObj = { username: "somchai", email: "somchai@example.com" };
// sessionStorage.setItem("user", JSON.stringify(userObj));

// // ดึงค่า
// let userData = JSON.parse(sessionStorage.getItem("user"));
// console.log(userData.username); // "somchai"
// console.log(userData.email);    // "somchai@example.com"