/**
 * js/film-carousel.js
 * Solución final: Bucle Infinito, Autoplay Inteligente y Modal de Video.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) return;
    
    const AUTO_SCROLL_SPEED = 1; 
    const AUTO_SCROLL_INTERVAL = 10; 
    const RESUME_DELAY = 500; 
    
    let autoScrollTimer = null;
    let resumeTimer = null;
    let originalWidth = 0; 
    
    // 1. Clonación del contenido
    const originalItems = Array.from(filmStrip.children);
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true));
    });


    // --- FUNCIONES DE SCROLL/AUTOPLAY ---
    
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        clearTimeout(resumeTimer); 

        // Iniciar todas las previews
        filmStrip.querySelectorAll('.video-preview').forEach(v => v.play());

        autoScrollTimer = setInterval(() => {
            if (originalWidth === 0) { originalWidth = filmStrip.scrollWidth / 2; }
            
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            // Condición de Bucle Infinito: Si el scroll pasa el ancho original, saltamos.
            if (filmStrip.scrollLeft >= originalWidth) {
                filmStrip.scrollLeft -= originalWidth;
            } 
        }, AUTO_SCROLL_INTERVAL);
    }
    
    function stopAutoScroll() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
        // Pausar todas las previews
        filmStrip.querySelectorAll('.video-preview').forEach(v => v.pause());
    }

    function stopAutoScrollAndPrepareResume() {
        stopAutoScroll();
        clearTimeout(resumeTimer); 
        resumeTimer = setTimeout(() => {
            startAutoScroll();
        }, RESUME_DELAY);
    }
    
    // Función de bucle que funciona con el scroll manual
    function handleLoopingScroll() {
        if (originalWidth === 0) { originalWidth = filmStrip.scrollWidth / 2; }
        
        // Salto hacia adelante
        if (filmStrip.scrollLeft >= originalWidth) {
            filmStrip.scrollLeft -= originalWidth;
        }
        // Salto inverso
        else if (filmStrip.scrollLeft < 1) { 
            filmStrip.scrollLeft += originalWidth;
        }
    }


    // --- Lógica de Interacción del Usuario ---

    function handleManualScrollStart() {
        stopAutoScroll(); 
        filmStrip.addEventListener('scroll', handleScrollActivity);
    }
    
    let scrollActivityTimer = null;

    function handleScrollActivity() {
        clearTimeout(resumeTimer); 
        handleLoopingScroll(); // Mantiene el bucle infinito al hacer scroll manual

        clearTimeout(scrollActivityTimer);

        scrollActivityTimer = setTimeout(() => {
            stopAutoScrollAndPrepareResume(); 
            filmStrip.removeEventListener('scroll', handleScrollActivity);
        }, 150); // Detecta que la inercia del scroll ha terminado
    }


    // --- Lógica de Apertura de Video Modal ---
    
    function openVideoModal(url) {
        stopAutoScroll(); 

        const modal = document.createElement('div');
        modal.classList.add('video-lightbox');
        modal.innerHTML = `
            <div class="video-lightbox-content">
                <span class="video-close-btn">x</span>
                <video src="${url}" controls autoplay playsinline class="full-screen-video"></video>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        const videoElement = modal.querySelector('.full-screen-video');

        const closeModal = () => {
            videoElement.pause();
            modal.remove();
            document.body.style.overflow = '';
            startAutoScroll(); 
        };

        modal.querySelector('.video-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(); 
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }


    // --- Inicialización ---

    filmStrip.addEventListener('click', (e) => {
        const link = e.target.closest('.video-link');
        if (link) {
            e.preventDefault(); 
            const videoUrl = link.getAttribute('data-video-url');
            
            const previewVideo = link.querySelector('.video-preview');
            if (previewVideo) {
                previewVideo.pause(); // Pausa la preview en el carrusel
            }
            
            openVideoModal(videoUrl);
        }
    });

    function initializeScroll() {
        // Calculamos el ancho inicial
        originalWidth = filmStrip.scrollWidth / 2;
        filmStrip.scrollLeft = originalWidth;

        filmStrip.addEventListener('scroll', handleLoopingScroll);

        filmStrip.addEventListener('wheel', handleManualScrollStart, false);
        filmStrip.addEventListener('touchstart', handleManualScrollStart, false);
        
        startAutoScroll();
    }
    
    setTimeout(initializeScroll, 200); 
});
