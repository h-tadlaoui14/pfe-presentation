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
    // ========================
    // Currency Toggle
    // ========================
    const currencyToggle = document.getElementById('currencyToggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', () => {
            const isEur = currencyToggle.classList.toggle('eur');
            const newCurrency = isEur ? 'EUR' : 'MAD';

            // Update labels
            currencyToggle.querySelectorAll('.currency-label').forEach(label => {
                label.classList.toggle('active', label.dataset.curr === newCurrency);
            });

            // Dispatch global event for other components (like calculator)
            const event = new CustomEvent('currencyChange', {
                detail: { currency: newCurrency }
            });
            document.dispatchEvent(event);
        });
    }

    // ====================================
    // Genie Mascot — Proactive Messaging
    // ====================================
    const genieWrapper = document.getElementById('genieWrapper');
    const genieTip = document.getElementById('genieTip');
    const genieMsgEl = document.getElementById('genieTipMsg');
    const genieClose = document.getElementById('genieTipClose');

    const genieMessages = {
        'hero': '👋 I\'m <strong>Genie</strong>, your AI real estate advisor. Scroll down and I\'ll guide you!',
        'problem': '😤 These are real problems Moroccan renters face <strong>every day</strong>. I\'m here to fix them!',
        'market-size': '📊 Morocco\'s real estate market is worth <strong>100.6B MAD</strong> — 6.3% of GDP. Mostly undigitized — that\'s our chance!',
        'positioning': '🎯 Unlike listing portals, I\'m <strong>proactive</strong> — I alert you before you even ask.',
        'competitors': '💡 They list. I <strong>analyze, advise, and act</strong>. That\'s the STAYGENIE difference.',
        'partnerships': '🤝 We work with <strong>Mubawab, banks & agencies</strong> to bring the whole ecosystem together.',
        'personas': '🏠 I adapt to every user — <strong>renters, investors, agencies</strong> — each gets a tailored experience.',
        'ai-engines': '🧠 These are my <strong>6 AI brains</strong>. From subsidy checks to smart matching, each one is specialized.',
        'impact': '📊 Real numbers: <strong>94,000 families</strong> helped by Daam Sakane in 2024. I connect you to that!',
        'roadmap': '🚀 We go from MVP to Morocco\'s <strong>real estate intelligence layer</strong> in 6 months.',
        'revenue': '💰 <strong>4 revenue streams</strong> — freemium, commissions, SaaS, and referrals. Built to scale.',
        'why-now': '⏰ Subsidies, a digital gap, a housing crisis, and <strong>World Cup 2030</strong> converging. The time is now.',
        'gtm': '🚀 We start in <strong>Casablanca</strong>, prove the model, then expand. Phased and intentional!',
        'user-flow': '📱 Four steps from sign-up to <strong>moving in with confidence</strong>. Seamless by design.'
    };

    let genieVisible = false;
    let genieUserClosed = false;
    let currentGenieSection = '';

    function showGenieTip(html) {
        if (!genieTip || !genieMsgEl) return;
        genieMsgEl.innerHTML = html;
        genieTip.classList.add('visible');
        genieVisible = true;
    }

    function hideGenieTip() {
        if (!genieTip) return;
        genieTip.classList.remove('visible');
        genieVisible = false;
    }

    function updateGenieOnScroll() {
        if (genieUserClosed) return;
        const scrollMid = window.scrollY + window.innerHeight * 0.5;
        let active = 'hero';
        document.querySelectorAll('[id]').forEach(el => {
            if (!genieMessages[el.id]) return;
            if (scrollMid >= el.offsetTop) active = el.id;
        });
        if (active !== currentGenieSection && genieMessages[active]) {
            currentGenieSection = active;
            showGenieTip(genieMessages[active]);
        }
    }

    if (genieWrapper) {
        // Bounce + scroll to top on click (but not if clicking close button)
        genieWrapper.addEventListener('click', (e) => {
            if (e.target === genieClose || genieClose.contains(e.target)) return;
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
            genieWrapper.style.transition = 'transform 0.15s ease';
            genieWrapper.style.transform = 'scale(1.15)';
            setTimeout(() => { genieWrapper.style.transform = ''; }, 300);
        });

        // Close button dismisses bubble until next section change
        if (genieClose) {
            genieClose.addEventListener('click', (e) => {
                e.stopPropagation();
                hideGenieTip();
                genieUserClosed = true;
                // Re-enable proactive messages when they scroll to a new section
                setTimeout(() => { genieUserClosed = false; }, 8000);
            });
        }

        // Scroll-based proactive messages
        window.addEventListener('scroll', updateGenieOnScroll, { passive: true });

        // Auto-show greeting after page load
        setTimeout(() => {
            showGenieTip(genieMessages['hero']);
            // Auto-hide after 5s if user doesn't interact
            setTimeout(() => {
                if (genieVisible && currentGenieSection === 'hero') hideGenieTip();
            }, 5000);
        }, 2000);
    }

});
