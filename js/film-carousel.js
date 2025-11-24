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
    
    // 1. Clonar los elementos existentes
    const originalItems = Array.from(filmStrip.children);
    
    // 2. Duplicar el contenido (al menos una vez) para crear el bucle visual.
    // Lo duplicamos dos veces para tener: Original | Copia 1 | Copia 2
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true)); // Copia 1
        filmStrip.appendChild(item.cloneNode(true)); // Copia 2
    });

    // CLAVE: La función de inicialización del bucle.
    function initializeScrollLoop() {
        // Obtenemos las dimensiones una vez que se han añadido los clones
        const itemWidth = filmStrip.firstElementChild.offsetWidth + 
                          parseInt(window.getComputedStyle(filmStrip.firstElementChild).marginRight);

        // La posición central (punto de reinicio) es el final del conjunto original de ítems.
        const originalWidth = itemWidth * originalItems.length;

        let isScrolling;

        filmStrip.addEventListener('scroll', () => {
            // Bandera para indicar que estamos desplazándonos
            filmStrip.classList.add('is-scrolling');

            window.clearTimeout(isScrolling);

            // 🟢 Condición de Salto (Cuando llegamos al final del primer set)
            if (filmStrip.scrollLeft >= originalWidth) {
                // Saltamos instantáneamente al inicio (el inicio de la primera copia)
                filmStrip.scrollLeft -= originalWidth;
            }
            
            // 🟢 Condición de Salto Inverso (Cuando el usuario vuelve mucho al inicio)
            else if (filmStrip.scrollLeft < itemWidth) {
                 // Si nos desplazamos demasiado a la izquierda, saltamos a la parte duplicada
                 filmStrip.scrollLeft += originalWidth;
            }

            // Temporizador para quitar la clase 'is-scrolling'
            isScrolling = setTimeout(() => {
                filmStrip.classList.remove('is-scrolling');
            }, 66);
        });
        
        // Colocamos el scroll en el punto medio (inicio del contenido original) para que 
        // el bucle inverso también funcione desde el principio.
        filmStrip.scrollLeft = originalWidth;
    }
    
    // Iniciamos el bucle después de un pequeño retraso para asegurar que el navegador ha renderizado todo
    setTimeout(initializeScrollLoop, 150); 
});
