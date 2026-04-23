/* ════════════════════════════════════════════════════════
   GSV PORTFOLIO — script.js
════════════════════════════════════════════════════════ */

/* ── SKIP LOADER IF RETURNING FROM FORM ── */
if (window.location.hash === "#hero") {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

/* ── 1. LOADING SCREEN ── */
(function initLoader() {

    const lines = [
        "Welcome to my magical realm of code.",
        "Crafted with logic & a touch of gold."
    ];

    let currentLine = 0;
    let currentChar = 0;
    let isSkipped = false;

    function getElements(idx) {
        return {
            textEl: document.getElementById('inkLine' + idx),
            cursor: document.getElementById('cursor' + idx),
            quill: document.getElementById('quill' + idx),
        };
    }

    function typeLine(lineIdx) {
        if (isSkipped) return;

        const { textEl, cursor } = getElements(lineIdx);
        cursor.classList.remove('hidden');
        currentChar = 0;

        function typeChar() {
            if (isSkipped) return;

            if (currentChar <= lines[lineIdx].length) {
                textEl.textContent = lines[lineIdx].slice(0, currentChar);
                currentChar++;
                setTimeout(typeChar, 50);
            } else {
                cursor.classList.add('hidden');

                if (lineIdx < lines.length - 1) {
                    setTimeout(() => typeLine(lineIdx + 1), 500);
                } else {
                    setTimeout(() => {
                        document.getElementById('letterSign').classList.add('visible');

                        setTimeout(() => {
                            document.getElementById('loader').style.display = 'none';
                        }, 1200);

                    }, 400);
                }
            }
        }

        typeChar();
    }

    setTimeout(() => typeLine(0), 1000);

    document.getElementById("skipLoader")?.addEventListener("click", () => {
        isSkipped = true;
        document.getElementById('loader').style.display = 'none';
    });

    /* ── CONSTELLATION BACKGROUND ── */
    (function initConstellation() {
        const canvas = document.getElementById("constCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const stars = Array.from({ length: 70 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
        }));

        function draw() {
            ctx.clearRect(0, 0, w, h);

            stars.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;

                if (s.x < 0 || s.x > w) s.vx *= -1;
                if (s.y < 0 || s.y > h) s.vy *= -1;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(212,175,55,0.8)";
                ctx.fill();
            });

            // connect nearby stars
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(212,175,55,${1 - dist / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    })();
})();


/* ── 2. PARTICLES IN HERO ── */
(function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${40 + Math.random() * 50}%;
        --dur: ${5 + Math.random() * 8}s;
        --delay: ${Math.random() * 6}s;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        opacity: 0;
      `;
        container.appendChild(p);
    }
})();


/* ── 3. NAVBAR SCROLL EFFECT ── */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    function onScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 4. HAMBURGER MENU ── */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => menu.classList.remove('open'));
    });
})();


/* ── 5. SMOOTH SCROLLING ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


/* ── 6. PARALLAX HERO ── */
(function initParallax() {
    const bg = document.getElementById('heroBg');
    if (!bg) return;

    function onScroll() {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            bg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 7. SCROLL REVEAL ANIMATIONS ── */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // optionally unobserve after visible:
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();


/* ── 8. MUSIC TOGGLE ── */
(function initMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    if (!audio || !btn) return;

    let playing = false;

    btn.addEventListener('click', () => {
        if (playing) {
            audio.pause();
            icon.textContent = '♪';
            btn.title = 'Play Music';
            playing = false;
        } else {
            audio.play().catch(() => { });
            icon.textContent = '⏸';
            btn.title = 'Pause Music';
            playing = true;
        }
    });
})();


/* ── 9. DARK / LIGHT THEME TOGGLE ── */
(function initTheme() {
    const btn = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (!btn) return;

    const saved = localStorage.getItem('gsv-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    function updateIcon(theme) {
        btn.innerHTML = theme === 'dark'
            ? `<i data-lucide="moon"></i>`
            : `<i data-lucide="sun"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    updateIcon(saved);

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', next);
        localStorage.setItem('gsv-theme', next);

        updateIcon(next);
    });
})();

/* ── 11. ACTIVE NAV HIGHLIGHT ON SCROLL ── */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (match) match.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
})();


/* ── 12. CURSOR TRAIL (subtle golden dots) ── */
(function initCursorTrail() {
    // Only on desktop
    if (window.innerWidth < 900) return;

    const dots = [];
    const NUM = 5;

    for (let i = 0; i < NUM; i++) {
        const d = document.createElement('div');
        d.style.cssText = `
        position: fixed;
        width: ${4 - i * 0.3}px;
        height: ${4 - i * 0.3}px;
        background: rgba(212,175,55,${0.5 - i * 0.05});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: opacity 0.5s;
        transform: translate(-50%,-50%);
      `;
        document.body.appendChild(d);
        dots.push({ el: d, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX, y = mouseY;
        dots.forEach((dot, i) => {
            const prev = i === 0 ? { x: mouseX, y: mouseY } : dots[i - 1];
            dot.x += (prev.x - dot.x) * 0.35;
            dot.y += (prev.y - dot.y) * 0.35;
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
})();

/* ── SCROLL PROGRESS BAR ── */
(function initScrollProgress() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;

        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + "%";
    }, { passive: true });
})();

/* ── CONTACT FORM SUCCESS MESSAGE ── */
document.querySelector(".contact-form-wrap form")?.addEventListener("submit", function () {

    const successMsg = document.getElementById("formSuccess");

    setTimeout(() => {
        successMsg.style.display = "block";
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);

});