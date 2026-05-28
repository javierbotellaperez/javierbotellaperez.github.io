document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const counter = document.getElementById("carouselCounter");
    const container = document.querySelector(".carousel-container");

    const totalImages = 75;
    let currentIndex = 0;
    
    // TIEMPO DE DESPLAZAMIENTO AUTOMÁTICO (en milisegundos)
    const AUTO_SCROLL_INTERVAL = 4000; // 4 segundos
    let autoScrollTimer; // Variable para guardar el temporizador

    // 1. Generar imágenes (Igual que antes, pero con mejor control de errores)
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement("img");
        // Cambia .jpg si usas otro formato (.png, .webp)
        img.src = `assets/Asset_${i}.jpg`; 
        img.alt = `Fotografía Blanco y Negro ${i}`;
        img.classList.add("carousel-image");
        img.loading = "lazy"; // Carga perezosa para mejor rendimiento con 75 fotos
        
        img.onerror = () => { 
            img.src = 'https://via.placeholder.com/1000x600/333333/cccccc?text=Error+Loading+Asset';
            img.alt = 'Error de carga';
        };
        
        track.appendChild(img);
    }

    // 2. Función clave para mover la 'tira' de fotos horizontalmente
    function updateCarousel() {
        // En el CSS definimos que cada foto ocupa el 100% del contenedor.
        // Solo multiplicamos el índice por -100% para mover la tira a la izquierda.
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar contador
        counter.textContent = `${currentIndex + 1} / ${totalImages}`;
    }

    // Funciones de navegación
    function showNext() {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Vuelve al inicio
        }
        updateCarousel();
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1; // Va al final
        }
        updateCarousel();
    }

    // --- Lógica del Desplazamiento Automático ---

    function startAutoScroll() {
        // Primero limpiamos cualquier temporizador previo para no duplicarlos
        stopAutoScroll(); 
        // Creamos un nuevo intervalo que llama a showNext cada 4 segundos
        autoScrollTimer = setInterval(showNext, AUTO_SCROLL_INTERVAL);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // --- Eventos de Usuario ---

    nextBtn.addEventListener("click", () => {
        showNext();
        startAutoScroll(); // Reinicia el temporizador si el usuario hace clic
    });

    prevBtn.addEventListener("click", () => {
        showPrev();
        startAutoScroll(); // Reinicia el temporizador si el usuario hace clic
    });

    // PARAR la galería si el ratón está encima del contenedor
    container.addEventListener("mouseenter", stopAutoScroll);
    
    // REANUDAR la galería cuando el ratón sale
    container.addEventListener("mouseleave", startAutoScroll);

    // Ajuste por si cambian el tamaño de la ventana
    window.addEventListener("resize", updateCarousel);

    // --- INICIAR ---
    updateCarousel(); // Muestra la primera foto
    startAutoScroll(); // Arranca el movimiento automático
});
