# Base del proyecto — Página personal

**Versión:** 4.9

**Estado:** Sitio dividido en Side A y Side B, con todo el texto visible en inglés; Side A con ambientación VHS, cerebro SVG animado en la transición interna, glitch en CD y páginas de sección con contenido real; Side B con fondo carmesí, intro de estrellas y Evangelion, transición Evangelion entre secciones, navegación temática con iconos, las secciones Games, Anime, Music y Literature con contenido e imágenes, banner sin borde, animación SVG carmesí en CD, una interacción de reproducción única en CM que termina con un mensaje de bienvenida y *Serial Experiments Lain* como origen declarado del sitio
**Tipo de proyecto:** Sitio web personal estático

---

## 1. Qué es la página

La página personal es un sitio estático de presentación que reúne información sobre el propietario, su formación, su experiencia y las distintas secciones que se irán incorporando.

A partir de esta versión, el sitio está dividido en dos caras visualmente opuestas:

- **Side A:** una versión oscura con estética de cinta VHS deteriorada, inspirada en el terror analógico y en *Serial Experiments Lain*.
- **Side B:** una versión carmesí y translúcida sobre una textura de fondo, con navegación temática, iconos pixel-art y una interacción inspirada en *The Legend of Zelda*.

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
- El JavaScript de cliente se limita a tareas puntuales: retirar las portadas de entrada, escribir progresivamente el título y el texto de CM de Side A, gestionar las transiciones internas con SVG/GIF, omitir la portada completa cuando se llega desde una transición interna y reproducir una sola vez el GIF de CM en Side B.

### Dependencias del proyecto

- `astro`
- `typescript`

### Recursos incorporados

- Fuente `EASVHS` (`easvhs.ttf`), gratuita para uso personal y comercial según indicación del propietario.
- Animación de carga `carga_vhs.svg`.
- Introducción `Intro_Side_A.gif`.
- Transición entre secciones: SVG animado del cerebro (`spinning_brain.svg`), sin Canvas ni WebGL.
- Imagen de perfil de Side A `PFP_Side_A.gif`.
- Banner glitch animado `banner_glitch_CA.svg`.
- Fondo de Side B `background_Side_B.jpg` (optimizado desde el PNG original).
- Imagen de perfil de Side B `PFP_Side_B.gif`, con fondo transparente.
- Banner de Side B `banner_sharingan_carmesi.svg`, con las pupilas del Sharingan en carmesí.
- Fotograma fijo `banner_Side_B_still.webp` y GIF `banner_Side_B.gif` para la interacción de CM en Side B.
- Imagen inferior de CD en Side B: `i_dont_know_carmesi.svg`, versión carmesí animada del personaje.
- Intro de Side B: `stars_storm.svg` seguido de `Evangelion.gif` durante 1 segundo.
- Transición entre secciones de Side B: `Evangelion.gif` durante 0,7 segundos.
- Iconos de Side B: `Games_icon.png`, `Anime_icon.png`, `Music_icon.png` y `Literature_icon.png`.
- Imágenes de contenido: `public/media/games/`, `public/media/anime/`, `public/media/literature/` y `public/media/music/`, en formato WebP.
- Los recursos heredados sin uso se retiraron de `public/`; sus originales se conservan en `resource/`.
- Los GIF transparentes de Side B usan disposal `Background` para evitar rastros entre fotogramas.
- Las animaciones SVG de Side B (`i_dont_know_carmesi.svg` y `banner_sharingan_carmesi.svg`) alternan fotogramas con `visibility` y `animate` nativo, sin JavaScript.

---

## 3. Rutas y cambio de lado

| Ruta | Lado | Descripción |
|---|---|---|
| `/` | Side A | Página de inicio; incluye la entrada VHS |
| `/side-b` | Side B | Versión carmesí con intro, navegación temática e interacción de reproducción en CM |
| `/side-b/games` | Side B | Sección Games con ensayo personal, imágenes y galería |
| `/side-b/anime` | Side B | Sección Anime con ensayo, grupos y portadas |
| `/side-b/music` | Side B | Sección Music con ensayo, grupos y portadas de álbumes |
| `/side-b/literature` | Side B | Sección Literature con ensayo, grupos y portadas de libros |
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

Cada página contiene:

- Un botón `BACK` fijo en la esquina superior izquierda, que vuelve a `/`.
- El card principal CP, con la ambientación VHS de Side A.
- Un título grande y centrado con el nombre de la sección.
- El contenido completo de la sección, definido en `src/content/sections.ts` y renderizado como párrafos, subtítulos o listas de tecnologías según corresponda.

Los enlaces de CD de Side A llevan el atributo `data-section-link`. Al activarlos, `SectionTransition.astro` muestra el SVG animado del cerebro durante 0,7 segundos antes de navegar. La portada completa de SVG y GIF no se repite en esas transiciones internas.

En Side B, los apartados de CD llevan el atributo `data-side-b-section-link`. Al activarlos, `SideBSectionTransition.astro` muestra `Evangelion.gif` durante 0,7 segundos antes de navegar. Las páginas de sección de Side B comparten el fondo y el tema carmesí, y un botón `BACK` que vuelve a `/side-b` usando la misma transición.

`SideBSectionPageLayout.astro` admite dos variantes. La variante `empty` muestra un único card centrado con el título y ya no se usa en ninguna ruta. La variante `article` amplía el ancho del card y deja sitio para contenido largo; la utilizan Games, Anime, Music y Literature junto con `GamesPage.astro`, `AnimePage.astro`, `MusicPage.astro` y `LiteraturePage.astro`.

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

La distribución tiene dos variantes:

**Side A** mantiene dos niveles:

1. **CA** ocupa todo el ancho de CP en la parte superior.
2. Debajo, **CI**, **CM** y **CD** se distribuyen en tres columnas con proporciones **25 / 50 / 25**.

CA ocupa aproximadamente **una cuarta parte** de la altura de CP. Las tarjetas inferiores compensan el resto del espacio mediante una distribución de filas `1fr / 3fr`.

Esquema aproximado de Side A:

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

**Side B** reorganiza las mismas piezas en tres columnas con proporciones **25 / 50 / 25**:

1. **CI** y **CD** ocupan las columnas laterales y toda la altura de CP.
2. **CA** (CU) ocupa la mitad superior de la columna central.
3. **CM** ocupa la mitad inferior de la columna central, con la misma altura que CA.

Esquema aproximado de Side B:

```text
┌──────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────┐  ┌────┐  │
│  │          │  │ CU — Banner      │  │    │  │
│  │          │  ├──────────────────┤  │    │  │
│  │ CI  25 % │  │ CM      50 %     │  │ CD │  │
│  │          │  │                  │  │25 %│  │
│  └──────────┘  └──────────────────┘  └────┘  │
└──────────────────────────────────────────────┘
```

### CP — Card Principal

- Fondo adaptable al lado: carmesí translúcido sobre la imagen de fondo en Side B, negro en Side A.
- Borde de 1 px: rosa carmesí translúcido en Side B, lapislázuli en Side A.
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

La estructura de CP es común, pero el contenido de CM y CD cambia según el lado. La barra superior y la card izquierda comparten campos, aunque cada lado usa sus propias imágenes.

### 5.1. CA — Card superior (banner)

- Contiene un banner que ocupa el 100 % del ancho y del alto de la tarjeta.
- La tarjeta no tiene padding para que la imagen llegue hasta sus bordes.
- Texto alternativo: `Page banner`.
- Side A usa `object-fit: cover` en escritorio y `contain` en pantallas de hasta 864 px para no recortar el texto del SVG.
- Side B usa `object-fit: contain` sin padding, de modo que el SVG ocupa todo el espacio posible dentro de su tarjeta.
- El banner de Side B no tiene borde ni sombra adicional.

Variantes:

| Lado | Archivo |
|---|---|
| Side A | `public/images/banner_glitch_CA.svg` |
| Side B | `public/media/banner_sharingan_carmesi.svg` |

El banner de Side A es un SVG animado con efecto glitch, texto propio y la paleta lapislázuli del lado. El de Side B es un SVG animado de 320 × 181 px (32 fotogramas, 3,2 s) con las pupilas del Sharingan en carmesí, integrado a sangre sobre la tarjeta mediante `object-fit: contain`. La tarjeta no añade borde ni sombra, de modo que el banner queda limpio contra el fondo carmesí.

### 5.2. CI — Card izquierda

Contiene, de arriba hacia abajo:

1. Una imagen o animación de perfil.
2. Una lista de campos informativos.

La lista no utiliza viñetas ni numeración. Cada campo muestra dos niveles:

- Un título con mayor grosor de fuente.
- Un texto simple con el valor correspondiente.

Campos y valores actuales:

- **User**: Mr. Anatema
- **Name**: Bautista Alejandro Cafferata
- **Date of birth**: Jan 15, 2008
- **Country**: Argentina
- **Languages**: Native Spanish & basic English

Variantes de la imagen:

| Lado | Archivo | Reproducción | Tamaño |
|---|---|---|---|
| Side A | `public/media/PFP_Side_A.gif` | Automática, en bucle, sin controles | Ancho completo de CI, altura proporcional |
| Side B | `public/media/PFP_Side_B.gif` | Automática, en bucle, sin controles, con fondo transparente | Ancho completo de CI, limitado por altura; alineada en la parte superior con margen |

En Side B la imagen lleva un borde rosa, esquinas redondeadas y una sombra suave para integrarse como una calcomanía sobre la tarjeta carmesí. Se alinea en la parte superior de CI con un margen que la separa de los bordes, y los campos informativos quedan debajo.

### 5.3. CM — Card central

El contenido cambia según el lado:

**Side A:** bloque de bienvenida con escritura progresiva.

> **Layer: 088**

> You may be confused. Perhaps almost as much as I am. If you wish to discover who I am, perhaps this information will be of help. Be careful: they are watching us.

El título utiliza un elemento `h1` y la animación de typewriter se mantiene con acceso ARIA y alternativa bajo `prefers-reduced-motion`.

**Side B:** sin efectos de escritura. Muestra un título fijo:

> **It's dangerous to go alone! Take this**

Debajo se muestra el primer fotograma del banner, guardado como `public/media/banner_Side_B_still.webp`, presentado como un botón accesible. Al hacer clic, el still se sustituye por `public/media/banner_Side_B.gif` y el GIF se reproduce una sola vez desde el principio. A los 2700 ms —el GIF dura 2,56 s, por lo que se oculta 100 ms antes de que vuelva al primer fotograma— el bloque completo se oculta y el botón se deshabilita; no vuelve a mostrarse hasta recargar la página. Con `prefers-reduced-motion: reduce`, el clic oculta el bloque sin reproducir el GIF. El GIF se carga de forma diferida en el momento del clic y se oculta con `aria-hidden="true"`. Al terminar la interacción, el título también se oculta junto con el GIF y CM muestra un bloque final con el título **What's up** y un texto sobre sus aficiones, preferencias y actividades fuera del trabajo y los estudios.

### 5.4. CD — Card derecha (navegación)

El contenido cambia según el lado.

**Side A:** título **NAVY** y lista vertical de seis enlaces:

- Professional Profile
- Education
- Technologies
- Projects
- Organization
- Future Vision

Los elementos son enlaces reales (`<a>`) y apuntan a las rutas:

```text
/perfil-profesional
/formacion
/tecnologias
/proyectos
/organizacion
/vista-a-futuro
```

Estas rutas tienen páginas implementadas mediante `src/pages/[section].astro`. Los títulos, el orden y el contenido se definen en `src/content/sections.ts`; `RightCard.astro` consume `sectionNav` y los enlaces se marcan con `data-section-link` para activar la transición. Los slugs se mantienen en español, aunque el texto visible está en inglés.

Debajo de la lista, CD muestra `public/media/spin_head.svg` a ancho completo, en bucle y sin controles. Cada enlace aplica un glitch cromático al pasar el cursor o recibir foco, sin subrayado.

**Side B:** título **YES** y lista vertical de cuatro enlaces:

- Games
- Anime
- Music
- Literature

Cada apartado es un enlace real con un icono pixel-art a la izquierda y apunta a `/side-b/<slug>`. Los enlaces llevan `data-side-b-section-link` y activan la transición con `Evangelion.gif` de 0,7 segundos. Los iconos son `Games_icon.png`, `Anime_icon.png`, `Music_icon.png` y `Literature_icon.png`. Los iconos llevan un resplandor suave para mantener la legibilidad de las piezas oscuras sobre el carmesí.

Debajo de la lista, CD muestra `public/media/i_dont_know_carmesi.svg`, una animación SVG carmesí de 160 × 160 px (49 fotogramas, 6,47 s) sobre fondo negro. Su tamaño es `clamp(9rem, 26vh, 17rem)` para ganar presencia en la tarjeta. Comparte con la imagen de CI el borde rosa de 2 px, las esquinas redondeadas y la sombra suave.

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

Las transiciones internas entre `/`, las secciones y `BACK` usan el **SVG animado del cerebro** (`spinning_brain.svg`) durante **0,7 segundos**. El SVG incluye su propio texto `Loading ...` y se muestra a pantalla completa con `object-fit: contain`, sin Canvas ni WebGL. Para evitar que la portada completa vuelva a ejecutarse al llegar a la página de destino, la transición guarda una marca temporal en `sessionStorage` que el layout consume antes de renderizar la portada.

En CM de Side A, tanto el título **Layer: 088** como el párrafo se escriben carácter por carácter al quedar visible la página. Primero aparece el título y después el párrafo, con un cursor intermitente. Con `prefers-reduced-motion: reduce`, el contenido aparece completo sin animación. El texto completo permanece accesible mediante etiquetas ARIA mientras se reproduce el efecto visual. CM de Side B no usa typewriter.

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

## 7. Side B — versión carmesí

Side B tiene una identidad propia:

- Fondo general con `background_Side_B.jpg`, cubriendo la ventana y con desplazamiento fijo.
- CP y subcards con carmesí translúcido (`rgba(120, 6, 30, 0.3)`) y desenfoque de fondo.
- Bordes y títulos en rosa carmesí; texto en rosa claro.
- Tipografía sans-serif genérica del sistema.
- Banner superior con `banner_sharingan_carmesi.svg`, a sangre dentro de su tarjeta y sin borde adicional.
- CI con el perfil animado `PFP_Side_B.gif` en la parte superior, separado de los bordes por un margen, y los campos debajo.
- Intro de entrada: `stars_storm.svg` durante 4 segundos y `Evangelion.gif` durante 1 segundo.
- Transición entre secciones: `Evangelion.gif` durante 0,7 segundos, con una marca en `sessionStorage` para omitir la intro al volver a `/side-b`.
- CM con el título fijo «It's dangerous to go alone! Take this» y la reproducción única del GIF del banner, oculta 100 ms antes de que el GIF se reinicie; al terminar, el título también desaparece y aparece el mensaje **What's up** con la presentación de sus aficiones.
- CD con título **YES**, cuatro enlaces temáticos con iconos pixel-art e `i_dont_know_carmesi.svg` ampliado debajo de la lista.
- Games, Anime, Music y Literature con ensayo personal en inglés, imágenes y galerías de portadas.
- Anime incluye a *Serial Experiments Lain* como la obra que inspiró la creación del sitio.
- Sin filtro VHS.
- La estructura de CP y las dimensiones generales siguen siendo comunes a Side A, pero Side B usa una distribución propia: CI y CD a toda altura, CA y CM a la mitad de la columna central.

El fondo y los GIF se optimizaron para la web: el PNG original se convirtió a JPEG, los fondos blancos/negros de los GIF se volvieron transparentes y los GIF transparentes usan disposal `Background` para evitar el rastro de fotogramas anteriores. Los iconos se redujeron a 128 px.

Las imágenes de contenido se guardan en `public/media/<sección>/` en formato WebP, con un ancho máximo de 640 px (1100 px para la consola de Games). Las portadas, logotipos y marcas pertenecen a sus respectivos propietarios; la galería de Games incluye una nota al pie indicándolo.

Las páginas de contenido reutilizan tres piezas:

- `SideBMediaPage.astro`: cabecera introductoria, grupos con título y descripción, y cierre opcional.
- `SideBEntryGrid.astro`: rejilla responsive que alterna entre una y cuatro columnas según el layout.
- `SideBEntryCard.astro`: tarjeta de entrada con imagen, título, subtítulo y nota, en variantes `poster`, `cover` y `album`.

---

## 8. Comparación visual

| Propiedad | Side A | Side B |
|---|---|---|
| Fondo | Negro | Imagen carmesí oscura |
| Tarjetas | Negro opaco | Carmesí translúcido con blur |
| Bordes | Lapislázuli | Rosa carmesí |
| Títulos | Lapislázuli | Rosa carmesí |
| Texto informativo | Azul claro | Rosa claro |
| Tipografía | EASVHS | Sans-serif del sistema |
| Banner | SVG glitch animado | SVG carmesí del Sharingan sin borde adicional |
| Imagen de perfil | GIF animado | GIF animado transparente |
| CM | Typewriter «Layer: 088» | Título fijo y reproducción única del GIF |
| CD | NAVY + enlaces con glitch | YES + enlaces con iconos + i_dont_know_carmesi |
| Entrada animada | Sí | No |
| Filtro VHS | Sí | No |
| Botón superior | Side A | Side B |

---

## 9. Distribución y comportamiento responsivo

La distribución se implementa con **CSS Grid** y se adapta mediante media queries. La base es común a ambos lados; Side B sobrescribe las áreas y las filas en escritorio para dar a CI y CD toda la altura y repartir la columna central entre CA y CM.

### Escritorio amplio (más de 1280 px)

- CP adapta sus márgenes laterales y verticales al tamaño de la ventana.
- La altura de CP se ajusta al espacio vertical disponible.
- En Side A, CA ocupa todo el ancho.
- En Side A, CI, CM y CD mantienen la proporción 25 / 50 / 25.
- En Side B, CI y CD ocupan toda la altura, CA y CM se reparten la columna central en dos mitades iguales.
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
│   │   ├── spin_head.svg
│   │   ├── PFP_Side_A.gif
│   │   ├── PFP_Side_B.gif
│   │   ├── banner_Side_B.gif
│   │   ├── banner_Side_B_still.webp
│   │   ├── banner_sharingan_carmesi.svg
│   │   ├── i_dont_know_carmesi.svg
│   │   ├── background_Side_B.jpg
│   │   ├── stars_storm.svg
│   │   ├── Evangelion.gif
│   │   ├── Games_icon.png
│   │   ├── Anime_icon.png
│   │   ├── Music_icon.png
│   │   ├── Literature_icon.png
│   │   ├── games/
│   │   │   └── *.webp (21 imágenes: veinte juegos y la PlayStation 2)
│   │   ├── anime/
│   │   │   └── *.webp (20 portadas)
│   │   ├── literature/
│   │   │   └── *.webp (22 portadas)
│   │   └── music/
│   │       └── *.webp (60 portadas de álbumes y retratos)
│   └── textures/
│       └── vhs-noise.svg
│
├── src/
│   ├── components/
│   │   ├── MainCard.astro
│   │   ├── HeaderCard.astro
│   │   ├── LeftCard.astro
│   │   ├── CenterCard.astro
│   │   ├── SideBCenterCard.astro
│   │   ├── GamesPage.astro
│   │   ├── AnimePage.astro
│   │   ├── MusicPage.astro
│   │   ├── LiteraturePage.astro
│   │   ├── SideBMediaPage.astro
│   │   ├── SideBEntryGrid.astro
│   │   ├── SideBEntryCard.astro
│   │   ├── RightCard.astro
│   │   ├── SideBNavCard.astro
│   │   ├── SideSwitcher.astro
│   │   ├── SideAIntro.astro
│   │   ├── SideBIntro.astro
│   │   ├── SectionTransition.astro
│   │   ├── SideBSectionTransition.astro
│   │   └── VhsOverlay.astro
│   │
│   ├── content/
│   │   ├── sections.ts
│   │   ├── sideBSections.ts
│   │   ├── anime.ts
│   │   ├── music.ts
│   │   └── literature.ts
│   │
│   ├── layouts/
│   │   ├── SideALayout.astro
│   │   ├── SideBLayout.astro
│   │   ├── SideBSectionPageLayout.astro
│   │   └── SectionPageLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── side-b.astro
│   │   ├── side-b/
│   │   │   └── [section].astro
│   │   └── [section].astro
│   │
│   └── styles/
│       ├── global.css
│       ├── side-a.css
│       ├── side-b.css
│       ├── section.css
│       └── vhs.css
│
├── resource/
│   ├── Anime_icon.png
│   ├── Art_icon.svg
│   ├── Evangelion.gif
│   ├── Games_icon.png
│   ├── Intro_Side_A.gif
│   ├── Knowledge_icon.png
│   ├── Literature_icon.png
│   ├── Music_icon.png
│   ├── PFP_Side_A.gif
│   ├── PFP_Side_B.gif
│   ├── background_Side_B.png
│   ├── banner_glitch_CA.svg
│   ├── banner_Side_B.gif
│   ├── banner_sharingan.gif
│   ├── banner_sharingan_carmesi.svg
│   ├── carga_vhs.svg
│   ├── i_dont_know.gif
│   ├── i_dont_know_carmesi.svg
│   ├── master_sword.png
│   ├── ness.gif
│   ├── pick_master_sword.gif
│   ├── spin_head.svg
│   ├── spinning_brain.svg
│   ├── stars_storm.svg
│   └── teto.png
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
| `src/layouts/SideBLayout.astro` | Documento HTML de Side B, fondo carmesí, tema translúcido, transición entre secciones y control opcional de `SideSwitcher` |
| `src/layouts/SideBSectionPageLayout.astro` | Estructura de las páginas de sección de Side B: `BACK`, card, título y variantes `empty` y `article` |
| `src/layouts/SectionPageLayout.astro` | Estructura de las páginas de sección de Side A: `BACK`, CP, título y bloques de contenido |
| `src/pages/index.astro` | Página de inicio; renderiza Side A |
| `src/pages/side-b.astro` | Renderiza la portada de Side B con su intro |
| `src/pages/side-b/[section].astro` | Genera las cuatro rutas de sección de Side B desde `getStaticPaths` y elige el componente de contenido según el slug |
| `src/pages/[section].astro` | Genera las seis rutas de sección de Side A desde `getStaticPaths` |
| `src/content/sections.ts` | Contenido estructurado de las seis secciones de Side A y orden de navegación |
| `src/content/sideBSections.ts` | Títulos, slugs e iconos de las cuatro secciones de Side B |
| `src/content/anime.ts` | Introducción y grupos de la sección Anime |
| `src/content/music.ts` | Introducción y grupos de la sección Music |
| `src/content/literature.ts` | Introducción, grupos y cierre de la sección Literature |
| `src/components/MainCard.astro` | Organiza las cuatro subcards y elige componentes e imágenes según el lado |
| `src/components/HeaderCard.astro` | Banner superior; acepta imagen y texto alternativo |
| `src/components/LeftCard.astro` | Imagen de perfil y lista de campos personales |
| `src/components/CenterCard.astro` | CM de Side A: título y texto de bienvenida con typewriter accesible |
| `src/components/SideBCenterCard.astro` | CM de Side B: título fijo, fotograma pausado y reproducción única del GIF |
| `src/components/GamesPage.astro` | Contenido de Games: ensayo, imágenes intercaladas, bloque de Crazy Zombie y galería de veinte juegos |
| `src/components/AnimePage.astro` | Contenido de Anime: introducción y grupos con portadas |
| `src/components/MusicPage.astro` | Contenido de Music: introducción y grupos con portadas de álbumes |
| `src/components/LiteraturePage.astro` | Contenido de Literature: introducción, grupos y cierre |
| `src/components/SideBMediaPage.astro` | Layout de artículo para las secciones de contenido de Side B |
| `src/components/SideBEntryGrid.astro` | Rejilla responsive de entradas con imágenes |
| `src/components/SideBEntryCard.astro` | Tarjeta de entrada con imagen, título, subtítulo y nota |
| `src/components/RightCard.astro` | CD de Side A: título NAVY, enlaces con glitch y `spin_head.svg` |
| `src/components/SideBNavCard.astro` | CD de Side B: título YES, enlaces con iconos e `i_dont_know_carmesi.svg` |
| `src/components/SideSwitcher.astro` | Botón fijo de cambio entre Side A y Side B |
| `src/components/SideAIntro.astro` | Secuencia completa de carga e introducción de Side A |
| `src/components/SideBIntro.astro` | Intro de Side B: estrellas y Evangelion durante 5 s |
| `src/components/SectionTransition.astro` | Transición interna de Side A de 0,7 s con el SVG del cerebro |
| `src/components/SideBSectionTransition.astro` | Transición interna de Side B de 0,7 s con `Evangelion.gif` |
| `src/components/VhsOverlay.astro` | Capas visuales del filtro VHS |
| `src/styles/global.css` | Variables, estilos base, distribución de CP y reglas responsive |
| `src/styles/side-a.css` | Fuente EASVHS, tema oscuro, botón de Side A y omisión de la portada en transiciones |
| `src/styles/side-b.css` | Fondo de Side B, variables carmesí, transparencias y ajustes de imágenes |
| `src/styles/section.css` | Botón `BACK`, CP de sección y tipografía del contenido |
| `src/styles/vhs.css` | Efectos, animaciones y accesibilidad del filtro VHS |

Los estilos internos de las tarjetas están encapsulados en sus componentes. La estructura común, la distribución y los temas generales se controlan desde `global.css`, `side-a.css`, `side-b.css` y las variables CSS.

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
- Side B con fondo carmesí, tarjetas translúcidas y navegación temática propia.
- Side A con fondo negro, bordes y títulos lapislázuli y texto informativo azul claro.
- Fuente EASVHS aplicada a Side A.
- Portada de entrada con `carga_vhs.svg` e `Intro_Side_A.gif`.
- Animación de escritura secuencial para el título y el texto de CM de Side A, con alternativa accesible y soporte de movimiento reducido.
- CM de Side B con título fijo, fotograma pausado y reproducción única del GIF, con alternativa de movimiento reducido.
- Imágenes animadas propias en ambos lados.
- Intro de Side B con `stars_storm.svg` y `Evangelion.gif`.
- Transición entre secciones de Side B con `Evangelion.gif` de 0,7 segundos.
- Games con ensayo personal, imágenes intercaladas y galería de veinte juegos en `public/media/games/`.
- Anime con 20 portadas (incluida *Serial Experiments Lain*), Music con 60 y Literature con 22, organizadas en grupos y con texto en inglés.
- Music presenta al autor como guitarrista, tecladista, baterista, saxofonista y flautista, sin imágenes de instrumentos.
- Sistema reutilizable de páginas de contenido: `SideBMediaPage`, `SideBEntryGrid` y `SideBEntryCard`.
- Side B con CI y CD a toda altura, CA y CM a la mitad de la columna central.
- Banner de Side B con `banner_sharingan_carmesi.svg` a sangre y sin borde adicional.
- Imagen de CI alineada arriba con margen; CD comparte su borde, esquinas y sombra.
- CI de Side B con el perfil animado `PFP_Side_B.gif`.
- CD de Side B reducido a Games, Anime, Music y Literature, con `i_dont_know_carmesi.svg` ampliado.
- CM de Side B oculta el título y el GIF al terminar la interacción y muestra el mensaje **What's up**.
- Filtro VHS exclusivo de Side A con scanlines, ruido, aberración cromática, parpadeo y tracking.
- Seis páginas de sección de Side A con `BACK`, CP y contenido real.
- Transición interna de Side A de 0,7 s con el SVG animado del cerebro.
- CD de Side A con glitch cromático y CD de Side B con enlaces, iconos pixel-art e imagen inferior.
- Banner y GIF de Side B sin rastros de fotogramas anteriores.
- Respeto de `prefers-reduced-motion`.
- Distribución responsive sin desbordamiento horizontal.
- Depuración de recursos no utilizados y de código muerto, conservando los originales en `resource/`.

### Pendiente

- Evaluar si la introducción de Side A debe reiniciar el GIF desde su primer fotograma.
- Valorar nuevas animaciones o transiciones entre páginas en etapas posteriores.

---

## 14. Convenciones para futuras ampliaciones

- Mantener una tarjeta por componente.
- Reutilizar la clase base `.card` para conservar la estructura común.
- Utilizar las variables CSS para temas, márgenes, padding y radios.
- Evitar duplicar estilos entre componentes.
- No usar posicionamiento absoluto para construir la distribución principal.
- Mantener los enlaces de navegación de ambos lados como enlaces reales y con su atributo de transición correspondiente.
- No importar `VhsOverlay` ni `SectionTransition` desde el layout de Side B.
- Mantener el tema de Side B en `side-b.css` y los assets temáticos en `public/media/`.
- Al convertir GIF con transparencia, conservar el canvas completo y usar disposal `Background` para evitar rastros entre fotogramas.
- Mantener el filtro VHS como una capa independiente y con `pointer-events: none`.
- Respetar `prefers-reduced-motion` en cualquier animación nueva.
- Incorporar JavaScript únicamente cuando CSS no pueda resolver la necesidad.
- Utilizar `SideAIntro` y `VhsOverlay` como piezas autónomas de Side A.
