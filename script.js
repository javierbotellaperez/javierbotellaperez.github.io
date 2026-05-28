document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");

    // ⚠️ PON AQUÍ EL NÚMERO EXACTO DE FOTOS QUE TIENES AHORA (Ej: 85, 90, 100...)
    const totalImages = 102; 
    let activeIndex = 1;

    // Función para crear las imágenes de la cinta
    function createImg(index) {
        const img = document.createElement("img");
        img.src = `assets/Asset_${index}.jpg`; // Cambia a .png si tus fotos usan ese formato
        img.alt = `Fotografía ${index}`;
        img.classList.add("carousel-image");
        
        // Al hacer clic en una foto de la cinta, abre el visor a pantalla completa
        img.addEventListener("click", () => {
            openLightbox(index);
        });

        img.onerror = () => { 
            img.style.display = 'none'; // Si no existe la foto, la oculta para no romper el diseño
        };
        return img;
    }

    // 1. Inyectamos la tanda original y su clon para el bucle infinito
    for (let i = 1; i <= totalImages; i++) track.appendChild(createImg(i));
    for (let i = 1; i <= totalImages; i++) track.appendChild(createImg(i));

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
        lightboxImg.src = `assets/Asset_${activeIndex}.jpg`;
    }

    function nextPhoto() {
        if (activeIndex < totalImages) {
            activeIndex++;
        } else {
            activeIndex = 1; // Vuelve a la primera foto
        }
        updateLightboxImage();
    }

    function prevPhoto() {
        if (activeIndex > 1) {
            activeIndex--;
        } else {
            activeIndex = totalImages; // Va a la última foto
        }
        updateLightboxImage();
    }

    // 3. Eventos del Visor (Clicks y Teclado)
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextPhoto(); });
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevPhoto(); });
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", closeLightbox); // Cierra también si clicas al fondo negro

    // Evita cerrar el visor si clicas justo encima de la foto grande
    lightboxImg.addEventListener("click", (e) => { e.stopPropagation(); });

    // CONTROL POR TECLADO (ESC, Flecha Izquierda, Flecha Derecha)
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return; // Si el visor está cerrado, no hace nada
        
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            nextPhoto();
        } else if (e.key === "ArrowLeft") {
            prevPhoto();
        }
    });
});
