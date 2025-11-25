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
    
    // Obtenemos todos los elementos de tarjeta (ahora son <article>s)
    const projects = Array.from(projectGrid.querySelectorAll('.archive-card')); 

    // Definición de posibles valores de filtro (para saber si es rol o categoría)
    const roles = ["Post Coordinator", "Prod Coordinator", "Production Manager", "Prod Assistant"];
    const categories = ["Music Video", "Commercial", "TV & Series"];

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
        
        projects.forEach(project => {
            // Obtenemos los atributos de datos
            const projectRole = project.getAttribute('data-role');
            const projectCategory = project.getAttribute('data-category');
            
            let isVisible = false;

            if (filterValue === 'all') {
                isVisible = true; // Mostrar todo
            } else if (roles.includes(filterValue) && projectRole === filterValue) {
                isVisible = true; // Filtrar por Rol
            } else if (categories.includes(filterValue) && projectCategory === filterValue) {
                isVisible = true; // Filtrar por Categoría
            }

            // Aplicar la visibilidad
            if (isVisible) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
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
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        
        // Reinsertar los elementos mezclados en el DOM
        array.forEach(item => {
            projectGrid.appendChild(item);
        });
    }

    // Inicializar la página con el filtro "All Work" y orden aleatorio
    shuffleProjects(projects);
});
