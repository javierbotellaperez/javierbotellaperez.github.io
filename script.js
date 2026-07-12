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
    const totalImages = 94; 
    const totalVideos = 8;  
    
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
        2: { 
            title: "El Sexo Convexo", 
            client: "Futurachicapop", 
            role: "Director", 
            year: "2021", 
            awards: ["Nominación: Mejor Videoclip Internacional - 20ª edición de Bogoshorts"],
            dirección: "Javier Botella", 
            producción: "Oscila Studio, Martí Méndez, Anna Salgado",
            ayudante_de_producción: "Júlia Fabs, Sergio Avellaneda",
            PA: "Andrew, Marcel, Marc Marq",
            ayudante_de_dirección: "Ford Fiesta Groc",
            DOP: "Lucas Hope",
            foquista: "Maximiliano Fritz",
            gaffer: "Héctor",
            foto: "Diego Ezia",
            dirección_de_arte: "Jul Comin, David Medina Águila",
            atrezzo: "Sara Martínez",
            estilismo: "Aida, Dani Valiente",
            wearing: "Víctor von Schwarz, Un Violeta Más, Mateu Lo",
            MUAH: "Airin Lion, Raquel García Makeup",
            edición: "Sergio Avellaneda, Marta MKV",
            telecine: "Lucas Hope",
            diseño_gráfico: "Judit Musachs",
            diseño_de_sonido: "Carnaby Studios",
            cast: "Sergio Avellaneda, Octawi, Fabri Montes, Graus, Mario de la Piedra, Ali Nastichenko, Nat Ramanandi, Joan Marc Herrera, Toni Aguilar, Kevin Antequera, Geo Cortés, Quique Muro López, Berta, Selma Ree, Carlos Olero Choa, Erik Anguera, Adrian MB"
        },
        3: { 
            title: "Historias de Sadie Girl", 
            client: "Futurachicapop", 
            role: "Director", 
            year: "2022", 
            con: "Futurachicapop, Alvaro Lucas, Pau Gomez",
            director: "Javier Botella", 
            dop: "Noun, Lluis Ferrer, Marcel Pascual",
            ayte_direccion: "Mara Problas",
            director_de_arte: "David Medina Aguila",
            estilista: "Blanco C",
            maquillaje: "Airin Lion",
            editor: "Deb G. Vargas, Desoto Gudayol",
            post_produccion: "Marta MKV",
            color: "Lita Bosch",
            diseno_grafico: "Alfon Fan",
            directora_de_produccion: "Mara Problas",
            coordinador_de_produccion: "Adrián Gómez Gallego",
            equipo_de_produccion: "Alejo Ayala, Champagne Shoots, Fon Blanco",
            foquista: "Roger Milian",
            aux_camara: "Enia Balagué",
            maquinista: "Fontich",
            jefe_de_electricos: "Martí Pluma",
            electricos: "Joan Bustos, Erik Dalmau, Martí Molas, Oriol Tarrason",
            ayte_arte: "Leire Oru",
            aux_arte: "Marianna Terzini",
            atrezzo: "Judit Jaumà, Manuel Menendez, Nunnurr",
            ayte_estilismo: "Victor Nuns",
            aux_estilismo: "Licari, Manuela Barreto",
            ayte_maquillaje: "Lau Makeup BCN, Sofi D. Makeup",
            aux_maquillaje: "Ana Codes, Arnau Soriano",
            fotografo: "Fon Blanco",
            coreografo: "Kevin Antequera",
            bailarines: "Toni Aguilar, Domi Shameless, Biel Torra, Carles Un00",
            amigas: "Airin Lion, Vittu Chloe, Nix Von Trier, Elena Aguilera"
        },
        4: { 
            title: "Money Queer", 
            client: "Jabeat & Okamiluke", 
            role: "Director", 
            year: "2020", 
            directed_by: "We Are Liquorice",
            head_of_production: "Anna Salgado",
            production_manager: "Machinazo",
            PA: "Gont, Penetroker, La Puig",
            assistant_director: "Laura Ruiz Penacho",
            second_assistant_director: "Víctor Radoselovicz",
            DOP: "Pau Ramírez Marques",
            AC: "Lali RP",
            second_AC: "Albert Marcos",
            DiT: "Andrés MV",
            gaffer: "Citizen Kani",
            sparks: "Antoine Sonnery, Daniel de José, Geraldo Souza, Santi Rodriguez, Anna Moliné, Victor Tapies",
            art_director: "Youngard",
            art_assist: "Joanet JC",
            styling: "Juls Puig, Carlota Punceer",
            MUAH: "Irene Gene",
            editor: "Pauluzon",
            color: "Martí Somoza",
            graphics: "Quincoxes, Jayk Darvishian"
        },
        5: { 
            title: "Autoboicot y Descanso", 
            client: "Rocío Saiz & Tauro", 
            role: "Director", 
            year: "2022", 
            director: "Javier Botella",
            director_de_fotografia: "Sergio Avellaneda",
            director_de_arte: "David Medina Aguila",
            MUAH: "Airin Lion",
            vestu: "Irene Arellano",
            ayte_arte: "Llyli Roberts",
            aux_arte: "Aurora Muñoz",
            aux_ambientación: "Leire Oru",
            producción: "La Puig",
            ayte_dirección: "Futurachicapop",
            ayte_muah: "Raquel García Makeup",
            edit: "Deb G. Vargas, Miguel Lomana",
            color: "Lita Bosch",
            figuración: "Olga Fernández, Jsssssz, Airin Lion, Futurachicapop, Irene Arellano, Aurora Muñoz, La Puig"
        },
        6: { title: "Turista Sueca", client: "Turista Sueca", role: "Director", year: "2023", director: "Javier Botella Pérez", Camera: "Jordi Terribas & Javier Botella" },
        7: { 
            title: "Borracho", 
            client: "Warmi", 
            role: "Director", 
            year: "2023", 
            él: "Rodrigo Parrilla",
            director: "Javier Botella Pérez",
            director_de_fotografía: "Adrián Foj",
            gaffer: "Carmen Ramis",
            producción: "Beatriz Rojo",
            director_de_arte: "David Medina Águila",
            editor: "Miguel Lomana",
            color: "La Cúpula Audiovisual",
            diseño_gráfico: "Guille Sotelo"
        },
        8: { 
            title: "Hiel", 
            client: "Warmi", 
            role: "Director", 
            year: "2023", 
            él: "Rodrigo Parrilla",
            director: "Javier Botella Pérez",
            director_de_fotografía: "Adrián Foj",
            gaffer: "Carmen Ramis",
            producción: "Beatriz Rojo",
            director_de_arte: "David Medina Águila",
            editor: "Miguel Lomana",
            color: "La Cúpula Audiovisual",
            diseño_gráfico: "Guille Sotelo"
        }
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

    // --- VARIABLES PARA PINCH-TO-ZOOM (MOVIL LIGHTBOX) ---
    let scale = 1;
    let startDistance = 0;
    let isPinching = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    function formatNumber(num) { return String(num).padStart(5, '0'); }

    // --- ALGORITMO DE BARAJADO ---
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
        return fullSequence;
    }

    // --- LAZY LOADING ---
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

    function setupTouchScroll(container, type) {
        let startTouchX = 0; let isDragging = false; let lastDiffX = 0; let inertiaFrame = null;
        container.addEventListener("touchstart", (e) => {
            if(e.touches.length > 1) return; // Ignorar si es un gesto multitáctil
            isDragging = true; startTouchX = e.touches[0].clientX; lastDiffX = 0;
            if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
        }, { passive: true });
        container.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            lastDiffX = (currentX - startTouchX) * 2.2; 
            if (type === 'photo') { currentSpeedPhotos = baseSpeedPhotos + lastDiffX; } 
            else { currentSpeedVideos = baseSpeedVideos + lastDiffX; }
            startTouchX = currentX; 
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
                if (type === 'photo') { currentSpeedPhotos = baseSpeedPhotos + lastDiffX; } 
                else { currentSpeedVideos = baseSpeedVideos + lastDiffX; }
                inertiaFrame = requestAnimationFrame(applyInertia);
            }
            applyInertia();
        });
    }

    // Controles de Aceleración y Mouseenter
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
        if(e.target.classList.contains("carousel-image")) openLightbox('photo', parseInt(e.target.dataset.index));
    });

    videoTrack.addEventListener("mouseenter", () => currentSpeedVideos = 0);
    videoTrack.addEventListener("mouseleave", () => currentSpeedVideos = baseSpeedVideos);
    videoTrack.addEventListener("click", (e) => {
        const target = e.target.closest(".video-item-wrapper");
        if(target) openLightbox('video', parseInt(target.dataset.index));
    });

    setupTouchScroll(containerPhotos, 'photo');
    setupTouchScroll(containerVideos, 'video');

    function openLightbox(mode, index) {
        currentMode = mode; currentIndex = index;
        resetZoom();
        updateContent(); 
        lightbox.classList.add("active");
    }

    function closeLightbox() { 
        lightbox.classList.remove("active", "show-img", "show-vid"); 
        lightboxVid.pause(); lightboxVid.removeAttribute('src'); lightboxVid.load(); lightboxImg.removeAttribute('src');
        if (lightboxCredits) lightboxCredits.innerHTML = "";
        resetZoom();
    }

    if(document.getElementById("closeBtn")) document.getElementById("closeBtn").onclick = closeLightbox;
    lightbox.onclick = closeLightbox;
    lightboxImg.onclick = (e) => e.stopPropagation();
    lightboxVid.onclick = (e) => e.stopPropagation();
    if (lightboxCredits) lightboxCredits.onclick = (e) => e.stopPropagation();

    // --- GESTOS PINCH-TO-ZOOM EN DISPOSITIVOS MÓVILES ---
    function getDistance(touches) {
        return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    }

    function resetZoom() {
        scale = 1; translateX = 0; translateY = 0;
        lightboxImg.style.transform = `translate(0px, 0px) scale(1)`;
    }

    lightboxImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            isPinching = true;
            startDistance = getDistance(e.touches);
            startX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - translateX;
            startY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - translateY;
        } else if (e.touches.length === 1 && scale > 1) {
            // Permitir paneo/arrastre si la imagen tiene zoom
            isPinching = false;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    }, { passive: true });

    lightboxImg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && isPinching) {
            const currentDistance = getDistance(e.touches);
            // Factor de sensibilidad del zoom
            scale = Math.min(Math.max(1, (currentDistance / startDistance) * scale), 4); 
            
            const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            translateX = currentX - startX;
            translateY = currentY - startY;

            lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        } else if (e.touches.length === 1 && scale > 1) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    }, { passive: true });

    lightboxImg.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            isPinching = false;
        }
        if (scale <= 1) {
            resetZoom();
        }
    });

    // --- GENERADOR INTELIGENTE DE CONTENIDO ---
    function updateContent() {
        const formatted = formatNumber(currentIndex);
        lightbox.classList.remove("show-img", "show-vid");
        lightboxVid.pause(); lightboxVid.removeAttribute('src'); lightboxVid.load(); lightboxImg.removeAttribute('src');
        if (lightboxCredits) lightboxCredits.innerHTML = "";
        
        if (currentMode === 'photo') {
            lightboxImg.src = `/assets/Asset_${formatted}.jpg`; 
            lightbox.classList.add("show-img");
            if (lightboxCredits) {
                const data = photoData[currentIndex] || { title: `Photo #${currentIndex}`, location: "Barcelona", project: "Personal Project", year: "2026" };
                lightboxCredits.innerHTML = `
                    <h3 class="credits-title">${data.title}</h3>
                    <p class="credits-subtitle">${data.location} &bull; ${data.project} &bull; ${data.year}</p>
                `;
            }
        } else {
            lightboxVid.src = `/videos/Video_${formatted}.mp4`; 
            lightbox.classList.add("show-vid"); lightboxVid.play();
            if (lightboxCredits) {
                const data = videoData[currentIndex] || { title: `Video #${currentIndex}`, client: "Client", role: "Director", year: "2026" };
                let creditsHTML = `
                    <h3 class="credits-title">${data.title}</h3>
                    <p class="credits-subtitle">${data.client} &bull; ${data.role} &bull; ${data.year}</p>
                `;

                if (data.awards) {
                    creditsHTML += `<div class="credits-awards">`;
                    const awardsList = Array.isArray(data.awards) ? data.awards : [data.awards];
                    awardsList.forEach(award => { creditsHTML += `<p class="award-item">🌿 ${award}</p>`; });
                    creditsHTML += `</div>`;
                }

                creditsHTML += `<hr class="credits-divider"><div class="extra-credits-wrapper">`;
                const fixedKeys = ['title', 'client', 'role', 'year', 'awards'];
                
                Object.keys(data).forEach(key => {
                    if (!fixedKeys.includes(key)) {
                        const label = key.replace(/_/g, ' ')
                                         .split(' ')
                                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                         .join(' ');
                        creditsHTML += `
                            <div class="credit-row">
                                <span class="credit-label">${label}:</span>
                                <span class="credit-value">${data[key]}</span>
                            </div>
                        `;
                    }
                });
                creditsHTML += `</div>`;
                lightboxCredits.innerHTML = creditsHTML;
            }
        }
    }

    function change(delta) {
        const total = (currentMode === 'photo') ? totalImages : totalVideos;
        currentIndex = (currentIndex + delta - 1 + total) % total + 1;
        resetZoom();
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

    /* ==========================================================================
       PROTECCIÓN DE CONTENIDO (Anti-copia y bloqueo de descargas básicas)
       ========================================================================== */
    // 1. Bloquear el click derecho (evita "Guardar imagen como...", "Guardar vídeo...")
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // 2. Bloquear atajos de teclado típicos de clonación / inspección
    document.addEventListener('keydown', (e) => {
        // Bloquear Ctrl+S / Cmd+S (Guardar página)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
        }
        // Bloquear Ctrl+U / Cmd+U (Ver código fuente)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
        }
        // Bloquear F12 y Ctrl+Shift+I / Cmd+Opt+I (Inspeccionar elemento)
        if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });

    // 3. Evitar que arrastren tus fotos/vídeos al escritorio para guardarlos
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
            e.preventDefault();
        }
    });

    loadPhotos(); loadVideos(); animate();
});
