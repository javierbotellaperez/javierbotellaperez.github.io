<script>
        // --- 1. CONFIGURACIÓN INICIAL ---
        const container = document.getElementById('imageContainer');
        
        let isDragging = false;
        let animationFrameId = null; 
        let initialX; 
        let initialY; 
        let xOffset = 0; 
        let yOffset = 0; 

        // --- 2. FUNCIÓN CLAVE: ACTUALIZA LA POSICIÓN (USANDO GPU) ---
        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        // --- 3. BUCLE DE ANIMACIÓN FLUIDA ---
        function moveSticker() {
            if (isDragging) {
                setTranslate(xOffset, yOffset, container);
                animationFrameId = requestAnimationFrame(moveSticker);
            }
        }

        // --- 4. FUNCIONES DE ARRASTRE ---
        function dragStart(e) {
            e.preventDefault();
            isDragging = true;
            container.style.cursor = 'grabbing';
            
            initialX = e.clientX;
            initialY = e.clientY;
            
            const transformMatrix = window.getComputedStyle(container).transform;
            if (transformMatrix !== 'none') {
                const matrix = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ');
                xOffset = parseFloat(matrix[4] || 0);
                yOffset = parseFloat(matrix[5] || 0);
            }
            
            if (animationFrameId === null) {
                 animationFrameId = requestAnimationFrame(moveSticker);
            }
        }

        function drag(e) {
            if (isDragging) {
                xOffset = e.clientX - initialX + xOffset;
                yOffset = e.clientY - initialY + yOffset;
                
                initialX = e.clientX;
                initialY = e.clientY;
            }
        }

        function dragEnd(e) {
            isDragging = false;
            container.style.cursor = 'grab';
            
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        
        // --- 5. FUNCIÓN DE ZOOM ---
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

        container.addEventListener("mousedown", dragStart, false);
        document.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);
        container.addEventListener("wheel", handleZoom, false);
    </script>
