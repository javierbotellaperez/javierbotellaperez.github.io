document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const container = document.querySelector(".carousel-container");

    const totalImages = 75;
    let currentIndex = 0;
    
    // TIEMPO AUTOMÁTICO: Cambia cada 4000 milisegundos (4 segundos)
    const AUTO_SCROLL_INTERVAL = 4000; 
    let autoScrollTimer;

    // 1. Inyectar dinámicamente las 75 imágenes en la fila horizontal
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement("img");
        
        // ¡IMPORTANTE!: Si tus fotos no son .jpg, cambia esa extensión aquí debajo:
        img.src = `assets/Asset_${i}.jpg`; 
        
        img.alt = `Fotografía ${i}`;
        img.classList.add("carousel-image");
        img.loading = "lazy"; // Optimiza la carga para que la web vaya rápida
        
        // Imagen de respaldo por si falla la ruta de alguna foto
        img.onerror = () => { 
            img.src = 'https://via.placeholder.com/1100x650/111111/444444?text=Falta+Asset_' + i;
        };
        
        track.appendChild(img);
    }

    // 2. Mover el carrusel horizontalmente basándose en el porcentaje
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showNext() {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Al llegar al final, vuelve suavemente a la primera
        }
        updateCarousel();
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1; // Si retrocede en la primera, va a la última
        }
        updateCarousel();
    }

    // 3. Control del temporizador automático
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollTimer = setInterval(showNext, AUTO_SCROLL_INTERVAL);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // 4. Eventos de clics y mouse
    nextBtn.addEventListener("click", () => {
        showNext();
        startAutoScroll(); // Reinicia el tiempo al hacer clic
    });

    prevBtn.addEventListener("click", () => {
        showPrev();
        startAutoScroll(); // Reinicia el tiempo al hacer clic
    });

    // Pausa el carrusel automático si pones el mouse encima de la foto
    container.addEventListener("mouseenter", stopAutoScroll);
    // Lo reanuda cuando quitas el mouse
    container.addEventListener("mouseleave", startAutoScroll);

    // Ajuste de seguridad si se cambia el tamaño de la pantalla
    window.addEventListener("resize", updateCarousel);

    // Arranque inicial
    updateCarousel();
    startAutoScroll();
});
