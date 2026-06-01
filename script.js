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

    // --- CARGA MULTIMEDIA ---
    function loadPhotos() {
        for (let j = 0; j < 2; j++) {
            for (let i = 1; i <= totalImages; i++) {
                const img = document.createElement("img");
                img.src = `/assets/Asset_${formatNumber(i)}.jpg`;
                img.classList.add("carousel-image");
                img.dataset.index = i; // Guardamos su número real
                img.onerror = () => img.remove();
                photoTrack.appendChild(img);
            }
        }
    }

    function loadVideos() {
        for (let j = 0; j < 4; j++) {
            for (let i = 1; i <= totalVideos; i++) {
                const vid = document.createElement("video");
                vid.src = `/videos/Video_${formatNumber(i)}.mp4`;
                vid.classList.add("carousel-video-thumb");
                vid.dataset.index = i; // Guardamos su número real
                vid.muted = true; vid.autoplay = true; vid.loop = true; vid.playsInline = true;
                vid.onerror = () => vid.remove();
                videoTrack.appendChild(vid);
            }
        }
    }

    // --- MOTOR DE MOVIMIENTO ---
    function animate() {
        if (!lightbox.classList.contains("active")) {
            posPhotos += currentSpeedPhotos;
            posVideos += currentSpeedVideos;

            const halfPhotosWidth = photoTrack.scrollWidth / 2;
            if (Math.abs(posPhotos) >= halfPhotosWidth) posPhotos = 0;
            
            const halfVideosWidth = videoTrack.scrollWidth / 2;
            if (posVideos >= 0) posVideos = -halfVideosWidth;
            if (Math.abs(posVideos) >= videoTrack.scrollWidth) posVideos = -halfVideosWidth;

            photoTrack.style.transform = `translateX(${posPhotos}px)`;
            videoTrack.style.transform = `translateX(${posVideos}px)`;
        }
        requestAnimationFrame(animate);
    }

    // --- TRUCO MAESTRO: TRASTOCAR EL CLIC AL ELEMENTO DE ABAJO ---
    function setupSmartClick(zone, mode) {
        zone.addEventListener("click", (e) => {
            // Ocultamos la zona un microsegundo para ver qué hay debajo
            zone.style.pointerEvents = "none";
            const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
            zone.style.pointerEvents = "auto";

            // Si lo que había debajo es una foto o un video del carrusel, lo abrimos
            if (elementBelow && (elementBelow.classList.contains("carousel-image") || elementBelow.classList.contains("carousel-video-thumb"))) {
                const index = parseInt(elementBelow.dataset.index);
                if (index) openLightbox(mode, index);
            }
        });
    }

    // --- ESCUCHA DE HOVERS E INTERSECCIÓN DE CLICS ---
    
    // Fila de Fotos
    const photoLeftZone = containerPhotos.querySelector(".zone-left");
    const photoRightZone = containerPhotos.querySelector(".zone-right");

    photoLeftZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * 4);
    photoRightZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * -4);
    containerPhotos.addEventListener("mouseleave", () => currentSpeedPhotos = baseSpeedPhotos);
    
    // Activamos el clic inteligente en las zonas de las fotos
    setupSmartClick(photoLeftZone, 'photo');
    setupSmartClick(photoRightZone, 'photo');

    // Fila de Videos
    const videoLeftZone = containerVideos.querySelector(".zone-left");
    const videoRightZone = containerVideos.querySelector(".zone-right");

    videoLeftZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * -4);
    videoRightZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * 4);
    containerVideos.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);

    // Activamos el clic inteligente en las zonas de los videos
    setupSmartClick(videoLeftZone, 'video');
    setupSmartClick(videoRightZone, 'video');

    // Pausa si el ratón se queda fijo en el centro (directamente sobre los tracks)
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
        if(e.target.classList.contains("carousel-video-thumb")) {
            openLightbox('video', parseInt(e.target.dataset.index));
        }
    });

    // --- LÓGICA VISOR ---
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

    loadPhotos();
    loadVideos();
    animate();
});
