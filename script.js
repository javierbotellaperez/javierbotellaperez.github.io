document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");

    const totalImages = 102;
    const totalVideos = 8;
    
    let currentMode = 'photo'; // 'photo' o 'video'
    let currentIndex = 1;

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- CARGAR FOTOS ---
    function loadPhotos() {
        for (let j = 0; j < 2; j++) { // Doble tanda para infinito
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

    // --- CARGAR VIDEOS ---
    function loadVideos() {
        for (let j = 0; j < 4; j++) { // Cuatro tandas para que la fila sea larga
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

    // --- LÓGICA VISOR ---
    function openLightbox(mode, index) {
        currentMode = mode;
        currentIndex = index;
        updateContent();
        lightbox.classList.add("active");
    }

    function updateContent() {
        const formatted = formatNumber(currentIndex);
        lightbox.classList.remove("show-img", "show-vid");
        lightboxVid.pause();

        if (currentMode === 'photo') {
            lightboxImg.src = `/assets/Asset_${formatted}.jpg`;
            lightbox.classList.add("show-img");
        } else {
            lightboxVid.src = `/videos/Video_${formatted}.mp4`;
            lightbox.classList.add("show-vid");
            lightboxVid.play();
        }
    }

    function change(delta) {
        const total = (currentMode === 'photo') ? totalImages : totalVideos;
        currentIndex = (currentIndex + delta - 1 + total) % total + 1;
        updateContent();
    }

    // Eventos
    document.getElementById("nextBtn").onclick = (e) => { e.stopPropagation(); change(1); };
    document.getElementById("prevBtn").onclick = (e) => { e.stopPropagation(); change(-1); };
    document.getElementById("closeBtn").onclick = () => { lightbox.classList.remove("active"); lightboxVid.pause(); };
    lightbox.onclick = () => { lightbox.classList.remove("active"); lightboxVid.pause(); };

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") lightbox.classList.remove("active");
        if (e.key === "ArrowRight") change(1);
        if (e.key === "ArrowLeft") change(-1);
    });

    loadPhotos();
    loadVideos();
});
