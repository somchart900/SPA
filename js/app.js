// โหลด header
fetch("/components/header.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("header-placeholder").outerHTML = html;
        document.getElementById("main-content").classList.remove("d-none");
        setActiveMenu();
       
    });

// โหลด footer
fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("footer-placeholder").outerHTML = html;
    });

function setActiveMenu() {
    const currentPage = window.location.pathname.split("/").pop().split("?")[0].split("#")[0] || 'index.html';
    // const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}
