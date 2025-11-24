/**
 * js/film-carousel.js
 * Solución robusta para el bucle y el autoplay inteligente.
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
    const RESUME_DELAY = 3000; // 3 segundos antes de reanudar
    
    let autoScrollTimer = null;
    let resumeTimer = null;

    // --- Lógica del Bucle Infinito ---
    
    // 1. Clonar el contenido y obtener el ancho original
    const originalItems = Array.from(filmStrip.children);
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true));
    });
    
    let originalWidth = 0;

    // Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        clearTimeout(resumeTimer); 

        // 🟢 Calculamos el ancho dentro del intervalo, si es necesario
        if (originalWidth === 0) {
             originalWidth = filmStrip.scrollWidth / 2;
        }

        autoScrollTimer = setInterval(() => {
            
            // Desplaza el carrusel un pequeño paso a la derecha
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // Condición de Bucle Infinito: Si el scroll pasa el ancho original, saltamos.
            if (filmStrip.scrollLeft >= originalWidth) {
                filmStrip.scrollLeft -= originalWidth;
            }
            
        }, AUTO_SCROLL_INTERVAL);
    }
    
    // Función para detener el movimiento automático y preparar la reanudación
    function stopAutoScrollAndPrepareResume() {
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

    let scrollActivityTimer = null;

    // Esta función se llama cada vez que el usuario scrollea manualmente
    function handleManualScroll() {
        // 1. Detenemos el autoplay inmediatamente
        stopAutoScrollAndPrepareResume(); 
        
        // 2. Limpiamos el temporizador de actividad de scroll
        clearTimeout(scrollActivityTimer);
        
        // 3. Configuramos un nuevo temporizador para detectar el final de la actividad manual.
        // Mientras el usuario siga scrolleando, este temporizador se reiniciará constantemente.
        scrollActivityTimer = setTimeout(() => {
            // Cuando el usuario deja de scrollear por 150ms, el temporizador de RESUME_DELAY (en stopAutoScroll) 
            // ya está corriendo y se ejecutará para reiniciar el autoplay.
            // No necesitamos hacer nada más aquí.
        }, 150); 
    }


    // --- Inicialización ---

    function initializeScroll() {
        // Establecemos los listeners para detectar la interacción manual
        filmStrip.addEventListener('wheel', handleManualScroll, false);
        filmStrip.addEventListener('touchstart', handleManualScroll, false);
        
        // Inicializamos el scroll en el punto medio para que el bucle sea perfecto
        // Calculamos el ancho aquí por primera vez
        originalWidth = filmStrip.scrollWidth / 2;
        filmStrip.scrollLeft = originalWidth;

        // Iniciamos el Autoplay
        startAutoScroll();
    }
    
    // Iniciamos la configuración después de asegurar que el DOM ha medido los anchos
    setTimeout(initializeScroll, 200); 
});
