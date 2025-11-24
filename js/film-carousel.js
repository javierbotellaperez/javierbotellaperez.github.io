/**
 * js/film-carousel.js
 * Configuración de Autoplay y Scroll Básico (SIN bucle infinito).
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) {
        console.error("No se encontró el elemento #film-strip-carousel.");
        return;
    }
    
    // Configuración del Autoplay
    const AUTO_SCROLL_SPEED = 1; // Velocidad de desplazamiento (ej: 1 píxel por fotograma)
    const AUTO_SCROLL_INTERVAL = 10; // Intervalo de tiempo (ej: 10 milisegundos)
    let autoScrollTimer = null;

    // 1. Obtener los elementos originales (ya no los clonamos)
    const originalItems = Array.from(filmStrip.children);
    
    // 2. Función de inicialización
    function initializeBasicScroll() {
        
        // 🟢 Eliminamos toda la lógica de cálculo de originalWidth y de salto de scroll,
        // ya que el carrusel es finito.

        // Añadimos listeners para detener el scroll automático al interactuar manualmente
        filmStrip.addEventListener('wheel', stopAutoScroll, { once: true });
        filmStrip.addEventListener('touchstart', stopAutoScroll, { once: true });
        
        // Iniciamos el scroll automático
        startAutoScroll();
    }
    
    // Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; // Evitar iniciar dos veces

        autoScrollTimer = setInterval(() => {
            // Desplaza el carrusel un pequeño paso a la derecha
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // 🟢 Lógica para detener el scroll al llegar al final (opcional)
            // Si el scroll llega al final, podemos detenerlo o reiniciarlo al inicio.
            if (filmStrip.scrollLeft >= filmStrip.scrollWidth - filmStrip.clientWidth) {
                // Opción 1 (Detener): 
                stopAutoScroll(); 
                
                // Opción 2 (Reiniciar al inicio, si quieres un loop simple):
                // filmStrip.scrollLeft = 0;
            }
            
        }, AUTO_SCROLL_INTERVAL);
    }
    
    // Función para detener el movimiento automático (llamada por interacción del usuario)
    function stopAutoScroll() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
    }

    // Iniciamos la configuración después de un pequeño retraso
    setTimeout(initializeBasicScroll, 200); 
});
