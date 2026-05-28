document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const totalImages = 75;

    // Función auxiliar para crear y configurar una imagen
    function createImg(index) {
        const img = document.createElement("img");
        img.src = `assets/Asset_${index}.jpg`; // Recuerda cambiar a .png si tus fotos tienen ese formato
        img.alt = `Fotografía ${index}`;
        img.classList.add("carousel-image");
        
        // Imagen de reemplazo por si alguna foto falla en el servidor
        img.onerror = () => { 
            img.src = 'https://via.placeholder.com/400x400/ffffff/cccccc?text=Asset+' + index;
        };
        return img;
    }

    // 1. Inyectamos la primera tanda de 75 fotos
    for (let i = 1; i <= totalImages; i++) {
        track.appendChild(createImg(i));
    }

    // 2. ¡EL TRUCO!: Clonamos las 75 fotos y las pegamos inmediatamente detrás.
    // Esto permite que el bucle visual sea infinito y no se vea el corte.
    for (let i = 1; i <= totalImages; i++) {
        track.appendChild(createImg(i));
    }
});
