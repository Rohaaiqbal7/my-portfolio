/* ============================================================
   ROMAISA IQBAL — PORTFOLIO
   Vanilla JS: preloader, custom cursor, 3D tilt, scroll reveals,
   magnetic buttons, typing effect, active-nav indicator.
   ============================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (max-width: 900px)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Preloader ---------------- */
  (function preloader(){
    const pre = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const percent = document.getElementById('preloaderPercent');
    let progress = 0;

    const tick = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) progress = 100;
      fill.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';
      if (progress === 100) clearInterval(tick);
    }, 140);

    window.addEventListener('load', () => {
      setTimeout(() => {
        fill.style.width = '100%';
        percent.textContent = '100%';
        setTimeout(() => {
          pre.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 280);
      }, 400);
    });
  })();

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const glow = document.getElementById('cursorGlow');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      glow.style.left = mouseX + 'px';
      glow.style.top = mouseY + 'px';
    });

    function animateRing(){
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .tilt-el, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------- Navbar: scroll state + active link ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navIndicator = document.getElementById('navIndicator');
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function moveIndicator(link){
    if (!link || window.innerWidth <= 900) return;
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.style.transform = `translateX(${link.offsetLeft - 6}px)`;
  }

  function setActiveLink(id){
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    const active = navLinks.find(l => l.classList.contains('active'));
    moveIndicator(active);
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);

    const progressEl = document.getElementById('scrollProgress');
    const doc = document.documentElement;
    const scrollPct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    progressEl.style.width = scrollPct + '%';
  }, { passive: true });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => sec.id && sectionObserver.observe(sec));
  window.addEventListener('load', () => moveIndicator(document.querySelector('.nav-link.active')));
  window.addEventListener('resize', () => moveIndicator(document.querySelector('.nav-link.active')));

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
  }));

  /* ---------------- Typing effect ---------------- */
  (function typing(){
    const el = document.getElementById('typingText');
    const roles = ['Web Developer', 'WordPress Developer', 'UI/UX Enthusiast', 'Problem Solver'];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function step(){
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(step, 1500);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(step, deleting ? 40 : 85);
    }
    step();
  })();

  /* ---------------- Scroll reveal ---------------- */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), (entry.target.dataset.delay || i * 60));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => revealObserver.observe(item));

  /* ---------------- Stat counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1200;
      const stepTime = Math.max(duration / target, 30);
      const timer = setInterval(() => {
        current++;
        el.textContent = current + suffix + (current >= target ? '+' : '');
        if (current >= target) clearInterval(timer);
      }, stepTime);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------------- 3D tilt (hero card + tilt-el cards) ---------------- */
  if (!prefersReducedMotion && !isTouch) {
    function attachTilt(el, intensity = 10){
      let rect;
      el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      });
    }

    const heroCard = document.getElementById('tiltCard');
    if (heroCard) attachTilt(heroCard, 16);

    document.querySelectorAll('.tilt-el').forEach(el => attachTilt(el, 6));

    // Hero visual parallax on the whole group
    const heroVisual = document.getElementById('heroVisual');
    if (heroVisual) {
      heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroVisual.querySelectorAll('.floating-tag').forEach((tag, i) => {
          const depth = (i + 1) * 6;
          tag.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
      });
    }
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!prefersReducedMotion && !isTouch) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------- Smooth anchor scroll offset for fixed navbar ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();