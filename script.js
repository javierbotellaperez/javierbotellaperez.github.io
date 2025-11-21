/**
 * Script.js - Funcionalidad Básica del Portafolio
 */

// 1. Mostrar el Año Actual en el Pie de Página
// Esto garantiza que el copyright siempre muestre el año correcto.
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Puedes añadir más funcionalidades aquí en el futuro,
// como efectos de desplazamiento, o validación de formularios, etc.
