const CACHE_NAME = "v.2";

// ระบุ Keyword หรือ Path ของ API ที่เราไม่ต้องการให้เก็บแคชเด็ดขาด
const EXCLUDED_PATHS = [
    "/api/",
    "api.example.com", // เปลี่ยนเป็น domain API ของคุณ
    "/auth/",
    "https://api.external.com"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    console.log("Service Worker installed (Lazy Mode)");
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const url = event.request.url;

    // ตรวจสอบว่า URL นี้อยู่ในรายการที่ต้อง "ยกเว้น" (API) หรือไม่
    const isExcluded = EXCLUDED_PATHS.some(path => url.includes(path));

    if (isExcluded) {
        // ถ้าเป็น API ให้ดึงจาก Network เท่านั้น ไม่ต้องผ่าน Cache
        console.log("API detected, fetching from network only:", url);
        return; // ออกจากฟังก์ชัน ให้เบราว์เซอร์จัดการ fetch ปกติ
    }

    // สำหรับไฟล์ทั่วไป (HTML, JS, CSS, Images) ให้ทำ Lazy Cache
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // 1. ถ้ามีในแคชแล้ว ส่งคืนให้ทันที
            if (cachedResponse) {
                return cachedResponse;
            }

            // 2. ถ้าไม่มีในแคช ให้โหลดจาก Network
            return fetch(event.request).then(networkResponse => {
                // ตรวจสอบว่า response ปกติไหมก่อนจะเก็บลงแคช
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // ก๊อบปี้ไฟล์เก็บลงแคช (Lazy Cache)
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                    console.log("Lazy Cached:", url);
                });

                return networkResponse;
            }).catch(() => {
                // กรณีเน็ตหลุดและไม่มีแคช
                return new Response("Offline content not available");
            });
        })
    );
});