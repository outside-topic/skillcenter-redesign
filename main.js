/* ===========================
   DOM READY
=========================== */
document.addEventListener('DOMContentLoaded', function () {

    /* ===========================
       HEADER SCROLL EFFECT
    =========================== */
    const header = document.getElementById('siteHeader');
    const scrollThreshold = 60;

    function handleHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ===========================
       MOBILE MENU - CLOSE ON LINK CLICK
    =========================== */
    const offcanvasEl = document.getElementById('mobileMenu');
    const navLinks = offcanvasEl ? offcanvasEl.querySelectorAll('.nav-link') : [];

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }
        });
    });

    /* ===========================
       SMOOTH SCROLL FOR ANCHOR LINKS
    =========================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ===========================
       ACTIVE NAV LINK ON SCROLL
    =========================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(function (item) {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ===========================
       SCROLL REVEAL ANIMATION
    =========================== */
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Add staggered delay for grid children
                const parent = entry.target.closest('.row');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal-up');
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 0.1) + 's';
                }
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ===========================
       TESTIMONIAL SLIDER
    =========================== */
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const slides = track.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        }

        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoSlide();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoSlide();
            }
        }, { passive: true });

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }

    /* ===========================
       COUNTER ANIMATION
    =========================== */
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
        counterObserver.observe(el);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    /* ===========================
       NEWSLETTER FORM
    =========================== */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = newsletterEmail.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) {
                showFeedback('Please enter your email address.', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate successful subscription
            showFeedback('Thank you for subscribing! Check your inbox for confirmation.', 'success');
            newsletterEmail.value = '';

            // Hide feedback after 5 seconds
            setTimeout(function () {
                newsletterFeedback.textContent = '';
                newsletterFeedback.className = 'newsletter-feedback';
            }, 5000);
        });
    }

    function showFeedback(message, type) {
        newsletterFeedback.textContent = message;
        newsletterFeedback.className = 'newsletter-feedback ' + type;
    }

    /* ===========================
       BACK TO TOP BUTTON
    =========================== */
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});


gsap.to(".card_wrapper", {
    transform: "translateX(-120%)",
    scrollTrigger: {
        trigger: ".card_wrapper",
        scroller: "body",
        start: "top 50%",
        end: "top -100%",
        scrub: 3,
        pin: true
    }

})


const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,
  spaceBetween: 30,
  speed: 2000,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  }

});
