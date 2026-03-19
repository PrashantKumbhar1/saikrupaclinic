/**
 * Sai Krupa Clinic — Main JavaScript
 * Dr. Amit D. Shingare | New Panvel, Navi Mumbai
 */

(function () {
  'use strict';

  /* ===== NAVBAR SCROLL & MOBILE TOGGLE ===== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    toggleBackToTop();
  });

  function openNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNavDrawer && mobileNavDrawer.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  // Close mobile drawer on any link click inside it
  if (mobileNavDrawer) {
    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeNav());
    });
  }

  // Close nav on desktop nav-link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => closeNav());
  });

  // Close nav on backdrop click
  if (navBackdrop) navBackdrop.addEventListener('click', () => closeNav());

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (
      !navbar.contains(e.target) &&
      !(mobileNavDrawer && mobileNavDrawer.contains(e.target)) &&
      !(navBackdrop && navBackdrop.contains(e.target))
    ) {
      closeNav();
    }
  });

  // Close mobile CTA bar Book Now properly
  const mobileCTABar = document.getElementById('mobileCTABar');
  if (mobileCTABar) {
    mobileCTABar.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => closeNav());
    });
  }

  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link:not(.btn-nav)');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.id;
      }
    });
    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ===== SMOOTH SCROLL for anchors ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== ANIMATED COUNTER ===== */
  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;
    const counters = document.querySelectorAll('.stat-num:not(.stat-static)');
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    countersDone = true;
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters(); // try on load too

  /* ===== TESTIMONIALS CAROUSEL ===== */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let autoPlayTimer;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth <= 720) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  }

  function getCards() {
    return track ? track.querySelectorAll('.testimonial-card') : [];
  }

  function getTotalSlides() {
    return Math.max(0, getCards().length - (getSlidesPerView() - 1));
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    if (!track) return;
    slidesPerView = getSlidesPerView();
    const cards = getCards();
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24; // gap 24px
    const maxSlide = getTotalSlides() - 1;
    currentSlide = Math.min(currentSlide, maxSlide);
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    updateCarousel();
    resetAutoPlay();
  }

  function nextSlide() {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
  }

  function prevSlide() {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateCarousel();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  // Touch/swipe support
  if (track) {
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAutoPlay();
      }
    });
  }

  // Initialize carousel
  buildDots();
  autoPlayTimer = setInterval(nextSlide, 5000);
  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ===== APPOINTMENT FORM ===== */
  const form = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitAppt');

  if (form) {
    // Set min date to today
    const dateInput = document.getElementById('prefDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }
      if (!/^[\+]?[\d\s\-]{10,15}$/.test(phone)) {
        alert('Please enter a valid phone number.');
        return;
      }
      // Simulate form submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
        // WhatsApp redirect with form data
        const service = document.getElementById('service').value || 'General Consultation';
        const date = document.getElementById('prefDate').value || 'Flexible';
        const time = document.getElementById('prefTime').value || 'Flexible';
        const msg = `Hello Dr. Shingare,\n\nAppointment Request:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}`;
        const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
        setTimeout(() => { window.open(waUrl, '_blank'); }, 1500);
      }, 1500);
    });
  }

  /* ===== HERO PARTICLES ===== */
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    const colors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6'];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 20 + 8;
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particlesContainer.appendChild(particle);
    }
  }

  /* ===== AOS — ANIMATE ON SCROLL ===== */
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
  }
  initAOS();

  /* ===== BACK TO TOP (removed from DOM, no-op) ===== */
  function toggleBackToTop() {}

  /* ===== SERVICE CARDS KEYBOARD ACCESSIBILITY ===== */
  document.querySelectorAll('.service-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.service-link');
        if (link) link.click();
      }
    });
  });

  console.log('%c🏥 Sai Krupa Clinic — Website Loaded', 'color: #3B82F6; font-size: 14px; font-weight: bold;');
  console.log('%cDr. Amit D. Shingare | Sector 7, New Panvel, Navi Mumbai', 'color: #10B981; font-size: 12px;');

})();
