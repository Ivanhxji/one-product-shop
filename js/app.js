/* ============================================
   ONE PRODUCT SHOP — JavaScript
   Features: Sticky nav, FAQ accordion, Qty selector,
   Mobile menu, Scroll reveal, Smooth scroll, Urgency
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR: scroll shadow ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // --- MOBILE MENU ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // --- FAQ ACCORDION ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- QUANTITY SELECTOR ---
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const buyBtn = document.getElementById('buyBtn');
    const basePrice = 49.99;

    function updatePrice() {
        const qty = parseInt(qtyInput.value) || 1;
        const total = (basePrice * qty).toFixed(2);
        buyBtn.innerHTML = `Add to Cart — $${total}<span class="btn-subtext">FREE Shipping | 30-Day Guarantee</span>`;
    }

    qtyMinus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
            qtyInput.value = val - 1;
            updatePrice();
        }
    });

    qtyPlus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value) || 1;
        if (val < 10) {
            qtyInput.value = val + 1;
            updatePrice();
        }
    });

    qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value) || 1;
        val = Math.max(1, Math.min(10, val));
        qtyInput.value = val;
        updatePrice();
    });

    // --- BUY BUTTON (demo) ---
    buyBtn.addEventListener('click', () => {
        buyBtn.innerHTML = `Added to Cart! &#10003;<span class="btn-subtext">Redirecting to checkout...</span>`;
        buyBtn.style.background = '#27ae60';
        setTimeout(() => {
            buyBtn.style.background = '';
            updatePrice();
        }, 2000);
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll(
        '.feature-card, .review-card, .ps-card, .trust-item, .section-header, .buy-grid, .faq-item'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- STICKY MOBILE CTA: show after scrolling past hero ---
    const hero = document.getElementById('hero');
    const stickyMobileCta = document.getElementById('stickyMobileCta');

    if (hero && stickyMobileCta) {
        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.innerWidth <= 768) {
                    stickyMobileCta.style.display = entry.isIntersecting ? 'none' : 'block';
                }
            });
        }, { threshold: 0 });
        stickyObserver.observe(hero);
    }

    // --- SMOOTH SCROLL for all #anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- URGENCY: Random "viewing now" count ---
    const urgencyEl = document.querySelector('.buy-urgency strong');
    if (urgencyEl) {
        setInterval(() => {
            const count = Math.floor(Math.random() * 15) + 8;
            urgencyEl.textContent = `${count} people`;
        }, 5000);
    }

    // --- THUMBNAIL CLICK (demo) ---
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

});
