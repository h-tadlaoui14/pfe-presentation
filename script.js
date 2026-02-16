/* ================================
   STAYGENIE Presentation — Script
   ================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // Scroll-based animations
    // ========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .journey-step').forEach(el => {
        observer.observe(el);
    });

    // ========================
    // Progress bar
    // ========================
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    // ========================
    // Active nav link
    // ========================
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll-based active nav link (more reliable than IntersectionObserver for adjacent sections)
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100; // offset for nav height
        let currentSection = '';

        sections.forEach(section => {
            if (!section.id) return;
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === currentSection);
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ========================
    // Persona tabs
    // ========================
    const tabs = document.querySelectorAll('.persona-tab');
    const contents = document.querySelectorAll('.persona-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const persona = tab.dataset.persona;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(c => c.classList.remove('active'));
            const target = document.getElementById('persona-' + persona);
            if (target) {
                target.classList.add('active');
                // Trigger journey step animations for this persona
                target.querySelectorAll('.journey-step').forEach((step, i) => {
                    step.classList.remove('visible');
                    setTimeout(() => step.classList.add('visible'), 100 + i * 120);
                });
            }
        });
    });

    // Trigger journey steps for initially active persona
    const activePersona = document.querySelector('.persona-content.active');
    if (activePersona) {
        const stepsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const steps = activePersona.querySelectorAll('.journey-step');
                    steps.forEach((step, i) => {
                        setTimeout(() => step.classList.add('visible'), 100 + i * 120);
                    });
                    stepsObserver.disconnect();
                }
            });
        }, { threshold: 0.1 });
        stepsObserver.observe(activePersona);
    }

    // ========================
    // Counter animation
    // ========================
    const counters = document.querySelectorAll('.impact-value[data-count]');
    let countersDone = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    const duration = 1800;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(target * ease);

                        if (target >= 1000) {
                            counter.textContent = current.toLocaleString();
                        } else {
                            counter.textContent = current;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));

    // ========================
    // Smooth scroll for anchor links
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================
    // Nav background on scroll
    // ========================
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });

});
