/**
 * js/gallery-manager.js
 * Maneja la ordenación aleatoria de las fotos, aplica la inclinación de archivador,
 * e inicializa la galería Lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.content-grid');
    if (!galleryGrid) return;
    
    // Obtenemos todos los ítems de la galería
    const projects = Array.from(galleryGrid.querySelectorAll('.project-item'));
    
    // --- LÓGICA DE LIGHTBOX (Variables y Funciones) ---
    let lightbox = null; 
    let currentImageIndex = 0;
    let allGalleryImages = [];

    function createLightboxStructure() {
        if (lightbox) return; 

        lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.classList.add('lightbox');

        lightbox.innerHTML = `
            <button id="lightbox-close" class="lightbox-close-btn">X</button>
            <div class="lightbox-content-wrapper">
                <button id="lightbox-prev" class="lightbox-nav lightbox-prev">←</button>
                <img id="lightbox-image" src="" alt="Vista ampliada de la foto">
                <button id="lightbox-next" class="lightbox-nav lightbox-next">→</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Eventos de navegación
        document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
        document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));
        
        // Permitir cerrar con la tecla ESC y navegar con flechas
        document.addEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
        if (lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    }

    function updateLightbox() {
        const imgElement = document.getElementById('lightbox-image');
        if (imgElement && allGalleryImages.length > 0) {
            imgElement.src = allGalleryImages[currentImageIndex].src;
        }
    }

    function openLightbox(startIndex, images) {
        createLightboxStructure();
        allGalleryImages = images;
        currentImageIndex = startIndex;
        
        updateLightbox();
        lightbox.classList.add('visible');
        document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        document.body.style.overflow = ''; 
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + allGalleryImages.length) % allGalleryImages.length;
        updateLightbox();
    }
    
    function initializeLightbox() {
        // Obtenemos todas las imágenes para la galería
        const images = projects.map(item => item.querySelector('img'));
        
        // Adjuntamos el listener de click a cada item para abrir el lightbox
        projects.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index, images); 
            });
        });
    }

    // --- LÓGICA DE ARCHIVADOR Y SHUFFLE ---

    // Función para aplicar la ligera rotación aleatoria
    function applyRandomTilt(items) {
        items.forEach(item => {
            const tilt = (Math.random() * 3) - 1.5; 
            const shiftX = (Math.random() * 8) - 4; 

            // Aplicar la transformación CSS
            item.style.transform = `translateX(${shiftX}px) rotate(${tilt}deg)`;
        });
    }

    // Función de Ordenación Aleatoria (Shuffle)
    function shuffleAndApply(array) {
        let currentIndex = array.length, randomIndex;

        // Mezcla de Fisher-Yates
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        
        // Reinsertar los elementos mezclados en el DOM
        array.forEach(item => {
            galleryGrid.appendChild(item);
        });
        
        // 🟢 Aplicar la inclinación después de mezclar
        applyRandomTilt(array);
    }
    
    // --- Inicio del Script ---
    shuffleAndApply(projects);
    initializeLightbox(); 
});
