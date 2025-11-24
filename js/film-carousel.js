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
    const RESUME_DELAY = 3000; 
    
    let autoScrollTimer = null;
    let resumeTimer = null;

    // --- 1. CONFIGURACIÓN DEL BUCLE ---
    
    // 1. Clonar los elementos existentes (solo una vez es suficiente)
    const originalItems = Array.from(filmStrip.children);
    
    // Obtenemos el ancho del conjunto de elementos originales
    let originalWidth = 0;

    // Duplicamos el contenido (solo una vez)
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true)); 
    });

    // --- Lógica de Scroll Automático y Bucle ---
    
    // Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        
        clearTimeout(resumeTimer); 

        // 🟢 CLAVE: El temporizador de Autoplay
        autoScrollTimer = setInterval(() => {
            
            // Si el ancho original no se ha calculado, lo calculamos ahora
            if (originalWidth === 0) {
                 // Calculamos el ancho del primer set de elementos
                 originalWidth = filmStrip.scrollWidth / 2;
            }

            // Desplaza el carrusel un pequeño paso a la derecha
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // 🟢 Condición de Bucle Infinito: Si el scroll pasa el ancho original, saltamos.
            if (filmStrip.scrollLeft >= originalWidth) {
                // Saltamos al inicio del set original (simulando el bucle)
                filmStrip.scrollLeft -= originalWidth;
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

    let isInteracting = false; // Bandera para saber si el scroll es manual

    // Función que se llama cuando el usuario interactúa (trackpad, wheel, touch)
    function handleUserInteraction() {
        // Detiene el autoplay y comienza el temporizador de reanudación
        stopAutoScroll();
        isInteracting = true; 
        
        // Reiniciamos el temporizador de reanudación con cada evento de scroll
        filmStrip.addEventListener('scroll', handleScrollActivity);
    }

    let scrollActivityTimer = null;

    function handleScrollActivity() {
        // Reiniciamos el temporizador de reanudación con cada evento de scroll
        clearTimeout(resumeTimer); 
        
        // Usamos un pequeño retraso para detectar cuando el scroll manual ha finalizado.
        clearTimeout(scrollActivityTimer);

        scrollActivityTimer = setTimeout(() => {
            // El scroll manual ha terminado, reiniciamos el ciclo de stop/resume.
            stopAutoScroll(); 
            isInteracting = false;
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
    
    // Iniciamos la configuración después de asegurar que el DOM ha medido los anchos
    setTimeout(initializeScroll, 200); 
});
