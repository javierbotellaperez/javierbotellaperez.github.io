/**
 * js/sticker-manager.js
 * Clase para manejar la interacción (PAN y PINCH) y la gestión de 20 stickers
 * con movimiento y zoom ágiles.
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
        
        this.isMoving = false; 
        
        // 🔥 Agilidad: Transición rápida para el soltado final y el zoomend
        this.QUICK_TRANSITION = 'transform 0.1s ease-out';

        this.setupHammer();
        // 🟢 CLAVE: Posicionamiento inicial al cargar la ventana
        window.addEventListener('load', () => this.setupInitialPosition());
    }
    
    setupInitialPosition() {
        // Establece un tamaño inicial fijo
        this.containerLink.style.width = `${this.initialSize}px`;

        // Posicionamiento Aleatorio dentro de la ventana
        const anchoViewport = window.innerWidth - this.initialSize;
        const altoViewport = window.innerHeight - this.initialSize;

        // Asegura que no se posicionen en la esquina (0,0) y que estén dentro del viewport
        this.currentX = Math.random() * anchoViewport;
        this.currentY = Math.random() * altoViewport;

        // Aplica la transformación inicial
        this.setTransform(this.currentX, this.currentY, this.currentScale);
    }
    
    setTransform(x, y, scale) {
        this.containerLink.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    setupHammer() {
        const mc = new Hammer(this.containerLink);
        
        // Hammer settings:
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 2 }); // 🔥 Umbral bajo para mayor sensibilidad
        mc.get('pinch').set({ enable: true });

        // --- GESTIÓN de Clicks / Enlaces ---
        this.containerLink.addEventListener('click', (e) => {
            // Si hubo movimiento (arrastre o zoom), cancelamos el click para no navegar
            if (this.isMoving) {
                e.preventDefault();
            }
        }, true);

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
        
        // 🔥 Agilidad: Deshabilita la transición CSS para respuesta instantánea
        this.containerLink.style.transition = 'none';

        // Obtener la posición actual para evitar saltos
        const style = window.getComputedStyle(this.containerLink).transform;
        const matrix = style.match(/matrix.*\((.+)\)/);
        if (matrix && matrix[1]) {
            const values = matrix[1].split(', ');
            this.currentX = parseFloat(values[4] || 0);
            this.currentY = parseFloat(values[5] || 0);
        }
    }

    handlePanMove(ev) {
        // Detecta el movimiento real
        if (Math.abs(ev.deltaX) > 2 || Math.abs(ev.deltaY) > 2) { 
            this.isMoving = true;
        }
        
        const deltaX = this.currentX + ev.deltaX;
        const deltaY = this.currentY + ev.deltaY;
        this.setTransform(deltaX, deltaY, this.currentScale);
    }

    handlePanEnd(ev) {
        // 🔥 Agilidad: Reactiva la transición para el soltado final suave
        this.containerLink.style.transition = this.QUICK_TRANSITION;
        // Guarda la posición final (Fijación)
        this.currentX += ev.deltaX;
        this.currentY += ev.deltaY;
    }

    // --- Lógica de Zoom (PINCH) ---
    handlePinchStart(ev) {
        this.isMoving = true; 
        // 🔥 Agilidad: Deshabilita la transición CSS para respuesta instantánea
        this.containerLink.style.transition = 'none';
    }
    
    handlePinchMove(ev) {
        let newScale = this.currentScale * ev.scale;
        newScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));
        this.setTransform(this.currentX, this.currentY, newScale);
    }

    handlePinchEnd(ev) {
        // 🔥 Agilidad: Reactiva la transición para el final de zoom suave
        this.containerLink.style.transition = this.QUICK_TRANSITION;
        this.currentScale *= ev.scale;
        this.currentScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, this.currentScale));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const totalStickers = 20;
    const stickerTypes = [
        // Asegúrate de que las rutas y los hrefs sean correctos
        { idBase: 'sticker-arnau', src: 'assets/images/arnau.png', href: 'arnau.html' },
        { idBase: 'sticker-alex', src: 'assets/images/alex.png', href: 'alex.html' }
    ];
    
    const stickerArea = document.querySelector('.sticker-area');
    
    // 1. Generar los 20 stickers dinámicamente
    for (let i = 0; i < totalStickers; i++) {
        const typeIndex = i % stickerTypes.length;
        const type = stickerTypes[typeIndex];
        
        const uniqueId = `${type.idBase}-${i}`;
        
        const a = document.createElement('a');
        a.id = uniqueId;
        a.href = type.href; // 🟢 Hipervínculo establecido aquí
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
        
        // 🟢 CLAVE: La instancia se crea para cada uno de los 20 stickers
        new InteractiveSticker(uniqueId);
    }
});
