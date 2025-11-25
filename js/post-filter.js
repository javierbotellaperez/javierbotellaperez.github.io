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
            } 
            // 🟢 CLAVE: Si el valor del filtro coincide con el Rol O la Categoría
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
        
        // 4. Implementación de Ordenación Aleatoria
        shuffleProjects(projects);
    }
    
    // 4. Función de Ordenación Aleatoria (Fisher-Yates)
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
        
        // Reinsertar los elementos en el DOM (los visibles quedan mezclados y al principio)
        visibleProjects.forEach(item => {
            projectGrid.appendChild(item);
        });

        // Aseguramos que los elementos ocultos también se reinserten al final
        array.filter(p => p.classList.contains('hidden')).forEach(item => {
            projectGrid.appendChild(item);
        });
    }

    // Inicializar la página con el filtro "All Work" y orden aleatorio
    shuffleProjects(projects);
});
