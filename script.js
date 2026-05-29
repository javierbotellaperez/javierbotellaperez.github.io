document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");
    const nextBtn = document.getElementById("lightboxNext");
    const prevBtn = document.getElementById("lightboxPrev");
    const closeBtn = document.getElementById("closeBtn");
    const zoneLeft = document.getElementById("zoneLeft");
    const zoneRight = document.getElementById("zoneRight");

    const totalImages = 102;
    const totalVideos = 8;
    
    let currentMode = 'photo';
    let currentIndex = 1;

    // --- VARIABLES DE ANIMACIÓN POR SOFTWARE ---
    let posPhotos = 0;
    let posVideos = 0;
    
    // Velocidades base naturales (Reducidas y ajustadas, video +10%)
    let speedPhotos = -0.3; 
    let speedVideos = 0.55; 

    let currentSpeedPhotos = speedPhotos;
    let currentSpeedVideos = speedVideos;

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- CARGA MULTIMEDIA ---
    function loadPhotos() {
        for (let j = 0; j < 2; j++) {
            for (let i = 1; i <= totalImages; i++) {
                const img = document.createElement("img");
                img.src = `/assets/Asset_${formatNumber(i)}.jpg`;
                img.classList.add("carousel-image");
                img.onclick = () => openLightbox('photo', i);
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
                vid.muted = true; vid.autoplay = true; vid.loop = true; vid.playsInline = true;
                vid.onclick = () => openLightbox('video', i);
                vid.onerror = () => vid.remove();
                videoTrack.appendChild(vid);
            }
        }
    }

    // --- MOTOR DE MOVIMIENTO CONTINUO ANIMADO ---
    function animate() {
        if (!lightbox.classList.contains("active")) {
            posPhotos += currentSpeedPhotos;
            posVideos += currentSpeedVideos;

            // Bucles infinitos invisibles al llegar al 50% del ancho
            const halfPhotosWidth = photoTrack.scrollWidth / 2;
            if (Math.abs(posPhotos) >= halfPhotosWidth) posPhotos = 0;
            if (posVideos >= 0) posVideos = -halfPhotosWidth;
            if (Math.abs(posVideos) >= photoTrack.scrollWidth) posVideos = -halfPhotosWidth;

            photoTrack.style.transform = `translateX(${posPhotos}px)`;
            videoTrack.style.transform = `translateX(${posVideos}px)`;
        }
        requestAnimationFrame(animate);
    }

    // --- INTERACCIÓN DE VELOCIDAD POR ZONAS (HOVER) ---
    zoneLeft.addEventListener("mouseenter", () => {
        currentSpeedPhotos = speedPhotos * 4; // Acelera a la izquierda
        currentSpeedVideos = speedVideos * -4; // Invierte y acelera
    });

    zoneRight.addEventListener("mouseenter", () => {
        currentSpeedPhotos = speedPhotos * -4; // Invierte y acelera
        currentSpeedVideos = speedVideos * 4;  // Acelera a la derecha
    });

    // Al salir de los extremos, vuelve al ritmo relajado de galería
    function resetSpeed() {
        currentSpeedPhotos = speedPhotos;
        currentSpeedVideos = speedVideos;
    }
    zoneLeft.addEventListener("mouseleave", resetSpeed);
    zoneRight.addEventListener("mouseleave", resetSpeed);

    // Pausar si el ratón se posa sobre un elemento específico para ver la pieza
    photoTrack.addEventListener("mouseenter", () => { currentSpeedPhotos = 0; currentSpeedVideos = 0; });
    photoTrack.addEventListener("mouseleave", resetSpeed);
    videoTrack.addEventListener("mouseenter", () => { currentSpeedPhotos = 0; currentSpeedVideos = 0; });
    videoTrack.addEventListener("mouseleave", resetSpeed);

    // --- LÓGICA VISOR ---
    function openLightbox(mode, index) {
        currentMode = mode; currentIndex = index;
        updateContent(); lightbox.classList.add("active");
    }

    function closeLightbox() { lightbox.classList.remove("active"); lightboxVid.pause(); }

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
    if(closeBtn) closeBtn.onclick = closeLightbox;
    lightbox.onclick = closeLightbox;
    lightboxImg.onclick = (e) => e.stopPropagation();
    lightboxVid.onclick = (e) => e.stopPropagation();

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
