/**
 * js/sticker-manager.js
 * Clase para manejar la interacción (PAN, PINCH, WHEEL) y la gestión de stickers ÚNICOS,
 * con funcionalidad de z-index y generación de pestañas de nombre de proyecto.
 * * Versión corregida: Soluciona la anulación accidental de clicks (navegación).
 */

// Contador global para asegurar que el sticker seleccionado siempre tenga el z-index más alto.
let stickerZIndexCounter = 1000; 

class InteractiveSticker {
    constructor(elementId, initialSize = 150, minScale = 0.5, maxScale = 3) {
        this.containerLink = document.getElementById(elementId);
        
        if (!this.containerLink) return;

        // Restauramos el tamaño inicial a 150px
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

        // --- GESTIÓN de Clicks / Enlaces (Corrección de navegación) ---
        this.containerLink.addEventListener('click', (e) => {
            // 🟢 CLAVE: Si hubo movimiento (arrastre o zoom), cancelamos la navegación.
            if (this.isMoving) {
                e.preventDefault();
                // Resetear el isMoving para que el siguiente click SÍ funcione.
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
        // Marcamos movimiento si supera el threshold de 2px
        if (Math.abs(ev.deltaX) > 2 || Math.abs(ev.deltaY) > 2) { 
            this.isMoving = true;
        }
        
        const deltaX = this.currentX + ev.deltaX;
        const deltaY = this.currentY + ev.deltaY;
        this.setTransform(deltaX, deltaY, this.currentScale);
    }

    handlePanEnd(ev) {
        this.containerLink.style.transition = this.QUICK_TRANSITION;
        
        // El isMoving ya se marcó en panmove si hubo movimiento real.
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
    
    // 🟢 CLAVE: Array de stickers ÚNICOS
    const stickerTypes = [
        { idBase: 'sticker-arnau', src: 'assets/images/arnau.png', href: 'arnau.html', name: 'Arnau' },
        { idBase: 'sticker-alex', src: 'assets/images/alex.png', href: 'alex.html', name: 'Alex' },
        { idBase: 'sticker-diary', src: 'assets/images/diary.png', href: 'diary.html', name: 'Diary' }, 
        { idBase: 'sticker-paris', src: 'assets/images/paris.png', href: 'paris.html', name: 'Paris' }
    ];
    
    const stickerArea = document.querySelector('.sticker-area');
    
    // 1. Generar los stickers ÚNICOS dinámicamente
    stickerTypes.forEach((type) => {
        const uniqueId = type.idBase; 
        
        const a = document.createElement('a');
        a.id = uniqueId;
        a.href = type.href; 
        a.classList.add('sticker-link', 'interactive-sticker');

        // Añadir la Pestaña de Nombre
        const tag = document.createElement('span');
        tag.classList.add('project-tag');
        tag.textContent = type.name;
        a.appendChild(tag);
        
        const img = document.createElement('img');
        img.src = type.src; 
        img.alt = `Sticker ${type.idBase}`;
        
        a.appendChild(img);
        stickerArea.appendChild(a);

        // 2. Inicializar la interacción Hammer.js
        new InteractiveSticker(uniqueId);
    });
});
