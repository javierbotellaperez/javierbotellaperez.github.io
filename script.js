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
    let isMoving = false; // Nueva variable para controlar si hubo un arrastre real

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
    // 🔥 ELIMINAMOS 'inputClass: Hammer.MouseInput' para evitar conflictos
    const mc = new Hammer(containerLink);
    
    // Configuramos el PAN para movimiento libre y sensible
    mc.get('pan').set({ 
        direction: Hammer.DIRECTION_ALL,
        threshold: 5
    }); 
    
    mc.get('pinch').set({ enable: true });


    /* =========================================
       1. GESTO DE ARRASTRE (PAN) - Movimiento Libre
       ========================================= */

    mc.on('panstart', function (ev) {
        // Al inicio, asumimos que NO es un movimiento, sino un click
        isMoving = false; 
        
        // CRÍTICO: Leer la posición real actual para evitar el salto
        const transformMatrix = window.getComputedStyle(containerDiv).transform;
        if (transformMatrix !== 'none') {
            const matrix = transformMatrix.match(/matrix.*\((.+)\)/);
            if (matrix && matrix[1]) {
                const values = matrix[1].split(', ');
                currentX = parseFloat(values[4] || 0);
                currentY = parseFloat(values[5] || 0);
            }
        }

        // Desactiva la transición al empezar a arrastrar
        containerDiv.style.transition = 'none';
        
        // Deshabilita el enlace para evitar que se active inmediatamente
        containerLink.style.pointerEvents = 'none'; 
    });

    mc.on('panmove', function (ev) {
        // Si nos movemos más de 5 píxeles (el threshold), es un movimiento real
        if (Math.abs(ev.deltaX) > 5 || Math.abs(ev.deltaY) > 5) {
            isMoving = true;
        }
        
        const deltaX = currentX + ev.deltaX;
        const deltaY = currentY + ev.deltaY;
        setTransform(deltaX, deltaY, currentScale);
    });

    mc.on('panend', function (ev) {
        // Reactiva la transición para una liberación SUAVE
        containerDiv.style.transition = 'transform 0.3s ease-out';
        
        // Guarda la posición final (el sticker se queda donde lo sueltas)
        currentX += ev.deltaX;
        currentY += ev.deltaY;
        
        // 🔥 CRÍTICO: Reactivación INMEDIATA y manejo del click
        if (isMoving) {
            // Si hubo movimiento, reactivamos los eventos y la imagen se queda.
            containerLink.style.pointerEvents = 'auto';
        } else {
            // Si NO hubo movimiento (fue un toque/click rápido), reactivamos el enlace
            // DESPUÉS de un pequeño retraso, permitiendo que el navegador registre el 'click'.
             setTimeout(() => {
                containerLink.style.pointerEvents = 'auto';
            }, 50); 
        }
    });


    /* =========================================
       2. GESTO DE ZOOM (PINCH) - No necesita cambios
       ========================================= */

    mc.on('pinchstart', function (ev) {
        containerDiv.style.transition = 'none';
    });
    
    mc.on('pinchmove', function (ev) {
        let newScale = currentScale * ev.scale;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        setTransform(currentX, currentY, newScale);
    });

    mc.on('pinchend', function (ev) {
        containerDiv.style.transition = 'transform 0.3s ease-out';
        currentScale *= ev.scale;
        currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale));
    });

    window.addEventListener('load', posicionarAleatoriamente);

} else {
    console.log("Script de interacción no inicializado: El elemento base no fue encontrado.");
}
