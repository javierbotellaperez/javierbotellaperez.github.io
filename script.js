document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");

    // Configuración exacta de tus archivos actuales
    const totalImages = 102; 
    let activeIndex = 1;

    // Función mágica para convertir el número 1 en "00001", el 12 en "00012", etc.
    function formatNumber(num) {
        return String(num).padStart(5, '0');
    }

    // Función segura para crear imágenes
    function createImg(index) {
        const img = document.createElement("img");
        const formattedIndex = formatNumber(index);
        
        // Ahora la ruta buscará exactamente: /assets/Asset_00001.jpg
        img.src = `/assets/Asset_${formattedIndex}.jpg`; 
        img.alt = `Fotografía ${formattedIndex}`;
        img.classList.add("carousel-image");
        
        // Al hacer clic, abre el visor
        img.addEventListener("click", () => {
            openLightbox(index);
        });

        // Si alguna foto de la secuencia falta, se oculta para no romper la web
        img.onerror = () => { 
            img.remove(); 
        };
        
        return img;
    }

    // 1. Inyectamos las 102 fotos originales y sus 102 clones para el bucle infinito
    for (let i = 1; i <= totalImages; i++) {
        track.appendChild(createImg(i));
    }
    for (let i = 1; i <= totalImages; i++) {
        track.appendChild(createImg(i));
    }

    // 2. Lógica del Visor (Lightbox)
    function openLightbox(index) {
        activeIndex = index;
        updateLightboxImage();
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    function updateLightboxImage() {
        const formattedIndex = formatNumber(activeIndex);
        lightboxImg.src = `/assets/Asset_${formattedIndex}.jpg`;
    }

    function nextPhoto() {
        if (activeIndex < totalImages) {
            activeIndex++;
        } else {
            activeIndex = 1;
        }
        updateLightboxImage();
    }

    // Corregido el retroceso para que vaya a la 102 si estás en la 1
    function prevPhoto() {
        if (activeIndex > 1) {
            activeIndex--;
        } else {
            activeIndex = totalImages;
        }
        updateLightboxImage();
    }

    // 3. Eventos del visor y teclado
    if(nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextPhoto(); });
    if(prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevPhoto(); });
    if(closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if(lightbox) lightbox.addEventListener("click", closeLightbox);

    if(lightboxImg) {
        lightboxImg.addEventListener("click", (e) => { e.stopPropagation(); });
        lightboxImg.onerror = () => { nextPhoto(); };
    }

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") nextPhoto();
        else if (e.key === "ArrowLeft") prevPhoto();
    });
});
