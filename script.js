/* script.js — polished interactivity + accessibility + small performance upgrades */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const burger = $('.burger');
  const nav = $('.nav-links');
  const navLinks = $$('.nav-links a');
  const navbar = $('.navbar');
  const themeToggle = $('.theme-toggle');
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  const contactForm = $('#contactForm');
  const typewriterElement = $('#typewriter-text');
  const yearEl = $('#year');

  // ---------- Footer year ----------
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Burger / Mobile Nav ----------
  function closeMobileNav() {
    if (!nav || !burger) return;
    nav.classList.remove('active');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active');
      burger.classList.toggle('active');
    });

    // Close on ESC for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  // ---------- Navbar scroll effect (throttled via rAF) ----------
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ---------- Theme toggle with persistence ----------
  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Apply saved theme
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    setTheme(saved);
  } catch (e) {
    setTheme('light');
  }

  // ---------- Active nav link on scroll ----------
  const sections = $$('main section[id]');
  function onScrollActiveLink() {
    let current = '';
    const offset = 140;
    const scrollPos = window.scrollY;

    for (const section of sections) {
      const top = section.offsetTop - offset;
      if (scrollPos >= top) current = section.id;
    }

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScrollActiveLink, { passive: true });
  window.addEventListener('resize', onScrollActiveLink);
  onScrollActiveLink();

  // ---------- Smooth anchor scrolling ----------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length === 1) return;
      const target = $(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    });
  });

  // ---------- Project filtering ----------
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter || 'all';
        projectCards.forEach(card => {
          const cats = (card.dataset.category || '').toLowerCase();
          const show = filter === 'all' || cats.includes(filter.toLowerCase());
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // ---------- Contact form ----------
  // IMPORTANT: replace the endpoint with your real Formspree ID or your backend endpoint.
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formStatus = $('#formStatus');
      if (formStatus) formStatus.textContent = 'Sending...';

      const data = {
        name: contactForm.name?.value?.trim() || '',
        email: contactForm.email?.value?.trim() || '',
        subject: contactForm.subject?.value?.trim() || '',
        message: contactForm.message?.value?.trim() || ''
      };

      if (!data.name || !data.email || !data.subject || !data.message) {
        if (formStatus) formStatus.textContent = 'Please fill in all fields.';
        return;
      }

      try {
        const endpoint = 'https://formspree.io/f/your-form-id'; // <-- change this
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          if (formStatus) formStatus.textContent = '✅ Thank you! Your message has been sent.';
          contactForm.reset();
        } else {
          if (formStatus) formStatus.textContent = '⚠️ Something went wrong. Please try again.';
        }
      } catch (error) {
        if (formStatus) formStatus.textContent = '❌ Error sending message.';
      }
    });
  }

  // ---------- Typewriter effect ----------
  // Matches your new positioning as Data Engineer (Azure)
  const texts = [
    'Data Engineer (Azure • SQL • Python)',
    'ADF • ADLS Gen2 • Databricks • Delta Lake',
    'Incremental Loads • MERGE Upserts • SCD Type 2',
    'Building production-style lakehouse pipelines'
  ];

  let tIndex = 0, cIndex = 0, deleting = false;

  function typeWriter() {
    if (!typewriterElement) return;
    const current = texts[tIndex];

    if (deleting) {
      cIndex = Math.max(0, cIndex - 1);
    } else {
      cIndex = Math.min(current.length, cIndex + 1);
    }

    typewriterElement.textContent = current.substring(0, cIndex);

    let delay = deleting ? 35 : 80;
    if (!deleting && cIndex === current.length) { delay = 1400; deleting = true; }
    if (deleting && cIndex === 0) { deleting = false; tIndex = (tIndex + 1) % texts.length; delay = 350; }

    setTimeout(typeWriter, delay);
  }
  window.addEventListener('load', () => setTimeout(typeWriter, 500));

  // ---------- Appear on scroll (skip if reduced motion) ----------
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('appear');
      });
    }, { threshold: 0.15 });

    $$('section').forEach(s => {
      s.classList.add('will-appear');
      io.observe(s);
    });
  } else {
    $$('section').forEach(s => s.classList.add('appear'));
  }
})();
