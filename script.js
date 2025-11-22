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


<script>
        // --- 1. CONFIGURACIÓN INICIAL ---
        const container = document.getElementById('imageContainer');
        
        let isDragging = false;
        let animationFrameId = null; // ID para requestAnimationFrame
        
        // Posiciones del cursor y desplazamiento
        let initialX; 
        let initialY; 
        let xOffset = 0; 
        let yOffset = 0; 

        // --- 2. FUNCIÓN CLAVE: ACTUALIZA LA POSICIÓN (USANDO GPU) ---
        function setTranslate(xPos, yPos, el) {
            // Utilizamos translate3d, que es la forma más fluida de mover elementos
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        // --- 3. BUCLE DE ANIMACIÓN FLUIDA ---
        function moveSticker() {
            // Solo ejecuta la animación si estamos arrastrando
            if (isDragging) {
                setTranslate(xOffset, yOffset, container);
                // Vuelve a solicitar el siguiente cuadro para mantener la fluidez
                animationFrameId = requestAnimationFrame(moveSticker);
            }
        }

        // --- 4. FUNCIONES DE ARRASTRE ---
        function dragStart(e) {
            e.preventDefault();
            isDragging = true;
            container.style.cursor = 'grabbing';
            
            // Calcula el desplazamiento inicial basado en la posición del ratón
            initialX = e.clientX;
            initialY = e.clientY;
            
            // Si ya tiene un transform aplicado, lo parseamos para empezar desde ahí
            const transformMatrix = window.getComputedStyle(container).transform;
            if (transformMatrix !== 'none') {
                const matrix = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ');
                xOffset = parseFloat(matrix[4] || 0);
                yOffset = parseFloat(matrix[5] || 0);
            }
            
            // Inicia el bucle de animación
            if (animationFrameId === null) {
                 animationFrameId = requestAnimationFrame(moveSticker);
            }
        }

        function drag(e) {
            if (isDragging) {
                // Actualiza solo los offsets, no la posición real en la pantalla
                // La función moveSticker se encarga de aplicar los cambios en el próximo frame
                xOffset = e.clientX - initialX + xOffset;
                yOffset = e.clientY - initialY + yOffset;
                
                // Reinicia las posiciones iniciales para el siguiente cálculo delta
                initialX = e.clientX;
                initialY = e.clientY;
            }
        }

        function dragEnd(e) {
            isDragging = false;
            container.style.cursor = 'grab';
            
            // Detiene el bucle de requestAnimationFrame cuando el arrastre termina
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        
        // --- 5. FUNCIÓN DE ZOOM (Se mantiene sin cambios) ---
        function handleZoom(e) {
            e.preventDefault(); 

            const scaleFactor = 0.05; 
            let currentWidth = container.offsetWidth;
            let currentHeight = container.offsetHeight;
            let delta = e.deltaY * -0.01; 

            let newWidth = currentWidth + currentWidth * delta * scaleFactor;
            let newHeight = currentHeight + currentHeight * delta * scaleFactor;

            const minSize = 50; 
            const maxSize = 800; 

            if (newWidth > minSize && newWidth < maxSize) {
                container.style.width = newWidth + 'px';
                container.style.height = newHeight + 'px';
            }
        }

        // --- 6. ASIGNACIÓN DE EVENT LISTENERS ---

        // Eventos para el contenedor (Arrastre)
        container.addEventListener("mousedown", dragStart, false);
        document.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);
        
        // Evento para el Zoom (Rueda/Pellizco)
        container.addEventListener("wheel", handleZoom, false);

    </script>
