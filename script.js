document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const container = document.querySelector(".carousel-container");

    const totalImages = 75;
    let currentIndex = 0;
    
    // Configuración del tiempo: 4000 milisegundos = 4 segundos
    const AUTO_SCROLL_INTERVAL = 4000; 
    let autoScrollTimer;

    // 1. Generar tus 75 imágenes automáticamente
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement("img");
        img.src = `assets/Asset_${i}.jpg`; // Si tus fotos son .png, cámbialo aquí
        img.alt = `Fotografía ${i}`;
        img.classList.add("carousel-image");
        img.loading = "lazy";
        
        img.onerror = () => { 
            img.src = 'https://via.placeholder.com/900x550/ffffff/cccccc?text=Asset+' + i;
        };
        
        track.appendChild(img);
    }

    // 2. Mover la tira de imágenes
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showNext() {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Vuelve a la primera al terminar
        }
        updateCarousel();
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1; // Va a la última
        }
        updateCarousel();
    }

    // 3. Lógica del movimiento automático
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollTimer = setInterval(showNext, AUTO_SCROLL_INTERVAL);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // 4. Eventos de los botones y ratón
    nextBtn.addEventListener("click", () => {
        showNext();
        startAutoScroll(); // Reinicia el temporizador
    });

    prevBtn.addEventListener("click", () => {
        showPrev();
        startAutoScroll(); // Reinicia el temporizador
    });

    // Pausar al poner el ratón encima, reanudar al quitarlo
    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);

    window.addEventListener("resize", updateCarousel);

    // Arrancar el sistema
    updateCarousel();
    startAutoScroll();
});
