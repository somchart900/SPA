// Initialize the app
window.app = {
    router: {
        currentPage: 'home',

        // 🔥 เปลี่ยนหน้า
        navigate: function (page, pushHistory = true) {
            this.currentPage = page;
            const contentEl = document.getElementById('app-content');

            if (!contentEl) {
                console.error('app-content element not found');
                return;
            }

            // ✅ เปลี่ยน URL
            if (pushHistory) {
                const url = page === 'home' ? '/' : `/${page}`;
                window.history.pushState({ page: page }, '', url);
            }

            // ✅ เปลี่ยน title
            const pageTitle = page === 'home'
                ? 'Home'
                : page.charAt(0).toUpperCase() + page.slice(1);

            document.title = `${pageTitle} - My SPA App`;

            // ✅ โหลด content
            const pagePath = `/pages/${page}.html`;

            fetch(pagePath)
                .then(response => {
                    if (!response.ok) throw new Error('Page not found');
                    return response.text();
                })
                .then(html => {
                    contentEl.innerHTML = html;

                    // 🔥 อัปเดต active link (สำคัญ)
                    this.setActiveLink();
                })
                .catch(error => {
                    //console.error('Error loading page:', error);

                    if (page !== 'home') {
                        window.history.replaceState({ page: 'home' }, '', '/');
                        this.navigate('home', false);
                    } else {
                        contentEl.innerHTML = `
                            <div class="container mt-5">
                                <div class="alert alert-danger">
                                    Error loading page: ${error.message}
                                </div>
                            </div>`;
                    }
                });
        },

        // 🔥 อ่าน path จาก URL
        getPageFromURL: function () {
            const path = window.location.pathname;
            if (path === '/' || path === '') return 'home';

            const segments = path.substring(1).split('/');
            return segments[0] || 'home';
        },

        // 🔥 เซ็ต active nav
        setActiveLink: function () {
            const links = document.querySelectorAll('a.nav-link');

            links.forEach(link => {
                const url = new URL(link.href);
                const path = url.pathname === '/' ? 'home' : url.pathname.substring(1);

                if (path === this.currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    },

    loadComponents: function () {
        // 🔥 โหลด header
        fetch('/components/header.html')
            .then(res => res.text())
            .then(html => {
                const headerEl = document.getElementById('navbar-header');
                if (headerEl) {
                    headerEl.innerHTML = html;

                    // 🔥 ต้องยิง active หลัง header โหลด
                    window.app.router.setActiveLink();
                }
            })
            .catch(err => console.error('Error loading header:', err));

        // โหลด footer
        fetch('/components/footer.html')
            .then(res => res.text())
            .then(html => {
                const footerEl = document.getElementById('footer-content');
                if (footerEl) {
                    footerEl.innerHTML = html;
                }
            })
            .catch(err => console.error('Error loading footer:', err));
    }
};

// 🔥 ดัก back / forward
window.addEventListener('popstate', function (event) {
    const page = event.state?.page || window.app.router.getPageFromURL();
    window.app.router.navigate(page, false);
});

// 🔥 start app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    window.app.loadComponents();
    const page = window.app.router.getPageFromURL();
    window.app.router.navigate(page, false);
}

// 🔥 ดัก click ทั้งเว็บ (แทน onclick)
document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const url = new URL(link.href);

    // เฉพาะลิงก์ในเว็บเรา
    if (url.origin !== window.location.origin) return;

    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;

    e.preventDefault();

    const page = url.pathname === '/' ? 'home' : url.pathname.substring(1);

    window.app.router.navigate(page);
});

