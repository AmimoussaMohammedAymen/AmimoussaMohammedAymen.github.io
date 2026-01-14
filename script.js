(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const burger = $('.burger');
  const nav = $('.nav-links');
  const themeToggle = $('.theme-toggle');
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  const typewriterEl = $('#typewriter-text');
  const contactForm = $('#contactForm');
  const yearEl = $('#year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------- Mobile nav ----------------
  const closeNav = () => {
    if (!nav || !burger) return;
    nav.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  };

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    // close nav after clicking a link
    $$('.nav-links a').forEach(a => {
      a.addEventListener('click', () => closeNav());
    });
  }

  // ---------------- Theme ----------------
  function setTheme(mode){
    // mode: "dark" or "light"
    document.body.classList.toggle('light', mode === 'light');
    if (themeToggle){
      themeToggle.innerHTML = mode === 'light'
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
      themeToggle.setAttribute('aria-pressed', String(mode !== 'light'));
      themeToggle.title = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
    try{ localStorage.setItem('theme', mode); }catch(e){}
  }

  const saved = (() => {
    try { return localStorage.getItem('theme'); } catch(e){ return null; }
  })();

  if (saved) setTheme(saved);
  else setTheme('dark');

  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // ---------------- Project filter ----------------
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const f = (btn.dataset.filter || 'all').toLowerCase();
        projectCards.forEach(card => {
          const cats = (card.dataset.category || '').toLowerCase();
          const show = (f === 'all') || cats.includes(f);
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // ---------------- Typewriter ----------------
  const lines = [
    'ADF • ADLS Gen2 • Databricks • Delta Lake',
    'SQL (Windows, MERGE, SCD2) • Python',
    'Incremental Loads • Quality Checks • Automation',
    'Recruiter-ready projects with clean READMEs'
  ];

  let i = 0, j = 0, del = false;

  function tick(){
    if (!typewriterEl) return;
    const current = lines[i];
    typewriterEl.textContent = del ? current.slice(0, j--) : current.slice(0, j++);

    let speed = del ? 28 : 65;

    if (!del && j === current.length + 1) {
      del = true; speed = 900;
    }
    if (del && j === 0) {
      del = false; i = (i + 1) % lines.length; speed = 220;
    }
    setTimeout(tick, speed);
  }
  window.addEventListener('load', () => setTimeout(tick, 400));

  // ---------------- Contact form ----------------
  // Replace endpoint with your Formspree endpoint
  // ---------------- Contact form (Formspree) ----------------
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $('#formStatus');
      if (status) status.textContent = 'Sending...';
  
      // Grab fields safely (avoid form.name conflicts)
      const name = contactForm.querySelector('#name')?.value.trim();
      const email = contactForm.querySelector('#email')?.value.trim();
      const subject = contactForm.querySelector('#subject')?.value.trim();
      const message = contactForm.querySelector('#message')?.value.trim();
  
      if (!name || !email || !subject || !message) {
        if (status) status.textContent = 'Please fill in all fields.';
        return;
      }
  
      try {
        const endpoint = 'https://formspree.io/f/xnjjnalb';
  
        // FormData is the most compatible way with Formspree + GitHub Pages
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
  
        // Optional: make the email subject line nicer in your inbox
        formData.append('_subject', `Portfolio: ${subject}`);
        // Optional: route replies to sender (Formspree supports this)
        formData.append('_replyto', email);
  
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
  
        if (res.ok) {
          if (status) status.textContent = '✅ Sent! I will reply as soon as possible.';
          contactForm.reset();
        } else {
          // Try to show the real reason (helps debug)
          let msg = '⚠️ Something went wrong. Try again.';
          try {
            const data = await res.json();
            if (data && data.errors && data.errors.length) {
              msg = `⚠️ ${data.errors[0].message}`;
            }
          } catch (_) {}
          if (status) status.textContent = msg;
        }
      } catch (err) {
        if (status) status.textContent = '❌ Network error. Please try again.';
      }
    });
  }

})();
