(() => {
  'use strict';

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-line');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    revealObserver.observe(el);
  });

  /* ---------------- scroll progress bar ---------------- */
  const progressFill = document.getElementById('progressFill');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }

  /* ---------------- hero parallax type ---------------- */
  const parallaxSpans = document.querySelectorAll('.hero-bg-type span');

  function updateParallax() {
    const scrollTop = window.scrollY;
    parallaxSpans.forEach((span) => {
      const speed = parseFloat(span.dataset.speed) || 0.2;
      span.style.transform = `translateY(${scrollTop * speed}px)`;
    });
  }

  /* ---------------- timeline fill line ---------------- */
  const timelineTrack = document.querySelector('.timeline-track');
  const timelineLine = document.getElementById('timelineLine');

  function updateTimeline() {
    if (!timelineTrack || !timelineLine) return;
    const rect = timelineTrack.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const total = rect.height + vh * 0.4;
    let progress = (start - rect.top) / total;
    progress = Math.min(Math.max(progress, 0), 1);
    timelineLine.style.background =
      `linear-gradient(to bottom, var(--ink) ${progress * 100}%, var(--beige-line) ${progress * 100}%)`;
  }

  /* ---------------- rAF scroll loop ---------------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateParallax();
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- side rail active section ---------------- */
  const railDots = document.querySelectorAll('.rail-dots .dot');
  const sections = document.querySelectorAll('main section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const dot = document.querySelector(`.rail-dots .dot[href="#${entry.target.id}"]`);
      if (!dot) return;
      if (entry.isIntersecting) {
        railDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------------- counters ---------------- */
  const counters = document.querySelectorAll('.counter-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach((c) => counterObserver.observe(c));

  /* ---------------- custom cursor ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  if (cursorDot && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    const hoverTargets = document.querySelectorAll('a, button, .rail-dots .dot');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }
})();
