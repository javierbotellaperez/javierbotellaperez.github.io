// El ID del contenedor principal (el enlace) que queremos controlar.
const ELEMENTO_ID = 'imageLink_arnau';
const containerLink = document.getElementById(ELEMENTO_ID);

// Seleccionamos el div que contiene la imagen para aplicar las transformaciones
const containerDiv = containerLink.querySelector('.movable-resizable-container');

// Variables de estado
let currentScale = 1;
let currentX = 0;
let currentY = 0;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const TAMANO_INICIAL = 250; // Debe coincidir con el CSS

// --- FUNCIÓN DE POSICIONAMIENTO INICIAL (AL AZAR) ---
function posicionarAleatoriamente() {
    const anchoViewport = window.innerWidth;
    const altoViewport = window.innerHeight;

    // Calcula una posición X e Y inicial al azar, dejando espacio en los bordes.
    currentX = Math.random() * (anchoViewport - TAMANO_INICIAL);
    currentY = Math.random() * (altoViewport - TAMANO_INICIAL);

    // Aplica la transformación inicial
    setTransform(currentX, currentY, currentScale);
}

// --- FUNCIÓN CLAVE: APLICAR TRANSFORMACIÓN (Fluidez garantizada por CSS transition) ---
function setTransform(x, y, scale) {
    // Usamos translate3d y scale para el mejor rendimiento (aceleración por GPU)
    containerDiv.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

// --- LÓGICA HAMMER.JS PARA GESTOS (Arrastre y Zoom) ---
const mc = new Hammer(containerLink);

// Habilitamos el arrastre (pan) y el pellizco (pinch)
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
mc.get('pinch').set({ enable: true });


/* =========================================
   1. GESTO DE ARRASTRE (PAN - Imantar y Desplazar)
   ========================================= */

mc.on('panstart panmove', function (ev) {
    // 1. Deshabilita el enlace temporalmente mientras se arrastra
    containerLink.style.pointerEvents = 'none';

    // 2. Calcula la nueva posición sumando el desplazamiento (delta) de Hammer
    const deltaX = currentX + ev.deltaX;
    const deltaY = currentY + ev.deltaY;

    // 3. Aplica la transformación en tiempo real
    setTransform(deltaX, deltaY, currentScale);
});

mc.on('panend', function (ev) {
    // 1. Guarda la posición final para el siguiente arrastre
    currentX += ev.deltaX;
    currentY += ev.deltaY;
    
    // 2. Reactiva el enlace
    setTimeout(() => {
        containerLink.style.pointerEvents = 'auto';
    }, 350); // Pequeño retraso para evitar que el enlace se active al soltar el ratón/dedo
});


/* =========================================
   2. GESTO DE ZOOM (PINCH - Agrandar/Encoger)
   ========================================= */

mc.on('pinchstart pinchmove', function (ev) {
    // 1. Calcula la nueva escala, limitándola con las constantes
    let newScale = currentScale * ev.scale;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    // 2. Aplica la nueva transformación (posición no cambia, solo la escala)
    setTransform(currentX, currentY, newScale);
});

mc.on('pinchend', function (ev) {
    // 1. Guarda la escala final
    currentScale *= ev.scale;
    currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale));
});


// Ejecuta la función de posición aleatoria al cargar la página
window.addEventListener('load', posicionarAleatoriamente);
