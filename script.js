document.addEventListener("DOMContentLoaded", () => {
    const photoTrack = document.getElementById("photoTrack");
    const videoTrack = document.getElementById("videoTrack");
    const containerPhotos = document.getElementById("containerPhotos");
    const containerVideos = document.getElementById("containerVideos");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVid = document.getElementById("lightboxVid");
    const lightboxCredits = document.getElementById("lightboxCredits");
    const nextBtn = document.getElementById("lightboxNext");
    const prevBtn = document.getElementById("lightboxPrev");

    // --- CONTADORES TOTALES ---
    const totalImages = 94; // Modifica este número cuando cambie la cantidad de fotos
    const totalVideos = 8;  // Modifica este número cuando cambie la cantidad de vídeos
    
    // --- BASE DE DATOS DE CONTENIDOS ---
    const photoData = {
        1: { title: "Pere at home" , location: "Barcelona", project: "Personal Project", year: "2026" },
        2: { title: "Tour Eiffel" , location: "Paris", project: "Personal Project", year: "2021" },
        3: { title: "La Bastille", location: "Paris", project: "Personal Project", year: "2021" },
        4: { title: "Laundry with Jordi" , location: "Barcelona", project: "Personal Project", year: "2024" },
        5: { title: "Jordi" , location: "Barcelona", project: "Personal Project", year: "2024" },
        6: { title: "Agus" , location: "Barcelona", project: "Personal Project", year: "2025" },
        7: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        8: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },    
        9: { title: "Jordi", location: "Javier Botella Pérez", project: "Personal Project", year: "2024" },
        10: { title: "Shower", location: "Barcelona", project: "Personal Project", year: "2023" },
        11: { title: "Cruising", location: "Barcelona", project: "Personal Project", year: "2023" },
        12: { title: "Wall", location: "Barcelona", project: "Personal Project", year: "2023" },
        13: { title: "Arnau", location: "Javier Botella Pérez", project: "Personal Project", year: "2024" },
        14: { title: "Selfportrait", location: "Barcelona", project: "Personal Project", year: "2026" },
        15: { title: "Futurachicapop", location: "Barcelona", project: "Personal Project", year: "2021" },
        16: { title: "Futurachicapop", location: "Barcelona", project: "Personal Project", year: "2021" },  
        17: { title: "Futurachicapop", location: "Javier Botella Pérez", project: "Personal Project", year: "2021" },
        18: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        19: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        20: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        21: { title: "Agus", location: "Javier Botella Pérez", project: "Personal Project", year: "2025" },
        22: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        23: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        24: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },    
        25: { title: "Arnau", location: "Javier Botella Pérez", project: "Personal Project", year: "2024" },
        26: { title: "Arnau", location: "Barcelona", project: "Personal Project", year: "2024" },
        27: { title: "Arnau", location: "Barcelona", project: "Personal Project", year: "2024" },
        28: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        29: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        30: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        31: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        32: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        33: { title: "Luis", location: "Madrid", project: "Personal Project", year: "2022" },
        34: { title: "Shower", location: "Barcelona", project: "Personal Project", year: "2023" },
        35: { title: "Shower", location: "Barcelona", project: "Personal Project", year: "2023" },
        36: { title: "Alex", location: "Barcelona", project: "Personal Project", year: "2024" },
        37: { title: "Kiss", location: "Barcelona", project: "Personal Project", year: "2024" },
        38: { title: "Kiss", location: "Barcelona", project: "Personal Project", year: "2024" },
        39: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        40: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },    
        41: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        42: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        43: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        44: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        45: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        46: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        47: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        48: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },  
        49: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        50: { title: "Alberto", location: "Barcelona", project: "Personal Project", year: "2023" },
        51: { title: "Cruising", location: "Barcelona", project: "Personal Project", year: "2023" },
        52: { title: "Cruising", location: "Barcelona", project: "Personal Project", year: "2023" },
        53: { title: "Wall", location: "Barcelona", project: "Personal Project", year: "2023" },
        54: { title: "Wall", location: "Barcelona", project: "Personal Project", year: "2023" },
        55: { title: "Car", location: "Barcelona", project: "Personal Project", year: "2024" },
        56: { title: "Car", location: "Barcelona", project: "Personal Project", year: "2024" },    
        57: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        58: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        59: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        60: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        61: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        62: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        63: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        64: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" }, 
        65: { title: "Jordi", location: "Barcelona", project: "Personal Project", year: "2024" },
        66: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        67: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        68: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        69: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        70: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        71: { title: "Javi", location: "Barcelona", project: "Personal Project", year: "2024" },
        72: { title: "Javi", location: "Barcelona", project: "Personal Project", year: "2024" },    
        73: { title: "Javi", location: "Barcelona", project: "Personal Project", year: "2024" },
        74: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        75: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        76: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        77: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        78: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        79: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        80: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },  
        81: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        82: { title: "Agus", location: "Barcelona", project: "Personal Project", year: "2025" },
        83: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        84: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        85: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        86: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        87: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        88: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },    
        89: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        90: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        91: { title: "Jabeat", location: "Barcelona", project: "Personal Project", year: "2025" },
        92: { title: "Alex", location: "Barcelona", project: "Personal Project", year: "2024" },
        93: { title: "Alex", location: "Barcelona", project: "Personal Project", year: "2024" },
        94: { title: "Selfportrait", location: "Barcelona", project: "Personal Project", year: "2026" }
    };

    const videoData = {
        1: { title: "Quién quiera perdón que se lo pida a Dios", client: "Jabeat", role: "Director ReTakes + Editor", year: "2025", director: "Roger Martínez", Retakes: "Javier Botella", Edit: "Jabeat & Javier Botella" },
        2: { title: "El Sexo Convexo", client: "Futurachicapop", role: "Director", year: "2021", director: "Javier Botella Pérez", dop: "Lucas Hope" },
        3: { title: "Historias de Sadie Girl", client: "Futurachicapop", role: "Director", year: "2022", director: "Javier Botella Pérez", dop: "Noun" },
        4: { title: "Money Queer", client: "Jabeat & Okamiluke", role: "Director", year: "2020", director: "Javier Botella Pérez & David Medina", dop: "Pau Ramirez" },
        5: { title: "Autoboicot y Descanso", client: "Rocío Saiz & Tauro", role: "Director", year: "2022", director: "Javier Botella Pérez", dop: "Sergio Avellaneda" },
        6: { title: "Turista Sueca", client: "Turista Sueca", role: "Director", year: "2023", director: "Javier Botella Pérez", Camera: "Jordi Terribas & Javier Botella" },
        7: { title: "Borracho", client: "Warmi", role: "Director", year: "2023", director: "Javier Botella Pérez", dop: "Adrian Foj" },
        8: { title: "Hiel", client: "Warmi", role: "Director", year: "2023", director: "Javier Botella Pérez", dop: "Adrian Foj" }
    };

    // --- VARIABLES DE ESTADO Y ANIMACIÓN ---
    let currentMode = 'photo';
    let currentIndex = 1;
    let posPhotos = 0;
    let posVideos = 0;
    
    const baseSpeedPhotos = -0.3; 
    const baseSpeedVideos = 0.55; 

    let currentSpeedPhotos = baseSpeedPhotos;
    let currentSpeedVideos = baseSpeedVideos;

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- ALGORITMO DE BARAJADO ANTIREPETICIÓN INTEGRAL ---
    function getSmartShuffledSequence(totalCount, duplicatesNeeded) {
        let base = Array.from({length: totalCount}, (_, i) => i + 1);
        
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        let fullSequence = [];

        for (let d = 0; d < duplicatesNeeded; d++) {
            let currentBatch = shuffle([...base]);
            
            if (fullSequence.length > 0 && currentBatch[0] === fullSequence[fullSequence.length - 1]) {
                for (let i = 1; i < currentBatch.length; i++) {
                    if (currentBatch[i] !== fullSequence[fullSequence.length - 1]) {
                        [currentBatch[0], currentBatch[i]] = [currentBatch[i], currentBatch[0]];
                        break;
                    }
                }
            }
            fullSequence = fullSequence.concat(currentBatch);
        }

        if (fullSequence.length > 1 && fullSequence[fullSequence.length - 1] === fullSequence[0]) {
            for (let i = fullSequence.length - 2; i > 0; i--) {
                if (fullSequence[i] !== fullSequence[0] && fullSequence[i-1] !== fullSequence[fullSequence.length - 1]) {
                    [fullSequence[fullSequence.length - 1], fullSequence[i]] = [fullSequence[i], fullSequence[fullSequence.length - 1]];
                    break;
                }
            }
        }
        return fullSequence;
    }

    // --- CARGA MULTIMEDIA CONTROLADA CON LAZY LOADING ---
    function loadPhotos() {
        const photoSequence = getSmartShuffledSequence(totalImages, 2);
        photoSequence.forEach(i => {
            const img = document.createElement("img");
            img.src = `/assets/Asset_${formatNumber(i)}.webp`;
            img.classList.add("carousel-image");
            img.dataset.index = i;
            img.loading = "lazy";
            img.onerror = () => img.remove();
            photoTrack.appendChild(img);
        });
    }

    function loadVideos() {
        const videoSequence = getSmartShuffledSequence(totalVideos, 4);
        videoSequence.forEach(i => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("video-item-wrapper");
            wrapper.dataset.index = i;

            const img = document.createElement("img");
            img.src = `/assets/VidThumb_${formatNumber(i)}.webp`;
            img.classList.add("carousel-image");
            img.loading = "lazy";
            img.onerror = () => wrapper.remove();

            wrapper.appendChild(img);
            videoTrack.appendChild(wrapper);
        });
    }

    // --- MOTOR DE MOVIMIENTO ---
    function animate() {
        if (!lightbox.classList.contains("active")) {
            posPhotos += currentSpeedPhotos;
            posVideos += currentSpeedVideos;

            const halfPhotosWidth = photoTrack.scrollWidth / 2;
            if (posPhotos >= 0) posPhotos = -halfPhotosWidth;
            if (Math.abs(posPhotos) >= photoTrack.scrollWidth) posPhotos = -halfPhotosWidth;
            
            const halfVideosWidth = videoTrack.scrollWidth / 2;
            if (posVideos >= 0) posVideos = -halfVideosWidth;
            if (Math.abs(posVideos) >= videoTrack.scrollWidth) posVideos = -halfVideosWidth;

            photoTrack.style.transform = `translateX(${posPhotos}px)`;
            videoTrack.style.transform = `translateX(${posVideos}px)`;
        }
        requestAnimationFrame(animate);
    }

    // --- TRASPASAR EL CLIC DESDE LAS ZONAS DE ACELERACIÓN ---
    function setupSmartClick(zone, mode) {
        zone.addEventListener("click", (e) => {
            zone.style.pointerEvents = "none";
            const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
            zone.style.pointerEvents = "auto";

            if (elementBelow) {
                const target = elementBelow.closest(".carousel-image, .video-item-wrapper");
                if (target) {
                    const index = parseInt(target.dataset.index);
                    if (index) openLightbox(mode, index);
                }
            }
        });
    }

    // --- INTERACCIÓN TÁCTIL PARA MÓVILES ---
    function setupTouchScroll(container, type) {
        let startX = 0;
        let isDragging = false;
        let lastDiffX = 0;
        let inertiaFrame = null;

        container.addEventListener("touchstart", (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            lastDiffX = 0;
            if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
        }, { passive: true });

        container.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            lastDiffX = (currentX - startX) * 2.2; 

            if (type === 'photo') {
                currentSpeedPhotos = baseSpeedPhotos + lastDiffX;
            } else {
                currentSpeedVideos = baseSpeedVideos + lastDiffX;
            }
            startX = currentX; 
        }, { passive: true });

        container.addEventListener("touchend", () => {
            isDragging = false;
            function applyInertia() {
                if (Math.abs(lastDiffX) < 0.1) {
                    if (type === 'photo') currentSpeedPhotos = baseSpeedPhotos;
                    if (type === 'video') currentSpeedVideos = baseSpeedVideos;
                    return;
                }
                lastDiffX *= 0.92;
                if (type === 'photo') {
                    currentSpeedPhotos = baseSpeedPhotos + lastDiffX;
                } else {
                    currentSpeedVideos = baseSpeedVideos + lastDiffX;
                }
                inertiaFrame = requestAnimationFrame(applyInertia);
            }
            applyInertia();
        });
    }

    // --- ESCUCHA DE HOVERS Y CLICS ---
    const photoLeftZone = containerPhotos.querySelector(".zone-left");
    const photoRightZone = containerPhotos.querySelector(".zone-right");
    if(photoLeftZone) photoLeftZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * -8); 
    if(photoRightZone) photoRightZone.addEventListener("mouseenter", () => currentSpeedPhotos = baseSpeedPhotos * 8);  
    containerPhotos.addEventListener("mouseleave", () => currentSpeedPhotos = baseSpeedPhotos);
    if(photoLeftZone) setupSmartClick(photoLeftZone, 'photo');
    if(photoRightZone) setupSmartClick(photoRightZone, 'photo');

    const videoLeftZone = containerVideos.querySelector(".zone-left");
    const videoRightZone = containerVideos.querySelector(".zone-right");
    if(videoLeftZone) videoLeftZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * -8); 
    if(videoRightZone) videoRightZone.addEventListener("mouseenter", () => currentSpeedVideos = baseSpeedVideos * 8);  
    containerVideos.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);
    if(videoLeftZone) setupSmartClick(videoLeftZone, 'video');
    if(videoRightZone) setupSmartClick(videoRightZone, 'video');

    photoTrack.addEventListener("mouseenter", () => currentSpeedPhotos = 0);
    photoTrack.addEventListener("mouseleave", () => currentSpeedPhotos = baseSpeedPhotos);
    photoTrack.addEventListener("click", (e) => {
        if(e.target.classList.contains("carousel-image")) {
            openLightbox('photo', parseInt(e.target.dataset.index));
        }
    });

    videoTrack.addEventListener("mouseenter", () => currentSpeedVideos = 0);
    videoTrack.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);
    videoTrack.addEventListener("click", (e) => {
        const target = e.target.closest(".video-item-wrapper");
        if(target) {
            openLightbox('video', parseInt(target.dataset.index));
        }
    });

    setupTouchScroll(containerPhotos, 'photo');
    setupTouchScroll(containerVideos, 'video');

    // --- VISOR LIGHTBOX ---
    function openLightbox(mode, index) {
        currentMode = mode; 
        currentIndex = index;
        updateContent(); 
        lightbox.classList.add("active");
    }

    function closeLightbox() { 
        lightbox.classList.remove("active", "show-img", "show-vid"); 
        lightboxVid.pause(); 
        lightboxVid.removeAttribute('src'); 
        lightboxVid.load(); 
        lightboxImg.removeAttribute('src');
        if (lightboxCredits) lightboxCredits.innerHTML = "";
    }

    const closeBtn = document.getElementById("closeBtn");
    if(closeBtn) closeBtn.onclick = closeLightbox;
    lightbox.onclick = closeLightbox;
    lightboxImg.onclick = (e) => e.stopPropagation();
    lightboxVid.onclick = (e) => e.stopPropagation();
    if (lightboxCredits) lightboxCredits.onclick = (e) => e.stopPropagation();

    // --- RENDERIZADO INTELIGENTE DE CRÉDITOS ---
    function updateContent() {
        const formatted = formatNumber(currentIndex);
        lightbox.classList.remove("show-img", "show-vid");
        lightboxVid.pause();
        lightboxVid.removeAttribute('src');
        lightboxVid.load();
        lightboxImg.removeAttribute('src');
        if (lightboxCredits) lightboxCredits.innerHTML = "";
        
        if (currentMode === 'photo') {
            lightboxImg.src = `/assets/Asset_${formatted}.jpg`; 
            lightbox.classList.add("show-img");
            
            if (lightboxCredits) {
                // Objeto por defecto seguro con la propiedad 'year' incluida por si acaso
                const data = photoData[currentIndex] || { title: `Fotografía #${currentIndex}`, location: "Javier Botella Pérez", project: "Personal Project", year: "2026" };
                
                lightboxCredits.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.location}</p>
                    <p>${data.project}</p>
                    <p>${data.year}</p>
                `;
            }
        } else {
            lightboxVid.src = `/videos/Video_${formatted}.mp4`; 
            lightbox.classList.add("show-vid"); 
            lightboxVid.play();
            
            if (lightboxCredits) {
                const data = videoData[currentIndex] || { title: `Proyecto de Vídeo #${currentIndex}`, client: "Client / Artist Name", role: "Production Credit", year: "2026", director: "Director Name", dop: "DoP Name" };
                
                lightboxCredits.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.client}</p>
                    <p>${data.role}</p>
                    <p>${data.year}</p>
                    <div class="extra-credits-wrapper">
                        <p><strong>Director:</strong> ${data.director}</p>
                        <p><strong>DoP:</strong> ${data.dop}</p>
                    </div>
                `;
            }
        }
    }

    function change(delta) {
        const total = (currentMode === 'photo') ? totalImages : totalVideos;
        currentIndex = (currentIndex + delta - 1 + total) % total + 1;
        updateContent();
    }

    if(nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); change(1); };
    if(prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); change(-1); };

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") change(1);
        else if (e.key === "ArrowLeft") change(-1);
    });

    // Carga e inicio limpios
    loadPhotos();
    loadVideos();
    animate();
});
