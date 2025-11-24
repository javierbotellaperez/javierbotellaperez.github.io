/**
 * js/film-carousel.js
 * Configuración de Autoplay inteligente: se pausa al interactuar
 * y se reanuda después de un breve periodo de inactividad.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) {
        console.error("No se encontró el elemento #film-strip-carousel.");
        return;
    }
    
    // Configuración
    const AUTO_SCROLL_SPEED = 1; // Velocidad de desplazamiento
    const AUTO_SCROLL_INTERVAL = 10; // Intervalo de tiempo
    const RESUME_DELAY = 3000; // 🟢 CLAVE: 3 segundos antes de reanudar el Autoplay
    
    let autoScrollTimer = null;
    let resumeTimer = null;

    // --- Lógica de Scroll Automático ---
    
    // Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        
        // Limpiamos el temporizador de reanudación por si estaba pendiente
        clearTimeout(resumeTimer); 

        autoScrollTimer = setInterval(() => {
            // Desplaza el carrusel un pequeño paso a la derecha
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // Lógica para reiniciar al llegar al final de la tira
            if (filmStrip.scrollLeft >= filmStrip.scrollWidth - filmStrip.clientWidth) {
                filmStrip.scrollLeft = 0; // Reinicia al inicio
            }
            
        }, AUTO_SCROLL_INTERVAL);
    }
    
    // Función para detener el movimiento automático
    function stopAutoScroll() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
        // Limpiamos cualquier temporizador de reanudación anterior
        clearTimeout(resumeTimer); 
        
        // 🟢 CLAVE: Iniciamos un temporizador para reanudar el scroll después del RESUME_DELAY
        resumeTimer = setTimeout(() => {
            startAutoScroll();
        }, RESUME_DELAY);
    }
    
    // --- Lógica de Interacción del Usuario ---

    // La función que se llama cuando el usuario interactúa
    function handleUserInteraction() {
        stopAutoScroll();
        
        // Si el usuario está scrolleando activamente, reiniciamos el temporizador de reanudación.
        filmStrip.addEventListener('scroll', handleScrollEnd);
    }

    let scrollEndTimer = null;

    function handleScrollEnd() {
        // Limpiamos el temporizador anterior
        clearTimeout(scrollEndTimer);
        
        // Configuramos un nuevo temporizador que se disparará si el usuario deja de scrollear por 150ms
        scrollEndTimer = setTimeout(() => {
            // El scroll manual ha terminado, llamamos a stopAutoScroll, lo cual iniciará el RESUME_DELAY
            stopAutoScroll();
            // Eliminamos el listener de scroll para evitar spam
            filmStrip.removeEventListener('scroll', handleScrollEnd);
        }, 150); 
    }


    // --- Inicialización ---

    function initializeScroll() {
        // Establecemos los listeners para detectar la interacción manual
        filmStrip.addEventListener('wheel', handleUserInteraction, false);
        filmStrip.addEventListener('touchstart', handleUserInteraction, false);
        
        // Iniciamos el Autoplay
        startAutoScroll();
    }
    
    // Iniciamos la configuración después de un pequeño retraso
    setTimeout(initializeScroll, 200); 
});
