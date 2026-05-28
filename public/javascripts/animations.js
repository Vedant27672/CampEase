/* ═══════════════════════════════════════════════════════
   CampEase v2 — Interactions & Animations
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavbar();
    initScrollReveal();
    initStatCounters();
    initFlashToast();
    initFormValidation();
});

/* ════════════════════════════════════════════
   THEME (light / dark)
   Applied to <html data-theme="...">
   ════════════════════════════════════════════ */
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const root = document.documentElement;

    // On first load, apply saved or system preference
    const saved = localStorage.getItem('campease-theme');
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', preferred);

    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('campease-theme', next);
    });
}

/* ════════════════════════════════════════════
   NAVBAR — scroll shrink, hamburger, dropdown
   ════════════════════════════════════════════ */
function initNavbar() {
    const nav       = document.querySelector('.site-nav');
    const burger    = document.getElementById('navBurger');
    const drawer    = document.getElementById('navMobile');
    const userBtn   = document.getElementById('navUserBtn');
    const userMenu  = userBtn ? userBtn.closest('.nav-user') : null;

    // Scroll: add shadow class
    if (nav) {
        const onScroll = throttle(() => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 10);
        }, 80);
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Hamburger toggle
    if (burger && drawer) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = drawer.classList.toggle('open');
            burger.setAttribute('aria-expanded', open);
        });
        // Close drawer on outside click
        document.addEventListener('click', (e) => {
            if (!drawer.contains(e.target) && e.target !== burger) {
                drawer.classList.remove('open');
            }
        });
    }

    // User dropdown toggle
    if (userBtn && userMenu) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove('open');
            }
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') userMenu.classList.remove('open');
        });
    }

    // Active nav link highlight
    const path = window.location.pathname;
    document.querySelectorAll('.nav-lnk, .nav-mob-lnk').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        const exact = path === href;
        const sub   = href !== '/' && path.startsWith(href);
        if (exact || sub) a.classList.add('active');
    });
}

/* ════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
   ════════════════════════════════════════════ */
function initScrollReveal() {
    const items = document.querySelectorAll('.scroll-reveal');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), i * 65);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items.forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════
   STAT COUNTERS (home page)
   ════════════════════════════════════════════ */
function initStatCounters() {
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
}

function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
}

/* ════════════════════════════════════════════
   TOAST NOTIFICATIONS
   Reads window.__flash set by boilerplate.ejs
   ════════════════════════════════════════════ */
function initFlashToast() {
    if (window.__flash) {
        showToast(window.__flash.type, window.__flash.msg);
    }
}

function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error:   '<i class="fas fa-exclamation-circle"></i>',
        info:    '<i class="fas fa-info-circle"></i>',
    };
    const icon = icons[type] || icons.info;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-body">${message}</span>
        <button class="toast-close" aria-label="Dismiss"><i class="fas fa-times"></i></button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const dismiss = () => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 5000);
}

// Expose globally so controllers can call it
window.showToast = showToast;

/* ════════════════════════════════════════════
   BOOTSTRAP FORM VALIDATION
   ════════════════════════════════════════════ */
function initFormValidation() {
    document.querySelectorAll('.validated-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

/* ════════════════════════════════════════════
   UTILITY: throttle
   ════════════════════════════════════════════ */
function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= limit) { last = now; fn.apply(this, args); }
    };
}

/* ════════════════════════════════════════════
   SMOOTH ANCHOR SCROLLING
   ════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
