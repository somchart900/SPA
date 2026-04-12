
function productApp() {
    return {
        products: [],
        loading: true,
        error: '',

        async fetchProducts() {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000); // 3 วิ

            try {
                const res = await fetch('https://fakestoreapi.com/products', {
                    signal: controller.signal
                });

                const data = await res.json();

                // delay นิดให้เห็น animation
                setTimeout(() => {
                    this.products = data;
                    this.loading = false;
                }, 100);

            } catch (err) {
                this.loading = false;

                if (err.name === 'AbortError') {
                    this.error = 'โหลดช้าเกิน 3 วิ ยกเลิกแล้ว';
                } else {
                    this.error = 'โหลดไม่สำเร็จ';
                }
            } finally {
                clearTimeout(timeout);
            }
        }
    }
}