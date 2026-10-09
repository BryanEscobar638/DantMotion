# DantMotion — Resumen del proyecto

Documentación técnica de lo que contiene el sitio de **DantMotion** (desarrollo web, marketing
digital y diseño) y cómo está construido.

- **Tipo:** sitio web estático (HTML + CSS + JavaScript puro).
- **Build / dependencias:** ninguna. No hay `package.json`, bundler ni frameworks.
- **Idioma:** español (con favicon/logo de marca).

---

## 1. Estructura de archivos

```
DantMotion/
├── index.html              # Página principal
├── privacidad.html         # Política de privacidad (Ley 1581)
├── proyectos/
│   └── index.html          # Portafolio con filtros, modal y visor (/proyectos/)
├── css/
│   └── style.css           # Todos los estilos (variables CSS + tema claro/oscuro)
├── js/
│   └── main.js             # Toda la lógica (un único IIFE)
├── img/
│   ├── logo-dantmotion.png # Logo completo (respaldo PNG)
│   ├── logo-dantmotion.webp# Logo completo optimizado (hero)
│   ├── logo-mark.png       # Símbolo circular (header, footer, avatar)
│   ├── favicon.png         # Favicon
│   └── proyectos/          # Capturas de cada proyecto (WebP)
├── robots.txt              # Reglas para buscadores
├── sitemap.xml             # Mapa del sitio
├── LICENSE                 # MIT
├── README.md               # Presentación del negocio
└── docs/
    └── RESUMEN.md          # Este documento
```

## 2. Páginas y secciones

### `index.html` (página principal)
Orden de secciones (con enfoque **dev-first**):

1. **Header** — logo circular + navegación + toggle de tema + menú móvil.
2. **Hero** — propuesta de desarrollo web, CTAs y el logo en un círculo con glow.
3. **Desarrollo Web** — 5 tipos de proyecto (landing, corporativo, tienda, app a medida, soporte).
4. **Portafolio (recientes)** — 3 proyectos reales con imagen; botón "Ver todos los proyectos".
5. **Marketing Digital** — 4 planes con precios.
6. **Diseño Gráfico** — 3 paquetes.
7. **Video** — 3 paquetes.
8. **Paquete Estrella** (Todo en Uno).
9. **Sobre nosotros** — copy, diferenciales con iconos y zona de servicio.
10. **FAQ** — acordeón con 5 preguntas.
11. **Contacto** — formulario + tarjetas + "¿Qué pasa después?" (pasos).
12. **Footer** + botón flotante de WhatsApp.

### `proyectos/index.html` (portafolio)
- Encabezado, **filtros por categoría** (Todos · Diseño Gráfico · Desarrollo Web · Video).
- **Tarjetas de proyecto** con imagen, categoría, descripción y etiquetas.
- **Modal de proyecto** con galería y detalle.
- **Visor a pantalla completa** (lightbox) con zoom y navegación.
- CTA final al contacto.

### `privacidad.html`
- Política de privacidad (12 puntos) para la Ley 1581 de Colombia.

## 3. Tecnologías y enfoque

- **HTML5** semántico y accesible.
- **CSS3** con variables (`:root`), tema claro/oscuro y `@media` para responsive.
- **JavaScript** vanilla (sin librerías), dentro de un único IIFE con `'use strict'`.
- **Supabase / build:** no aplica; es 100% estático.

## 4. Funcionalidades principales

### Tema claro/oscuro
- Se aplica un `<script>` inline en el `<head>` **antes del primer render** para evitar el
  parpadeo (FOUC). La preferencia se guarda en `localStorage` (con `try/catch`).
- El botón actualiza `aria-pressed` y `aria-label`.

### Navegación
- Menú móvil (hamburguesa) con `aria-expanded`/`aria-controls`, cierre con **Escape**, clic fuera
  y al seleccionar un enlace.

### Acordeón FAQ
- ARIA (`aria-expanded`, `aria-controls`, `role="region"`), solo un ítem abierto a la vez.

### Animaciones de scroll
- `IntersectionObserver` añade `.visible` a los elementos `.fade-in` (con fallback si no existe).
- Se respeta `prefers-reduced-motion`.

### Formulario de contacto
- **Validación en línea** por campo (`aria-invalid`, mensaje bajo el input, foco al primer error).
- **Consentimiento de datos** (checkbox obligatorio → `privacidad.html`).
- **Honeypot** antispam oculto.
- **Preselección de plan**: los botones "Lo quiero"/"Cotizar" (`data-service-group`) rellenan el
  servicio y el mensaje del formulario.
- **Envío:** si `FORM_ENDPOINT` tiene valor, envía por `fetch` (Formspree/FormSubmit); si no,
  abre **WhatsApp** con el mensaje prellenado.

### Portafolio (filtros + modal + visor)
- **Filtros** por categoría (JS toggles sobre `.project-card[data-category]`).
- **Modal** (`#projectModal`): galería con imagen principal, leyenda, miniaturas y navegación;
  pestañas de detalle ("Qué incluye", "Tecnologías"/"Enfoque").
- **Visor a pantalla completa** (`#lightbox`): cierre arriba-derecha, navegación lateral,
  **deslizar** (pointer events) y **zoom** (rueda, botones `−/+`, doble clic); arrastrar para
  desplazar cuando hay zoom. `Escape` cierra primero el visor.

### Iconografía
- **Sprite SVG** (`<symbol>` + `<use>`): WhatsApp, sol/luna, chevron, imagen, video, teléfono,
  email, tarjeta, redes y los iconos de desarrollo (window, code, cart, layers, tool).

### Ubicación y pasos
- Bloque **"¿Qué pasa después?"** con 3 pasos y nota de respuesta (< 24 h).

## 5. Arquitectura de CSS (`css/style.css`)

- **Variables en `:root`**: colores y canales RGB (`--blue-rgb`, etc.), fondos, textos, bordes,
  sombras, radios, transiciones y fuentes.
- **Tema oscuro** con `[data-theme="dark"]`.
- **Nomenclatura tipo BEM**: `.bloque__elemento--modificador`.
- **Componentes**: header, hero, pricing, simple-card, featured-card, portfolio, projects,
  modal, lightbox, about, faq, contact, footer, formulario.
- **Responsive** con `@media (max-width: 1024px / 768px / 480px)`; grillas que pasan a 1 columna
  y planes/servicios que pasan a scroll horizontal.
- **Utilidades**: `.gradient-text`, `.fade-in`, `.skip-link`, `.svg-sprite`, `.honeypot`.

## 6. Arquitectura de JavaScript (`js/main.js`)

Un único IIFE con `'use strict'` y secciones:

1. **Configuración**: `FORM_ENDPOINT`, `WHATSAPP_NUMBER`, `serviceLabels`.
2. **Tema** (aplicar/guardar/actualizar botón).
3. **Menú móvil** (abrir/cerrar, Escape, clic fuera).
4. **FAQ** (acordeón + ARIA).
5. **Animaciones** (IntersectionObserver + fallback).
6. **Filtros de proyectos** (`data-filter` / `data-category`).
7. **Modal de proyecto** (`PROJECTS` + render de galería y detalle).
8. **Visor a pantalla completa** (zoom/pan/swipe).
9. **Formulario de contacto** (validación, envío por endpoint o WhatsApp).
10. **Preselección de plan** desde los botones de servicios.
11. **Scroll suave** para enlaces ancla (con guardia para `href="#"`).

### Datos del portafolio (`PROJECTS`)
Cada proyecto es una clave con `title`, `cat`, `desc`, `features`, `stack`, `stackLabel`
(opcional) e `images[]`. La clave coincide con el `data-project` de la tarjeta. Las imágenes
apuntan a `../img/proyectos/...`.

## 7. Imágenes y optimización

- Piezas de proyectos convertidas a **WebP** y adaptadas a formatos cuadrados/16:9 según la
  categoría (con fondo desenfocado cuando el original era de otra proporción).
- Logo completo servido en el hero con `<picture>` (**WebP + fallback PNG**).
- Imágenes de tarjetas con `loading="lazy"`.
- Los originales se optimizaron con **Pillow** (redimensión, recorte de bordes blancos, WebP).

## 8. SEO

- `title`, `meta description`, `canonical` y `theme-color`.
- **Open Graph** y **Twitter Card** (`og:title/description/url/site_name/locale/image`).
- **Datos estructurados** JSON-LD (`LocalBusiness`).
- `robots.txt` y `sitemap.xml`.

## 9. Accesibilidad

- Skip link, `:focus-visible`, contraste cuidado.
- `aria-*` en menú, FAQ, modal y visor.
- `aria-hidden` en iconos decorativos y textos alternativos descriptivos.
- Soporte de `prefers-reduced-motion`.
- Fallback `<noscript>` para que el contenido no quede invisible sin JS.

## 10. Rendimiento

- Imágenes en WebP, sprite SVG y carga diferida.
- Transiciones acotadas a propiedades concretas (no `all`).
- Sin dependencias externas ni bloqueo de render.

## 11. Responsive

- Breakpoints: **1024 / 768 / 480 px**.
- Menú hamburguesa en móvil; grillas a 1 columna; planes/servicios con scroll horizontal.
- Modal a pantalla completa con altura `100dvh` y campos a `1rem` para evitar el zoom de iOS.

## 12. Personalización

| Qué | Dónde |
|---|---|
| Precios y textos de servicios | `index.html` |
| Proyectos del portafolio | Objeto `PROJECTS` en `js/main.js` + `img/proyectos/` |
| Logo / favicon | `img/` |
| WhatsApp y email | `index.html` y `js/main.js` (`WHATSAPP_NUMBER`, enlaces `wa.me`) |
| Envío del formulario | `FORM_ENDPOINT` en `js/main.js` |
| Colores y tema | Variables en `:root` de `css/style.css` |

## 13. Convenciones de commits

- **Conventional Commits** en inglés (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- Historial con commits temáticos (assets, privacidad, proyectos, a11y, UI, responsive).

## 14. Pendientes / roadmap

- [ ] Imagen **Open Graph** (`img/og-image.png`, 1200×630).
- [ ] Confirmar el **dominio real** en `canonical`, `og:url`, `sitemap.xml` y `robots.txt`.
- [ ] Datos legales completos (nombre/NIT del responsable) en `privacidad.html`.
- [ ] Enlaces reales de **Instagram/Facebook** (hoy son `#`).
- [ ] Endpoint de envío del formulario (`FORM_ENDPOINT`).
- [ ] Zoom por **pellizco** en el visor móvil.
