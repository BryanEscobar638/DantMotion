# DantMotion

> Sitio web de **DantMotion**: desarrollo web, marketing digital y diseño gráfico.

Sitio 100% estático (HTML, CSS y JavaScript puro, sin dependencias ni build) con enfoque en
**desarrollo web a la medida**, portafolio de proyectos con galería y visor a pantalla completa,
tema claro/oscuro, formulario de contacto y diseño responsive.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-✓-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Características

- **Home dev-first**: el desarrollo web es la sección principal, con planes de marketing,
  diseño y video como servicios complementarios.
- **Portafolio** (`/proyectos`) con filtros por categoría (diseño, desarrollo, video).
- **Modal de proyecto** con galería, descripción, "Qué incluye" y tecnologías.
- **Visor a pantalla completa**: zoom (rueda/botones/doble clic), navegación deslizable y cierre.
- **Tema claro/oscuro** con persistencia y sin parpadeo (aplicado antes del primer render).
- **Formulario de contacto** con validación en línea, consentimiento de datos (Ley 1581) y
  envío por WhatsApp o por endpoint (Formspree/FormSubmit).
- **Accesibilidad**: skip link, foco visible, `aria` en menú/acordeón/modal, soporte de
  `prefers-reduced-motion` y textos alternativos.
- **SEO**: metadatos, Open Graph/Twitter, datos estructurados JSON-LD, `robots.txt` y `sitemap.xml`.
- **Rendimiento**: imágenes en WebP con fallback, sprite SVG y carga diferida (`lazy`).

## 🚀 Demo

- Producción: <https://dantmotion.com/>
- Portafolio: <https://dantmotion.com/proyectos/>

## 🧱 Estructura

```
DantMotion/
├── index.html              # Página principal
├── privacidad.html         # Política de privacidad
├── proyectos/
│   └── index.html          # Portafolio con filtros, modal y visor (/proyectos/)
├── css/
│   └── style.css           # Estilos (variables CSS + tema claro/oscuro)
├── js/
│   └── main.js             # Tema, menú, FAQ, filtros, modal, visor y formulario
├── img/
│   ├── logo-dantmotion.png # Logo completo (respaldo)
│   ├── logo-dantmotion.webp
│   ├── logo-mark.png       # Símbolo circular (header, footer, hero)
│   ├── favicon.png
│   └── proyectos/          # Capturas de los proyectos (WebP)
├── robots.txt
├── sitemap.xml
├── LICENSE
└── README.md
```

## 🖥️ Cómo ejecutarlo en local

No requiere instalación. Abre `index.html` en el navegador.

Para probar rutas como `/proyectos/`, usa un servidor local:

```bash
# Python
python -m http.server 8000

# o Node
npx serve .
```

Luego abre <http://localhost:8000>.

## 🌐 Despliegue

Al ser estático, publica el contenido del repo tal cual en cualquier hosting
estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).

## ⚙️ Personalización

- **Precios y textos de servicios**: `index.html`.
- **Proyectos del portafolio**: edita el objeto `PROJECTS` en `js/main.js` (título,
  descripción, `features`, `stack` e `images`) y añade las imágenes en `img/proyectos/`.
- **Logo**: reemplaza los archivos en `img/`.
- **Datos de contacto** (WhatsApp / email): busca el número `573217716506` y el correo en
  `index.html` y `js/main.js`.
- **Envío real del formulario**: define `FORM_ENDPOINT` en `js/main.js`
  (si queda vacío, el formulario abre WhatsApp).

## ♿ Accesibilidad y rendimiento

Enlaces con foco visible, skip link, etiquetas y roles ARIA, contraste cuidado, movimiento
reducido, imágenes `lazy` en WebP y SVG en sprite. Objetivo: buena puntuación en Lighthouse.

## 🗺️ Roadmap

- [ ] Imagen Open Graph (`img/og-image.png`, 1200×630).
- [ ] Reemplazar los enlaces de Instagram/Facebook (hoy `#`).
- [ ] Zoom por pellizco (pinch) en el visor móvil.
- [ ] Conectar el formulario a un backend/endpoint propio.

## 📄 Licencia

[MIT](LICENSE) © 2026 DantMotion

## 📬 Contacto

- WhatsApp: [+57 321 7716506](https://wa.me/573217716506)
- Email: [contacto@dantmotion.com](mailto:contacto@dantmotion.com)
