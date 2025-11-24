/**
 * js/film-carousel.js
 * Implementa un carrusel que simula un bucle infinito
 * duplicando el contenido tres veces y reseteando el scroll.
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

    // 1. Clonar los elementos existentes
    const originalItems = Array.from(filmStrip.children);
    
    // Duplicar el contenido (dos veces)
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true)); // Copia 1
        filmStrip.appendChild(item.cloneNode(true)); // Copia 2
    });

    function initializeScrollLoop() {
        
        // Cálculo del ancho del ítem (ancho + margen derecho)
        const firstItem = originalItems[0];
        const itemComputedStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.getBoundingClientRect().width + 
                          parseFloat(itemComputedStyle.marginRight);

        // Ancho total de los elementos originales
        const originalWidth = itemWidth * originalItems.length;

        let isScrolling;

        // --- Lógica del Bucle Infinito (Salto) ---
        filmStrip.addEventListener('scroll', () => {
            filmStrip.classList.remove('is-scrolling');
            window.clearTimeout(isScrolling);

            // Condición de Salto hacia adelante
            if (filmStrip.scrollLeft >= originalWidth) {
                filmStrip.scrollLeft -= originalWidth;
            }
            
            // Condición de Salto Inverso (para el scroll manual hacia atrás)
            else if (filmStrip.scrollLeft < itemWidth) {
                 filmStrip.scrollLeft += originalWidth;
            }

            // Temporizador para quitar la clase 'is-scrolling'
            isScrolling = setTimeout(() => {
                filmStrip.classList.add('is-scrolling');
            }, 50); 
        });
        
        // Colocamos el scroll en el punto medio (inicio del contenido original)
        filmStrip.scrollLeft = originalWidth;

        // --- 🟢 NUEVA FUNCIÓN: INICIAR EL SCROLL AUTOMÁTICO ---
        startAutoScroll();
    }
    
    // 🟢 Función para iniciar el movimiento automático
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; // Evitar iniciar dos veces

        autoScrollTimer = setInterval(() => {
            // Desplaza el carrusel un pequeño paso a la derecha
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // Se detiene el autoscroll si el usuario interactúa manualmente
            filmStrip.addEventListener('wheel', stopAutoScroll, { once: true });
            filmStrip.addEventListener('touchstart', stopAutoScroll, { once: true });
            
        }, AUTO_SCROLL_INTERVAL);
    }
    
    // 🟢 Función para detener el movimiento automático
    function stopAutoScroll() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
    }

    // Iniciar la configuración y el autoscroll
    setTimeout(initializeScrollLoop, 200); 
});
