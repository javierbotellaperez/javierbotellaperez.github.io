/**
 * js/sticker-manager.js
 * Clase para manejar la interacción (PAN y PINCH) y la gestión de 20 stickers.
 */

class InteractiveSticker {
    constructor(elementId, initialSize = 150, minScale = 0.5, maxScale = 3) {
        this.containerLink = document.getElementById(elementId);
        
        if (!this.containerLink) return;

        this.initialSize = initialSize;
        this.MIN_SCALE = minScale;
        this.MAX_SCALE = maxScale;
        
        this.currentScale = 1;
        this.currentX = 0;
        this.currentY = 0;
        
        this.isMoving = false; // Bandera para diferenciar arrastre de click
        this.isClick = true; // Asumimos que es un click hasta que se demuestre lo contrario

        this.setupInitialPosition();
        this.setupHammer();
    }
    
    setupInitialPosition() {
        // Establece un tamaño inicial fijo
        this.containerLink.style.width = `${this.initialSize}px`;

        // Posicionamiento Aleatorio dentro de la ventana
        const anchoViewport = window.innerWidth - this.initialSize;
        const altoViewport = window.innerHeight - this.initialSize;

        this.currentX = Math.random() * anchoViewport;
        this.currentY = Math.random() * altoViewport;

        // Aplica la transformación inicial
        this.setTransform(this.currentX, this.currentY, this.currentScale);
    }
    
    setTransform(x, y, scale) {
        // Usa translate3d para aceleración por hardware
        this.containerLink.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    setupHammer() {
        const mc = new Hammer(this.containerLink);
        
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 5 }); 
        mc.get('pinch').set({ enable: true });

        // --- GESTIÓN DE Clicks / Enlaces ---
        this.containerLink.addEventListener('click', (e) => {
            // Si hubo movimiento, cancelamos el click para no navegar
            if (this.isMoving) {
                e.preventDefault();
            }
        }, true); // Usamos captura para asegurarnos de que se ejecute primero

        // --- Eventos de PAN (Arrastre) ---
        mc.on('panstart', (ev) => this.handlePanStart(ev));
        mc.on('panmove', (ev) => this.handlePanMove(ev));
        mc.on('panend', (ev) => this.handlePanEnd(ev));

        // --- Eventos de PINCH (Zoom) ---
        mc.on('pinchstart', (ev) => this.handlePinchStart(ev));
        mc.on('pinchmove', (ev) => this.handlePinchMove(ev));
        mc.on('pinchend', (ev) => this.handlePinchEnd(ev));
    }
    
    // --- Lógica de Arrastre (PAN) ---
    handlePanStart(ev) {
        this.isMoving = false;
        // Obtener la posición actual para evitar saltos (muy importante)
        const style = window.getComputedStyle(this.containerLink).transform;
        const matrix = style.match(/matrix.*\((.+)\)/);
        if (matrix && matrix[1]) {
            const values = matrix[1].split(', ');
            this.currentX = parseFloat(values[4] || 0);
            this.currentY = parseFloat(values[5] || 0);
        }
    }

    handlePanMove(ev) {
        if (Math.abs(ev.deltaX) > 5 || Math.abs(ev.deltaY) > 5) {
            this.isMoving = true;
        }
        
        const deltaX = this.currentX + ev.deltaX;
        const deltaY = this.currentY + ev.deltaY;
        this.setTransform(deltaX, deltaY, this.currentScale);
    }

    handlePanEnd(ev) {
        // Guarda la posición final (Fijación)
        this.currentX += ev.deltaX;
        this.currentY += ev.deltaY;
    }

    // --- Lógica de Zoom (PINCH) ---
    handlePinchStart(ev) {
        this.isMoving = true; // El zoom también cuenta como movimiento
    }
    
    handlePinchMove(ev) {
        let newScale = this.currentScale * ev.scale;
        newScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));
        this.setTransform(this.currentX, this.currentY, newScale);
    }

    handlePinchEnd(ev) {
        this.currentScale *= ev.scale;
        this.currentScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, this.currentScale));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const totalStickers = 20;
    const stickerTypes = [
        { idBase: 'sticker-arnau', src: 'assets/images/arnau.png', href: 'arnau.html' },
        { idBase: 'sticker-alex', src: 'assets/images/alex.png', href: 'alex.html' }
    ];
    
    const stickerArea = document.querySelector('.sticker-area');
    const stickersArray = [];

    // 1. Generar los 20 stickers dinámicamente en el HTML
    for (let i = 0; i < totalStickers; i++) {
        // Alternamos entre los dos tipos de sticker
        const typeIndex = i % stickerTypes.length;
        const type = stickerTypes[typeIndex];
        
        const uniqueId = `${type.idBase}-${i}`;
        
        const a = document.createElement('a');
        a.id = uniqueId;
        a.href = type.href;
        a.classList.add('sticker-link', 'interactive-sticker');

        const img = document.createElement('img');
        img.src = type.src;
        img.alt = `Sticker ${type.idBase}`;
        
        a.appendChild(img);
        stickerArea.appendChild(a);
    }

    // 2. Inicializar la interacción Hammer.js para cada sticker
    for (let i = 0; i < totalStickers; i++) {
        const typeIndex = i % stickerTypes.length;
        const type = stickerTypes[typeIndex];
        const uniqueId = `${type.idBase}-${i}`;
        
        const stickerInstance = new InteractiveSticker(uniqueId);
        stickersArray.push(stickerInstance);
    }
});
