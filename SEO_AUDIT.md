# Auditoría SEO & AEO - MetaReiki Astro

## Resumen Ejecutivo

**MetaReiki Astro** cuenta con una base técnica sólida y un contenido de alta calidad (interpretaciones astrológicas) que actualmente es invisible para los motores de búsqueda debido a su arquitectura de Página Única (SPA).

La oportunidad más grande reside en **"desbloquear"** el contenido que ya existe en los archivos JSON y convertirlo en una biblioteca pública de conocimiento astrológico. Esto transformará la aplicación de una simple "herramienta privada" a una **autoridad temática** indexable.

---

## 1. Análisis Técnico (Technical SEO)

### 🔴 Crítico: Arquitectura SPA (Single Page Application)
**Problema:** Actualmente, todo el contenido vive en la URL raíz (`/`). Google puede indexar la home, pero no existen URLs específicas para "Profecciones", "Tránsitos" o "Partes Herméticas". Si un usuario busca "qué son las profecciones", no tienes una página específica para responderle (Landing Page).
**Solución:** Implementar **React Router**.
- Crear rutas estáticas:
    - `/carta-natal`
    - `/profecciones`
    - `/transitos`
    - `/partes-hermeticas`
    - `/reiki-salud`
- Cada ruta debe tener su propio título, meta descripción y contenido explicativo estático (H1, texto introductorio) antes de mostrar la calculadora.

### 🔴 Crítico: Rendimiento (Tailwind CSS CDN)
**Problema:** Se está cargando Tailwind vía CDN (`<script src="https://cdn.tailwindcss.com"></script>`). Esto obliga al navegador a descargar un script pesado, escanear todo el DOM y generar estilos en tiempo real.
- **Impacto:** Aumenta el *Time to Interactive* (TTI) y causa *Flash of Unstyled Content* (FOUC). Penaliza Core Web Vitals.
**Solución:** Migrar a un proceso de construcción (build) estándar de Tailwind.
- Instalar `tailwindcss`, `postcss`, `autoprefixer`.
- Generar un archivo `styles.css` estático y minificado en tiempo de compilación.

### 🟡 Medio: Metaetiquetas Dinámicas
**Problema:** El `<title>` y `<meta description>` son estáticos en `index.html`.
**Solución:** Implementar `react-helmet-async`.
- Permitirá cambiar el título a "Calculadora de Profecciones - MetaReiki" cuando el usuario navegue a esa sección, mejorando el CTR en resultados de búsqueda.

---

## 2. Estrategia de Contenido (Content Optimization)

### 💎 La Mina de Oro: "Biblioteca Astrológica"
Tienes archivos JSON (`sol.json`, etc.) con contenido original y de alta calidad en español (ej. *"El Sol en Aries en la Casa 1..."*). Actualmente, este texto solo se ve si un usuario genera una carta con esa posición.

**Estrategia:** Crear una sección de **Glosario / Biblioteca**.
- Generar rutas públicas para cada interpretación:
    - `/biblioteca/planetas/sol/aries/casa-1`
    - `/biblioteca/planetas/luna/tauro/casa-4`
- **Volumen:** Esto generará automáticamente cientos de páginas de contenido relevante y altamente específico (Long-tail keywords).
- **Valor:** Responde a búsquedas muy concretas como *"qué significa sol en aries casa 7"*.

### Páginas de Aterrizaje (Landing Pages)
Para cada funcionalidad de la app, crear una página explicativa que sirva como puerta de entrada.
- **Ejemplo: `/profecciones`**
    - **H1:** ¿Qué son las Profecciones Anuales?
    - **Contenido:** Explicación de la técnica del Señor del Tiempo.
    - **CTA:** "Calcula tu Profección ahora" (que lleva al formulario o lo despliega).
    - **Beneficio:** Captura tráfico informacional ("top of funnel") y lo convierte en usuarios de la app.

---

## 3. Answer Engine Optimization (AEO)

Los motores de respuesta (ChatGPT, Perplexity, Google SGE) buscan **datos estructurados** y **respuestas directas**.

### Datos Estructurados (Schema.org)
Implementar JSON-LD dinámico según la página:

1.  **En la Home (`SoftwareApplication`):** Ya existe, pero se puede enriquecer con `aggregateRating` (si tienes reseñas) o `featureList`.
2.  **En las Landing Pages (`FAQPage`):**
    - Pregunta: "¿Qué es una revolución solar?"
    - Respuesta: (Tu definición experta).
    - *Esto aumenta la probabilidad de aparecer en los fragmentos destacados (Featured Snippets).*
3.  **En la Biblioteca (`Article` o `TechArticle`):**
    - Para las páginas de interpretación (ej. Sol en Aries).
    - Define claramente que es contenido educativo sobre astrología.

### Formato de Respuesta Directa
En las páginas de la Biblioteca, estructurar el contenido para que sea fácil de "leer" por la IA:
- Usar listas (`<ul>`, `<ol>`) para características.
- Usar negritas `<strong>` en las palabras clave semánticas (ej. **"independencia"**, **"iniciativa"** para Aries).
- Párrafos cortos y concisos al inicio (definición TL;DR).

---

## 4. Experiencia de Usuario (UX & Engagement)

### Navegación y Enlazado Interno
- **Footer Expandido:** En lugar de un footer vacío, crear un "Mapa del Sitio" visual con enlaces a:
    - Calculadoras (Carta, Tránsitos, etc.)
    - Biblioteca (Signos, Planetas, Casas)
- **Migas de Pan (Breadcrumbs):** Esenciales para la navegación en la sección de Biblioteca.
    - *Inicio > Biblioteca > Planetas > Sol > Aries*

### Velocidad y Retención
- Al migrar Tailwind a build estático, la carga inicial será instantánea.
- **Call to Action (CTA):** En las páginas de la Biblioteca, añadir siempre un botón flotante o visible: *"¿Tienes esta posición? Calcula tu carta completa gratis aquí"*.

---

## 5. Hoja de Ruta Priorizada (Roadmap)

### Fase 1: Cimientos Técnicos (Impacto: ALTO | Esfuerzo: BAJO)
1.  [ ] **Build de Tailwind:** Configurar PostCSS y eliminar el script CDN.
2.  [ ] **React Router:** Instalar y configurar las rutas base (`/`, `/carta-natal`, `/profecciones`, etc.).
3.  [ ] **Metaetiquetas:** Instalar `react-helmet-async` para títulos dinámicos.

### Fase 2: Despliegue de Contenido (Impacto: MUY ALTO | Esfuerzo: MEDIO)
1.  [ ] **Landing Pages:** Redactar y maquetar las páginas explicativas para cada tab de la app.
2.  [ ] **FAQ Schema:** Añadir datos estructurados a estas landings.

### Fase 3: La Biblioteca (Impacto: MASIVO | Esfuerzo: ALTO)
1.  [ ] **Rutas Dinámicas:** Crear la lógica de routing para `/biblioteca/:planeta/:signo/:casa`.
2.  [ ] **Generación de Páginas:** Crear el componente que lee los JSON existentes y los renderiza como artículos legibles.
3.  [ ] **Interlinking:** Conectar estas páginas entre sí y con la calculadora.

---

**Conclusión del Auditor:**
MetaReiki Astro tiene el potencial de dominar el nicho de "Astrología Helenística Técnica" en español. El contenido ya está escrito (en el código); la tarea es puramente de arquitectura para hacerlo visible al mundo.
