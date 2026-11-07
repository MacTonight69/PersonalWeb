# Base del proyecto — Página personal

**Versión:** 3.6

**Estado:** Sitio dividido en Side A y Side B; Side A con ambientación VHS, escritura progresiva en CM, cerebro 3D en la transición interna, cabeza giratoria en CD, páginas de sección y CP adaptable en escritorio
**Tipo de proyecto:** Sitio web personal estático

---

## 1. Qué es la página

La página personal es un sitio estático de presentación que reúne información sobre el propietario, su formación, su experiencia y las distintas secciones que se irán incorporando.

A partir de esta versión, el sitio está dividido en dos caras visualmente opuestas:

- **Side A:** una versión oscura con estética de cinta VHS deteriorada, inspirada en el terror analógico y en *Serial Experiments Lain*.
- **Side B:** la versión clara y neutral que existía antes de la división, conservada como base para su desarrollo futuro.

La página de inicio (`/`) es **Side A**. El botón fijo de la esquina superior derecha permite viajar entre ambas caras.

Por el momento, **el texto de contenido es el mismo en ambos lados**. La diferencia está en la ambientación, los colores, la tipografía, las imágenes y los efectos.

---

## 2. Stack tecnológico

| Tecnología | Función |
|---|---|
| Astro 7.4.7 | Framework principal y generación estática |
| TypeScript | Tipado y organización del código |
| HTML5 | Estructura semántica |
| CSS3 | Diseño, distribución, animaciones y filtro VHS |

### Restricciones actuales

- No hay backend.
- No hay base de datos.
- No hay sistema de autenticación.
- La salida es estática (`output: 'static'`).
- No se utiliza React ni otro framework de interfaz.
- No se incorporan bibliotecas externas de diseño.
- El filtro VHS se implementa con CSS y una textura SVG, sin Canvas ni WebGL.
- El JavaScript de cliente se limita a tareas puntuales: retirar la portada de entrada, escribir progresivamente el título y el texto de CM, gestionar la transición interna de 0,88 s con el SVG y omitir la portada completa cuando se llega desde una transición interna.

### Dependencias del proyecto

- `astro`
- `typescript`

### Recursos incorporados

- Fuente `EASVHS` (`easvhs.ttf`), gratuita para uso personal y comercial según indicación del propietario.
- Animación de carga `carga_vhs.svg`.
- Introducción `Intro_Side_A.gif`.
- Transición entre secciones: cerebro giratorio en three.js, con `spinning_brain.svg` como reserva si no hay WebGL.
- Imagen de perfil `PFP_Side_A.gif`.
- Banner glitch animado `banner_glitch_CA.svg`.

---

## 3. Rutas y cambio de lado

| Ruta | Lado | Descripción |
|---|---|---|
| `/` | Side A | Página de inicio; incluye la entrada VHS |
| `/side-b` | Side B | Versión clara y neutral original |
| `/perfil-profesional` | Side A | Sección Perfil Profesional |
| `/formacion` | Side A | Sección Formación |
| `/tecnologias` | Side A | Sección Tecnologías |
| `/proyectos` | Side A | Sección Proyectos |
| `/organizacion` | Side A | Sección Organización |
| `/vista-a-futuro` | Side A | Sección Vista a futuro |

El cambio de lado se realiza mediante el componente `SideSwitcher`, situado en la esquina superior derecha de la ventana y fuera de CP.

- En Side A se muestra **Side A** y el enlace lleva a `/side-b`.
- En Side B se muestra **Side B** y el enlace lleva a `/`.
- El botón es un enlace real estilizado como botón.
- Tiene una etiqueta accesible que indica el lado de destino.
- En Side A queda por encima del filtro VHS, por lo que permanece visible y utilizable.
- Las páginas de sección no muestran `SideSwitcher`; solo incluyen el botón `BACK`, CP, el título y el texto.

### Páginas de sección

Las seis rutas de sección se generan desde `src/pages/[section].astro` y comparten `src/layouts/SectionPageLayout.astro`.

Cada página contiene únicamente:

- Un botón `BACK` fijo en la esquina superior izquierda, que vuelve a `/`.
- El card principal CP, con la ambientación VHS de Side A.
- Un título grande y centrado con el nombre de la sección.
- El texto `En esta sección se hablará de mi [nombre_sección]`.

Los enlaces de CD llevan el atributo `data-section-link`. Al activarlos, `SectionTransition.astro` muestra un cerebro giratorio renderizado en three.js durante 0,88 segundos antes de navegar (con el SVG como imagen de reserva si falla WebGL). La portada completa de SVG y GIF no se repite en esas transiciones internas.

---

## 4. Estructura general de la interfaz

Todo el contenido visible se organiza dentro de un contenedor principal denominado **CP (Card Principal)**.

Dentro de CP existen cuatro subcontenedores:

| Contenedor | Nombre | Función actual |
|---|---|---|
| CA | Card superior | Banner que ocupa todo el tamaño de la tarjeta |
| CI | Card izquierda | Imagen de perfil y campos de información personal |
| CM | Card central | Título y texto de bienvenida |
| CD | Card derecha | Barra de navegación entre las secciones del sitio |

La distribución tiene dos niveles:

1. **CA** ocupa todo el ancho de CP en la parte superior.
2. Debajo, **CI**, **CM** y **CD** se distribuyen en tres columnas con proporciones **25 / 50 / 25**.

CA ocupa aproximadamente **una cuarta parte** de la altura de CP. Las tarjetas inferiores compensan el resto del espacio mediante una distribución de filas `1fr / 3fr`.

Esquema aproximado:

```text
┌──────────────────────────────────────────────┐
│ CP                                           │
│  ┌────────────────────────────────────────┐  │
│  │ CA — Banner                            │  │
│  └────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────────────┐  ┌────┐  │
│  │ CI  25 % │  │ CM      50 %     │  │ CD │  │
│  │          │  │                  │  │25 %│  │
│  └──────────┘  └──────────────────┘  └────┘  │
└──────────────────────────────────────────────┘
```

### CP — Card Principal

- Fondo adaptable al lado: blanco en Side B, negro en Side A.
- Borde de 1 px: negro en Side B, lapislázuli en Side A.
- Esquinas redondeadas.
- Margen lateral de **100 px** en escritorio.
- Margen superior de **50 px**.
- Margen inferior de **40 px** (`2.5rem`).
- Padding interior de **24 px** (`1.5rem`).
- Separación uniforme entre tarjetas de **20 px** (`1.25rem`).
- Altura mínima adaptable al contenido y al alto de la ventana.
- Implementación mediante CSS Grid, sin posicionamientos absolutos para la distribución principal.

---

## 5. Contenido de las tarjetas

El contenido textual es idéntico en ambos lados y no se ha modificado en esta etapa.

### 5.1. CA — Card superior (banner)

- Contiene un banner que ocupa el 100 % del ancho y del alto de la tarjeta.
- La tarjeta no tiene padding para que la imagen llegue hasta sus bordes.
- La imagen se recorta con `object-fit: cover`.
- Texto alternativo: `Banner de la página`.

Variantes:

| Lado | Archivo |
|---|---|
| Side A | `public/images/banner_glitch_CA.svg` |
| Side B | `public/images/banner-placeholder.svg` |

El banner de Side A es un SVG animado con efecto glitch, texto propio y la paleta lapislázuli del lado. El de Side B es el marcador neutro original. En pantallas de hasta 864 px, el banner de Side A se muestra completo con `object-fit: contain` para no recortar su texto; en escritorio utiliza `cover`.

### 5.2. CI — Card izquierda

Contiene, de arriba hacia abajo:

1. Una imagen pequeña de perfil.
2. Una lista de campos informativos.

La lista no utiliza viñetas ni numeración. Cada campo muestra dos niveles:

- Un título con mayor grosor de fuente.
- Un texto simple con el valor correspondiente.

Campos y valores actuales:

- **Usuario**: Mr. Anatema
- **Nombre**: Bautista Alejandro Cafferata
- **Fecha de nacimiento**: 15 ene. 2008
- **País**: Argentina
- **Idiomas**: ES nat. & ENG bas.

Variantes de la imagen:

| Lado | Archivo | Reproducción | Tamaño |
|---|---|---|---|
| Side A | `public/media/PFP_Side_A.gif` | Automática, en bucle, sin controles | Ancho completo de CI, altura proporcional |
| Side B | `public/images/profile-placeholder.svg` | Imagen estática | Tamaño reducido original |

### 5.3. CM — Card central

Contiene el bloque de bienvenida, centrado vertical y horizontalmente:

**Título:**

> Layer: 88

**Texto:**

> Es posible que esté usted confundido. Tal vaz casi tanto como yo. Si quiere descrubrir quién soy yo, tal vez esta información le sea de ayuda. Tenga cuidado por donde mira: Dios nos está mirando...

El título utiliza un elemento `h1`, por lo que constituye el encabezado principal de la página.

### 5.4. CD — Card derecha (navegación)

Funciona como barra de navegación entre las diferentes páginas o apartados del sitio.

Contiene:

- Un título grande con el texto **NAVY**.
- Una lista vertical de seis enlaces:
  - Perfil Profesional
  - Formación
  - Tecnologías
  - Proyectos
  - Organización
  - Vista a futuro

Los elementos son enlaces reales (`<a>`), no simple texto. Actualmente apuntan a las rutas:

```text
/perfil-profesional
/formacion
/tecnologias
/proyectos
/organizacion
/vista-a-futuro
```

Estas rutas ya tienen páginas implementadas mediante `src/pages/[section].astro`. Los destinos se definen en el arreglo `sections` de `src/components/RightCard.astro` y se marcan con `data-section-link` para activar la transición GIF.

En Side A, debajo de la lista y separada de ella, CD muestra `public/media/spin_head.svg` ocupando todo el ancho de la tarjeta. Es un SVG animado que se reproduce automáticamente, en bucle y sin controles. En Side B la animación no se muestra, para conservar el diseño claro original.

---

## 6. Side A — ambientación VHS

### 6.1. Entrada a la página

Al entrar en Side A se ejecuta una secuencia de presentación antes de mostrar la página:

1. Se reproduce `carga_vhs.svg` durante **6 segundos**, completando su ciclo principal de carga.
2. Durante **0,5 segundos** se muestra `Intro_Side_A.gif`.
3. A los **6,5 segundos** se retira la portada y aparece la página.

La secuencia se implementa con animaciones CSS en `SideAIntro.astro`. Un pequeño script retira el contenedor al finalizar para que no interfiera con la página.

- La animación de carga y la introducción están precargadas.
- La portada tiene `aria-hidden="true"` y no aporta contenido textual.
- La portada no bloquea clics (`pointer-events: none`).
- Con `prefers-reduced-motion: reduce`, la portada se oculta por completo y la página aparece de inmediato.

La secuencia completa de `carga_vhs.svg` + `Intro_Side_A.gif` se reserva para:

- La entrada inicial a una página de Side A.
- El regreso a Side A desde Side B.

Las transiciones internas entre `/`, las secciones y `BACK` usan un **cerebro 3D giratorio en three.js** durante **0,88 segundos**: dos hemisferios con giros procedurales generados por ruido de valor, cisura longitudinal, cerebelo con folias y tronco encefálico, renderizados con superficie oscura oclusiva, anillos de latitud azules y halo radial en la paleta de Side A. El SVG original se conserva como imagen de reserva cuando WebGL no está disponible. Para evitar que la portada completa vuelva a ejecutarse al llegar a la página de destino, la transición guarda una marca temporal en `sessionStorage` que el layout consume antes de renderizar la portada.

En CM, tanto el título **Layer: 88** como el párrafo se escriben carácter por carácter al quedar visible la página. Primero aparece el título y después el párrafo, con un cursor intermitente. Con `prefers-reduced-motion: reduce`, el contenido aparece completo sin animación. El texto completo permanece accesible mediante etiquetas ARIA mientras se reproduce el efecto visual.

### 6.2. Colores

| Elemento | Color |
|---|---|
| Fondo general | Negro (`#000000`) |
| Fondo de CP y subcards | Negro (`#000000`) |
| Bordes | Lapislázuli oscuro (`#26619c`) |
| Títulos y texto resaltado | Lapislázuli (`#3b7bc4`) |
| Texto informativo | Azul claro (`#9dc7f0`) |
| Botón de cambio de lado | Fondo negro semitransparente, borde y texto azul |

Los títulos incluyen el `h1` de bienvenida, los títulos de los campos, el título **NAVY** y los enlaces de navegación. Los valores de los campos y el párrafo de bienvenida usan el azul informativo más claro.

### 6.3. Tipografía

Se aplica la fuente **EASVHS** a todo el texto de Side A mediante `@font-face` y la variable `--font-sans`.

Archivo:

```text
public/fonts/easvhs.ttf
```

La fuente no incluye glifos acentuados ni el signo de grado. Como el texto no debe modificarse, esos caracteres recurren a una fuente de respaldo monoespaciada (`Courier New`, `monospace`). El resto del texto utiliza EASVHS.

### 6.4. Filtro VHS

El filtro se implementa en:

- `src/components/VhsOverlay.astro`
- `src/styles/vhs.css`

Solamente se importa desde `SideALayout.astro`. Side B no lo renderiza ni lo inicializa.

Características:

- Capa fija que cubre toda la ventana (`position: fixed; inset: 0`).
- `pointer-events: none`: no bloquea clics, enlaces, scroll ni controles.
- `z-index: 100`: queda por encima de la página, pero por debajo del botón de cambio de lado (`z-index: 300`) y de la portada de entrada (`z-index: 1000`).
- No modifica el flujo, las dimensiones ni la estructura HTML de CP.
- No se aplica a Side B.

Efectos incluidos:

1. **Scanlines:** líneas horizontales sutiles con `repeating-linear-gradient` y desplazamiento lento.
2. **Noise:** textura SVG de ruido analógico con desplazamiento discreto.
3. **Chromatic aberration:** franjas de color sutiles en los bordes mediante gradientes y `box-shadow` internos.
4. **Flickering:** variaciones irregulares de luminosidad de baja intensidad.
5. **Tracking errors:** bandas horizontales ocasionales que recorren la pantalla.

Variables de ajuste:

```css
--vhs-scanline-opacity: 0.16;
--vhs-noise-opacity: 0.08;
--vhs-flicker-opacity: 0.035;
--vhs-aberration-offset: 1px;
--vhs-tracking-opacity: 0.16;
```

Con `prefers-reduced-motion: reduce` se desactivan las animaciones, se ocultan el parpadeo y las bandas de tracking, y se reduce la intensidad del ruido. Los efectos estáticos restantes no perjudican la legibilidad.

---

## 7. Side B — versión clara

Side B conserva la base visual original:

- Fondo general blanco.
- Fondo de CP y subcards blanco.
- Bordes negros de 1 px.
- Títulos y texto en negro.
- Tipografía sans-serif genérica del sistema.
- Banner neutro de marcador de posición.
- Imagen de perfil estática de marcador de posición.
- Sin animación de entrada.
- Sin filtro VHS.
- Mismo contenido textual y misma estructura de tarjetas que Side A.

Side B está preparada para evolucionar de forma independiente en una etapa posterior.

---

## 8. Comparación visual

| Propiedad | Side A | Side B |
|---|---|---|
| Fondo | Negro | Blanco |
| Bordes | Lapislázuli | Negros |
| Títulos | Lapislázuli | Negros |
| Texto informativo | Azul claro | Negro |
| Tipografía | EASVHS | Sans-serif del sistema |
| Banner | Oscuro con glitch animado | Claro neutro |
| Imagen de perfil | GIF animado | SVG estático |
| Entrada animada | Sí | No |
| Filtro VHS | Sí | No |
| Botón superior | Side A | Side B |

---

## 9. Distribución y comportamiento responsivo

La distribución se implementa con **CSS Grid** y se adapta mediante media queries. Es común a ambos lados.

### Escritorio amplio (más de 1280 px)

- CP adapta sus márgenes laterales y verticales al tamaño de la ventana.
- La altura de CP se ajusta al espacio vertical disponible.
- CA ocupa todo el ancho.
- CI, CM y CD mantienen la proporción 25 / 50 / 25.
- La proporción se consigue con `grid-template-columns: 1fr 2fr 1fr`.
- La imagen de perfil se limita por altura y conserva su proporción para dejar espacio a los campos.
- Las animaciones de entrada y transición caben en la ventana sin recortar sus imágenes.

### Portátiles y tabletas grandes (hasta 1280 px)

- CP conserva las tres columnas, con márgenes, padding, separación y altura fluidos.
- En ventanas de hasta 672 px de alto se compactan la imagen de perfil y los campos.
- En alturas excepcionalmente bajas, CP puede extenderse y permitir scroll antes que recortar información.

### Tabletas (hasta 1024 px)

- Se conserva el comportamiento de escritorio hasta el breakpoint de 864 px.
- Los tamaños de texto y espacios se ajustan gradualmente al ancho y alto de la ventana.

### Tabletas pequeñas y móviles (hasta 864 px)

- El margen lateral se reduce a 24 px (`1.5rem`).
- Los márgenes superior e inferior pasan a 24 px (`1.5rem`).
- El padding interior de CP baja a 16 px (`1rem`).
- La separación entre tarjetas baja a 16 px (`1rem`).
- Las columnas pasan a una distribución vertical con este orden:
  1. CA.
  2. CI.
  3. CM.
  4. CD.
- CA, CM y CD conservan una altura mínima de 160 px (`10rem`).

### Móviles pequeños (hasta 480 px)

- El margen lateral se reduce a 12 px (`0.75rem`).
- Los márgenes superior e inferior se reducen a 12 px (`0.75rem`).

En todos los tamaños se evita el desbordamiento horizontal.

---

## 10. Estructura de archivos

```text
PersonalWeb/
├── public/
│   ├── fonts/
│   │   └── easvhs.ttf
│   ├── images/
│   │   ├── banner-placeholder.svg
│   │   ├── banner_glitch_CA.svg
│   │   └── profile-placeholder.svg
│   ├── media/
│   │   ├── carga_vhs.svg
│   │   ├── Intro_Side_A.gif
│   │   ├── spinning_brain.svg
│   │   └── PFP_Side_A.gif
│   └── textures/
│       └── vhs-noise.svg
│
├── src/
│   ├── components/
│   │   ├── MainCard.astro
│   │   ├── HeaderCard.astro
│   │   ├── LeftCard.astro
│   │   ├── CenterCard.astro
│   │   ├── RightCard.astro
│   │   ├── SideSwitcher.astro
│   │   ├── SideAIntro.astro
│   │   ├── SectionTransition.astro
│   │   └── VhsOverlay.astro
│   │
│   ├── layouts/
│   │   ├── SideALayout.astro
│   │   ├── SideBLayout.astro
│   │   └── SectionPageLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── side-b.astro
│   │   └── [section].astro
│   │
│   └── styles/
│       ├── global.css
│       ├── side-a.css
│       ├── section.css
│       └── vhs.css
│
├── resource/
│   ├── banner_glitch_CA.svg
│   ├── carga_vhs.svg
│   ├── Intro_Side_A.gif
│   ├── PFP_Side_A.gif
│   └── spinning_brain.svg
├── fonts/
│   └── easvhs.ttf
│
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── vhs_filther.md
└── base.md
```

Los archivos de `resource/` y `fonts/` son los originales de trabajo. El sitio utiliza las copias ubicadas en `public/`.

---

## 11. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `src/layouts/SideALayout.astro` | Documento HTML de Side A, tema oscuro, precarga de recursos, portada de entrada, filtro VHS y control opcional de `SideSwitcher` |
| `src/layouts/SideBLayout.astro` | Documento HTML de Side B, tema claro, sin filtro ni portada |
| `src/layouts/SectionPageLayout.astro` | Estructura de las páginas de sección: `BACK`, CP, título y texto |
| `src/pages/index.astro` | Página de inicio; renderiza Side A |
| `src/pages/side-b.astro` | Renderiza Side B |
| `src/pages/[section].astro` | Genera las seis rutas de sección desde `getStaticPaths` |
| `src/components/MainCard.astro` | Organiza las cuatro subcards y elige las imágenes según el lado |
| `src/components/HeaderCard.astro` | Banner superior; acepta imagen y texto alternativo |
| `src/components/LeftCard.astro` | Imagen de perfil y lista de campos personales |
| `src/components/CenterCard.astro` | Título y texto de bienvenida con animación de escritura accesible |
| `src/components/RightCard.astro` | Título NAVY y enlaces de navegación |
| `src/components/SideSwitcher.astro` | Botón fijo de cambio entre Side A y Side B |
| `src/components/SideAIntro.astro` | Secuencia completa de carga e introducción de Side A |
| `src/components/SectionTransition.astro` | Transición interna de 0,88 s con cerebro 3D en three.js y reserva SVG |
| `src/components/VhsOverlay.astro` | Capas visuales del filtro VHS |
| `src/styles/global.css` | Variables, estilos base, distribución de CP y reglas responsive |
| `src/styles/side-a.css` | Fuente EASVHS, tema oscuro, botón de Side A y omisión de la portada en transiciones |
| `src/styles/section.css` | Botón `BACK`, CP de sección, título y texto |
| `src/styles/vhs.css` | Efectos, animaciones y accesibilidad del filtro VHS |

Los estilos internos de las tarjetas están encapsulados en sus componentes. La estructura común, la distribución y los temas generales se controlan desde `global.css`, `side-a.css` y las variables CSS.

---

## 12. Ejecución del proyecto

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Rutas disponibles:

```text
http://localhost:4321/                    → Side A
http://localhost:4321/side-b              → Side B
http://localhost:4321/perfil-profesional  → Sección Perfil Profesional
http://localhost:4321/formacion           → Sección Formación
http://localhost:4321/tecnologias         → Sección Tecnologías
http://localhost:4321/proyectos           → Sección Proyectos
http://localhost:4321/organizacion        → Sección Organización
http://localhost:4321/vista-a-futuro      → Sección Vista a futuro
```

Generar la versión estática:

```bash
npm run build
```

Previsualizar la versión generada:

```bash
npm run preview
```

El resultado de la compilación se guarda en `dist/`.

---

## 13. Estado actual y pendientes

### Implementado

- Proyecto Astro con TypeScript y salida estática.
- División en Side A y Side B con layouts independientes.
- Página de inicio en Side A.
- Botón de cambio de lado en la esquina superior derecha, fuera de CP.
- Side B conserva el diseño claro original.
- Side A con fondo negro, bordes y títulos lapislázuli y texto informativo azul claro.
- Fuente EASVHS aplicada a Side A.
- Portada de entrada con `carga_vhs.svg` e `Intro_Side_A.gif`.
- Animación de escritura secuencial para el título y el texto de CM, con alternativa accesible y soporte de movimiento reducido.
- Imagen de perfil animada en Side A.
- Filtro VHS exclusivo de Side A con scanlines, ruido, aberración cromática, parpadeo y tracking.
- Seis páginas de sección con `BACK`, CP, título y texto.
- Transición interna de 0,88 s con cerebro giratorio en three.js, sin repetir la portada completa.
- Respeto de `prefers-reduced-motion`.
- Distribución responsive sin desbordamiento horizontal.

### Pendiente

- Definir el contenido definitivo de cada sección.
- Definir el diseño definitivo y el contenido propio de Side B.
- Incorporar el contenido biográfico y las secciones adicionales.
- Evaluar si la introducción de Side A debe reiniciar el GIF desde su primer fotograma.
- Valorar nuevas animaciones o transiciones entre páginas en etapas posteriores.

---

## 14. Convenciones para futuras ampliaciones

- Mantener una tarjeta por componente.
- Reutilizar la clase base `.card` para conservar la estructura común.
- Utilizar las variables CSS para temas, márgenes, padding y radios.
- Evitar duplicar estilos entre componentes.
- No usar posicionamiento absoluto para construir la distribución principal.
- Mantener los enlaces de navegación como enlaces reales.
- No importar `VhsOverlay` desde el layout de Side B.
- Mantener el filtro VHS como una capa independiente y con `pointer-events: none`.
- Respetar `prefers-reduced-motion` en cualquier animación nueva.
- Incorporar JavaScript únicamente cuando CSS no pueda resolver la necesidad.
- Utilizar `SideAIntro` y `VhsOverlay` como piezas autónomas de Side A.
