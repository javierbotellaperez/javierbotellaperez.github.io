document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const counter = document.getElementById("carouselCounter");

    const totalImages = 75;
    let currentIndex = 0;

    // 1. Generar automáticamente las 75 imágenes en el HTML
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement("img");
        // Ajusta el formato (.jpg, .png, etc.) según sean tus archivos reales
        img.src = `assets/Asset_${i}.jpg`; 
        img.alt = `Asset ${i}`;
        img.classList.add("carousel-image");
        
        // Control de errores por si falta alguna imagen intermedia
        img.onerror = () => { img.src = 'https://via.placeholder.com/800x500?text=Error+Loading+Asset' };
        
        track.appendChild(img);
    }

    // 2. Función para actualizar la posición del carrusel
    function updateCarousel() {
        const width = track.clientWidth;
        // Movemos la pista hacia la izquierda multiplicando el ancho por el índice actual
        track.style.transform = `translateX(-${currentIndex * width}px)`;
        // Actualizamos el texto del contador
        counter.textContent = `${currentIndex + 1} / ${totalImages}`;
    }

    // 3. Eventos de los botones
    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Vuelve al inicio si llega al final
        }
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1; // Va al final si retrocede desde el inicio
        }
        updateCarousel();
    });

    // 4. Reajustar el carrusel si el usuario cambia el tamaño de la ventana del navegador
    window.addEventListener("resize", updateCarousel);
});
