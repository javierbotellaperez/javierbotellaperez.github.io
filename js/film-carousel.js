/**
 * js/film-carousel.js
 * (Incluye funcionalidad de Autoplay Inteligente y Modal de Video Lightbox)
 */

document.addEventListener('DOMContentLoaded', () => {
    const filmStrip = document.getElementById('film-strip-carousel');
    
    if (!filmStrip) {
        // Inicializa el autoplay solo si no es la página de stickers (que usa otro script)
        const videos = document.querySelectorAll('.video-preview');
        videos.forEach(v => v.play()); 
        return;
    }
    
    const AUTO_SCROLL_SPEED = 1; 
    const AUTO_SCROLL_INTERVAL = 10; 
    const RESUME_DELAY = 500; 
    
    let autoScrollTimer = null;
    let resumeTimer = null;
    let originalWidth = 0; 
    
    // Clonación (El resto de la lógica de bucle se mantiene)
    const originalItems = Array.from(filmStrip.children);
    originalItems.forEach(item => {
        filmStrip.appendChild(item.cloneNode(true));
        filmStrip.appendChild(item.cloneNode(true));
    });


    // --- FUNCIONES DE SCROLL/AUTOPLAY ---
    
    function startAutoScroll() {
        if (autoScrollTimer !== null) return; 
        clearTimeout(resumeTimer); 

        autoScrollTimer = setInterval(() => {
            if (originalWidth === 0) { originalWidth = filmStrip.scrollWidth / 3; }
            filmStrip.scrollLeft += AUTO_SCROLL_SPEED;

            if (filmStrip.scrollLeft >= originalWidth) {
                filmStrip.scrollLeft -= originalWidth;
            } 
        }, AUTO_SCROLL_INTERVAL);
        
        // Iniciar todas las previews
        filmStrip.querySelectorAll('.video-preview').forEach(v => v.play());
    }
    
    function stopAutoScroll() {
        if (autoScrollTimer !== null) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
        // Pausar todas las previews
        filmStrip.querySelectorAll('.video-preview').forEach(v => v.pause());

        clearTimeout(resumeTimer); 
        resumeTimer = setTimeout(() => {
            startAutoScroll();
        }, RESUME_DELAY);
    }
    
    // --- LÓGICA DE APERTURA DE VIDEO MODAL (LIGHTBOX) ---

    function openVideoModal(url) {
        // Pausamos el carrusel
        stopAutoScroll(); // Pausa el autoplay

        // Creamos el modal dinámicamente
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

        // Eventos de cerrar y stop video
        const closeBtn = modal.querySelector('.video-close-btn');
        const videoElement = modal.querySelector('.full-screen-video');

        const closeModal = () => {
            videoElement.pause();
            modal.remove();
            document.body.style.overflow = '';
            startAutoScroll(); // 🟢 Reanudar el carrusel al cerrar
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(); // Cerrar si se clica fuera del contenido
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // --- LÓGICA DE INTERACCIÓN Y AUTOPLAY INTELIGENTE ---

    function handleManualScrollStart() {
        stopAutoScroll(); 
        filmStrip.addEventListener('scroll', handleScrollActivity);
    }
    
    let scrollActivityTimer = null;
    function handleScrollActivity() {
        clearTimeout(resumeTimer); 
        
        // Lógica de salto de bucle
        if (originalWidth !== 0) {
            if (filmStrip.scrollLeft >= originalWidth) {
                filmStrip.scrollLeft -= originalWidth;
            } 
        }

        clearTimeout(scrollActivityTimer);

        scrollActivityTimer = setTimeout(() => {
            startAutoScroll(); 
            filmStrip.removeEventListener('scroll', handleScrollActivity);
        }, 150); 
    }
    
    // Inicialización
    function initializeScroll() {
        // Calculamos el ancho inicial después de que se rendericen los clones
        originalWidth = filmStrip.scrollWidth / 3;
        filmStrip.scrollLeft = originalWidth;

        filmStrip.addEventListener('scroll', handleLoopingScroll);
        filmStrip.addEventListener('wheel', handleManualScrollStart, false);
        filmStrip.addEventListener('touchstart', handleManualScrollStart, false);
        
        // Eventos Hover para Previews (Para navegadores que no inician el video por defecto)
        filmStrip.querySelectorAll('.video-preview').forEach(video => {
            video.addEventListener('mouseenter', () => { video.play(); });
            video.addEventListener('mouseleave', () => { video.pause(); });
        });
        
        startAutoScroll();
    }
    
    setTimeout(initializeScroll, 200); 
});
