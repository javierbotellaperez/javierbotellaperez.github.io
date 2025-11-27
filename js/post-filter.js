/**
 * js/post-filter.js
 * Maneja la lógica de filtrado de proyectos, la apertura/cierre del menú desplegable, 
 * y la funcionalidad de Lightbox de proyectos con navegación.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filter-toggle');
    const filterMenu = document.getElementById('filter-menu');
    const currentTitle = document.getElementById('current-filter-title');
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectGrid = document.getElementById('project-grid');
    
    const projects = Array.from(projectGrid.querySelectorAll('.archive-card')); 

    const modal = document.getElementById('project-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const dropdownIcon = document.getElementById('dropdown-icon');

    let currentProjectIndex = 0;

    // --- Lógica de Lightbox / Modal ---
    
    function openModal(index) {
        const visibleProjects = projects.filter(p => !p.classList.contains('hidden'));
        
        if (visibleProjects.length === 0) return;
        
        currentProjectIndex = index;

        // 1. Clonamos el contenido del proyecto seleccionado
        const projectToDisplay = visibleProjects[currentProjectIndex].cloneNode(true);
        
        // 2. Removemos los enlaces de la imagen y tags clonados
        const imageLink = projectToDisplay.querySelector('a:not(.role-filter-tag):not(.category-filter-tag)');
        if (imageLink) {
            imageLink.outerHTML = `<img src="${imageLink.querySelector('img').src}" class="project-thumbnail" alt="Project Image">`;
        }
        
        // 3. Limpiamos y añadimos el contenido al modal
        modalDetails.innerHTML = '';
        modalDetails.appendChild(projectToDisplay);
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function navigateModal(direction) {
        const visibleProjects = projects.filter(p => !p.classList.contains('hidden'));
        if (visibleProjects.length === 0) return;

        currentProjectIndex = (currentProjectIndex + direction + visibleProjects.length) % visibleProjects.length;
        
        openModal(currentProjectIndex);
    }
    
    // Asignar listeners a cada ficha para abrir el modal
    projects.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // No abrimos el modal si estamos clicando en el tag de filtro
            if (e.target.classList.contains('role-filter-tag') || e.target.classList.contains('category-filter-tag')) {
                return;
            }
            
            e.preventDefault();
            
            // Encontramos el índice del proyecto clicado DENTRO de los visibles
            const visibleProjects = projects.filter(p => !p.classList.contains('hidden'));
            const visibleIndex = visibleProjects.indexOf(card);

            if (visibleIndex !== -1) {
                openModal(visibleIndex);
            }
        });
    });

    // Eventos de navegación del modal
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => navigateModal(-1));
    nextBtn.addEventListener('click', () => navigateModal(1));
    
    // Navegación con teclado (cursor entre proyectos y ESC)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateModal(-1);
            if (e.key === 'ArrowRight') navigateModal(1);
        }
    });

    // --- Lógica del Desplegable y Filtrado ---

    // Botón de Reset [x]
    const resetButton = document.createElement('button');
    resetButton.classList.add('filter-reset-btn');
    resetButton.innerHTML = 'x'; 
    resetButton.setAttribute('aria-label', 'Clear active filter');
    filterToggle.appendChild(resetButton); 

    // 1. Lógica del Desplegable (Dropdown)
    filterToggle.addEventListener('click', (e) => {
        if (e.target === resetButton) return; 
        
        filterMenu.classList.toggle('visible');
        filterToggle.classList.toggle('is-open'); 

        // 🟢 CLAVE: Rotación del ícono
        if (filterMenu.classList.contains('visible')) {
            dropdownIcon.style.transform = 'rotate(180deg)';
        } else {
            dropdownIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Cerrar el menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.classList.remove('visible');
            dropdownIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Lógica del Botón Reset [x]
    resetButton.addEventListener('click', () => {
        const allWorkButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        if (allWorkButton) {
            allWorkButton.click();
        }
    });

    // Lógica de Filtrado por Botón del Menú
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            filterMenu.classList.remove('visible');
            currentTitle.textContent = button.textContent;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (filterValue === 'all') {
                currentTitle.classList.remove('filtered');
            } else {
                currentTitle.classList.add('filtered');
            }

            filterProjects(filterValue);
        });
    });
    
    // Configurar listeners para las etiquetas (tags) de las tarjetas
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

    // Función Principal de Filtrado
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

            if (isVisible) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
        
        shuffleProjects(projects);
    }
    
    // Función de Ordenación Aleatoria y Inclinación
    function applyRandomTilt(projects) {
        projects.forEach(project => {
            const tilt = (Math.random() * 3) - 1.5; 
            const shiftX = (Math.random() * 5) - 2.5; 
            project.style.transform = `translateX(${shiftX}px) rotate(${tilt}deg)`;
        });
    }

    function shuffleProjects(array) {
        const visibleProjects = array.filter(p => !p.classList.contains('hidden'));
        
        let currentIndex = visibleProjects.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [visibleProjects[currentIndex], visibleProjects[randomIndex]] = [
                visibleProjects[randomIndex], visibleProjects[currentIndex]];
        }
        
        visibleProjects.forEach(item => {
            projectGrid.appendChild(item);
        });

        array.filter(p => p.classList.contains('hidden')).forEach(item => {
            projectGrid.appendChild(item);
        });
        
        applyRandomTilt(projects);
    }

    // Inicialización
    setupTagListeners(); 
    shuffleProjects(projects);
});
