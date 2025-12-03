/**
 * js/sticker-manager.js
 * CLAVE: Solución del bug de posicionamiento.
 */

// Contador global para asegurar que el sticker seleccionado siempre tenga el z-index más alto.
let stickerZIndexCounter = 1000; 
let stickerInstances = []; // 🟢 Nueva lista para almacenar instancias de stickers

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
        // 🔴 ELIMINAMOS EL EVENTO 'load' - El posicionamiento se hará manualmente después del filtro
        // window.addEventListener('load', () => this.setupInitialPosition()); 
    }
    
    // 🟢 Esta función es llamada manualmente
    setupInitialPosition() {
        this.containerLink.style.width = `${this.initialSize}px`;

        // Añadimos una pequeña compensación de 250px para evitar que se solape con el header/footer
        const headerCompensate = 250; 
        
        const anchoViewport = window.innerWidth - this.initialSize - 50; 
        const altoViewport = window.innerHeight - this.initialSize - headerCompensate;
        
        // Posicionamiento
        this.currentX = Math.random() * anchoViewport;
        this.currentY = Math.random() * altoViewport + 50; // Empezar un poco más abajo

        this.setTransform(this.currentX, this.currentY, this.currentScale);
    }
    
    setTransform(x, y, scale) {
        this.containerLink.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    setupHammer() {
        // ... (resto de métodos de Hammer.js y WheelZoom) ...
    }
    
    // (Mantener aquí el resto de métodos de la clase: setupWheelZoom, handlePanStart, etc.)
}


document.addEventListener('DOMContentLoaded', () => {
    
    const stickerArea = document.querySelector('.sticker-area');
    const modal = document.getElementById('age-disclaimer-modal');
    const btnYes = document.getElementById('disclaimer-yes');
    const btnNo = document.getElementById('disclaimer-no');
    
    // --- Definición de Stickers ---
    const stickerTypes = [
        { idBase: 'sticker-arnau', src: 'assets/images/arnau.png', href: 'arnau.html', name: 'Arnau', ageRestricted: true},
        { idBase: 'sticker-alex', src: 'assets/images/alex.png', href: 'alex.html', name: 'Alex', ageRestricted: true },
        { idBase: 'sticker-diary', src: 'assets/images/diary.png', href: 'diary.html', name: 'Diary', ageRestricted: false }, 
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
    ];

    // --- Funciones de Filtrado y Visualización ---

    function filterAndShow(isAdult) {
        if (modal) {
            modal.style.display = 'none'; // Ocultar el modal
        }
        
        stickerArea.innerHTML = '';
        stickerInstances = []; // 🟢 Limpiamos las instancias anteriores
        
        stickerTypes.forEach((type) => {
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

                // Inicializar la interacción y guardar la instancia
                const sticker = new InteractiveSticker(uniqueId);
                stickerInstances.push(sticker); // 🟢 Guardamos la instancia
            }
        });
        
        // 🟢 CLAVE: Llama al posicionamiento ALEATORIO después de que todos los stickers existen.
        window.setTimeout(() => {
            stickerInstances.forEach(sticker => {
                sticker.setupInitialPosition();
            });
        }, 100); // Pequeño retraso para que el navegador termine de renderizar

        // Mostrar alerta de pie de página si es menor de 18
        if (!isAdult) {
            displayAgeAlert();
        }
    }
    
    // ... (El resto de las funciones displayAgeAlert, checkAgeRestriction, Listeners, etc. permanecen igual) ...
    
    // Iniciar la verificación
    checkAgeRestriction(); 
});
