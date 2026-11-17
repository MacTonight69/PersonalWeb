# Base del proyecto — Página personal

**Versión:** 5.0

**Estado:** Sitio de una sola página con dos identidades visuales conmutables en el mismo documento. Home y las seis secciones profesionales / cuatro secciones de ocio se escriben dentro de CM con efecto de tipeo. El cambio de lado usa un video de transición a pantalla completa; el cambio de sección usa un destello del GIF de entrada dentro del card. Cada lado tiene su propio banner glitch, y el texto de la sección activa en CD se cifra cada 0,5 s mientras está visible. Side B usa la paleta carmesí, el retrato y la animación carmesí, y conserva el título NAVY.

**Tipo de proyecto:** Sitio web personal estático.

---

## 1. Qué es la página

La página personal es un sitio estático de presentación que reúne información sobre el propietario, su formación, su experiencia, sus proyectos y sus intereses.

Todo vive en una única ruta, `/`. Sobre ese mismo documento se alternan dos caras:

- **Side A:** fondo negro, paleta lapislázuli, fuente EASVHS, filtro VHS, banner glitch azul e intro de carga.
- **Side B:** fondo carmesí, paleta roja, retrato, animación y banner carmesí, sin filtro VHS.

El botón de cambio de lado está dentro de CD, junto al título **NAVY**. No navega: cambia el tema, la lista de secciones, la imagen de CI y la animación de CD en la página actual. El cambio se cubre con `section.mp4` a pantalla completa. Al cambiar de lado, CM vuelve al mensaje de bienvenida.

Las secciones no tienen rutas propias. Al pulsar una sección de CD, su texto se escribe en CM.

---

## 2. Stack tecnológico

| Tecnología | Función |
|---|---|
| Astro 7.4.7 | Framework principal y generación estática |
| TypeScript | Tipado y organización del código |
| HTML5 | Estructura semántica |
| CSS3 | Diseño, distribución, animaciones y filtro VHS |
| JavaScript de cliente | Tipeo, cambio de lado, transición y control de accesibilidad |

### Restricciones actuales

- No hay backend, base de datos ni autenticación.
- Salida estática (`output: 'static'`).
- No se usan React, Vue, Svelte ni bibliotecas externas de diseño.
- El filtro VHS se implementa con CSS y una textura SVG, sin Canvas ni WebGL.
- El video de transición es un archivo MP4 reproducible de forma nativa y se muestra completo, sin recortes ni deformación (`object-fit: contain`).
- El JavaScript de cliente se limita a una entrada (`src/scripts/app.ts`): tipeo, paneles de sección, cambio de tema, transición y saltos de accesibilidad.

### Dependencias

- `astro`
- `typescript`

### Recursos usados

- `EASVHS` (`public/fonts/easvhs.ttf`).
- `carga_vhs.svg` + `Intro_Side_A.gif` para la entrada de Side A.
- `Intro_Side_A.gif` también para el destello de 0,3 s dentro de CM antes de cada cambio de texto.
- `banner_glitch.svg` como banner de Side A.
- `banner_glitch_B.svg` como banner de Side B.
- `PFP_Side_A.gif` como retrato de Side A.
- `spin_head.svg` como animación inferior de CD en Side A.
- `PFP_Side_B.gif` como retrato de Side B.
- `i_dont_know_carmesi.svg` como animación inferior de CD en Side B.
- `section.mp4` (`public/media/section.mp4`) como transición al cambiar de lado.
- `vhs-noise.svg` para el ruido del filtro VHS.

No quedan recursos sin uso en `public/`: se retiraron fondos, banners viejos, iconos y galerías del diseño anterior.

---

## 3. Ruta y cambio de lado

| Ruta | Descripción |
|---|---|
| `/` | Página única; contiene Side A y Side B |

El cambio de lado se realiza con `SideToggle.astro`, un `<button>` situado junto al título **NAVY** de CD.

- En Side A muestra **Side B**; en Side B muestra **Side A**.
- Tiene `aria-label` y `title` con el lado de destino.
- Actualiza `data-side` en `<html>`, las variables de color, las listas de CD, la PFP de CI, el banner de CA, la animación de CD y `meta[name="theme-color"]`.
- No modifica la URL ni recarga la página.
- Al cambiar de lado, CM vuelve a Home y se apaga el cifrado de la navegación.

### Transición de cambio de lado

1. Se pulsa el botón de lado.
2. Se muestra `section.mp4` a pantalla completa, completo y sin deformación, silenciado, durante sus 4,77 s.
3. Se puede saltar con clic, Escape, Enter o Espacio.
4. Al terminar el video se aplica el nuevo lado: tema, banner, PFP, animación de CD y lista de secciones.
5. CM queda en Home y el cifrado de la navegación se apaga.
6. Con `prefers-reduced-motion: reduce` el lado cambia de inmediato, sin video.

Durante el video la interfaz queda cubierta, por lo que no se puede iniciar otra acción. El cambio de sección no reproduce este video.

---

## 4. Estructura de la interfaz

Todo el contenido visible vive dentro de **CP (Card Principal)**.

| Contenedor | Nombre | Función |
|---|---|---|
| CA | Card superior | Banner animado; azul en Side A y carmesí en Side B |
| CI | Card izquierda | Retrato y campos personales |
| CM | Card central | Bienvenida y texto de la sección activa |
| CD | Card derecha | Título NAVY, botón de lado, navegación y animación inferior |

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

La distribución es la misma en ambos lados: CA arriba y CI/CM/CD en tres columnas. El banner y los colores cambian según el lado.

### CP

- Fondo y borde según el lado.
- Esquinas redondeadas, margen lateral fluido y padding variable.
- Distribución con CSS Grid.
- En escritorio se ajusta a la altura de la ventana; en móvil se apila en una columna.

### CI

- Retrato según el lado: `PFP_Side_A.gif` o `PFP_Side_B.gif`.
- El retrato ocupa todo el ancho disponible de CI descontando su margen; la altura se calcula automáticamente y conserva la proporción original.
- Side A: margen de 8 px alrededor del retrato.
- Side B: margen de 18 px alrededor del retrato; el borde carmesí queda pegado a la imagen.
- Campos: Usuario, Nombre, Fecha de nacimiento, País e Idiomas, con texto ligeramente mayor que en la versión anterior.
- En Side B la imagen tiene borde y sombra carmesí.

### CM

- Estado inicial: **Home**, con **Layer: 088** y el texto de bienvenida.
- Estado de sección: título y contenido de la sección elegida.
- El contenido tiene scroll interno cuando supera la altura del card.
- El texto visible se escribe progresivamente; una copia oculta conserva el texto completo para lectores de pantalla.
- El GIF de entrada se muestra dentro de CM durante 0,3 s antes de sustituir el texto.
- Un clic dentro de CM completa inmediatamente el tipeo en curso.

### CD

- Title **NAVY** (se conserva en ambos lados) y botón de cambio de lado en la misma fila.
- Side A: siete entradas de texto (Home + seis secciones), con glitch al pasar el cursor.
- Side B: cinco entradas de texto (Home + Games, Anime, Music, Literature), sin iconos ni viñetas.
- Las listas son `role="tablist"`; cada enlace es un `role="tab"` con `aria-selected` y foco itinerante. El panel es CM (`role="tabpanel"`, `id="cm-panel"`).
- La flecha arriba/abajo, Home y End recorren las pestañas.
- El texto de la entrada activa se cifra cada 0,5 s mientras su sección está en CM. Home arranca cifrada al cargar la página.
- Sin subrayado en la entrada activa; se distingue por color y brillo.
- La animación inferior ocupa el 100% del ancho disponible de CD, con altura automática y proporción conservada.
- Side A: la animación va a sangre. Side B: lleva un padding de 18 px.
- En alturas ≤ 800 px se compactan el título y los gaps de CD para que la lista y la animación sigan cabiendo.
- Animación inferior: `spin_head.svg` en Side A, `i_dont_know_carmesi.svg` en Side B.

---

## 5. Contenido de las secciones

El contenido está tipado en `src/content/`.

- `types.ts`: `SectionBlock`, `SectionContent`, `SectionEntry`.
- `sections.ts`: contenido de Side A y ensamblado de ambas listas.
- `sideB.ts`: ensayos completos de Games, Anime, Music y Literature como bloques de texto, sin galerías ni datos de portadas.

### Home

- Es la primera entrada de CD en ambos lados y queda seleccionada al cargar y después de cambiar de lado.
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

El cambio de sección no reproduce `section.mp4`; ese video pertenece al cambio de lado.

Con `prefers-reduced-motion: reduce` no se muestra el GIF, el texto aparece completo y el cifrado de la navegación no se activa.

### Cifrado de la navegación activa

- Solo se aplica a la entrada de CD cuya sección está visible en CM.
- Arranca cifrada la entrada Home al cargar la página.
- Cambia cada 0,5 s entre ROT13, ROT7, Atbash, Vigenère con clave NAVY, una sustitución alfabética propia y dos mezclas que incluyen mayúsculas, minúsculas, dígitos y símbolos ASCII.
- Conserva la longitud exacta del texto y los espacios; no usa alfabetos árabes, japoneses ni emojis.
- El `aria-label` de cada pestaña conserva el nombre real, de modo que el cifrado es solo visual.
- Se apaga y restaura el texto original al cambiar de sección, volver a Home, cambiar de lado o comenzar la transición de lado.
- Con `prefers-reduced-motion: reduce` permanece apagado.

El tipeo del mensaje de bienvenida conserva los tiempos originales: 88 ms por carácter en el título y 24 ms en el párrafo.

---

## 7. Side A

- Fondo negro, bordes lapislázuli, títulos azules y texto azul claro.
- Fuente EASVHS; los caracteres sin glifo caen a `Courier New`.
- Intro de 6,5 s: 6 s de `carga_vhs.svg` y 0,5 s de `Intro_Side_A.gif`.
- Filtro VHS con scanlines, ruido, aberración cromática, parpadeo y tracking.
- Banner glitch azul (`banner_glitch.svg`), visible completo en CA.
- Retrato animado.
- Glitch en los enlaces de CD al pasar el cursor o recibir foco.
- El filtro VHS se oculta por completo en Side B.

---

## 8. Side B

- Fondo `#140208` y superficies `#1b0209`.
- Bordes y títulos carmesí; texto claro rosado.
- Banner carmesí (`banner_glitch_B.svg`) sobre fondo negro.
- Retrato `PFP_Side_B.gif` y animación `i_dont_know_carmesi.svg`.
- Navegación de texto, sin iconos ni viñetas.
- Sin filtro VHS, sin intro y sin glitch.
- Título NAVY conservado.

---

## 9. Accesibilidad

- `html lang="en"`.
- Pestañas con `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` y foco itinerante.
- CM como `role="tabpanel"` con `tabindex="0"` y `aria-labelledby` dinámico.
- Región `aria-live="polite"` que anuncia la sección activa.
- Copia `sr-only` del texto completo de cada sección.
- `aria-busy` en CM durante la transición.
- Foco visible en botones y pestañas.
- El cifrado de CD es visual: el `aria-label` de cada pestaña conserva siempre el nombre real.
- `prefers-reduced-motion` respetado en intro, video de lado, destello, tipeo, cifrado de navegación, VHS y glitch.
- El video de transición de lado está silenciado y no se anuncia a lectores de pantalla (`aria-hidden`).

---

## 10. Distribución responsive

- **Escritorio (> 864 px):** CP con CA + tres columnas 25/50/25 en ambos lados. El banner usa `contain` para mostrarse completo y sin deformación.
- **≤ 864 px:** márgenes de 24 px, CP apilado en CA, CI, CM y CD; CM limita su altura a 68 dvh y hace scroll interno.
- **Alturas ≤ 800 px:** el título y los gaps de CD se compactan; la PFP y la animación conservan su ancho completo.
- **≤ 480 px:** márgenes de 12 px.
- No hay desbordamiento horizontal.

---

## 11. Estructura de archivos

```text
PersonalWeb/
├── public/
│   ├── fonts/easvhs.ttf
│   ├── images/
│   │   ├── banner_glitch.svg
│   │   └── banner_glitch_B.svg
│   ├── media/
│   │   ├── carga_vhs.svg
│   │   ├── Intro_Side_A.gif
│   │   ├── PFP_Side_A.gif
│   │   ├── PFP_Side_B.gif
│   │   ├── spin_head.svg
│   │   ├── i_dont_know_carmesi.svg
│   │   └── section.mp4
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
└── base.md
```

---

## 12. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `src/layouts/BaseLayout.astro` | Documento HTML, precargas, intro, transición, VHS y entrada del script |
| `src/pages/index.astro` | Página única |
| `src/scripts/app.ts` | Tipeo, paneles, pestañas, cambio de lado, video y accesibilidad |
| `src/components/MainCard.astro` | CP y composición de las cuatro subcards |
| `src/components/HeaderCard.astro` | Banner de CA; intercambia la variante A/B |
| `src/components/LeftCard.astro` | Retrato y campos personales; datos para ambos lados |
| `src/components/CenterCard.astro` | CM, bienvenida, secciones, datos serializados y destello |
| `src/components/RightCard.astro` | NAVY, listas de secciones, botón de lado y animación |
| `src/components/SideToggle.astro` | Botón de cambio de Side A/Side B |
| `src/components/SideAIntro.astro` | Entrada VHS de 6,5 s |
| `src/components/SideTransition.astro` | Capa del video `section.mp4` |
| `src/components/VhsOverlay.astro` | Capas del filtro VHS |
| `src/content/types.ts` | Tipos del contenido |
| `src/content/sections.ts` | Contenido de Side A y listas de navegación |
| `src/content/sideB.ts` | Ensayos de Games/Anime/Music/Literature como bloques de texto |
| `src/styles/global.css` | Variables de distribución, base, CP y responsive |
| `src/styles/themes.css` | Paletas de Side A y Side B |
| `src/styles/vhs.css` | Efectos y accesibilidad del filtro VHS |

---

## 13. Ejecución

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

## 14. Estado actual y pendientes

### Implementado

- Página única sin rutas de sección.
- Cambio de lado en el mismo documento.
- Home en ambos lados, con el texto inicial de CM y texto propio en Side B.
- Texto de sección en CM con tipeo y scroll interno.
- Destello del GIF dentro de CM.
- Transición en video a pantalla completa al cambiar de lado.
- Cifrado cada 0,5 s de la entrada activa de CD, con longitud constante; Home arranca cifrada al cargar.
- Cifrados con letras, dígitos y símbolos ASCII.
- Banners glitch propios para Side A y Side B.
- Future Vision en binario.
- Paleta carmesí, retrato y animación de Side B.
- NAVY conservado en Side B.
- CD de Side B sin iconos ni viñetas.
- Sin subrayado en la pestaña activa y texto reducido en CI/CD.
- PFP de CI y animación de CD a ancho completo, con altura automática y proporción conservada.
- Márgenes diferenciados en la PFP de CI (8 px en A, 18 px en B) y padding de 18 px en la animación de CD de Side B.
- Texto de CI ligeramente mayor en ambos lados.
- Navegación con pestañas accesibles y foco itinerante.
- Respeto de `prefers-reduced-motion`.
- Limpieza de recursos, notas y datos sin uso.

### Pendiente

- Valorar si el estado del lado debe persistir entre recargas (`localStorage`).
- Revisar el peso de `PFP_Side_B.gif` (1,9 MB) e `i_dont_know_carmesi.svg` (2,1 MB).
- Añadir favicon, Open Graph y sitemap.
- Añadir un script de verificación (`astro check`) si se desea validación de plantillas en CI.

---

## 15. Convenciones

- Mantener una tarjeta por componente.
- Mantener el contenido en `src/content/` y el comportamiento en `src/scripts/app.ts`.
- Usar las variables CSS de `themes.css` para cualquier color nuevo.
- No duplicar el contenido entre lados.
- Los enlaces de sección son controles de la misma página, no rutas.
- Mantener la copia `sr-only` y `aria-busy` en cualquier cambio del tipeo.
- Respetar `prefers-reduced-motion` en cualquier animación nueva.
- No volver a introducir la portada completa en transiciones internas.
