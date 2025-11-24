/**
 * js/film-carousel.js
 * Implementa un carrusel que simula un bucle infinito
 * copiando los elementos y reseteando el scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    // Si no encontramos la tira de película, salimos.
    if (!filmStrip) {
        console.error("No se encontró el elemento #film-strip-carousel.");
        return;
    }

    // Función para clonar y añadir elementos al final
    function setupInfiniteScroll() {
        // 1. Clonar los elementos existentes
        const items = Array.from(filmStrip.children);
        
        // 2. Duplicar la primera serie de elementos y añadirlos al final
        // Esto crea el "bucle" visual necesario. 
        items.forEach(item => {
            const clone = item.cloneNode(true); // Clonar profundamente
            filmStrip.appendChild(clone);
        });
        
        // 3. Obtener las dimensiones
        setTimeout(() => {
            initializeScrollLoop(filmStrip, items.length);
        }, 100); 
    }

    function initializeScrollLoop(strip, originalItemCount) {
        // Calculamos el ancho de cada ítem (incluyendo el margen derecho)
        const itemWidth = strip.firstElementChild.offsetWidth + 
                          parseInt(window.getComputedStyle(strip.firstElementChild).marginRight);

        // Ancho total de los elementos originales
        const originalWidth = itemWidth * originalItemCount;

        let isScrolling;

        strip.addEventListener('scroll', () => {
            // Bandera para indicar que estamos desplazándonos
            strip.classList.add('is-scrolling');

            // 1. Limpiar el temporizador de reinicio para evitar parpadeos
            window.clearTimeout(isScrolling);

            // 2. Comprobar si hemos pasado el límite del contenido original
            if (strip.scrollLeft >= originalWidth) {
                // Si pasamos el límite, nos movemos instantáneamente al inicio del contenido duplicado
                strip.scrollLeft -= originalWidth;
            } 
            // 3. Temporizador para quitar la clase 'is-scrolling' (simula que el scroll ha terminado)
            isScrolling = setTimeout(() => {
                strip.classList.remove('is-scrolling');
            }, 66); 
        });
    }

    // Iniciar la configuración
    setupInfiniteScroll();
});
