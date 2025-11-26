/**
 * js/post-filter.js
 * Maneja la lógica de filtrado de proyectos, la apertura/cierre del menú desplegable, 
 * y la ordenación aleatoria con efecto de inclinación de archivador.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filter-toggle');
    const filterMenu = document.getElementById('filter-menu');
    const currentTitle = document.getElementById('current-filter-title');
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectGrid = document.getElementById('project-grid');
    
    const projects = Array.from(projectGrid.querySelectorAll('.archive-card')); 

    // --- Lógica del Desplegable y Botón Reset ---
    
    // 🟢 CLAVE: Añadir el botón de Reset [x] al DOM
    const resetButton = document.createElement('button');
    resetButton.classList.add('filter-reset-btn');
    resetButton.innerHTML = 'x'; 
    resetButton.setAttribute('aria-label', 'Clear active filter');
    filterToggle.appendChild(resetButton); 

    filterToggle.addEventListener('click', (e) => {
        if (e.target === resetButton) return; 
        filterMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
        if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.classList.remove('visible');
        }
    });

    resetButton.addEventListener('click', () => {
        const allWorkButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        if (allWorkButton) {
            allWorkButton.click();
        }
    });

    // --- Lógica de Filtrado por Botón del Menú ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            filterMenu.classList.remove('visible');
            currentTitle.textContent = button.textContent;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Marcar si hay un filtro activo (para mostrar el botón X)
            if (filterValue === 'all') {
                currentTitle.classList.remove('filtered');
            } else {
                currentTitle.classList.add('filtered');
            }
            
            filterProjects(filterValue);
        });
    });
    
    // --- Configurar listeners para las etiquetas (tags) de las tarjetas ---
    function setupTagListeners() {
        const tagElements = document.querySelectorAll('.role-filter-tag, .category-filter-tag');

        tagElements.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault(); 
                const filterValue = tag.getAttribute('data-filter');
                
                const correspondingButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === filterValue);
                
                if (correspondingButton) {
                    correspondingButton.click(); 
                } else {
                    currentTitle.textContent = filterValue;
                    currentTitle.classList.add('filtered');
                    filterProjects(filterValue);
                }
            });
        });
    }

    // --- Función Principal de Filtrado ---
    function filterProjects(filterValue) {
        
        projects.forEach(project => {
            const projectRole = project.getAttribute('data-role');
            const projectCategory = project.getAttribute('data-category');
            
            let isVisible = false;

            if (filterValue === 'all') {
                isVisible = true; 
            } 
            else if (projectRole === filterValue || projectCategory === filterValue) {
                isVisible = true; 
            }

            // Aplicar la visibilidad
            if (isVisible) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
        
        // Ejecutar ordenación e inclinación
        shuffleProjects(projects);
    }
    
    // 🟢 NUEVA FUNCIÓN: Aplica una ligera rotación aleatoria a las fichas
    function applyRandomTilt(projects) {
        projects.forEach(project => {
            // Generar un ángulo aleatorio entre -1.5 y 1.5 grados
            const tilt = (Math.random() * 3) - 1.5; 
            
            // Generar una pequeña traslación horizontal aleatoria 
            const shiftX = (Math.random() * 5) - 2.5; 

            // Aplicar la transformación CSS (transformado + rotación)
            // Es crucial que el translate y rotate estén en el mismo string
            project.style.transform = `translateX(${shiftX}px) rotate(${tilt}deg)`;
        });
    }
    
    // Función de Ordenación Aleatoria
    function shuffleProjects(array) {
        const visibleProjects = array.filter(p => !p.classList.contains('hidden'));
        
        let currentIndex = visibleProjects.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [visibleProjects[currentIndex], visibleProjects[randomIndex]] = [
                visibleProjects[randomIndex], visibleProjects[currentIndex]];
        }
        
        // Reinsertar los elementos mezclados en el DOM
        visibleProjects.forEach(item => {
            projectGrid.appendChild(item);
        });

        // Aseguramos que los elementos ocultos también se reinserten al final
        array.filter(p => p.classList.contains('hidden')).forEach(item => {
            projectGrid.appendChild(item);
        });
        
        // 🟢 CLAVE: Aplicamos la inclinación después de la ordenación
        applyRandomTilt(projects);
    }

    // Inicialización
    setupTagListeners(); 
    shuffleProjects(projects);
});
