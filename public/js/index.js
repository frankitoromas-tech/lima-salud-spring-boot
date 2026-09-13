(function () {
    'use strict';

    document.querySelectorAll('.js-current-year').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    var tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

    var ruta = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
        if (link.getAttribute('href') === ruta) link.classList.add('active');
    });
})();