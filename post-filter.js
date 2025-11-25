/**
 * js/post-filter.js
 * Maneja la lógica de filtrado de proyectos por rol y categoría, 
 * y la apertura/cierre del menú desplegable.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filter-toggle');
    const filterMenu = document.getElementById('filter-menu');
    const currentTitle = document.getElementById('current-filter-title');
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectGrid = document.getElementById('project-grid');
    const projects = Array.from(projectGrid.children); // Todas las tarjetas de proyecto

    // 1. Lógica del Desplegable (Dropdown)
    filterToggle.addEventListener('click', () => {
        filterMenu.classList.toggle('visible');
    });

    // Cerrar el menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.classList.remove('visible');
        }
    });

    // 2. Lógica de Filtrado por Botón
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Ocultar el menú después de la selección
            filterMenu.classList.remove('visible');
            
            // Actualizar el título principal
            currentTitle.textContent = button.textContent;

            // Desactivar todos los botones y activar el seleccionado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Ejecutar el filtrado y ordenación
            filterProjects(filterValue);
        });
    });

    // 3. Función Principal de Filtrado y Ordenación
    function filterProjects(filterValue) {
        
        // El valor de búsqueda puede ser un rol o una categoría
        const isRoleFilter = ["Post Coordinator", "Prod Coordinator", "Production Manager", "Prod Assistant"].includes(filterValue);
        const isCategoryFilter = ["Music Video", "Commercial", "TV & Series"].includes(filterValue);
        
        projects.forEach(project => {
            const projectRole = project.getAttribute('data-role');
            const projectCategory = project.getAttribute('data-category');
            
            let isVisible = false;

            if (filterValue === 'all') {
                isVisible = true; // Mostrar todo
            } else if (isRoleFilter && projectRole === filterValue) {
                isVisible = true; // Filtrar por Rol
            } else if (isCategoryFilter && projectCategory === filterValue) {
                isVisible = true; // Filtrar por Categoría
            }

            // Aplicar la visibilidad
            if (isVisible) {
                project.classList.remove('hidden');
                // Nota: La opacidad se usa si la ordenación fuera más compleja
                project.style.opacity = 1; 
            } else {
                project.classList.add('hidden');
                project.style.opacity = 0; 
            }
        });
        
        // 4. Implementación de Ordenación Aleatoria
        shuffleProjects(projects);
    }
    
    // 4. Función de Ordenación Aleatoria (Fisher-Yates)
    function shuffleProjects(array) {
        let currentIndex = array.length, randomIndex;

        // Mientras queden elementos a mezclar.
        while (currentIndex !== 0) {
            // Seleccionar un elemento restante.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // Intercambiarlo con el elemento actual.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        
        // Reinsertar los elementos mezclados en el DOM (solo los visibles)
        array.forEach(item => {
            projectGrid.appendChild(item);
        });
    }

    // Inicializar la página con el filtro "All Work" y orden aleatorio
    shuffleProjects(projects);
});
