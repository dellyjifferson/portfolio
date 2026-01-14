// Basic UI behavior and features: typing intro, theme toggle, contact form via EmailJS
document.addEventListener('DOMContentLoaded', () => {
  // small helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  // typed intro
  const lines = [
    'I make robots move.',
    'I write embedded firmware.',
    'I build prototypes that solve problems.',
    'I love hardware + code.'
  ];
  let idx = 0, char = 0;
  const typed = $('#typed');
  function typeLoop(){
    const text = lines[idx];
    if (char <= text.length){
      typed.textContent = text.slice(0,char);
      char++;
      setTimeout(typeLoop, 40);
    } else {
      setTimeout(() => {
        char = 0; idx = (idx+1) % lines.length;
        setTimeout(typeLoop, 800);
      }, 1000);
    }
  }
  typeLoop();

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle
  const root = document.documentElement;
  const themeToggle = $('#theme-toggle');
  // apply saved theme or dark by default
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.classList.add('light');
  function setTheme(t){
    if (t === 'light'){ root.classList.add('light'); themeToggle.textContent = '🌞'; localStorage.setItem('theme','light'); }
    else { root.classList.remove('light'); themeToggle.textContent = '🌙'; localStorage.setItem('theme','dark'); }
  }
  // initial button label
  setTheme(saved === 'light' ? 'light' : 'dark');
  themeToggle.addEventListener('click', () => {
    const nowIsLight = root.classList.contains('light');
    setTheme(nowIsLight ? 'dark' : 'light');
  });

  // mobile menu toggle (full screen overlay)
  const menuBtn = $('#menu-toggle');
  const nav = $('.nav');
  const closeBtn = $('.nav-close-btn');

  function closeMenu() {
    nav.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // restore scrolling
  }

  function openMenu() {
    nav.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock scrolling
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) closeMenu();
      else openMenu();
    });
  }

  // close button inside menu
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // auto-close when a link is clicked
  const navLinks = $$('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Smooth offset for internal links (to account for sticky header)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerOffset = document.querySelector('.topbar').offsetHeight + 8;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });

  // Contact form via EmailJS
  // Instructions: SIGN UP at https://www.emailjs.com, create a service, template, and get your user ID
  // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_USER_ID' below.
  const CONTACT_FORM = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const mailtoFallback = document.getElementById('mailto-fallback');

  // populate mailto fallback dynamically
  const fallbackEmail = 'dellyjifferson509@gmail.com';
  mailtoFallback.href = `mailto:${fallbackEmail}`;

  // initialize EmailJS - you'll replace the ID
  try {
    emailjs.init('UaHSZwyiWyOWbwvrk'); // <-- replace with your EmailJS user ID
  } catch (err) {
    // emailjs not loaded or init error
    console.warn('EmailJS init error', err);
  }

  CONTACT_FORM && CONTACT_FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.textContent = 'Sending...';
    const serviceID = 'service_hg8euie';    // replace
    const templateID = 'template_3qoj5vp';  // replace

    // Use emailjs.sendForm for convenience
    emailjs.sendForm(serviceID, templateID, CONTACT_FORM)
      .then(() => {
        statusEl.textContent = 'Message sent — thank you!';
        CONTACT_FORM.reset();
      }, (err) => {
        console.error('EmailJS error', err);
        statusEl.textContent = 'Failed to send. You can use the mailto link below.';
      });
  });

  // Accessibility: reduce motion if user prefers
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.querySelectorAll('.cursor').forEach(n => n.style.display = 'none');
  }
});

