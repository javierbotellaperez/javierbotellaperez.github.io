/**
 * js/post-filter.js
 * Maneja la lógica de filtrado de proyectos por rol y categoría, 
 * y la apertura/cierre del menú desplegable, y la ordenación aleatoria.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filter-toggle');
    const filterMenu = document.getElementById('filter-menu');
    const currentTitle = document.getElementById('current-filter-title');
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectGrid = document.getElementById('project-grid');
    
    // Obtenemos todos los elementos de tarjeta (<article>s)
    const projects = Array.from(projectGrid.querySelectorAll('.archive-card')); 

    // --- 🟢 NUEVA LÓGICA: Añadir el botón de Reset [x] al DOM ---
    const resetButton = document.createElement('button');
    resetButton.classList.add('filter-reset-btn');
    resetButton.innerHTML = 'x'; 
    resetButton.setAttribute('aria-label', 'Clear active filter');
    filterToggle.appendChild(resetButton); 

    // 1. Lógica del Desplegable (Dropdown)
    filterToggle.addEventListener('click', (e) => {
        // Si se hace clic en el botón de reset, no abrimos el menú
        if (e.target === resetButton) return; 
        filterMenu.classList.toggle('visible');
    });

    // Cerrar el menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.classList.remove('visible');
        }
    });

    // --- Lógica del Botón Reset [x] ---
    resetButton.addEventListener('click', () => {
        // Simular el clic en el botón 'All Work'
        const allWorkButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        if (allWorkButton) {
            allWorkButton.click();
        }
    });

    // 2. Lógica de Filtrado por Botón del Menú
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

            // Ejecutar el filtrado y ordenación
            filterProjects(filterValue);
        });
    });
    
    // 🟢 3. Configurar listeners para las etiquetas (tags) de las tarjetas
    function setupTagListeners() {
        // Seleccionamos los nuevos enlaces de filtro que están DENTRO de las tarjetas
        const tagElements = document.querySelectorAll('.role-filter-tag, .category-filter-tag');

        tagElements.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault(); 
                const filterValue = tag.getAttribute('data-filter');
                
                // Buscar el botón correspondiente en el menú para actualizar el estado
                const correspondingButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === filterValue);
                
                if (correspondingButton) {
                    // Simular el clic en el botón del menú para actualizar el estado y filtrar
                    correspondingButton.click(); 
                } else {
                    // Si el filtro no existe en el menú, solo aplicamos la lógica básica
                    currentTitle.textContent = filterValue;
                    currentTitle.classList.add('filtered');
                    filterProjects(filterValue);
                }
            });
        });
    }


    // 4. Función Principal de Filtrado
    function filterProjects(filterValue) {
        
        projects.forEach(project => {
            const projectRole = project.getAttribute('data-role');
            const projectCategory = project.getAttribute('data-category');
            
            let isVisible = false;

            if (filterValue === 'all') {
                isVisible = true; // Mostrar todo
            } 
            // Si el valor del filtro coincide con el Rol O la Categoría
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
        
        // 5. Implementación de Ordenación Aleatoria
        shuffleProjects(projects);
    }
    
    // 5. Función de Ordenación Aleatoria
    function shuffleProjects(array) {
        // Obtenemos solo los elementos visibles para mezclar
        const visibleProjects = array.filter(p => !p.classList.contains('hidden'));
        
        let currentIndex = visibleProjects.length, randomIndex;

        // Mezclamos solo los elementos visibles
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
    }

    // Inicialización
    setupTagListeners(); // 🟢 Llamar a la nueva función de listeners
    shuffleProjects(projects);
});
