/**
 * Gowreesham — Interactive Scripts
 * Handles: navigation, scroll animations, parallax, particles
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // NAVIGATION
  // ============================

  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = navLinks.querySelectorAll('a');

  // Scroll effect on nav
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav__toggle--active');
    navLinks.classList.toggle('nav__links--open');
  });

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav__toggle--active');
      navLinks.classList.remove('nav__links--open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ============================
  // SCROLL REVEAL ANIMATIONS
  // ============================

  const revealElements = () => {
    // Collect all animatable elements
    const aboutImage = document.querySelector('.about__image-wrapper');
    const aboutText = document.querySelector('.about__text');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const familyCards = document.querySelectorAll('.family__card');
    const locationInfo = document.querySelector('.location__info');
    const locationMap = document.querySelector('.location__map-wrapper');

    const elements = [];

    if (aboutImage) elements.push({ el: aboutImage, delay: 0 });
    if (aboutText) elements.push({ el: aboutText, delay: 1 });

    galleryItems.forEach((item, i) => {
      elements.push({ el: item, delay: i });
    });

    familyCards.forEach((card, i) => {
      elements.push({ el: card, delay: i });
    });

    if (locationInfo) elements.push({ el: locationInfo, delay: 0 });
    if (locationMap) elements.push({ el: locationMap, delay: 1 });

    // Add reveal class
    elements.forEach(({ el, delay }) => {
      el.classList.add('reveal', `reveal--delay-${delay}`);
    });

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(({ el }) => observer.observe(el));
  };

  revealElements();

  // ============================
  // ANIMATED COUNTER
  // ============================

  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          let current = 0;
          const duration = 1500;
          const step = target / (duration / 16);

          const update = () => {
            current += step;
            if (current >= target) {
              el.textContent = target;
            } else {
              el.textContent = Math.floor(current);
              requestAnimationFrame(update);
            }
          };

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  };

  animateCounters();

  // ============================
  // FLOATING PARTICLES
  // ============================

  const createParticles = () => {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 25;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
      `;

      container.appendChild(particle);
    }
  };

  createParticles();

  // ============================
  // SMOOTH PARALLAX ON HERO
  // ============================

  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');

  const handleParallax = () => {
    if (!hero || !heroContent) return;

    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroHeight) {
      const factor = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - factor * 1.2;
    }
  };

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ============================
  // SMOOTH SCROLL FOR SAFARI
  // ============================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
