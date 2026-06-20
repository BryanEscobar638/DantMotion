(function () {
  'use strict';

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ===== Mobile Menu =====
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
    });
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.elements['name'].value.trim();
      const email = this.elements['email'].value.trim();
      const message = this.elements['message'].value.trim();
      const service = this.elements['service'].value;

      if (!name || !email || !message || !service) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor ingresa un correo electrónico válido.');
        return;
      }

      const text = encodeURIComponent(
        'Hola DantMotion, quiero más información:%0A%0A' +
        'Nombre: ' + name + '%0A' +
        'Email: ' + email + '%0A' +
        'Teléfono: ' + (this.elements['phone'].value || 'No indicado') + '%0A' +
        'Servicio: ' + service + '%0A' +
        'Mensaje: ' + message
      );

      window.open('https://wa.me/573217716506?text=' + text, '_blank');

      this.reset();

      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });
    });
  }
  // ===== Smooth scroll for anchor links (fallback) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
