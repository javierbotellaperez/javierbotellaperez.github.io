/* --- Reset y Base Minimalista --- */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body {
    width: 100%;
    height: 100%;
    background-color: #ffffff; /* Fondo blanco */
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

/* --- Contenedores Flexibles de las Filas --- */
.carousel-container {
    position: relative;
    width: 100vw;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 15px 0;
}

.carousel-track {
    display: flex;
    width: max-content;
}

/* Pausa al pasar el ratón */
.carousel-container:hover .carousel-track {
    animation-play-state: paused;
}

/* --- Animaciones de Movimiento Opuesto (Velocidad reducida al 20%) --- */
.scroll-left {
    /* De 150s a 750s para ir 5 veces más despacio */
    animation: scrollL 750s linear infinite;
}

.scroll-right {
    /* De 60s a 300s para ir 5 veces más despacio */
    animation: scrollR 300s linear infinite;
}

@keyframes scrollL {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes scrollR {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}

/* --- Ajuste de las Fotos (MANTIENEN Blanco y Negro) --- */
.carousel-image {
    height: 35vh;
    width: auto;
    padding: 0;
    object-fit: cover;
    filter: grayscale(100%); /* Fotos en B/N */
    cursor: pointer;
    transition: filter 0.3s ease;
}

/* Al pasar el ratón por la foto, se ilumina sutilmente pero sigue en B/N */
.carousel-image:hover {
    filter: grayscale(100%) brightness(110%);
}

/* --- Ajuste Fijo de los Videos (AHORA EN COLOR) --- */
.carousel-video-thumb {
    width: 640px !important;
    height: 360px !important;
    padding: 0;
    object-fit: cover;
    /* ELIMINADO EL FILTRO GRAYSCALE PARA MANTENER COLOR */
    cursor: pointer;
    transition: transform 0.3s ease;
}

/* Efecto sutil al pasar el ratón por el video */
.carousel-video-thumb:hover {
    transform: scale(1.02); /* Pequeño zoom en lugar de cambio de color */
}

/* --- DISEÑO DEL VISOR GRANDE (LIGHTBOX) --- */
.lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.98);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.lightbox.active { display: flex; }

.lightbox-content {
    max-width: 85%;
    max-height: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lightbox-content img, .lightbox-content video {
    max-width: 100%;
    max-height: 100%;
    display: none;
}

/* Foto grande en B/N */
.lightbox.show-img #lightboxImg { display: block; filter: grayscale(100%); }
/* Video grande en COLOR */
.lightbox.show-vid #lightboxVid { display: block; }

/* Controles del Visor */
.lightbox-btn, .close-btn {
    position: absolute;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 40px;
    cursor: pointer;
    transition: 0.2s;
    z-index: 1100;
}

.lightbox-btn:hover, .close-btn:hover {
    color: #ffffff;
}

.prev { left: 30px; top: 50%; transform: translateY(-50%); }
.next { right: 30px; top: 50%; transform: translateY(-50%); }
.close-btn { top: 20px; right: 30px; font-size: 60px; }
