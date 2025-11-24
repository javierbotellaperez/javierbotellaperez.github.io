/**
 * js/film-carousel.js
 * Implementa un carrusel que simula un bucle infinito
 * duplicando el contenido tres veces y reseteando el scroll.
 * Se eliminan los conflictos de scroll-snap de CSS.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) {
        console.error("No se encontró el elemento #film-strip-carousel.");
        return;
    }
    
    // 1. Clonar los elementos existentes
    const originalItems = Array.from(filmStrip.children);
    
    // 2. Duplicar el contenido (dos veces) para crear el bucle visual.
    // Estructura: Original | Copia 1 | Copia 2
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true)); // Copia 1
        filmStrip.appendChild(item.cloneNode(true)); // Copia 2
    });

    // CLAVE: La función de inicialización del bucle.
    function initializeScrollLoop() {
        
        // 🟢 CORRECCIÓN CLAVE DE CÁLCULO: Usamos getBoundingClientRect().width para obtener el ancho real.
        const firstItem = originalItems[0];
        const itemComputedStyle = window.getComputedStyle(firstItem);
        
        // Calculamos el ancho del ítem (ancho + margen derecho)
        const itemWidth = firstItem.getBoundingClientRect().width + 
                          parseFloat(itemComputedStyle.marginRight);

        // Ancho total de los elementos originales
        const originalWidth = itemWidth * originalItems.length;

        let isScrolling;

        filmStrip.addEventListener('scroll', () => {
            // Eliminamos la clase is-scrolling para anular scroll-behavior: auto; al saltar
            filmStrip.classList.remove('is-scrolling');

            window.clearTimeout(isScrolling);

            // 1. Condición de Salto hacia adelante (Cuando llegamos al final del primer set)
            if (filmStrip.scrollLeft >= originalWidth) {
                // Saltamos instantáneamente al inicio (el inicio de la primera copia)
                filmStrip.scrollLeft -= originalWidth;
            }
            
            // 2. Condición de Salto Inverso (Cuando el usuario vuelve mucho al inicio)
            else if (filmStrip.scrollLeft < itemWidth) {
                 // Si nos desplazamos demasiado a la izquierda, saltamos a la parte duplicada
                 filmStrip.scrollLeft += originalWidth;
            }

            // 3. Pequeño temporizador para poner la clase 'is-scrolling' si hay scroll activo
            isScrolling = setTimeout(() => {
                filmStrip.classList.add('is-scrolling');
            }, 50); 
        });
        
        // Colocamos el scroll en el punto medio (inicio del contenido original) para que 
        // el bucle inverso también funcione desde el principio.
        filmStrip.scrollLeft = originalWidth;
    }
    
    // Iniciamos el bucle después de un pequeño retraso para asegurar que el navegador ha renderizado todo
    setTimeout(initializeScrollLoop, 200); 
});
