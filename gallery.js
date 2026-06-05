/**
 * Gowreesham Gallery — Interactive Scripts
 * Handles: filter tabs, lightbox, back-to-top, navigation, scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // NAVIGATION (same as main)
  // ============================

  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('nav__toggle--active');
      navLinks.classList.toggle('nav__links--open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('nav__toggle--active');
        navLinks.classList.remove('nav__links--open');
      });
    });
  }

  // ============================
  // FILTER TABS
  // ============================

  const tabs = document.querySelectorAll('.gallery-tab');
  const categories = document.querySelectorAll('.gallery-category');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab
      tabs.forEach(t => t.classList.remove('gallery-tab--active'));
      tab.classList.add('gallery-tab--active');

      // Filter categories
      categories.forEach(cat => {
        const catType = cat.getAttribute('data-category');
        if (filter === 'all' || catType === filter) {
          cat.classList.remove('gallery-category--hidden');
          cat.style.display = '';
          // Retrigger reveal animation
          requestAnimationFrame(() => {
            cat.style.opacity = '0';
            cat.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              cat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              cat.style.opacity = '1';
              cat.style.transform = 'translateY(0)';
            });
          });
        } else {
          cat.classList.add('gallery-category--hidden');
          cat.style.display = 'none';
        }
      });
    });
  });

  // ============================
  // LIGHTBOX
  // ============================

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // Gather all visible gallery items
  let galleryItems = [];
  let currentIndex = 0;

  const getVisibleItems = () => {
    return Array.from(document.querySelectorAll('.masonry__item')).filter(item => {
      // Check if parent category is visible
      const cat = item.closest('.gallery-category');
      return cat && !cat.classList.contains('gallery-category--hidden');
    });
  };

  const openLightbox = (index) => {
    galleryItems = getVisibleItems();
    if (index < 0 || index >= galleryItems.length) return;

    currentIndex = index;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.masonry__overlay h3');
    const desc = item.querySelector('.masonry__overlay p');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxDesc.textContent = desc ? desc.textContent : '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
    // Small delay to let transition finish
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  const navigate = (direction) => {
    galleryItems = getVisibleItems();
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.masonry__overlay h3');
    const desc = item.querySelector('.masonry__overlay p');

    // Fade transition
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title ? title.textContent : '';
      lightboxDesc.textContent = desc ? desc.textContent : '';
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 200);
  };

  // Click handlers on items
  document.querySelectorAll('.masonry__item').forEach(item => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
    }
  });

  // ============================
  // SCROLL REVEAL FOR ITEMS
  // ============================

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('gallery-reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.masonry__item').forEach((item, i) => {
    item.classList.add('gallery-reveal');
    item.style.transitionDelay = `${(i % 6) * 0.08}s`;
    revealObserver.observe(item);
  });

  // ============================
  // BACK TO TOP
  // ============================

  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================
  // SMOOTH SCROLL
  // ============================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
