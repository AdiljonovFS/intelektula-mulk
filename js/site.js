/* ════════════════════════════════════════════════════════════════════════
   INTERACTIVE SITE CONTROLLER
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. STICKY HEADER ON SCROLL ─────────────────────── */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');

  const onScroll = () => {
    const scrolled = window.scrollY;
    if (header) header.classList.toggle('scrolled', scrolled > 30);

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      scrollProgress.style.width = `${percent}%`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── 2. MOBILE NAVIGATION TOGGLE ────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });
    siteNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => siteNav.classList.remove('open'));
    });
  }

  /* ─── 3. ACTIVE NAV LINK ON SCROLL ───────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map(link => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -65% 0px',
      threshold: 0,
    });
    sections.forEach(section => navObserver.observe(section));
  }

  /* ─── 4. REVEAL-ON-SCROLL ANIMATIONS ─────────────────── */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // No animation — show everything immediately
    document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('visible'));
  }

  /* ─── 5. COUNTER ANIMATION ───────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('uz-UZ').replace(/,/g, ' ');

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('uz-UZ').replace(/,/g, ' ');
    };

    requestAnimationFrame(step);
  }

  /* ─── 6. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header?.offsetHeight || 72;
      const offset = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({
        top: offset,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      // Update URL without page jump
      history.pushState(null, '', targetId);
    });
  });

  /* ─── 7. PARALLAX FOR HERO ORBS ─────────────────────── */
  if (!prefersReducedMotion) {
    const orbs = document.querySelectorAll('.orb');
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.2 + (i * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── 8. STAGGERED GRID ANIMATIONS ───────────────────── */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const grids = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .timeline, .brands-grid, .sources-grid, .responsibility-grid');
    const gridObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    grids.forEach(grid => gridObserver.observe(grid));
  }

  console.info('✨ IP Law site initialized');
})();
