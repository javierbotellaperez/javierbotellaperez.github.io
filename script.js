// El ID del contenedor principal (el enlace) que queremos controlar.
const ELEMENTO_ID = 'imageLink_arnau';
const containerLink = document.getElementById(ELEMENTO_ID);

if (containerLink) {
    
    const containerDiv = containerLink.querySelector('.movable-resizable-container');

    // Variables de estado
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;
    const TAMANO_INICIAL = 250;

    // --- FUNCIÓN DE POSICIONAMIENTO INICIAL (AL AZAR) ---
    function posicionarAleatoriamente() {
        const anchoViewport = window.innerWidth;
        const altoViewport = window.innerHeight;

        currentX = Math.random() * (anchoViewport - TAMANO_INICIAL * 1.5);
        currentY = Math.random() * (altoViewport - TAMANO_INICIAL * 1.5);
        
        setTransform(currentX, currentY, currentScale);
    }

    // --- FUNCIÓN CLAVE: APLICAR TRANSFORMACIÓN ---
    function setTransform(x, y, scale) {
        containerDiv.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    // --- LÓGICA HAMMER.JS PARA GESTOS (Arrastre y Zoom) ---
    const mc = new Hammer(containerLink, {
        // Asegura que Hammer detecte los eventos del ratón (clic y arrastre)
        inputClass: Hammer.MouseInput 
    });
    
    // 🔥 CORRECCIÓN CLAVE: Configuramos el PAN para que sea sensible (threshold: 5)
    // y para que detecte el movimiento en TODAS las direcciones.
    mc.get('pan').set({ 
        direction: Hammer.DIRECTION_ALL,
        threshold: 5
    }); 
    
    mc.get('pinch').set({ enable: true });


    /* =========================================
       1. GESTO DE ARRASTRE (PAN) - Movimiento Libre (Ratón/Dedo)
       ========================================= */

    mc.on('panstart', function (ev) {
        // CRÍTICO: Leer la posición real actual del elemento para evitar el salto
        const transformMatrix = window.getComputedStyle(containerDiv).transform;
        
        if (transformMatrix !== 'none') {
            const matrix = transformMatrix.match(/matrix.*\((.+)\)/);
            if (matrix && matrix[1]) {
                const values = matrix[1].split(', ');
                currentX = parseFloat(values[4] || 0);
                currentY = parseFloat(values[5] || 0);
            }
        }

        // Desactiva la transición al empezar a arrastrar para una respuesta INSTANTÁNEA
        containerDiv.style.transition = 'none';
        containerLink.style.pointerEvents = 'none'; // Deshabilita el enlace temporalmente
    });

    mc.on('panmove', function (ev) {
        // El movimiento libre está dado por la suma del desplazamiento X e Y
        const deltaX = currentX + ev.deltaX;
        const deltaY = currentY + ev.deltaY;
        setTransform(deltaX, deltaY, currentScale);
    });

    mc.on('panend', function (ev) {
        // Reactiva la transición para una liberación SUAVE
        containerDiv.style.transition = 'transform 0.3s ease-out';
        
        // Guarda la posición final
        currentX += ev.deltaX;
        currentY += ev.deltaY;
        
        // Reactiva el enlace
        setTimeout(() => {
            containerLink.style.pointerEvents = 'auto';
        }, 350);
    });


    /* =========================================
       2. GESTO DE ZOOM (PINCH)
       ========================================= */

    mc.on('pinchstart', function (ev) {
        // Desactiva la transición para una respuesta INSTANTÁNEA al hacer zoom
        containerDiv.style.transition = 'none';
    });
    
    mc.on('pinchmove', function (ev) {
        let newScale = currentScale * ev.scale;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        setTransform(currentX, currentY, newScale);
    });

    mc.on('pinchend', function (ev) {
        // Reactiva la transición para un final de zoom SUAVE
        containerDiv.style.transition = 'transform 0.3s ease-out';
        
        // Guarda la escala final
        currentScale *= ev.scale;
        currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale));
    });

    window.addEventListener('load', posicionarAleatoriamente);

} else {
    console.log("Script de interacción no inicializado: El elemento base no fue encontrado.");
}
