/**
 * js/main.js
 * Funciones de inicialización global de la web.
 * - Actualiza el año actual en el pie de página.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Busca el elemento con el ID 'current-year'
    const currentYearElement = document.getElementById('current-year');
    
    // Si el elemento existe, establece su contenido al año actual.
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
