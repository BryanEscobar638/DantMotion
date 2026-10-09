(function () {
  'use strict';

  // ===== Configuración =====
  // Endpoint real de envío (Formspree, FormSubmit, etc.). Si se deja vacío,
  // el formulario enviará el mensaje por WhatsApp como respaldo.
  // Ejemplo: const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
  const FORM_ENDPOINT = '';
  const WHATSAPP_NUMBER = '573217716506';

  const serviceLabels = {
    marketing: 'Marketing Digital',
    diseno: 'Diseño Gráfico',
    video: 'Video / Reels',
    'todo-en-uno': 'Paquete Todo en Uno',
    desarrollo: 'Desarrollo Web',
    otro: 'Otro'
  };

  // ===== Helpers =====
  function getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* almacenamiento no disponible */
    }
  }

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function updateThemeToggle() {
    if (!themeToggle) return;
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    saveTheme(theme);
    updateThemeToggle();
  }

  // El tema inicial ya se aplicó en el <head> para evitar el parpadeo.
  // Aquí solo aseguramos el estado del botón (o lo inicializamos si hiciera falta).
  if (!html.getAttribute('data-theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(getStoredTheme() || (prefersDark ? 'dark' : 'light'));
  } else {
    updateThemeToggle();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  // ===== Mobile Menu =====
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    document.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });
  }

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
        const question = el.querySelector('.faq-item__question');
        if (question) question.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback para navegadores sin IntersectionObserver
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===== Project Filters (página de proyectos) =====
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        filterButtons.forEach(function (b) {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        let visibleCount = 0;

        projectCards.forEach(function (card) {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.hidden = !match;
          if (match) {
            card.classList.add('visible');
            visibleCount++;
          }
        });

        const empty = document.getElementById('projectsEmpty');
        if (empty) empty.hidden = visibleCount !== 0;
      });
    });
  }

  // ===== Project Modal (página de proyectos) =====
  // Edita/añade aquí la información de cada proyecto.
  // La clave debe coincidir con el `data-project` de la tarjeta.
  const PROJECT_IMG_BASE = '../img/proyectos/';
  const PROJECTS = {
    sis: {
      title: 'SIS — Sistema de información escolar',
      cat: 'Desarrollo Web',
      desc: 'Sistema de información a la medida para la Fundación Liceo Inglés que centraliza la operación académica y de convivencia del colegio y da a las familias un portal propio, con control de acceso por rol. Reemplaza el papel, las hojas de cálculo y las herramientas sueltas por módulos integrados.',
      features: [
        'Asistencia desde el móvil con horario rotativo, sustituciones y reportes.',
        'Notas, gradebooks y reportes de progreso.',
        'Portal de padres y estudiantes (cada quien ve solo su información).',
        'Comunicados con medición de lectura y anuncios/tareas con acuse.',
        'Disciplina, convivencia, casos de bullying y consejería.',
        'Autorizaciones, PQRS y pre-faltas.',
        'Servicios conexos: comedor, transporte, extracurriculares y tutorías.',
        'Notificaciones push web y funciones de IA (resúmenes y consultas).'
      ],
      stack: ['JavaScript', 'Supabase (PostgreSQL + RLS)', 'Google OAuth', 'n8n', 'OpenAI', 'PWA'],
      images: [
        { src: PROJECT_IMG_BASE + 'sis-1.webp', alt: 'Listado de estudiantes en el Campus Académico del SIS' },
        { src: PROJECT_IMG_BASE + 'sis-2.webp', alt: 'Toma de asistencia por clase en el SIS' },
        { src: PROJECT_IMG_BASE + 'sis-3.webp', alt: 'Panel de analíticas académicas del SIS' }
      ]
    },
    wssuite: {
      title: 'WSSUITE — CRM de WhatsApp',
      cat: 'Desarrollo Web',
      desc: 'Suite completa para operar la WhatsApp Business API de Meta desde un panel propio: atención al cliente en vivo y marketing masivo en un solo lugar. Gestiona conversaciones, lanza campañas con plantillas aprobadas y mide entregas, costos y desempeño de agentes.',
      features: [
        'Chat bidireccional en tiempo real.',
        'Gestor de plantillas con estados de aprobación de Meta.',
        'Campañas masivas con colas, límite de envío y reintentos automáticos.',
        'Analíticas de entregas, costos y desempeño por agente.',
        'Contactos, etiquetas y segmentos reutilizables.',
        'Envío y almacenamiento de imágenes, video y audio.',
        'Bot de IA con traspaso (handoff) a agentes humanos.',
        'Ventana de 24 h y mensaje de bienvenida automático.'
      ],
      stack: ['React + TypeScript', 'Node.js + Fastify', 'PostgreSQL + Prisma', 'Redis + BullMQ', 'Socket.IO', 'Docker'],
      images: [
        { src: PROJECT_IMG_BASE + 'wssuite-1.webp', alt: 'Bandeja de conversaciones en tiempo real de WSSUITE' },
        { src: PROJECT_IMG_BASE + 'wssuite-2.webp', alt: 'Gestor de plantillas de WhatsApp con aprobación de Meta' },
        { src: PROJECT_IMG_BASE + 'wssuite-3.webp', alt: 'Analíticas de WSSUITE: entregas, campañas y opt-outs' }
      ]
    },
    'campo-alegre': {
      title: 'Software de admisiones — Escuela Campo Alegre',
      cat: 'Desarrollo Web',
      desc: 'Plataforma que digitaliza todo el proceso de admisión de la Escuela Campo Alegre: del formulario de preadmisión y los tours hasta las fichas con firma digital, los documentos y la decisión final. Incluye notificaciones automáticas y un chatbot con IA.',
      features: [
        'Formulario público de preadmisión bilingüe (ES/EN).',
        'Gestión de interesados y promoción a solicitud.',
        'Agendamiento de tours (presencial o por video).',
        'Portal de la familia: fichas, documentos, firma digital y pago de aplicación.',
        'Pipeline de admisión por etapas con revisión paso a paso.',
        'Referencias del colegio y de profesores mediante enlaces seguros.',
        'Notificaciones por correo y recordatorios automáticos.',
        'Chatbot con IA y exportación de datos (PowerSchool).'
      ],
      stack: ['Next.js + React', 'TypeScript', 'PostgreSQL + Prisma', 'NextAuth', 'next-intl (ES/EN)', 'n8n + OpenAI'],
      images: [
        { src: PROJECT_IMG_BASE + 'campo-alegre-1.webp', alt: 'Dashboard de admisiones de la Escuela Campo Alegre' },
        { src: PROJECT_IMG_BASE + 'campo-alegre-2.webp', alt: 'Listado de aspirantes por grado en el panel de admisiones' },
        { src: PROJECT_IMG_BASE + 'campo-alegre-3.webp', alt: 'Portal de familias con el estado del proceso de admisión' }
      ]
    },
    'seguros-oms': {
      title: 'Publicidad para SEGUROS O.M.S',
      cat: 'Diseño Gráfico',
      desc: 'Set de piezas publicitarias para redes sociales de SEGUROS O.M.S, operador mayorista de seguros. Creé una línea gráfica consistente —marca, tipografía, tratamiento de la fotografía y datos del asesor— para promocionar distintos ramos: auto, familia, hogar, negocio y responsabilidad civil profesional.',
      features: [
        'Piezas para redes sociales en formato cuadrado (1080×1080).',
        'Adaptación por ramo: auto, familia, hogar, negocio y responsabilidad civil.',
        'Jerarquía tipográfica con titulares de impacto y llamado a la acción.',
        'Tratamiento fotográfico con tinte azul de marca y overlays.',
        'Bloque de contacto del asesor (correo y teléfono) en cada pieza.',
        'Logotipo y línea gráfica aplicados de forma consistente.'
      ],
      stackLabel: 'Enfoque',
      stack: ['Redes sociales', 'Marca', 'Tipografía', 'Publicidad'],
      stageAspect: '1 / 1',
      images: [
        { src: PROJECT_IMG_BASE + 'seguros-oms-1.webp', alt: 'Pieza de publicidad de seguro de auto para SEGUROS O.M.S' },
        { src: PROJECT_IMG_BASE + 'seguros-oms-2.webp', alt: 'Pieza de publicidad de seguro de familia para SEGUROS O.M.S' },
        { src: PROJECT_IMG_BASE + 'seguros-oms-3.webp', alt: 'Pieza de publicidad de seguro de hogar para SEGUROS O.M.S' },
        { src: PROJECT_IMG_BASE + 'seguros-oms-4.webp', alt: 'Pieza de publicidad de seguro para negocios de SEGUROS O.M.S' },
        { src: PROJECT_IMG_BASE + 'seguros-oms-5.webp', alt: 'Pieza de publicidad de responsabilidad civil profesional de SEGUROS O.M.S' }
      ]
    },
    'cruz-roja': {
      title: 'Piezas gráficas — Cruz Roja Colombiana',
      cat: 'Diseño Gráfico',
      desc: 'Diseño de piezas de comunicación para la Cruz Roja Colombiana, Seccional Risaralda. Creé invitaciones y volantes en distintos formatos (cuadrado, vertical y story) para capacitaciones, ceremonias y la convocatoria de voluntariado, cuidando la identidad de la institución.',
      features: [
        'Piezas en distintos formatos: cuadrado, vertical y story.',
        'Invitación a capacitación sobre cambio climático.',
        'Invitación a la ceremonia de clausura del Servicio Social.',
        'Volante de convocatoria de voluntariado con pasos y enlace.',
        'Aplicación de la identidad y el logotipo de la Cruz Roja.',
        'Jerarquía de información clara (fecha, hora y lugar).'
      ],
      stackLabel: 'Enfoque',
      stack: ['Diseño editorial', 'Redes sociales', 'Volantes', 'Identidad'],
      stageAspect: '1 / 1',
      images: [
        { src: PROJECT_IMG_BASE + 'cruz-roja-1.webp', alt: 'Invitación a capacitación sobre cambio climático de la Cruz Roja Colombiana' },
        { src: PROJECT_IMG_BASE + 'cruz-roja-2.webp', alt: 'Invitación a la ceremonia de clausura del Servicio Social de la Cruz Roja' },
        { src: PROJECT_IMG_BASE + 'cruz-roja-3.webp', alt: 'Volante de convocatoria de voluntariado de la Cruz Roja Colombiana' }
      ]
    }
  };

  const projectModal = document.getElementById('projectModal');

  if (projectModal && projectCards.length) {
    const modalImage = document.getElementById('modalImage');
    const modalThumbs = document.getElementById('modalThumbs');
    const modalCat = document.getElementById('modalCat');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalStack = document.getElementById('modalStack');
    const modalStackLabel = document.getElementById('modalStackLabel');
    const modalCaption = document.getElementById('modalCaption');
    const prevBtn = projectModal.querySelector('.modal__nav--prev');
    const nextBtn = projectModal.querySelector('.modal__nav--next');
    const closeBtn = projectModal.querySelector('.modal__close');

    let currentProject = null;
    let imageIndex = 0;
    let lastFocused = null;

    function renderImage() {
      if (!currentProject) return;
      const images = currentProject.images || [];
      const img = images[imageIndex];

      if (img) {
        modalImage.src = img.src;
        modalImage.alt = img.alt || currentProject.title;
        if (modalCaption) modalCaption.textContent = img.alt || '';
      }

      modalThumbs.querySelectorAll('.modal__thumb').forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === imageIndex);
      });

      const multiple = images.length > 1;
      if (prevBtn) prevBtn.hidden = !multiple;
      if (nextBtn) nextBtn.hidden = !multiple;
    }

    function renderThumbs() {
      modalThumbs.innerHTML = '';
      (currentProject.images || []).forEach(function (img, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal__thumb';
        btn.setAttribute('aria-label', 'Ver imagen ' + (i + 1));

        const thumbImg = document.createElement('img');
        thumbImg.src = img.src;
        thumbImg.alt = '';
        btn.appendChild(thumbImg);

        btn.addEventListener('click', function () {
          imageIndex = i;
          renderImage();
        });

        modalThumbs.appendChild(btn);
      });
    }

    function openModal(id) {
      const data = PROJECTS[id];
      if (!data) return;

      currentProject = data;
      imageIndex = 0;
      lastFocused = document.activeElement;

      modalCat.textContent = data.cat || '';
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;

      modalFeatures.innerHTML = '';
      (data.features || []).forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'modal__feature';
        li.textContent = item;
        modalFeatures.appendChild(li);
      });

      modalStack.innerHTML = '';
      (data.stack || []).forEach(function (tech) {
        const li = document.createElement('li');
        li.className = 'modal__tag';
        li.textContent = tech;
        modalStack.appendChild(li);
      });
      if (modalStackLabel) modalStackLabel.textContent = data.stackLabel || 'Tecnologías';

      renderThumbs();
      renderImage();

      projectModal.hidden = false;
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', onModalKeydown);
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      projectModal.hidden = true;
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onModalKeydown);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    function showImage(delta) {
      const count = (currentProject.images || []).length;
      if (!count) return;
      imageIndex = (imageIndex + delta + count) % count;
      renderImage();
    }

    function onModalKeydown(e) {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') { closeLightbox(); return; }
        if (e.key === 'ArrowRight') { lbNavigate(1); return; }
        if (e.key === 'ArrowLeft') { lbNavigate(-1); return; }
        return;
      }
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === 'ArrowRight') {
        showImage(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        showImage(-1);
        return;
      }
      if (e.key === 'Tab') {
        const focusables = projectModal.querySelectorAll('button');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    projectCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(this.getAttribute('data-project'));
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { showImage(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showImage(1); });

    projectModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    // ----- Visor a pantalla completa (lightbox) -----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxStage = document.getElementById('lightboxStage');
    const lightboxZoomIn = document.getElementById('lightboxZoomIn');
    const lightboxZoomOut = document.getElementById('lightboxZoomOut');

    let lbScale = 1;
    let lbX = 0;
    let lbY = 0;
    let lbDragging = false;
    let lbMoved = false;
    let lbStartX = 0;
    let lbStartY = 0;
    let lbBaseX = 0;
    let lbBaseY = 0;

    function lbApply() {
      lightboxImg.style.transform =
        'translate(' + lbX + 'px, ' + lbY + 'px) scale(' + lbScale + ')';
      lightboxImg.classList.toggle('is-zoomed', lbScale > 1);
    }

    function lbReset() {
      lbScale = 1;
      lbX = 0;
      lbY = 0;
      lbApply();
    }

    function lbZoomAt(newScale, clientX, clientY) {
      newScale = Math.min(4, Math.max(1, newScale));
      const rect = lightboxStage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (clientX - cx - lbX) / lbScale;
      const py = (clientY - cy - lbY) / lbScale;
      lbX = (clientX - cx) - px * newScale;
      lbY = (clientY - cy) - py * newScale;
      lbScale = newScale;
      if (lbScale === 1) {
        lbX = 0;
        lbY = 0;
      }
      lbApply();
    }

    function lbZoomCenter(delta) {
      const rect = lightboxStage.getBoundingClientRect();
      lbZoomAt(lbScale + delta, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    function lbShow() {
      if (!currentProject) return;
      const images = currentProject.images || [];
      const img = images[imageIndex];
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || currentProject.title;
      if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
      lbReset();
      const multiple = images.length > 1;
      if (lightboxPrev) lightboxPrev.hidden = !multiple;
      if (lightboxNext) lightboxNext.hidden = !multiple;
    }

    function openLightbox() {
      if (!currentProject || !lightbox) return;
      lbShow();
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      lbReset();
    }

    function lbNavigate(delta) {
      const count = (currentProject.images || []).length;
      if (!count) return;
      imageIndex = (imageIndex + delta + count) % count;
      lbShow();
      renderImage();
    }

    if (lightbox && lightboxStage) {
      modalImage.addEventListener('click', openLightbox);

      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      if (lightboxPrev) lightboxPrev.addEventListener('click', function () { lbNavigate(-1); });
      if (lightboxNext) lightboxNext.addEventListener('click', function () { lbNavigate(1); });
      if (lightboxZoomIn) lightboxZoomIn.addEventListener('click', function () { lbZoomCenter(0.5); });
      if (lightboxZoomOut) lightboxZoomOut.addEventListener('click', function () { lbZoomCenter(-0.5); });

      lightboxStage.addEventListener('click', function (e) {
        if (e.target === lightboxStage && !lbMoved) closeLightbox();
      });

      lightboxImg.addEventListener('dblclick', function (e) {
        e.preventDefault();
        if (lbScale > 1) {
          lbReset();
        } else {
          lbZoomAt(2.5, e.clientX, e.clientY);
        }
      });

      lightboxStage.addEventListener('wheel', function (e) {
        e.preventDefault();
        lbZoomAt(lbScale + (e.deltaY < 0 ? 0.5 : -0.5), e.clientX, e.clientY);
      }, { passive: false });

      lightboxStage.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        lbDragging = true;
        lbMoved = false;
        lbStartX = e.clientX;
        lbStartY = e.clientY;
        lbBaseX = lbX;
        lbBaseY = lbY;
        lightboxImg.classList.add('is-dragging');
        if (lightboxStage.setPointerCapture) {
          lightboxStage.setPointerCapture(e.pointerId);
        }
      });

      lightboxStage.addEventListener('pointermove', function (e) {
        if (!lbDragging) return;
        const dx = e.clientX - lbStartX;
        const dy = e.clientY - lbStartY;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) lbMoved = true;
        if (lbScale > 1) {
          lbX = lbBaseX + dx;
          lbY = lbBaseY + dy;
          lbApply();
        }
      });

      lightboxStage.addEventListener('pointerup', function (e) {
        if (!lbDragging) return;
        lbDragging = false;
        lightboxImg.classList.remove('is-dragging');
        const dx = e.clientX - lbStartX;
        const dy = e.clientY - lbStartY;
        if (lbScale === 1 && lbMoved && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
          lbNavigate(dx < 0 ? 1 : -1);
        }
      });

      lightboxStage.addEventListener('pointercancel', function () {
        lbDragging = false;
        lightboxImg.classList.remove('is-dragging');
      });
    }
  }

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const serviceSelect = document.getElementById('service');
  const messageField = document.getElementById('message');
  const PLAN_PREFIX = 'Me interesa el plan ';

  function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status' + (type ? ' ' + type : '');
  }

  function getErrorEl(input) {
    const describedBy = input.getAttribute('aria-describedby');
    return describedBy ? document.getElementById(describedBy) : null;
  }

  function setFieldError(input, message) {
    const errorEl = getErrorEl(input);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    } else {
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    }
  }

  function validateField(input) {
    if (input.type === 'checkbox') {
      if (input.required && !input.checked) {
        setFieldError(input, input.getAttribute('data-required-msg') || 'Este campo es obligatorio.');
        return false;
      }
      setFieldError(input, '');
      return true;
    }

    const value = (input.value || '').trim();

    if (input.required && !value) {
      setFieldError(input, input.getAttribute('data-required-msg') || 'Este campo es obligatorio.');
      return false;
    }

    if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError(input, 'Ingresa un correo electrónico válido.');
      return false;
    }

    setFieldError(input, '');
    return true;
  }

  function clearFormErrors() {
    if (!contactForm) return;
    contactForm.querySelectorAll('[aria-invalid]').forEach(function (el) {
      setFieldError(el, '');
    });
    setFormStatus('', '');
  }

  function openWhatsApp(payload) {
    const text = [
      'Hola DantMotion, quiero más información:',
      '',
      'Nombre: ' + payload.name,
      'Email: ' + payload.email,
      'Teléfono: ' + payload.phone,
      'Servicio: ' + payload.service,
      'Mensaje: ' + payload.message
    ].join('\n');

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    const win = window.open(url, '_blank');

    if (win) {
      win.opener = null;
    } else {
      // Si el navegador bloqueó la ventana emergente, navegamos directamente.
      window.location.href = url;
    }
  }

  function submitViaEndpoint(payload) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
    }
    setFormStatus('Enviando tu mensaje…', '');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Error ' + res.status);
        contactForm.reset();
        clearFormErrors();
        setFormStatus('¡Gracias! Recibimos tu mensaje y te responderemos muy pronto.', 'success');
      })
      .catch(function () {
        setFormStatus('No pudimos enviar el mensaje. Te abrimos WhatsApp para que puedas escribirnos.', 'error');
        openWhatsApp(payload);
      })
      .then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar mensaje';
        }
      });
  }

  if (contactForm) {
    const fields = Array.prototype.slice.call(
      contactForm.querySelectorAll('input:not(.honeypot), select, textarea')
    );

    fields.forEach(function (field) {
      const eventName = (field.type === 'checkbox' || field.tagName === 'SELECT') ? 'change' : 'input';
      field.addEventListener(eventName, function () {
        validateField(field);
      });
      field.addEventListener('blur', function () {
        validateField(field);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) {
          firstInvalid = field;
        }
      });

      if (firstInvalid) {
        setFormStatus('Revisa los campos marcados en rojo.', 'error');
        firstInvalid.focus();
        return;
      }

      const payload = {
        name: contactForm.elements['name'].value.trim(),
        email: contactForm.elements['email'].value.trim(),
        phone: contactForm.elements['phone'].value.trim() || 'No indicado',
        service: serviceLabels[serviceSelect.value] || serviceSelect.value,
        message: contactForm.elements['message'].value.trim()
      };

      if (FORM_ENDPOINT) {
        submitViaEndpoint(payload);
      } else {
        openWhatsApp(payload);
        contactForm.reset();
        clearFormErrors();
        setFormStatus('¡Gracias! Te hemos redirigido a WhatsApp para continuar la conversación.', 'success');
      }
    });
  }

  // ===== Preselección de plan desde los botones "Lo quiero" =====
  document.querySelectorAll('[data-service-group] a[href="#contacto"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const group = this.closest('[data-service-group]').getAttribute('data-service-group');
      const card = this.closest('.pricing-card, .simple-card, .featured-card');

      let plan = '';
      let price = '';

      if (card) {
        const nameEl = card.querySelector('.pricing-card__name, .simple-card__name, .featured-card__name');
        if (nameEl) plan = nameEl.textContent.trim();

        const priceEl = card.querySelector('.price, .simple-card__price, .featured-card__price');
        const periodEl = card.querySelector('.period, .featured-card__period');
        if (priceEl) {
          price = priceEl.textContent.trim();
          if (periodEl) price += ' ' + periodEl.textContent.trim();
        }
      }

      if (serviceSelect) {
        serviceSelect.value = group;
        validateField(serviceSelect);
      }

      // Solo prellenar el mensaje si hay un plan concreto (no en el CTA de sección).
      // No sobrescribir un mensaje propio del usuario.
      if (messageField && plan && (!messageField.value.trim() || messageField.value.indexOf(PLAN_PREFIX) === 0)) {
        messageField.value = PLAN_PREFIX + plan + (price ? ' (' + price + ')' : '') + '.';
        validateField(messageField);
      }
    });
  });

  // ===== Smooth scroll for anchor links (fallback) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignorar enlaces vacíos ("#") para evitar un selector inválido.
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
