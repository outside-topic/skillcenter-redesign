// Initialize Lenis
const lenis = new Lenis({
    autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
    console.log(e);
});





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

    if (sections.length > 0) {

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

        window.addEventListener('scroll', updateActiveNav, {
            passive: true
        });

    }

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


// gsap.to(".card_wrapper", {
//     transform: "translateX(-120%)",
//     scrollTrigger: {
//         trigger: ".card_wrapper",
//         scroller: "body",
//         start: "top 50%",
//         end: "top -100%",
//         scrub: 3,
//         pin: true
//     }

// })


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








// ======= login start =====
document.addEventListener('DOMContentLoaded', function () {

    /*==============================
    DOM ELEMENTS
    ==============================*/
    var loginForm = document.getElementById('loginForm');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var passwordToggle = document.getElementById('passwordToggle');
    var loginBtn = document.getElementById('loginBtn');
    var emailError = document.getElementById('emailError');
    var passwordError = document.getElementById('passwordError');


    /*==============================
    PASSWORD VISIBILITY TOGGLE
    ==============================*/
    passwordToggle.addEventListener('click', function () {
        var isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        var icon = this.querySelector('i');
        icon.classList.toggle('bi-eye', !isPassword);
        icon.classList.toggle('bi-eye-slash', isPassword);
    });


    /*==============================
    VALIDATION HELPERS
    ==============================*/
    function isValidEmail(email) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function showError(group, errorEl, message) {
        group.classList.add('has-error');
        errorEl.textContent = message;
    }

    function clearError(group, errorEl) {
        group.classList.remove('has-error');
        errorEl.textContent = '';
    }


    /*==============================
    CLEAR ERRORS ON INPUT
    ==============================*/
    emailInput.addEventListener('input', function () {
        clearError(this.closest('.login-form-group'), emailError);
    });

    passwordInput.addEventListener('input', function () {
        clearError(this.closest('.login-form-group'), passwordError);
    });


    /*==============================
    FORM SUBMISSION
    ==============================*/
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;
        var emailGroup = emailInput.closest('.login-form-group');
        var passwordGroup = passwordInput.closest('.login-form-group');

        /* Validate email */
        var emailValue = emailInput.value.trim();
        if (!emailValue) {
            showError(emailGroup, emailError, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailGroup, emailError, 'Please enter a valid email address');
            isValid = false;
        }

        /* Validate password */
        var passwordValue = passwordInput.value;
        if (!passwordValue) {
            showError(passwordGroup, passwordError, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(passwordGroup, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        /* Show loading state */
        loginBtn.classList.add('is-loading');
        loginBtn.disabled = true;

        /* Simulate API request */
        setTimeout(function () {
            loginBtn.classList.remove('is-loading');
            loginBtn.disabled = false;
        }, 2000);
    });


    /*==============================
    INPUT FOCUS EFFECTS
    ==============================*/
    var formGroups = document.querySelectorAll('.login-form-group');

    formGroups.forEach(function (group) {
        var input = group.querySelector('.form-control');

        if (!input) {
            return;
        }

        input.addEventListener('focus', function () {
            group.classList.add('is-focused');
        });

        input.addEventListener('blur', function () {
            group.classList.remove('is-focused');
        });
    });

});
// ======= login end =====



// ========== Register start =========
document.addEventListener('DOMContentLoaded', function () {

    /*==============================
    DOM ELEMENTS
    ==============================*/
    var registerForm = document.getElementById('registerForm');
    var firstNameInput = document.getElementById('firstName');
    var lastNameInput = document.getElementById('lastName');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var passwordInput = document.getElementById('password');
    var confirmPasswordInput = document.getElementById('confirmPassword');
    var termsCheck = document.getElementById('termsCheck');
    var registerBtn = document.getElementById('registerBtn');
    var passwordStrength = document.getElementById('passwordStrength');
    var strengthText = document.getElementById('strengthText');

    var firstNameError = document.getElementById('firstNameError');
    var lastNameError = document.getElementById('lastNameError');
    var emailError = document.getElementById('emailError');
    var phoneError = document.getElementById('phoneError');
    var passwordError = document.getElementById('passwordError');
    var confirmPasswordError = document.getElementById('confirmPasswordError');
    var termsError = document.getElementById('termsError');


    /*==============================
    PASSWORD TOGGLE
    ==============================*/
    var toggleButtons = document.querySelectorAll('.password-toggle');

    toggleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            var isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');

            var icon = this.querySelector('i');
            icon.classList.toggle('bi-eye', !isPassword);
            icon.classList.toggle('bi-eye-slash', isPassword);
        });
    });


    /*==============================
    PASSWORD STRENGTH CHECKER
    ==============================*/
    function checkPasswordStrength(password) {
        var score = 0;

        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 1) return 'weak';
        if (score === 2) return 'fair';
        if (score === 3) return 'good';
        return 'strong';
    }

    var strengthLabels = {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
    };

    function updateStrengthIndicator() {
        var value = passwordInput.value;

        if (value.length === 0) {
            passwordStrength.classList.remove('is-visible', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
            strengthText.textContent = '';
            return;
        }

        var level = checkPasswordStrength(value);

        passwordStrength.classList.add('is-visible');
        passwordStrength.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
        passwordStrength.classList.add('strength-' + level);
        strengthText.textContent = strengthLabels[level];
    }

    passwordInput.addEventListener('input', updateStrengthIndicator);


    /*==============================
    VALIDATION HELPERS
    ==============================*/
    function isValidEmail(email) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function isValidPhone(phone) {
        var digits = phone.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15;
    }

    function showError(group, errorEl, message) {
        group.classList.add('has-error');
        errorEl.textContent = message;
    }

    function clearError(group, errorEl) {
        group.classList.remove('has-error');
        errorEl.textContent = '';
    }


    /*==============================
    REAL-TIME CLEAR ON INPUT
    ==============================*/
    var fieldMap = [
        { input: firstNameInput, group: firstNameInput.closest('.reg-form-group'), error: firstNameError },
        { input: lastNameInput, group: lastNameInput.closest('.reg-form-group'), error: lastNameError },
        { input: emailInput, group: emailInput.closest('.reg-form-group'), error: emailError },
        { input: phoneInput, group: phoneInput.closest('.reg-form-group'), error: phoneError },
        { input: passwordInput, group: passwordInput.closest('.reg-form-group'), error: passwordError },
        { input: confirmPasswordInput, group: confirmPasswordInput.closest('.reg-form-group'), error: confirmPasswordError }
    ];

    fieldMap.forEach(function (field) {
        field.input.addEventListener('input', function () {
            clearError(field.group, field.error);
        });
    });

    termsCheck.addEventListener('change', function () {
        clearError(termsCheck.closest('.form-terms'), termsError);
    });


    /*==============================
    REAL-TIME PASSWORD MATCH
    ==============================*/
    confirmPasswordInput.addEventListener('input', function () {
        var group = this.closest('.reg-form-group');
        if (this.value.length > 0 && this.value !== passwordInput.value) {
            showError(group, confirmPasswordError, 'Passwords do not match');
        } else {
            clearError(group, confirmPasswordError);
        }
    });


    /*==============================
    FORM SUBMISSION
    ==============================*/
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;

        /* First Name */
        if (!firstNameInput.value.trim()) {
            showError(firstNameInput.closest('.reg-form-group'), firstNameError, 'First name is required');
            isValid = false;
        }

        /* Last Name */
        if (!lastNameInput.value.trim()) {
            showError(lastNameInput.closest('.reg-form-group'), lastNameError, 'Last name is required');
            isValid = false;
        }

        /* Email */
        var emailValue = emailInput.value.trim();
        if (!emailValue) {
            showError(emailInput.closest('.reg-form-group'), emailError, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput.closest('.reg-form-group'), emailError, 'Please enter a valid email address');
            isValid = false;
        }

        /* Phone */
        var phoneValue = phoneInput.value.trim();
        if (!phoneValue) {
            showError(phoneInput.closest('.reg-form-group'), phoneError, 'Phone number is required');
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            showError(phoneInput.closest('.reg-form-group'), phoneError, 'Please enter a valid phone number');
            isValid = false;
        }

        /* Password */
        var passwordValue = passwordInput.value;
        if (!passwordValue) {
            showError(passwordInput.closest('.reg-form-group'), passwordError, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(passwordInput.closest('.reg-form-group'), passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        /* Confirm Password */
        var confirmValue = confirmPasswordInput.value;
        if (!confirmValue) {
            showError(confirmPasswordInput.closest('.reg-form-group'), confirmPasswordError, 'Please confirm your password');
            isValid = false;
        } else if (confirmValue !== passwordValue) {
            showError(confirmPasswordInput.closest('.reg-form-group'), confirmPasswordError, 'Passwords do not match');
            isValid = false;
        }

        /* Terms */
        if (!termsCheck.checked) {
            showError(termsCheck.closest('.form-terms'), termsError, 'You must agree to the Terms of Service');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        /* Show loading state */
        registerBtn.classList.add('is-loading');
        registerBtn.disabled = true;

        /* Simulate API request */
        setTimeout(function () {
            registerBtn.classList.remove('is-loading');
            registerBtn.disabled = false;
        }, 2000);
    });


    /*==============================
    INPUT FOCUS EFFECTS
    ==============================*/
    var formGroups = document.querySelectorAll('.reg-form-group');

    formGroups.forEach(function (group) {
        var input = group.querySelector('.form-control');

        if (!input) {
            return;
        }

        input.addEventListener('focus', function () {
            group.classList.add('is-focused');
        });

        input.addEventListener('blur', function () {
            group.classList.remove('is-focused');
        });
    });

});
// ========== Register end =========



// =========course details start ===========

// =========course details end ===========