document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const containerPhotos = document.getElementById("containerPhotos");
    const containerVideos = document.getElementById("containerVideos");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");
    const nextBtn = document.getElementById("lightboxNext");
    const prevBtn = document.getElementById("lightboxPrev");
    const closeBtn = document.getElementById("closeBtn");

    // Configuración de volumen de archivos
    const totalImages = 114;
    const totalVideos = 8;
    
    let currentMode = 'photo';
    let currentIndex = 1;

    // --- VARIABLES DE ANIMACIÓN ---
    let posPhotos = 0;
    let posVideos = 0;
    
    const baseSpeedPhotos = -0.3; 
    const baseSpeedVideos = 0.55; 

    let currentSpeedPhotos = baseSpeedPhotos;
    let currentSpeedVideos = baseSpeedVideos;

    // Variables de inercia para lanzamiento táctil
    let inertiaPhotos = 0;
    let inertiaVideos = 0;
    const friction = 0.95; 

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- FUNCIÓN ALGORÍTMICA PARA MEZCLAR EL ORDEN (Fisher-Yates Shuffle) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[array[j]]] = [array[j], array[array[i]]];
        }
        return array;
    }

    // --- CARGA MULTIMEDIA ALEATORIA ---
    function loadPhotos() {
        // Creamos una lista base ordenada del 1 al 114
        let textIndexes = Array.from({length: totalImages}, (_, i) => i + 1);
        
        // Multiplicamos por 2 para el efecto de bucle infinito, barajando en cada tanda
        for (let j = 0; j < 2; j++) {
            let shuffledIndexes = shuffleArray([...textIndexes]);
            
            shuffledIndexes.forEach(i => {
                const img = document.createElement("img");
                img.src = `/assets/Asset_${formatNumber(i)}.jpg`;
                img.classList.add("carousel-image");
                img.dataset.index = i; // Guardamos el número real para el Lightbox
                img.onerror = () => img.remove();
                photoTrack.appendChild(img);
            });
        }
    }

    function loadVideos() {
        // Creamos una lista base ordenada del 1 al 8
        let videoIndexes = Array.from({length: totalVideos}, (_, i) => i + 1);
        
        for (let j = 0; j < 4; j++) {
            let shuffledIndexes = shuffleArray([...videoIndexes]);
            
            shuffledIndexes.forEach(i => {
                const container = document.createElement("div");
                container.classList.add("carousel-image-container");

                const img = document.createElement("img");
                img.src = `/assets/VidThumb_${formatNumber(i)}.jpg`;
                img.classList.add("carousel-image");
                img.dataset.index = i; // Guardamos el número real para el Lightbox
                img.onerror = () => container.remove();

                container.appendChild(img);
                videoTrack.appendChild(container);
            });
        }
    }

    // --- MOTOR DE MOVIMIENTO CON FÍSICAS DE INERCIA ---
    function animate() {
        if (!lightbox.classList.contains("active")) {
            
            // Aplicamos inercia si el usuario ha lanzado la fila con el dedo
            if (Math.abs(inertiaPhotos) > 0.05) {
                posPhotos += inertiaPhotos;
                inertiaPhotos *= friction;
            } else {
                posPhotos += currentSpeedPhotos;
            }

            if (Math.abs(inertiaVideos) > 0.05) {
                posVideos += inertiaVideos;
                inertiaVideos *= friction;
            } else {
                posVideos += currentSpeedVideos;
            }

            // Reseteos para que el carrusel sea infinito y no se corte
            const halfPhotosWidth = photoTrack.scrollWidth / 2;
            if (posPhotos >= 0) posPhotos = -halfPhotosWidth;
            if (Math.abs(posPhotos) >= photoTrack.scrollWidth) posPhotos = -halfPhotosWidth;
            
            const halfVideosWidth = videoTrack.scrollWidth / 2;
            if (posVideos >= 0) posVideos = -halfVideosWidth;
            if (Math.abs(posVideos) >= videoTrack.scrollWidth) posVideos = -halfVideosWidth;

            photoTrack.style.transform = `translateX(${posPhotos}px)`;
            videoTrack.style.transform = `translateX(${posVideos}px)`;
        }
        requestAnimationFrame(animate);
    }

    // --- TRUCO MAESTRO: TRASPASAR EL CLIC EN ZONAS HOVER INVISIBLES ---
    function setupSmartClick(zone, mode) {
        zone.addEventListener("click", (e) => {
            zone.style.pointerEvents = "none";
            const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
            zone.style.pointerEvents = "auto";

            if (elementBelow) {
                const img = elementBelow.classList.contains("carousel-image") ? elementBelow : elementBelow.querySelector(".carousel-image");
                if (img) {
                    const index = parseInt(img.dataset.index);
                    if (index) openLightbox(mode, index);
                }
            }
        });
    }

    // --- GESTOR TÁCTIL (MOVIMIENTO ÁGIL Y LANZAMIENTO) ---
    function setupTouchScroll(container, type) {
        let startX = 0;
        let lastX = 0;
        let lastTime = 0;
        let speedX = 0;
        let isDragging = false;

        container.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            lastX = startX;
            lastTime = performance.now();
            isDragging = true;
            
            if (type === 'photo') inertiaPhotos = 0;
            if (type === 'video') inertiaVideos = 0;
        }, { passive: true });

        container.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentTime = performance.now();
            const diffX = currentX - lastX;
            const timeDiff = currentTime - lastTime;

            if (timeDiff > 0) {
                speedX = diffX / timeDiff * 15; 
            }

            if (type === 'photo') posPhotos += diffX;
            else posVideos += diffX;

            lastX = currentX;
            lastTime = currentTime;
        }, { passive: true });

        container.addEventListener("touchend", () => {
            isDragging = false;
            if (type === 'photo') {
                inertiaPhotos = speedX;
                if (Math.abs(inertiaPhotos) < 1) inertiaPhotos = 0;
            } else {
                inertiaVideos = speedX;
                if (Math.abs(inertiaVideos) < 1) inertiaVideos = 0;
            }
            speedX = 0;
        });
    }

    // --- CONTROL DE ACELERACIÓN POR CURSOR (Escritorio) ---
    const photoLeftZone = containerPhotos.querySelector(".zone-left");
    const photoRightZone = containerPhotos.querySelector(".zone-right");

    photoLeftZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * -8); 
    photoRightZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * 8);  
    containerPhotos.addEventListener("mouseleave", () => currentSpeedPhotos = baseSpeedPhotos);
    
    setupSmartClick(photoLeftZone, 'photo');
    setupSmartClick(photoRightZone, 'photo');

    const videoLeftZone = containerVideos.querySelector(".zone-left");
    const videoRightZone = containerVideos.querySelector(".zone-right");

    videoLeftZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * -8); 
    videoRightZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * 8);  
    containerVideos.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);

    setupSmartClick(videoLeftZone, 'video');
    setupSmartClick(videoRightZone, 'video');

    // Pausas físicas al poner el cursor en el centro (Escritorio)
    photoTrack.addEventListener("mouseenter", () => currentSpeedPhotos = 0);
    photoTrack.addEventListener("mouseleave", () => currentSpeedPhotos = baseSpeedPhotos);
    photoTrack.addEventListener("click", (e) => {
        if(e.target.classList.contains("carousel-image")) {
            openLightbox('photo', parseInt(e.target.dataset.index));
        }
    });

    videoTrack.addEventListener("mouseenter", () => currentSpeedVideos = 0);
    videoTrack.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);
    videoTrack.addEventListener("click", (e) => {
        const img = e.target.classList.contains("carousel-image") ? e.target : e.target.querySelector(".carousel-image");
        if(img) {
            openLightbox('video', parseInt(img.dataset.index));
        }
    });

    // Activamos las funciones de arrastre táctil para smartphone
    setupTouchScroll(containerPhotos, 'photo');
    setupTouchScroll(containerVideos, 'video');

    // --- GESTIÓN INTERNA DEL VISOR (LIGHTBOX) ---
    function openLightbox(mode, index) {
        currentMode = mode; currentIndex = index;
        updateContent(); lightbox.classList.add("active");
    }

    function closeLightbox() { lightbox.classList.remove("active"); lightboxVid.pause(); }

    document.getElementById("closeBtn").onclick = closeLightbox;
    lightbox.onclick = closeLightbox;
    lightboxImg.onclick = (e) => e.stopPropagation();
    lightboxVid.onclick = (e) => e.stopPropagation();

    function updateContent() {
        const formatted = formatNumber(currentIndex);
        lightbox.classList.remove("show-img", "show-vid");
        lightboxVid.pause();
        if (currentMode === 'photo') {
            lightboxImg.src = `/assets/Asset_${formatted}.jpg`; lightbox.classList.add("show-img");
        } else {
            lightboxVid.src = `/videos/Video_${formatted}.mp4`; lightbox.classList.add("show-vid"); lightboxVid.play();
        }
    }

    function change(delta) {
        const total = (currentMode === 'photo') ? totalImages : totalVideos;
        currentIndex = (currentIndex + delta - 1 + total) % total + 1;
        updateContent();
    }

    if(nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); change(1); };
    if(prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); change(-1); };

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") change(1);
        else if (e.key === "ArrowLeft") change(-1);
    });

    // Inicializamos las cargas y el bucle de renderizado
    loadPhotos();
    loadVideos();
    animate();
});
