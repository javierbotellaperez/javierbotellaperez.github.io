document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const containerPhotos = document.getElementById("containerPhotos");
    const containerVideos = document.getElementById("containerVideos");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");
    const lightboxCredits = document.getElementById("lightboxCredits"); // Añadido para la columna de créditos
    const nextBtn = document.getElementById("lightboxNext");
    const prevBtn = document.getElementById("lightboxPrev");
    const closeBtn = document.getElementById("closeBtn");

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

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- ALGORITMO DE BARAJADO ANTIREPETICIÓN ---
    function getSmartShuffledSequence(totalCount, duplicatesNeeded) {
        let base = Array.from({length: totalCount}, (_, i) => i + 1);
        
        // Función interna Fisher-Yates
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        let fullSequence = [];
        let lastBatch = [];

        for (let d = 0; d < duplicatesNeeded; d++) {
            let currentBatch = shuffle([...base]);
            
            // Si el primer elemento de esta tanda coincide con el último de la anterior, lo movemos al final
            if (lastBatch.length > 0 && currentBatch[0] === lastBatch[lastBatch.length - 1]) {
                const first = currentBatch.shift();
                currentBatch.push(first);
            }
            
            fullSequence = fullSequence.concat(currentBatch);
            lastBatch = currentBatch;
        }

        // Validación final de seguridad para el salto del bucle infinito (Fin del carrusel con el principio)
        if (fullSequence[fullSequence.length - 1] === fullSequence[0]) {
            // Intercambiamos el último elemento con el penúltimo para romper la coincidencia
            const len = fullSequence.length;
            [fullSequence[len - 1], fullSequence[len - 2]] = [fullSequence[len - 2], fullSequence[len - 1]];
        }

        return fullSequence;
    }

    // --- CARGA MULTIMEDIA CONTROLADA ---
    function loadPhotos() {
        // Generamos la secuencia larga aleatoria sin colisiones de extremos
        const photoSequence = getSmartShuffledSequence(totalImages, 2);
        
        photoSequence.forEach(i => {
            const img = document.createElement("img");
            img.src = `/assets/Asset_${formatNumber(i)}.jpg`;
            img.classList.add("carousel-image");
            img.dataset.index = i;
            img.onerror = () => img.remove();
            photoTrack.appendChild(img);
        });
    }

    function loadVideos() {
        // Generamos la secuencia larga de miniaturas de vídeo sin colisiones
        const videoSequence = getSmartShuffledSequence(totalVideos, 4);
        
        videoSequence.forEach(i => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("video-item-wrapper");
            wrapper.dataset.index = i;

            const img = document.createElement("img");
            img.src = `/assets/VidThumb_${formatNumber(i)}.jpg`;
            img.classList.add("carousel-image");
            img.onerror = () => wrapper.remove();

            wrapper.appendChild(img);
            videoTrack.appendChild(wrapper);
        });
    }

    // --- MOTOR DE MOVIMIENTO ---
    function animate() {
        if (!lightbox.classList.contains("active")) {
            posPhotos += currentSpeedPhotos;
            posVideos += currentSpeedVideos;

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

    // --- TRUCO MAESTRO: TRASPASAR EL CLIC DESDE LAS ZONAS DE ACELERACIÓN ---
    function setupSmartClick(zone, mode) {
        zone.addEventListener("click", (e) => {
            zone.style.pointerEvents = "none";
            const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
            zone.style.pointerEvents = "auto";

            if (elementBelow) {
                const target = elementBelow.closest(".carousel-image, .video-item-wrapper");
                if (target) {
                    const index = parseInt(target.dataset.index);
                    if (index) openLightbox(mode, index);
                }
            }
        });
    }

    // --- INTERACCIÓN TÁCTIL PARA MÓVILES (Optimizado: Más rápido y fluido) ---
    function setupTouchScroll(container, type) {
        let startX = 0;
        let isDragging = false;
        let lastDiffX = 0;
        let inertiaFrame = null;

        container.addEventListener("touchstart", (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            lastDiffX = 0;
            if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
        }, { passive: true });

        container.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            // Incrementamos la sensibilidad de respuesta del dedo multiplicando la diferencia
            lastDiffX = (currentX - startX) * 2.2; 

            if (type === 'photo') {
                currentSpeedPhotos = baseSpeedPhotos + lastDiffX;
            } else {
                currentSpeedVideos = baseSpeedVideos + lastDiffX;
            }
            
            startX = currentX; 
        }, { passive: true });

        container.addEventListener("touchend", () => {
            isDragging = false;
            
            // Función de inercia para simular un deslizamiento rápido que desacelera de manera orgánica
            function applyInertia() {
                if (Math.abs(lastDiffX) < 0.1) {
                    if (type === 'photo') currentSpeedPhotos = baseSpeedPhotos;
                    if (type === 'video') currentSpeedVideos = baseSpeedVideos;
                    return;
                }
                
                lastDiffX *= 0.92; // Factor de fricción (pérdida de velocidad progresiva)
                
                if (type === 'photo') {
                    currentSpeedPhotos = baseSpeedPhotos + lastDiffX;
                } else {
                    currentSpeedVideos = baseSpeedVideos + lastDiffX;
                }
                
                inertiaFrame = requestAnimationFrame(applyInertia);
            }
            
            applyInertia();
        });
    }

    // --- ESCUCHA DE HOVERS (Ordenador Escritorio) ---
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

    // Pausas al poner el ratón encima del eje central
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
        const target = e.target.closest(".video-item-wrapper");
        if(target) {
            openLightbox('video', parseInt(target.dataset.index));
        }
    });

    setupTouchScroll(containerPhotos, 'photo');
    setupTouchScroll(containerVideos, 'video');

    // --- LIGHTBOX VISOR ---
    function openLightbox(mode, index) {
        currentMode = mode; currentIndex = index;
        updateContent(); lightbox.classList.add("active");
    }

    // FUNCIÓN DE CIERRE OPTIMIZADA: Reinicia el estado completo del visor
    function closeLightbox() { 
        lightbox.classList.remove("active", "show-img", "show-vid"); 
        
        // Pausamos el vídeo y vaciamos los src de ambos elementos para que no se queden en caché
        lightboxVid.pause(); 
        lightboxVid.removeAttribute('src'); 
        lightboxVid.load(); // Fuerza al navegador a liberar el archivo de vídeo anterior
        
        lightboxImg.removeAttribute('src');
        
        // Limpiamos los créditos para que no aparezcan los antiguos antes de cargar los nuevos
        if (lightboxCredits) lightboxCredits.innerHTML = "";
    }

    document.getElementById("closeBtn").onclick = closeLightbox;
    lightbox.onclick = closeLightbox;
    lightboxImg.onclick = (e) => e.stopPropagation();
    lightboxVid.onclick = (e) => e.stopPropagation();
    if (lightboxCredits) lightboxCredits.onclick = (e) => e.stopPropagation();

    function updateContent() {
        const formatted = formatNumber(currentIndex);
        
        // Eliminamos las clases de visualización previas y pausamos antes de inyectar lo nuevo
        lightbox.classList.remove("show-img", "show-vid");
        lightboxVid.pause();
        
        if (currentMode === 'photo') {
            lightboxImg.src = `/assets/Asset_${formatted}.jpg`; 
            lightbox.classList.add("show-img");
            
            // Gestión de créditos para fotografías
            if (lightboxCredits) {
                lightboxCredits.innerHTML = `
                    <h3>Fotografía #${currentIndex}</h3>
                    <p>Javier Botella Pérez</p>
                    <p>Personal Project</p>
                `;
            }
        } else {
            lightboxVid.src = `/videos/Video_${formatted}.mp4`; 
            lightbox.classList.add("show-vid"); 
            lightboxVid.play();
            
            // Gestión de créditos dinámicos para vídeo con la línea de separación extra
            if (lightboxCredits) {
                lightboxCredits.innerHTML = `
                    <h3>Proyecto de Vídeo #${currentIndex}</h3>
                    <p>Client / Artist Name</p>
                    <p>Production Credit</p>
                    <p>2024</p>
                    <div class="extra-credits-wrapper">
                        <p><strong>Director:</strong> Director Name</p>
                        <p><strong>DoP:</strong> DoP Name</p>
                    </div>
                `;
            }
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

    loadPhotos();
    loadVideos();
    animate();
});
