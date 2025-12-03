/**
 * js/sticker-manager.js
 * Clase para manejar la interacción (PAN, PINCH, WHEEL) y la gestión de stickers ÚNICOS,
 * con verificación de edad, filtrado de contenido y generación de pestañas de nombre de proyecto.
 */

// Contador global para asegurar que el sticker seleccionado siempre tenga el z-index más alto.
let stickerZIndexCounter = 1000; 

class InteractiveSticker {
    constructor(elementId, initialSize = 200, minScale = 0.5, maxScale = 3) {
        this.containerLink = document.getElementById(elementId);
        
        if (!this.containerLink) return;

        this.initialSize = initialSize; 
        this.MIN_SCALE = minScale;
        this.MAX_SCALE = maxScale;
        
        this.currentScale = 1;
        this.currentX = 0;
        this.currentY = 0;
        
        this.isMoving = false; 
        
        this.QUICK_TRANSITION = 'transform 0.1s ease-out';

        this.setupHammer();
        window.addEventListener('load', () => this.setupInitialPosition());
    }
    
    setupInitialPosition() {
        this.containerLink.style.width = `${this.initialSize}px`;

        const anchoViewport = window.innerWidth - this.initialSize;
        const altoViewport = window.innerHeight - this.initialSize;

        this.currentX = Math.random() * anchoViewport;
        this.currentY = Math.random() * altoViewport;

        this.setTransform(this.currentX, this.currentY, this.currentScale);
    }
    
    setTransform(x, y, scale) {
        this.containerLink.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    setupHammer() {
        const mc = new Hammer(this.containerLink);
        
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 2 });
        mc.get('pinch').set({ enable: true });

        this.setupWheelZoom();

        // --- GESTIÓN de Clicks / Enlaces ---
        this.containerLink.addEventListener('click', (e) => {
            if (this.isMoving) {
                e.preventDefault();
                this.isMoving = false; 
            }
        }, true);

        // --- Eventos de Gesto ---
        mc.on('panstart', (ev) => this.handlePanStart(ev));
        mc.on('panmove', (ev) => this.handlePanMove(ev));
        mc.on('panend', (ev) => this.handlePanEnd(ev));
        mc.on('pinchstart', (ev) => this.handlePinchStart(ev));
        mc.on('pinchmove', (ev) => this.handlePinchMove(ev));
        mc.on('pinchend', (ev) => this.handlePinchEnd(ev));
    }
    
    // NUEVO MÉTODO: Manejo del evento Wheel para Trackpad/Rueda
    setupWheelZoom() {
        this.containerLink.addEventListener('wheel', (e) => {
            e.preventDefault(); 
            
            stickerZIndexCounter++;
            this.containerLink.style.zIndex = stickerZIndexCounter; 
            
            this.isMoving = true; 
            setTimeout(() => this.isMoving = false, 100); 

            const zoomSensitivity = 0.005;
            let scaleChange = e.deltaY * zoomSensitivity;
            let newScale = this.currentScale - scaleChange; 
            
            newScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));
            
            this.setTransform(this.currentX, this.currentY, newScale);
            this.currentScale = newScale;
        });
    }

    handlePanStart(ev) {
        this.isMoving = false;
        stickerZIndexCounter++;
        this.containerLink.style.zIndex = stickerZIndexCounter; 
        this.containerLink.style.transition = 'none';

        const style = window.getComputedStyle(this.containerLink).transform;
        const matrix = style.match(/matrix.*\((.+)\)/);
        if (matrix && matrix[1]) {
            const values = matrix[1].split(', ');
            this.currentX = parseFloat(values[4] || 0);
            this.currentY = parseFloat(values[5] || 0);
        }
    }

    handlePanMove(ev) {
        if (Math.abs(ev.deltaX) > 2 || Math.abs(ev.deltaY) > 2) { 
            this.isMoving = true;
        }
        
        const deltaX = this.currentX + ev.deltaX;
        const deltaY = this.currentY + ev.deltaY;
        this.setTransform(deltaX, deltaY, this.currentScale);
    }

    handlePanEnd(ev) {
        this.containerLink.style.transition = this.QUICK_TRANSITION;
        this.currentX += ev.deltaX;
        this.currentY += ev.deltaY;
    }

    handlePinchStart(ev) {
        this.isMoving = true; 
        stickerZIndexCounter++;
        this.containerLink.style.zIndex = stickerZIndexCounter; 
        this.containerLink.style.transition = 'none';
    }
    
    handlePinchMove(ev) {
        let newScale = this.currentScale * ev.scale;
        newScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));
        this.setTransform(this.currentX, this.currentY, newScale);
    }

    handlePinchEnd(ev) {
        this.containerLink.style.transition = this.QUICK_TRANSITION;
        this.currentScale *= ev.scale;
        this.currentScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, this.currentScale));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    const stickerArea = document.querySelector('.sticker-area');
    const modal = document.getElementById('age-disclaimer-modal');
    const btnYes = document.getElementById('disclaimer-yes');
    const btnNo = document.getElementById('disclaimer-no');
    
    // --- Definición de Stickers ---
    const stickerTypes = [
        // 🟢 CLAVE: Etiquetar con ageRestricted: true/false
        { idBase: 'sticker-arnau', src: 'assets/images/arnau.png', href: 'arnau.html', name: 'Arnau', ageRestricted: true},
        { idBase: 'sticker-alex', src: 'assets/images/alex.png', href: 'alex.html', name: 'Alex', ageRestricted: true },
        { idBase: 'sticker-diary', src: 'assets/images/diary.png', href: 'diary.html', name: 'Diary' }, 
        { idBase: 'sticker-paris', src: 'assets/images/paris.png', href: 'paris.html', name: 'Paris', ageRestricted: false }, 
        { idBase: 'sticker-adria', src: 'assets/images/adria.png', href: 'adria.html', name: 'adria', ageRestricted: true }, 
        { idBase: 'sticker-aldo', src: 'assets/images/aldo.png', href: 'aldo.html', name: 'aldo', ageRestricted: true }, 
        { idBase: 'sticker-budapest', src: 'assets/images/budapest.png', href: 'budapest.html', name: 'budapest', ageRestricted: false }, 
        { idBase: 'sticker-cruising', src: 'assets/images/cruising.png', href: 'cruising.html', name: 'cruising', ageRestricted: true }, 
        { idBase: 'sticker-elio', src: 'assets/images/elio.png', href: 'elio.html', name: 'elio', ageRestricted: true }, 
        { idBase: 'sticker-jabeat', src: 'assets/images/jabeat.png', href: 'jabeat.html', name: 'jabeat', ageRestricted: false }, 
        { idBase: 'sticker-jordi', src: 'assets/images/jordi.png', href: 'jordi.html', name: 'jordi', ageRestricted: true}, 
        { idBase: 'sticker-lloret', src: 'assets/images/lloret.png', href: 'lloret.html', name: 'lloret', ageRestricted: false}, 
        { idBase: 'sticker-luis', src: 'assets/images/luis.png', href: 'luis.html', name: 'luis', ageRestricted: true }, 
        { idBase: 'sticker-usa', src: 'assets/images/usa.png', href: 'nyc.html', name: 'usa', ageRestricted: false }, 
        { idBase: 'sticker-walden', src: 'assets/images/walden.png', href: 'walden.html', name: 'walden', ageRestricted: false }
        // Puedes añadir más stickers aquí siguiendo el patrón.
    ];

    // --- Funciones de Filtrado y Visualización ---

    function filterAndShow(isAdult) {
        if (modal) {
            modal.style.display = 'none'; // Ocultar el modal
        }
        
        // 1. Limpiar el área antes de regenerar
        stickerArea.innerHTML = '';
        
        // 2. Generar los stickers visibles
        stickerTypes.forEach((type) => {
            // Mostrar solo si: es adulto O el contenido NO es restringido
            const shouldShow = isAdult || (type.ageRestricted === false); 

            if (shouldShow) {
                const uniqueId = type.idBase; 
                
                // Generar HTML del sticker
                const a = document.createElement('a');
                a.id = uniqueId;
                a.href = type.href; 
                a.classList.add('sticker-link', 'interactive-sticker');

                const tag = document.createElement('span');
                tag.classList.add('project-tag');
                tag.textContent = type.name;
                a.appendChild(tag);
                
                const img = document.createElement('img');
                img.src = type.src; 
                img.alt = `Sticker ${type.name}`;
                
                a.appendChild(img);
                stickerArea.appendChild(a);

                // Inicializar la interacción
                new InteractiveSticker(uniqueId);
            }
        });
        
        // 3. Mostrar alerta de pie de página si es menor de 18
        if (!isAdult) {
            displayAgeAlert();
        }
    }

    function displayAgeAlert() {
        let footerAlert = document.querySelector('.age-restriction-alert');
        if (!footerAlert) {
             footerAlert = document.createElement('div');
             footerAlert.classList.add('age-restriction-alert');
             document.body.appendChild(footerAlert);
        }
        footerAlert.innerHTML = "Contenido restringido (+18) oculto. <span style='text-decoration: underline; cursor: pointer;' id='recheck-age'>Volver a verificar la edad.</span>";
        footerAlert.style.display = 'block'; 
        
        // Listener para volver a verificar la edad
        document.getElementById('recheck-age').addEventListener('click', () => {
            localStorage.removeItem('isAdult');
            window.location.reload();
        });
    }


    // --- 🟢 Función de Verificación Inicial ---

    function checkAgeRestriction() {
        const isAdultStored = localStorage.getItem('isAdult');

        if (isAdultStored === 'true') {
            filterAndShow(true);
        } else if (isAdultStored === 'false') {
            filterAndShow(false);
        } else {
            // Si nunca ha respondido, mostrar el modal
            if (modal) modal.style.display = 'flex';
        }
    }

    // --- Listeners del Modal ---

    if (btnYes && btnNo) {
        btnYes.addEventListener('click', () => {
            localStorage.setItem('isAdult', 'true');
            checkAgeRestriction(); // Llama a la función para cargar el contenido
        });

        btnNo.addEventListener('click', () => {
            localStorage.setItem('isAdult', 'false');
            checkAgeRestriction(); // Llama a la función para cargar el contenido filtrado
        });
    }

    // Iniciar la verificación
    checkAgeRestriction(); 
});
