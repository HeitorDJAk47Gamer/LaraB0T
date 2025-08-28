document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // --- PADRONIZAÇÃO DE COMANDOS ---
    const commandPrefix = '/';
    const statusMap = {
        'disponivel': { text: 'Disponível', color: 'limegreen' },
        'manutencao': { text: 'Em Manutenção', color: 'orange' },
        'melhoria': { text: 'Em Melhoria', color: 'deepskyblue' },
        'fora-do-ar': { text: 'Fora do Ar', color: 'grey' }
    };

    function setupCommands() {
        const commandCards = document.querySelectorAll('.command-card');
        commandCards.forEach(card => {
            const commandName = card.dataset.name;
            card.querySelector('h3').textContent = commandPrefix + commandName;
        });
    }

    // --- LÓGICA DO SELETOR DE TEMA ---
    function applyTheme(theme) {
        if (theme === 'light') {
            htmlEl.classList.add('light-mode');
            themeToggle.checked = true;
        } else {
            htmlEl.classList.remove('light-mode');
            themeToggle.checked = false;
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            htmlEl.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- AJUSTE DINÂMICO DO CONTEÚDO ---
    function adjustMainPadding() {
        const headerHeight = header.offsetHeight;
        main.style.paddingTop = `${headerHeight + 40}px`;
    }

    // --- NAVEGAÇÃO SINGLE-PAGE ---
    const pageLinks = document.querySelectorAll('.page-link');
    const pageSections = document.querySelectorAll('.page-section');

    function showPage(pageId) {
        pageSections.forEach(section => section.classList.remove('active'));
        pageLinks.forEach(link => link.classList.remove('active-link'));

        const activePage = document.querySelector(pageId);
        if (activePage) activePage.classList.add('active');
        
        const activeLink = document.querySelector(`a[href="${pageId}"]`);
        if(activeLink) activeLink.classList.add('active-link');
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            history.pushState(null, null, targetId);
            showPage(targetId);
        });
    });

    const currentHash = window.location.hash || '#inicio';
    showPage(currentHash);

    window.onpopstate = () => showPage(window.location.hash || '#inicio');

    // --- FUNCIONALIDADE DO MODAL (POP-UP) ---
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const clickableItems = document.querySelectorAll('.card, .command-card');

    clickableItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalImage = document.getElementById('modal-image');
            const modalTitle = document.getElementById('modal-title');
            const modalStatus = document.getElementById('modal-status');
            const modalDescription = document.getElementById('modal-description');
            const modalExample = document.getElementById('modal-example');
            const linksContainer = document.getElementById('modal-links');

            // Limpa o conteúdo anterior
            modalImage.style.display = 'none';
            modalStatus.style.display = 'none';
            modalExample.style.display = 'none';
            linksContainer.style.display = 'none';

            if (item.classList.contains('command-card')) {
                // Lógica para Comandos
                const commandName = item.dataset.name;
                const statusKey = item.dataset.status;
                const statusInfo = statusMap[statusKey] || { text: 'Indefinido', color: 'grey' };

                modalTitle.textContent = commandPrefix + commandName;
                modalDescription.textContent = item.dataset.description;
                
                modalStatus.innerHTML = `<span class="status-dot" style="background-color: ${statusInfo.color};"></span> ${statusInfo.text}`;
                modalStatus.style.display = 'flex';

                modalExample.innerHTML = `<strong>Exemplo:</strong> <code>${commandPrefix}${item.dataset.example}</code>`;
                modalExample.style.display = 'block';

            } else if (item.classList.contains('card')) {
                // Lógica para Sobre/Projetos
                const links = item.dataset.links ? JSON.parse(item.dataset.links) : [];
                
                modalImage.src = item.dataset.image;
                modalImage.style.display = 'block';
                modalTitle.textContent = item.dataset.title;
                modalDescription.textContent = item.dataset.description;
                
                linksContainer.innerHTML = '';
                if (links.length > 0) {
                    links.forEach(link => {
                        linksContainer.innerHTML += `<a href="${link.url}" target="_blank" rel="noopener noreferrer"><img src="${link.icon}" alt="${link.alt}"></a>`;
                    });
                    linksContainer.style.display = 'block';
                }
            }
            
            modal.classList.add('active');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // --- INICIALIZAÇÃO ---
    setupCommands();
    adjustMainPadding();
    window.addEventListener('resize', adjustMainPadding);
});
