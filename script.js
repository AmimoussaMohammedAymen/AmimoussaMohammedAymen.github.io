// Improved interactivity, accessibility and small performance tweaks

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li a');
const navbar = document.querySelector('.navbar');
const themeToggle = document.querySelector('.theme-toggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const typewriterElement = document.getElementById('typewriter-text');


// --------- Burger / Mobile Nav ----------
if (burger) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('active');
    burger.classList.toggle('active');
  });
}

// --------- Navbar scroll effect ----------
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --------- Theme toggle with persistence ----------
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  try { localStorage.setItem('theme', theme); } catch(e){}
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
});

// Apply saved theme
try {
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
} catch(e){ setTheme('light'); }


// --------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
function onScrollActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.pageYOffset >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href').substring(1) === current) a.classList.add('active');
  });
}
window.addEventListener('scroll', onScrollActiveLink);
window.addEventListener('resize', onScrollActiveLink);
onScrollActiveLink();


// --------- Project filtering ----------
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = card.dataset.category;
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


// --------- Contact form (example using fetch) ----------
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formStatus = document.getElementById('formStatus');
    const data = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject.value.trim(),
      message: contactForm.message.value.trim()
    };
    if (!data.name || !data.email || !data.subject || !data.message) {
      formStatus.textContent = 'Please fill in all fields.';
      return;
    }

    // Example: Replace the URL with your Formspree endpoint or backend URL
    const endpoint = 'https://formspree.io/f/your-form-id'; // <-- change this

    try {
      formStatus.textContent = 'Sending…';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        formStatus.textContent = 'Thanks — your message was sent.';
        contactForm.reset();
      } else {
        const text = await res.text();
        formStatus.textContent = 'There was an error sending the message.';
        console.warn('Form error', res.status, text);
      }
    } catch (err) {
      formStatus.textContent = 'There was an error sending the message.';
      console.error(err);
    }
  });
}


// --------- Typewriter effect ----------
const texts = [
  'Machine Learning & Data Engineer',
  'Computer Vision Specialist',
  'NLP & Signal Processing',
  'MSc — Digital Factory 4.0'
];
let tIndex = 0, cIndex = 0, deleting = false;
function typeWriter() {
  if (!typewriterElement) return;
  const current = texts[tIndex];
  if (deleting) {
    cIndex = Math.max(0, cIndex - 1);
    typewriterElement.textContent = current.substring(0, cIndex);
  } else {
    cIndex = Math.min(current.length, cIndex + 1);
    typewriterElement.textContent = current.substring(0, cIndex);
  }

  let delay = deleting ? 40 : 100;
  if (!deleting && cIndex === current.length) { delay = 1800; deleting = true; }
  if (deleting && cIndex === 0) { deleting = false; tIndex = (tIndex + 1) % texts.length; delay = 500; }

  setTimeout(typeWriter, delay);
}
window.addEventListener('load', () => { setTimeout(typeWriter, 600); });


// --------- Smooth anchor scrolling (better accessibility) ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length === 1) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close nav if mobile
    if (nav.classList.contains('active')) {
      nav.classList.remove('active'); burger.classList.remove('active');
    }
  });
});


// --------- Appear on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('appear');
  });
}, { threshold: 0.15 });
document.querySelectorAll('section').forEach(s => io.observe(s));

