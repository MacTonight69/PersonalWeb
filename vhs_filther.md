# Especificación técnica — Filtro VHS (Side A)

**Proyecto:** Página web personal  
**Sección:** Side A  
**Componente:** `VhsOverlay.astro`  
**Tecnologías:** Astro, TypeScript y CSS3  
**Estado:** Pendiente de implementación

---

## 1. Objetivo

Implementar un filtro visual VHS que proporcione a Side A una estética de grabación analógica deteriorada, inspirada en el terror analógico y en la ambientación visual de *Serial Experiments Lain*.

El efecto deberá simular las características visuales de una cinta VHS antigua mediante diferentes capas de interferencia, ruido y distorsión.

La implementación deberá priorizar el rendimiento, la independencia de los componentes y la posibilidad de modificar individualmente cada efecto.

## 2. Alcance y restricciones

**El filtro deberá afectar exclusivamente a Side A.**

Se establecen las siguientes restricciones obligatorias:

- No deberá afectar visualmente a Side B.
- No deberá modificar ni interferir con las animaciones de entrada.
- No deberá interferir con las animaciones de carga.
- No deberá modificar las transiciones de navegación entre páginas.
- No deberá bloquear interacciones, clics, desplazamientos ni controles.
- No deberá modificar la estructura HTML ni las dimensiones de CP o sus subcards.
- No deberá alterar la legibilidad del contenido.
- No deberá depender de bibliotecas externas para su funcionamiento básico.

El filtro deberá funcionar como una capa visual independiente, sin modificar directamente los elementos originales de la página.

## 3. Arquitectura del componente

Crear un componente independiente:

```text
src/
└── components/
    └── VhsOverlay.astro
```

Sus estilos deberán mantenerse separados del resto de la hoja de estilos:

```text
src/
└── styles/
    └── vhs.css
```

El componente solamente deberá importarse desde el layout correspondiente a Side A.

**No se deberá importar ni inicializar desde el layout de Side B.**

La estructura conceptual será:

```text
Side A
│
├── PageSwitcher
│
├── MainCard (CP)
│   ├── HeaderCard (CA)
│   ├── LeftCard (CI)
│   ├── CenterCard (CM)
│   └── RightCard (CD)
│
└── VhsOverlay
    ├── Scanlines
    ├── Noise
    ├── Chromatic Aberration
    ├── Flickering
    └── Tracking Errors
```

## 4. Efectos visuales requeridos

### 4.1. Scanlines — Líneas horizontales

Simular las líneas horizontales características de los monitores CRT.

Características:
- Distribución uniforme.
- Opacidad baja o moderada.
- Cobertura de toda la ventana.
- Posibilidad de incorporar una animación muy sutil.

Implementación preferente: `repeating-linear-gradient()`.

### 4.2. Noise — Ruido analógico

Añadir una textura de ruido visual que simule interferencias de una cinta VHS.

Características:
- Distribución irregular.
- Opacidad moderada o baja.
- Variación visual para evitar que parezca una imagen estática repetida.
- No deberá dificultar la lectura del contenido.

Implementación preferente: textura SVG o recurso gráfico ligero.

### 4.3. Chromatic Aberration — Aberración cromática

Simular una separación sutil de los canales RGB.

Características:
- Pequeños desplazamientos de color.
- Intensidad moderada.
- Aparición preferentemente en bordes y zonas de contraste.
- No deberá producir una distorsión permanente excesiva del texto.

Implementación preferente: pseudoelementos y propiedades CSS.

### 4.4. Flickering — Parpadeo

Simular pequeñas fluctuaciones de luminosidad propias de una grabación analógica.

Características:
- Variaciones irregulares o pseudorrandom.
- Intensidad moderada.
- Evitar parpadeos rápidos y excesivos.
- No deberá generar cambios bruscos de luminosidad que dificulten la visualización.

Implementación preferente: animaciones CSS.

### 4.5. Tracking Errors — Errores de seguimiento

Simular las interferencias horizontales que aparecen cuando una cinta VHS presenta problemas de lectura.

Características:
- Bandas horizontales de aparición ocasional.
- Desplazamientos breves.
- Duración reducida.
- Aparición irregular.
- Intensidad variable.

Implementación preferente: CSS y, si resulta necesario, JavaScript para controlar la aparición de las interferencias.

Este efecto deberá ser ocasional y no permanente.

## 5. Requisitos técnicos

El componente deberá cumplir las siguientes condiciones:

- Utilizar `position: fixed` para cubrir la ventana.
- Utilizar `inset: 0` para ocupar toda la superficie.
- Utilizar `pointer-events: none` para evitar interferencias con las interacciones.
- No modificar el flujo normal del documento.
- No provocar desplazamientos ni cambios de tamaño en los elementos.
- Mantener una jerarquía de capas independiente.
- Evitar filtros costosos aplicados directamente sobre toda la página.
- Evitar cálculos y animaciones JavaScript innecesarios.
- Priorizar propiedades CSS optimizadas para animación, como `opacity` y `transform`.

La capa deberá cubrir toda la ventana, independientemente de las dimensiones de CP.

### Jerarquía visual

El filtro deberá superponerse al contenido de Side A, pero no deberá ocultar controles que necesiten permanecer visualmente por encima de él.

El botón de cambio de página deberá conservar su funcionalidad y visibilidad.

La jerarquía de capas deberá definirse explícitamente mediante `z-index`, evitando conflictos con otros componentes.

## 6. Independencia de las animaciones y transiciones

Este apartado es especialmente importante.

El filtro VHS no deberá interferir con:

- Animaciones iniciales de aparición de Side A.
- Animaciones de carga.
- Animaciones individuales de CP y sus subcards.
- Transiciones de salida de Side A.
- Transiciones de entrada de Side B.
- Transiciones de navegación proporcionadas por Astro View Transitions.

El overlay deberá funcionar independientemente de estos procesos.

No se deberán aplicar animaciones globales al elemento `body`, `html` o al contenedor principal con el propósito de generar el efecto VHS.

Tampoco se deberá utilizar el filtro para modificar las propiedades de animación de los componentes originales.

Si se implementan transiciones entre páginas, el componente deberá permanecer asociado exclusivamente a Side A y no deberá persistir visualmente en Side B.

## 7. Rendimiento

La implementación deberá priorizar el funcionamiento fluido en equipos de prestaciones modestas.

Orden de preferencia:

1. CSS nativo.
2. Pseudoelementos CSS.
3. Texturas SVG ligeras.
4. JavaScript únicamente para efectos que no puedan resolverse adecuadamente mediante CSS.

No incorporar Canvas o WebGL en esta primera implementación.

Evitar:
- Animaciones constantes de propiedades que provoquen repintados costosos.
- Grandes cantidades de elementos DOM para representar ruido.
- Filtros `backdrop-filter` sobre toda la ventana.
- Texturas de resolución excesiva.
- Bibliotecas externas exclusivamente para generar el efecto.

## 8. Accesibilidad y control

El filtro deberá respetar la preferencia del sistema `prefers-reduced-motion`.

Cuando el usuario tenga activada esta preferencia:
- Desactivar las animaciones de flickering.
- Desactivar los movimientos de tracking.
- Reducir o eliminar las animaciones del ruido.
- Mantener únicamente los efectos estáticos que no perjudiquen la legibilidad.

La implementación deberá permitir modificar fácilmente la intensidad de cada efecto mediante variables CSS.

Ejemplo conceptual:

```css
:root {
  --vhs-scanline-opacity: 0.12;
  --vhs-noise-opacity: 0.08;
  --vhs-flicker-opacity: 0.04;
  --vhs-aberration-offset: 1px;
}
```

Los valores definitivos deberán ajustarse visualmente durante las pruebas.

## 9. Criterios de aceptación

La implementación se considerará terminada cuando:

- [ ] El filtro se visualice exclusivamente en Side A.
- [ ] Side B no presente ninguna interferencia del filtro.
- [ ] El filtro cubra toda la ventana.
- [ ] Las scanlines sean visibles pero discretas.
- [ ] El ruido analógico sea perceptible sin dificultar la lectura.
- [ ] La aberración cromática sea sutil.
- [ ] El flickering no resulte molesto.
- [ ] Los errores de tracking aparezcan ocasionalmente.
- [ ] Los elementos interactivos continúen funcionando.
- [ ] El botón de cambio de página permanezca operativo y visible.
- [ ] Las animaciones de entrada y carga funcionen independientemente.
- [ ] Las transiciones entre Side A y Side B no se vean afectadas.
- [ ] No se produzcan desbordamientos ni modificaciones de dimensiones.
- [ ] El rendimiento permanezca fluido.
- [ ] Se respete `prefers-reduced-motion`.

## 10. Resultado esperado

Side A deberá presentar una apariencia de grabación VHS antigua, con interferencias visuales sutiles, ruido analógico, líneas horizontales, aberración cromática y distorsiones ocasionales.

El resultado deberá transmitir una estética de terror analógico sin comprometer la legibilidad ni la navegación.

El filtro deberá estar implementado como un componente autónomo, reutilizable y fácilmente configurable, sin acoplarse a la estructura principal de la página ni interferir con los mecanismos de animación y transición del proyecto.
