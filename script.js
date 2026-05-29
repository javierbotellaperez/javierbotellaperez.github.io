document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");
    const nextBtn = document.getElementById("lightboxNext");
    const prevBtn = document.getElementById("lightboxPrev");
    const closeBtn = document.getElementById("closeBtn");

    const totalImages = 102;
    const totalVideos = 8;
    
    let currentMode = 'photo';
    let currentIndex = 1;

    function formatNumber(num) { 
        return String(num).padStart(5, '0'); 
    }

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
                vid.muted = true; 
                vid.autoplay = true; 
                vid.loop = true; 
                vid.playsInline = true;
                vid.onclick = () => openLightbox('video', i);
                vid.onerror = () => vid.remove();
                videoTrack.appendChild(vid);
            }
        }
    }

    function openLightbox(mode, index) {
        currentMode = mode;
        currentIndex = index;
        updateContent();
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightboxVid.pause();
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
});
