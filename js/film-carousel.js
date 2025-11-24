/**
 * js/film-carousel.js
 * Solución definitiva y robusta para el bucle infinito y el autoplay inteligente.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) {
        console.error("No se encontró el elemento #film-strip-carousel.");
        return;
    }
    
    // Configuración
    const AUTO_SCROLL_SPEED = 1; 
    const AUTO_SCROLL_INTERVAL = 10; 
    const RESUME_DELAY = 500; // 🟢 CLAVE: 0.5 segundos antes de reanudar el Autoplay
    
    let autoScrollTimer = null;
    let resumeTimer = null;
    let originalWidth = 0; 

    // 1. Configuración del Bucle y Clonación
    const originalItems = Array.from(filmStrip.children);
    
    // Duplicamos el contenido (solo una vez)
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true)); 
    });

    // --- Lógica del Bucle Infinito (SIEMPRE ACTIVA) ---
    
    // Esta función se encarga del salto invisible cuando el usuario o el autoplay llegan al límite.
    function handleLoopingScroll() {
        if (originalWidth === 0) {
            // Calculamos el ancho del primer set de elementos si aún no se ha hecho
             originalWidth = filmStrip.scrollWidth / 2;
        }

        // Condición de Salto hacia adelante
        if (filmStrip.scrollLeft >= originalWidth) {
            filmStrip.scrollLeft -= originalWidth;
        }
        
        // Condición de Salto Inverso (para el scroll manual hacia atrás)
        else if (filmStrip.scrollLeft < 1) { 
            filmStrip.scrollLeft += originalWidth;
        }
    }
    
    // Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        clearTimeout(resumeTimer); 

        autoScrollTimer = setInterval(() => {
            
            // 1. Mueve el scroll (trigger el evento 'scroll' y el bucle)
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;
            
        }, AUTO_SCROLL_INTERVAL);
    }
    
    // Función para detener el movimiento automático y preparar la reanudación
    function stopAutoScrollAndPrepareResume() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
        
        clearTimeout(resumeTimer); 
        
        // 🟢 CLAVE: Iniciamos un temporizador para reanudar el scroll después del RESUME_DELAY
        resumeTimer = setTimeout(() => {
            startAutoScroll();
        }, RESUME_DELAY);
    }
    
    // --- Lógica de Interacción del Usuario ---

    function handleManualScrollStart() {
        // Al detectar el inicio de la interacción manual (wheel/touchstart), detenemos el autoplay.
        stopAutoScrollAndPrepareResume(); 
        
        // 🟢 Añadimos un listener temporal para detectar el final de la inercia del scroll
        filmStrip.addEventListener('scroll', handleScrollActivity);
    }

    let scrollActivityTimer = null;

    function handleScrollActivity() {
        // 1. Cancelamos el temporizador de reanudación (el RESUME_DELAY) si el usuario sigue scrolleando.
        clearTimeout(resumeTimer); 
        
        // 2. Ejecutamos la lógica de bucle inmediatamente para mantenerlo infinito
        handleLoopingScroll();

        // 3. Reiniciamos el temporizador de actividad. Esto se ejecuta si el usuario para de scrollear.
        clearTimeout(scrollActivityTimer);

        scrollActivityTimer = setTimeout(() => {
            // Si pasan 150ms sin actividad de scroll, volvemos a llamar a stopAutoScroll para iniciar el RESUME_DELAY.
            stopAutoScrollAndPrepareResume(); 
            filmStrip.removeEventListener('scroll', handleScrollActivity);
        }, 150); 
    }


    // --- Inicialización ---

    function initializeScroll() {
        // Calculamos el ancho inicial
        originalWidth = filmStrip.scrollWidth / 2;
        filmStrip.scrollLeft = originalWidth;

        // Establecemos el listener del bucle (salto) para que funcione con el scroll manual
        filmStrip.addEventListener('scroll', handleLoopingScroll);

        // Establecemos los listeners para detectar la interacción manual
        filmStrip.addEventListener('wheel', handleManualScrollStart, false);
        filmStrip.addEventListener('touchstart', handleManualScrollStart, false);
        
        // Iniciamos el Autoplay
        startAutoScroll();
    }
    
    // Iniciamos la configuración después de asegurar que el DOM ha medido los anchos
    setTimeout(initializeScroll, 200); 
});
