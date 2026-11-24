# Base del proyecto — Página personal

**Versión:** 6.0

**Estado:** Sitio de una sola página con dos identidades visuales conmutables y una cara oculta. Home y las seis secciones profesionales / cuatro secciones de ocio se escriben dentro de CM con efecto de tipeo. El cambio entre Side A y Side B usa un video de transición a pantalla completa; el cambio de sección usa un destello del GIF de entrada dentro del card. Los códigos fuera de las secciones de A/B introducen a Side C con un destello de 0,4 s. Cada lado tiene su propia identidad visual, y el texto de la sección activa en CD se cifra cada 0,5 s mientras está visible.

**Tipo de proyecto:** Sitio web personal estático.

---

## 1. Qué es la página

La página personal es un sitio estático de presentación que reúne información sobre el propietario, su formación, su experiencia, sus proyectos y sus intereses.

Todo vive en una única ruta, `/`. Sobre ese mismo documento se alternan dos caras y una cara oculta:

- **Side A:** fondo negro, paleta lapislázuli, fuente EASVHS, filtro VHS, banner glitch azul e intro de carga.
- **Side B:** fondo carmesí, paleta roja, retrato, animación y banner carmesí, sin filtro VHS.
- **Side C:** fondo completamente negro, retrato de Madotsuki, sin animación de CD y sin banner. Se entra solo mediante un código fuera de las secciones de A/B; el botón de CD pasa a mostrar **GO BACK**.

El botón de cambio de lado está dentro de CD, junto al título **NAVY**. En A/B alterna entre Side A y Side B con `transitions.mp4` a pantalla completa. En Side C muestra **GO BACK** y vuelve al lado desde el que se entró. Al cambiar de lado, CM vuelve al mensaje de bienvenida.

Las secciones no tienen rutas propias. Al pulsar una sección de CD, su texto se escribe en CM.

---

## 2. Stack tecnológico

| Tecnología | Función |
|---|---|
| Astro 7.4.7 | Framework principal y generación estática |
| TypeScript | Tipado y organización del código |
| HTML5 | Estructura semántica |
| CSS3 | Diseño, distribución, animaciones y filtro VHS |
| JavaScript de cliente | Tipeo, códigos, cambio de lado, Side C, transición y control de accesibilidad |

### Restricciones actuales

- No hay backend, base de datos ni autenticación.
- Salida estática (`output: 'static'`).
- No se usan React, Vue, Svelte ni bibliotecas externas de diseño.
- El filtro VHS se implementa con CSS y una textura SVG, sin Canvas ni WebGL.
- El video de transición es un archivo MP4 reproducible de forma nativa y se muestra completo, sin recortes ni deformación (`object-fit: contain`).
- El JavaScript de cliente se limita a una entrada (`src/scripts/app.ts`): tipeo, paneles de sección, códigos, cambio de tema, Side C, transición y saltos de accesibilidad.

### Dependencias

- `astro`
- `typescript`

### Recursos usados

- `EASVHS` (`public/fonts/easvhs.ttf`).
- `carga_vhs.svg` + `Intro_Side_A.gif` para la entrada de Side A.
- `Intro_Side_A.gif` también para el destello de 0,3 s dentro de CM antes de cada cambio de texto y para el destello a pantalla completa de 0,4 s al entrar en Side C.
- `banner_glitch.svg` como banner de Side A.
- `banner_glitch_B.svg` como banner de Side B. Ambos viven en `public/media/`.
- `PFP_Side_A.gif`, `PFP_Side_B.gif` y `PFP_Side_C.gif` como retratos de cada lado.
- `spin_head.svg` e `i_dont_know_carmesi.svg` como animaciones inferiores de CD en Side A y Side B.
- `transitions.mp4` como video de transición entre Side A y Side B.
- `vhs-noise.svg` para el ruido del filtro VHS.
- Trece imágenes de código en `public/images/`, nombradas con su propio código: `616.svg`, `333.svg`, `666.svg`, `369.svg`, `777.svg`, `1001.gif`, `1111.jpeg`, `312.jpeg`, `3301.jpeg`, `333333333.jpeg`, `53.jpeg`, `609.jpeg` y `79.jpeg`.
- Seis animaciones de código en `public/media/codes/`: `2004.mp4`, `69.mp4`, `123.mp4`, `321.mp4`, `88.mp4` y `888.mp4`, con sus enlaces de origen Tenor.
- `codes.md` como lista maestra de códigos, ordenada de mayor a menor, con sus enlaces.

No quedan recursos sin uso en `public/`: se retiraron `section.mp4`, `Side_C_anim.gif`, los nombres antiguos de las imágenes y los recursos del diseño anterior.

---

## 3. Ruta y cambio de lado

| Ruta | Descripción |
|---|---|
| `/` | Página única; contiene Side A, Side B y Side C |

El cambio de lado se realiza con `SideToggle.astro`, un `<button>` situado junto al título **NAVY** de CD.

- En Side A muestra **Side B**; en Side B muestra **Side A**; en Side C muestra **GO BACK**.
- Tiene `aria-label` y `title` acordes a la acción.
- Actualiza `data-side` en `<html>`, las variables de color, las listas de CD, la PFP de CI, el banner de CA, la animación de CD y `meta[name="theme-color"]`.
- No modifica la URL ni recarga la página.
- Al cambiar entre A y B, CM vuelve a Home y se apaga el cifrado de la navegación.
- En Side C, **GO BACK** vuelve al lado desde el que se entró, sin reproducir el video.

### Transición de cambio de lado

1. Se pulsa el botón de lado desde Side A o Side B.
2. Se muestra `transitions.mp4` a pantalla completa, completo y sin deformación, silenciado, durante sus 7,68 s.
3. Se puede saltar con clic, Escape, Enter o Espacio.
4. A los 0,5 s del inicio, el nuevo lado se aplica debajo de la capa: tema, banner, PFP, animación de CD, lista de secciones y Home. El cambio no se ve.
5. CM queda en Home y el cifrado de la navegación se apaga.
6. Al terminar el video —o al saltarlo— solo se retira la capa; el nuevo lado ya está montado.
7. Con `prefers-reduced-motion: reduce` el lado cambia de inmediato, sin video.

Durante el video la interfaz queda cubierta, por lo que no se puede iniciar otra acción. El cambio de sección no reproduce este video. La entrada a Side C usa `Intro_Side_A.gif` durante 0,4 s, no este video.

### Entrada y salida de Side C

- Se entra únicamente al enviar un código que no corresponde a ninguna sección de Side A o Side B.
- `Intro_Side_A.gif` cubre toda la pantalla durante 0,4 s; después se aplica el tema negro, la PFP de Madotsuki y el código se muestra en CM. Side C no tiene animación de CD.
- El botón de CD muestra **GO BACK** y vuelve al lado desde el que se entró.
- Side C no tiene banner ni lista de secciones: CA se oculta y CI/CM/CD ocupan toda la altura.
- Los códigos de sección siguen funcionando desde Side C y devuelven a la sección y al lado que correspondan.

---

## 4. Estructura de la interfaz

Todo el contenido visible vive dentro de **CP (Card Principal)**.

| Contenedor | Nombre | Función |
|---|---|---|
| CA | Card superior | Banner animado; azul en Side A y carmesí en Side B |
| CI | Card izquierda | Retrato y campos personales |
| CM | Card central | Bienvenida y texto de la sección activa |
| CD | Card derecha | Título NAVY, botón de lado, navegación y animación inferior en A/B |

Distribución en escritorio:

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

Side A y Side B comparten la distribución con CA arriba y CI/CM/CD en tres columnas. Side C oculta CA y reparte CI/CM/CD en toda la altura. El banner y los colores cambian según el lado.

### CP

- Fondo y borde según el lado.
- Esquinas redondeadas, margen lateral fluido y padding variable.
- Distribución con CSS Grid.
- En escritorio se ajusta a la altura de la ventana; en móvil se apila en una columna.

### CI

- Retrato según el lado: `PFP_Side_A.gif`, `PFP_Side_B.gif` o `PFP_Side_C.gif`.
- El retrato ocupa todo el ancho disponible de CI descontando su margen; la altura se calcula automáticamente y conserva la proporción original.
- Side A: margen de 8 px alrededor del retrato.
- Side B: margen de 18 px alrededor del retrato; el borde carmesí queda pegado a la imagen.
- Side C: mitad del ancho disponible, margen de 8 px, sin borde ni sombra, con renderizado pixelado para el GIF de Madotsuki.
- Campos: Usuario, Nombre, Fecha de nacimiento, País e Idiomas, con texto ligeramente mayor que en la versión anterior.
- En Side B la imagen tiene borde y sombra carmesí.
- Un clic sobre el retrato, en cualquiera de los tres lados, abre el código de acceso en CM.

### CM

- Estado inicial: **Home**, con **Layer: 088** y el texto de bienvenida.
- Estado de sección: título y contenido de la sección elegida.
- Estado de código: formulario numérico o resultado desbloqueado.
- En Side C, CM muestra la imagen o el texto aleatorio del código, sin bienvenida.
- El contenido tiene scroll interno cuando supera la altura del card.
- El texto visible se escribe progresivamente; una copia oculta conserva el texto completo para lectores de pantalla.
- El GIF de entrada se muestra dentro de CM durante 0,3 s antes de sustituir el texto; al entrar en Side C se muestra a pantalla completa durante 0,4 s.
- Un clic dentro de CM completa inmediatamente el tipeo en curso.

### CD

- Title **NAVY** (se conserva en los tres lados) y botón de cambio de lado en la misma fila.
- Side A: siete entradas de texto (Home + seis secciones), con glitch al pasar el cursor.
- Side B: cinco entradas de texto (Home + Games, Anime, Music, Literature), sin iconos ni viñetas.
- Side C: sin lista de secciones ni animación; solo conserva el título NAVY y **GO BACK**.
- Las listas son `role="tablist"`; cada enlace es un `role="tab"` con `aria-selected` y foco itinerante. El panel es CM (`role="tabpanel"`, `id="cm-panel"`).
- La flecha arriba/abajo, Home y End recorren las pestañas.
- El texto de la entrada activa se cifra cada 0,5 s mientras su sección está en CM. Home arranca cifrada al cargar la página.
- Sin subrayado en la entrada activa; se distingue por color y brillo.
- La animación inferior ocupa el 100% del ancho disponible de CD, con altura automática y proporción conservada.
- Side A: la animación va a sangre. Side B: lleva un padding de 18 px. Side C no muestra animación.
- En alturas ≤ 800 px se compactan el título y los gaps de CD para que la lista y la animación sigan cabiendo.
- Animación inferior: `spin_head.svg` en Side A, `i_dont_know_carmesi.svg` en Side B. Side C queda vacío.

---

## 5. Contenido de las secciones

El contenido está tipado en `src/content/`.

- `types.ts`: `SectionBlock`, `SectionContent`, `SectionEntry`.
- `sections.ts`: contenido de Side A y ensamblado de ambas listas.
- `sideB.ts`: ensayos completos de Games, Anime, Music y Literature como bloques de texto, sin galerías ni datos de portadas.

### Home

- Es la primera entrada de CD en Side A y Side B, y queda seleccionada al cargar y después de cambiar entre esos lados.
- Side A: **Layer: 088** y el texto de bienvenida original.
- Side B: **Layer: 088** y «Feel free to look and browse this entire website.»
- Al cargar la página, el texto de Home en CD ya está cifrándose.
- Al pulsarla se repite el destello del GIF y el tipeo de bienvenida.
- El texto de Home no se guarda en `sections.ts`: vive en `src/scripts/app.ts` porque comparte el estado inicial de CM.

### Secciones de Side A

| Slug | Título |
|---|---|
| `perfil-profesional` | Professional Profile |
| `formacion` | Education |
| `tecnologias` | Technologies |
| `proyectos` | Projects |
| `organizacion` | Organization |
| `vista-a-futuro` | Future Vision |

### Secciones de Side B

| Slug | Título |
|---|---|
| `games` | Games |
| `anime` | Anime |
| `music` | Music |
| `literature` | Literature |

Solo se traslada el texto de los ensayos. Las portadas, galerías y notas por elemento del diseño anterior no se renderizan.

### Future Vision en binario

La sección `vista-a-futuro` tiene `binary: true`. Su cuerpo se transforma en cliente a binario UTF-8: cada byte se convierte en 8 bits y se separa con espacios. El título de la sección y la copia accesible conservan el texto original. El resultado es un bloque largo en fuente monoespaciada con scroll interno.

---

## 6. Cambio de sección

1. El usuario pulsa una pestaña de CD (Home o una sección).
2. Se marca la pestaña como activa y se actualiza el nombre accesible de CM.
3. `Intro_Side_A.gif` cubre CM durante 0,3 s.
4. Se sustituye el contenido de CM y comienza el tipeo: 10 ms por paso, con varios caracteres por paso en textos largos para que el efecto no se eternice. Home conserva el tipeo de bienvenida (88 ms / 24 ms).
5. El texto de la pestaña activa empieza a cifrarse cada 0,5 s.
6. En móvil, CM se desplaza a la vista al terminar la transición.

El cambio de sección no reproduce `transitions.mp4`; ese video pertenece al cambio de lado.

Con `prefers-reduced-motion: reduce` no se muestra el GIF, el texto aparece completo y el cifrado de la navegación no se activa.

### Cifrado de la navegación activa

- Solo se aplica a la entrada de CD cuya sección está visible en CM.
- Arranca cifrada la entrada Home al cargar la página.
- Cambia cada 0,5 s entre ROT13, ROT7, Atbash, Vigenère con clave NAVY, una sustitución alfabética propia y dos mezclas que incluyen mayúsculas, minúsculas, dígitos y símbolos ASCII.
- Conserva la longitud exacta del texto y los espacios; no usa alfabetos árabes, japoneses ni emojis.
- El `aria-label` de cada pestaña conserva el nombre real, de modo que el cifrado es solo visual.
- Se apaga y restaura el texto original al cambiar de sección, volver a Home, cambiar de lado o comenzar la transición de lado.
- Con `prefers-reduced-motion: reduce` permanece apagado.

### Código de acceso

- Se activa con un clic sobre la PFP de CI, en cualquiera de los tres lados.
- CM sustituye su contenido por el formulario **Access code**: un campo numérico seguido de un botón **Submit**.
- Un envío vacío o no entero conserva el formulario y muestra una indicación. Un envío válido oculta el formulario y da paso al contenido.
- Códigos de sección, en el orden en que aparecen en CD:

| Código | Sección |
|---|---|
| 0 | Home del lado actual (o del lado desde el que se entró en Side C) |
| 1 | Professional Profile |
| 2 | Education |
| 3 | Technologies |
| 4 | Projects |
| 5 | Organization |
| 6 | Future Vision |
| 7 | Games |
| 8 | Anime |
| 9 | Music |
| 10 | Literature |

- Un código de sección cierra el formulario y abre la sección como un clic en CD, con su destello y su tipeo. Si la sección pertenece al otro lado, el sitio cambia de lado de inmediato —sin el video de transición— y luego abre la sección.
- Cualquier otro número entra en Side C: `Intro_Side_A.gif` cubre toda la pantalla durante 0,4 s y después se aplica el tema negro y la PFP de Madotsuki.
- Si el número coincide con una imagen de `public/images/`, CM muestra esa imagen completa, centrada y sin deformación, con el pie `CODE <número>`. Las imágenes se cargan solo al desbloquear su código.
- La imagen `333333333.jpeg` se resuelve por coincidencia exacta y no interfiere con el código de sección `3` ni con la imagen `333.svg`.

| Código | Archivo |
|---|---|
| 616 | `616.svg` |
| 333 | `333.svg` |
| 666 | `666.svg` |
| 369 | `369.svg` |
| 777 | `777.svg` |
| 1001 | `1001.gif` |
| 1111 | `1111.jpeg` |
| 312 | `312.jpeg` |
| 3301 | `3301.jpeg` |
| 333333333 | `333333333.jpeg` |
| 53 | `53.jpeg` |
| 609 | `609.jpeg` |
| 79 | `79.jpeg` |

- Códigos de animación Tenor. El video se reproduce silenciado y en bucle; debajo del pie aparece el enlace **TENOR // SOURCE**:

| Código | Archivo local | Enlace de origen |
|---|---|---|
| 2004 | `public/media/codes/2004.mp4` | https://tenor.com/view/yume-nikki-madotsuki-jump-ending-gif-26637933 |
| 69 | `public/media/codes/69.mp4` | https://tenor.com/view/rpgmaker-yume-nikki-rain-raining-madotsuki-gif-16609780199635110009 |
| 123 | `public/media/codes/123.mp4` | https://tenor.com/view/rumia-touhou-jumpscare-gif-17190961014119105366 |
| 321 | `public/media/codes/321.mp4` | https://tenor.com/view/rumia-dance-cute-fortnite-moves-gif-16580646 |
| 88 | `public/media/codes/88.mp4` | https://tenor.com/view/nra-88th-div-marching-gif-22780604 |
| 888 | `public/media/codes/888.mp4` | https://tenor.com/view/bouncing-marisa-fumo-marisa-kirisame-touhou-fumo-gif-16962360816851147092 |

- Si el número no coincide con ninguna imagen ni animación, CM escribe una frase aleatoria del conjunto de respuestas desconocidas, con el mismo tipeo del resto del sitio.
- `codes.md` recoge todos los códigos ordenados de mayor a menor, con sus vínculos locales o de Tenor.
- **GO BACK** vuelve al lado desde el que se entró en Side C. Abrir Home o una sección también cierra el resultado y limpia el formulario.
- Con `prefers-reduced-motion: reduce` el contenido aparece de inmediato, sin destello ni tipeo.

El tipeo del mensaje de bienvenida conserva los tiempos originales: 88 ms por carácter en el título y 24 ms en el párrafo.

---

## 7. Side A

- Fondo negro, bordes lapislázuli, títulos azules y texto azul claro.
- Fuente EASVHS; los caracteres sin glifo caen a `Courier New`.
- Intro de 6,5 s: 6 s de `carga_vhs.svg` y 0,5 s de `Intro_Side_A.gif`.
- Filtro VHS con scanlines, ruido, aberración cromática, parpadeo y tracking.
- Banner glitch azul (`/media/banner_glitch.svg`), visible completo en CA.
- Retrato animado.
- Glitch en los enlaces de CD al pasar el cursor o recibir foco.
- El filtro VHS se oculta por completo en Side B y Side C.

---

## 8. Side B

- Fondo `#140208` y superficies `#1b0209`.
- Bordes y títulos carmesí; texto claro rosado.
- Banner carmesí (`/media/banner_glitch_B.svg`) sobre fondo negro.
- Retrato `PFP_Side_B.gif` y animación `i_dont_know_carmesi.svg`.
- Navegación de texto, sin iconos ni viñetas.
- Sin filtro VHS, sin intro y sin glitch.
- Título NAVY conservado.
- El botón de CD alterna con Side A.

---

## 9. Side C

- Cara oculta a la que solo se accede con un código que no sea una sección de Side A o Side B.
- Fondo y superficies completamente negros; bordes blancos y texto blanco/gris.
- Sin banner: CA se oculta y CI, CM y CD ocupan toda la altura de CP.
- PFP `PFP_Side_C.gif` (Madotsuki girando), con renderizado pixelado.
- Sin lista de secciones ni animación: CD conserva NAVY y el botón **GO BACK**.
- CM muestra la imagen o el texto aleatorio del código que abrió la cara.
- El botón **GO BACK** vuelve al lado desde el que se entró.
- Sin filtro VHS, sin intro y sin glitch.

---

## 10. Accesibilidad

- `html lang="en"`.
- Pestañas con `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` y foco itinerante.
- CM como `role="tabpanel"` con `tabindex="0"` y `aria-labelledby` dinámico. En Side C, sin pestaña asociada, usa `aria-label="Hidden content"`.
- Región `aria-live="polite"` que anuncia la sección, el código aceptado o el código desconocido.
- Copia `sr-only` del texto completo de cada sección y descripción de la imagen desbloqueada.
- `aria-busy` en CM durante la transición.
- El botón **GO BACK** tiene `aria-label` y `title` propios.
- Foco visible en botones y pestañas.
- El cifrado de CD es visual: el `aria-label` de cada pestaña conserva siempre el nombre real.
- `prefers-reduced-motion` respetado en intro, video de lado, destello de sección, destello de entrada a Side C, tipeo, cifrado de navegación, VHS y glitch.
- El video de transición de lado está silenciado y no se anuncia a lectores de pantalla (`aria-hidden`).

---

## 11. Distribución responsive

- **Escritorio (> 864 px):** CP con CA + tres columnas 25/50/25 en Side A y Side B. El banner usa `contain` para mostrarse completo y sin deformación.
- **Side C:** CA se oculta y las tres columnas ocupan toda la altura; en móvil se apilan CI, CM y CD.
- **≤ 864 px:** márgenes de 24 px, CP apilado en CA, CI, CM y CD; CM limita su altura a 68 dvh y hace scroll interno.
- **Alturas ≤ 800 px:** el título y los gaps de CD se compactan; la PFP y la animación conservan su ancho completo.
- **≤ 480 px:** márgenes de 12 px.
- No hay desbordamiento horizontal en los tres lados.

---

## 12. Estructura de archivos

```text
PersonalWeb/
├── public/
│   ├── fonts/easvhs.ttf
│   ├── images/
│   │   ├── 616.svg
│   │   ├── 333.svg
│   │   ├── 666.svg
│   │   ├── 369.svg
│   │   ├── 777.svg
│   │   ├── 1001.gif
│   │   ├── 1111.jpeg
│   │   ├── 312.jpeg
│   │   ├── 3301.jpeg
│   │   ├── 333333333.jpeg
│   │   ├── 53.jpeg
│   │   ├── 609.jpeg
│   │   └── 79.jpeg
│   ├── media/
│   │   ├── banner_glitch.svg
│   │   ├── banner_glitch_B.svg
│   │   ├── carga_vhs.svg
│   │   ├── Intro_Side_A.gif
│   │   ├── PFP_Side_A.gif
│   │   ├── PFP_Side_B.gif
│   │   ├── PFP_Side_C.gif
│   │   ├── spin_head.svg
│   │   ├── i_dont_know_carmesi.svg
│   │   ├── transitions.mp4
│   │   └── codes/
│   │       ├── 2004.mp4
│   │       ├── 69.mp4
│   │       ├── 123.mp4
│   │       ├── 321.mp4
│   │       ├── 88.mp4
│   │       └── 888.mp4
│   └── textures/vhs-noise.svg
│
├── src/
│   ├── components/
│   │   ├── MainCard.astro
│   │   ├── HeaderCard.astro
│   │   ├── LeftCard.astro
│   │   ├── CenterCard.astro
│   │   ├── RightCard.astro
│   │   ├── SideToggle.astro
│   │   ├── SideAIntro.astro
│   │   ├── SideTransition.astro
│   │   └── VhsOverlay.astro
│   ├── layouts/BaseLayout.astro
│   ├── pages/index.astro
│   ├── content/
│   │   ├── types.ts
│   │   ├── sections.ts
│   │   └── sideB.ts
│   ├── scripts/app.ts
│   └── styles/
│       ├── global.css
│       ├── themes.css
│       └── vhs.css
│
├── .gitignore
├── astro.config.mjs
├── package.json
├── package-lock.json
├── skills-lock.json
├── tsconfig.json
├── base.md
├── codes.md
└── secrets.md
```

---

## 13. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `src/layouts/BaseLayout.astro` | Documento HTML, precargas, intro, transición, VHS y entrada del script |
| `src/pages/index.astro` | Página única |
| `src/scripts/app.ts` | Tipeo, paneles, pestañas, códigos, cambio de lado, Side C, video y accesibilidad |
| `src/components/MainCard.astro` | CP y composición de las cuatro subcards |
| `src/components/HeaderCard.astro` | Banner de CA; intercambia la variante A/B. En Side C se oculta |
| `src/components/LeftCard.astro` | Retrato y campos personales; datos y variantes A/B/C |
| `src/components/CenterCard.astro` | CM, bienvenida, secciones, formulario de códigos, resultado dinámico, datos serializados y destello |
| `src/components/RightCard.astro` | NAVY, listas A/B, botón de lado, GO BACK y animaciones A/B |
| `src/components/SideToggle.astro` | Botón de cambio entre Side A/Side B o GO BACK en Side C |
| `src/components/SideAIntro.astro` | Entrada VHS de 6,5 s |
| `src/components/SideTransition.astro` | Capa del video `transitions.mp4` |
| `src/components/VhsOverlay.astro` | Capas del filtro VHS |
| `src/content/types.ts` | Tipos del contenido |
| `src/content/sections.ts` | Contenido de Side A y listas de navegación |
| `src/content/sideB.ts` | Ensayos de Games/Anime/Music/Literature como bloques de texto |
| `src/styles/global.css` | Variables de distribución, base, CP y responsive |
| `src/styles/themes.css` | Paletas y distribución de Side A, Side B y Side C |
| `src/styles/vhs.css` | Efectos y accesibilidad del filtro VHS |
| `codes.md` | Lista maestra de códigos, ordenada de mayor a menor, con enlaces |

---

## 14. Ejecución

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build    # dist/
npm run preview
```

Verificación de tipos:

```bash
npx tsc --noEmit
```

---

## 15. Estado actual y pendientes

### Implementado

- Página única sin rutas de sección.
- Cambio de lado en el mismo documento.
- Home en Side A y Side B, con el texto inicial de CM y texto propio en Side B.
- Texto de sección en CM con tipeo y scroll interno.
- Destello del GIF dentro de CM.
- Transición con `transitions.mp4` a pantalla completa al cambiar entre Side A y Side B.
- El nuevo lado se aplica 0,5 s después de iniciar el video, oculto bajo la capa.
- Entrada a Side C con `Intro_Side_A.gif` de 0,4 s para cualquier código fuera de las secciones.
- Side C con fondo negro, PFP de Madotsuki, sin animación de CD, sin banner y con **GO BACK**.
- Cifrado cada 0,5 s de la entrada activa de CD, con longitud constante; Home arranca cifrada al cargar.
- Cifrados con letras, dígitos y símbolos ASCII.
- Banners glitch propios para Side A y Side B.
- Future Vision en binario.
- Paleta carmesí, retrato y animación de Side B.
- NAVY conservado en los tres lados.
- CD de Side B sin iconos ni viñetas.
- Sin subrayado en la pestaña activa y texto reducido en CI/CD.
- PFP de CI y animación de CD a ancho completo, con altura automática y proporción conservada.
- Márgenes diferenciados en la PFP de CI (8 px en A, 18 px en B, 8 px en C), PFP de C a la mitad del ancho y bordes blancos en las cards de Side C; padding de 18 px en la animación de CD de Side B.
- Texto de CI ligeramente mayor en los tres lados.
- Código de acceso oculto tras un clic en la PFP de CI: secciones de CD numeradas de 0 a 10, trece imágenes y seis animaciones Tenor desbloqueables, y respuesta aleatoria para códigos sin contenido.
- Imágenes de código renombradas con su propio número, seis animaciones Tenor incorporadas y banners reubicados en `public/media/`.
- Eliminación de `section.mp4` y de los nombres antiguos de las imágenes.
- Navegación con pestañas accesibles y foco itinerante.
- Respeto de `prefers-reduced-motion`.
- Limpieza de recursos, notas y datos sin uso.

### Pendiente

- Valorar si el estado del lado debe persistir entre recargas (`localStorage`).
- Revisar el peso de `PFP_Side_B.gif` (1,9 MB), `i_dont_know_carmesi.svg` (2,1 MB), `transitions.mp4` (11,6 MB), `1001.gif` (3,8 MB) y las seis animaciones de código (~6 MB en total).
- Añadir favicon, Open Graph y sitemap.
- Añadir un script de verificación (`astro check`) si se desea validación de plantillas en CI.

---

## 16. Convenciones

- Mantener una tarjeta por componente.
- Mantener el contenido en `src/content/` y el comportamiento en `src/scripts/app.ts`.
- Usar las variables CSS de `themes.css` para cualquier color nuevo.
- No duplicar el contenido entre lados.
- Los enlaces de sección son controles de la misma página, no rutas.
- Mantener la copia `sr-only` y `aria-busy` en cualquier cambio del tipeo.
- Respetar `prefers-reduced-motion` en cualquier animación nueva.
- No volver a introducir la portada completa en transiciones internas.
