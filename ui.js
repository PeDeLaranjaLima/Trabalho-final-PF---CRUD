// Importa a classe/módulo principal que contém as funções de manipulação da livraria
import { HQLibrary } from './lib.js';

// ===== Dados e elementos =====

// Carrega os Quadrinhos salvos no localStorage.
// Se não houver nada salvo, reinicia com os Quadrinhos padrão (resetHQs).
let HQs = HQLibrary.loadHQs();
let backlog = HQLibrary.loadBacklog();
let favorites = HQLibrary.loadFavorites();
let readList = HQLibrary.loadRead();

// Seleciona elementos HTML que serão manipulados pelo JavaScript
const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');
const backButton = document.getElementById('backButton');

// Garante que o estado atual seja salvo no localStorage
HQLibrary.saveHQs(HQs);

// ===== Funções de exibição e controle =====

function showResult(content, isForm = false) {
    buttons.style.display = 'none';
    output.innerHTML = '';
    forms.innerHTML = '';

    const container = isForm ? forms : output;
    container.innerHTML = content;

    backButton.style.display = 'block';
    backButton.onclick = showHome;
}

function showTemporaryAlert(message, duration = 3000) {
    const alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.style.position = "fixed";
    alertBox.style.top = "40px";
    alertBox.style.right = "40px";
    alertBox.style.padding = "10px 20px";
    alertBox.style.backgroundColor = "#e956bcff";
    alertBox.style.color = "blue";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0 4px 8px rgba(71, 216, 202, 1)";
    alertBox.style.zIndex = "9999";
    alertBox.style.fontSize = "14px";
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, duration);
}

function loadPage(content, isForm = false, duration = 2000) {
    createLoaderOverlay();
    setTimeout(() => {
        removeLoaderOverlay();
        showResult(content, isForm);
    }, duration);
}

function createLoaderOverlay(message = "Carregando...") {
    const overlay = document.createElement('div');
    overlay.id = 'loaderOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 1000;

    overlay.innerHTML = `
        <img src="loading.gif" alt="Carregando..." style="width:400px; height:400px; margin-bottom: 10px;">
        <p>${message}</p>
    `;

    document.body.appendChild(overlay);
}

function removeLoaderOverlay() {
    const overlay = document.getElementById('loaderOverlay');
    if (overlay) overlay.remove();
}

function showHome() {
    buttons.style.display = 'grid';
    forms.innerHTML = '';
    output.style.backgroundColor = "#972befff";
    output.innerHTML = `
        <img src="LoadPF_Project.gif" alt="nave" style="width:80px; vertical-align:middle; margin-right:1px;">
        <span>Bem-vindo(a) ao seu companheiro de leituras!</span>
    `;
    backButton.style.display = 'none';
}

function showHQList(list, title, showButtons = false) {
    const listHtml = list.map(hq => `
        <div class="hq-item">
            <label>
                ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
                ${showButtons ? `
                    <img class="add-to-backlog" data-id="${hq.id}" src="IconsBackLog.webp" alt="Backlog" width="40" height="40">
                    <img class="add-to-favorites" data-id="${hq.id}" src="IconsFavoritar.webp" alt="Favoritos" width="40" height="40">
                ` : ''}
            </label>
        </div>
    `).join('');

    showResult(`
        <h3>${title}</h3>
        ${listHtml || '<p>Nenhum quadrinho encontrado.</p>'}
    `);

    if (showButtons) {
        document.querySelectorAll('.add-to-backlog').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                const hq = HQs.find(h => h.id === id);
                if (hq) {
                    backlog = HQLibrary.addToBacklog(backlog, hq);
                    HQLibrary.saveBacklog(backlog);
                    showTemporaryAlert(`"${hq.title}" adicionado ao backlog!`);
                }
            });
        });

        document.querySelectorAll('.add-to-favorites').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                const hq = HQs.find(h => h.id === id);
                if (hq) {
                    favorites = HQLibrary.addToFavorites(favorites, hq);
                    HQLibrary.saveFavorites(favorites);
                    showTemporaryAlert(`"${hq.title}" adicionado aos favoritos!`);
                }
            });
        });
    }
}

function showAddForm() {
    showResult(`
        <h3>Adicionar Quadrinho</h3>
        <form id="addForm">
            <input type="number" id="addId" placeholder="ID" required />
            <input type="text" id="addTitle" placeholder="Título" required />
            <input type="text" id="addAuthor" placeholder="Autor" required />
            <input type="number" id="addYear" placeholder="Ano" required />
            <input type="text" id="addPublisher" placeholder="Editora" required />
            <input type="text" id="addCategory" placeholder="Categoria" required />
            <button type="submit">Adicionar</button>
        </form>
    `, true);

    document.getElementById('addForm').addEventListener('submit', e => {
        e.preventDefault();
        const newHQs = {
            id: Number(document.getElementById('addId').value),
            title: document.getElementById('addTitle').value,
            author: document.getElementById('addAuthor').value,
            year: Number(document.getElementById('addYear').value),
            publisher: document.getElementById('addPublisher').value,
            category: document.getElementById('addCategory').value
        };
        HQs = HQLibrary.addHQ(HQs, newHQs);
        HQLibrary.saveHQs(HQs);
        showResult('Quadrinho adicionado!');
    });
}

function showUpdateForm() {
    showResult(`
        <h3>Atualizar Quadrinho</h3>
        <form id="updateForm">
            <input type="number" id="updateId" placeholder="ID do Quadrinho" required />
            <input type="text" id="updateTitle" placeholder="Novo título" />
            <input type="text" id="updateAuthor" placeholder="Novo autor" />
            <input type="number" id="updateYear" placeholder="Novo ano" />
            <input type="text" id="updatePublisher" placeholder="Nova editora" />
            <input type="text" id="updateCategory" placeholder="Nova categoria" />
            <button type="submit">Atualizar</button>
        </form>
    `, true);

    document.getElementById('updateForm').addEventListener('submit', e => {
        e.preventDefault();
        const id = Number(document.getElementById('updateId').value);
        const updates = {};
        const title = document.getElementById('updateTitle').value;
        const author = document.getElementById('updateAuthor').value;
        const year = document.getElementById('updateYear').value;
        const publisher = document.getElementById('updatePublisher').value;
        const category = document.getElementById('updateCategory').value;
        if (title) updates.title = title;
        if (author) updates.author = author;
        if (year) updates.year = Number(year);
        if (publisher) updates.publisher = publisher;
        if (category) updates.category = category;
        HQs = HQLibrary.updateHQ(HQs, id, updates);
        HQLibrary.saveHQs(HQs);
        showResult('Quadrinho atualizado!');
    });
}

function showDeleteForm() {
    showResult(`
        <h3>Remover Quadrinho</h3>
        <form id="deleteForm">
            <input type="number" id="deleteId" placeholder="ID do Quadrinho" required />
            <button type="submit">Remover</button>
        </form>
    `, true);

    document.getElementById('deleteForm').addEventListener('submit', e => {
        e.preventDefault();
        const id = Number(document.getElementById('deleteId').value);
        HQs = HQLibrary.deleteHQ(HQs, id);
        HQLibrary.saveHQs(HQs);
        showResult('Quadrinho removido!');
    });
}

function showListByAuthorForm() {
    showResult(`
        <h3>Listar Quadrinhos por autor</h3>
        <form id="authorForm">
            <input type="text" id="authorName" placeholder="Nome do autor" required />
            <button type="submit">Listar</button>
        </form>
    `, true);

    document.getElementById('authorForm').addEventListener('submit', e => {
        e.preventDefault();
        const author = document.getElementById('authorName').value;
        const filtered = HQLibrary.listHQsByAuthor(HQs, author);
        const resultText = filtered.length === 0 ? 'Nenhum Quadrinho encontrado.' : HQLibrary.listHQs(filtered);
        showResult(resultText);
    });
}

function showAuthorChart() {
    const counts = HQLibrary.countHQsByAuthor(HQs);
    const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
    const labels = sorted.map(([autor]) => autor);
    const data = sorted.map(([_, qtd]) => qtd);

    const palette = ["#FFB6C1", "#FF69B4", "#FF1493", "#FFC0CB", "#DB7093", "#DA70D6", "#BA55D3", "#9932CC", "#8A2BE2", "#9400D3", "#FFD700", "#FFC300", "#FFB300", "#FFAA00", "#FF9900", "#32CD32", "#228B22", "#00FF7F", "#00FA9A", "#7CFC00", "#FF69B4", "#FF6EB4", "#FF6ABF", "#FF5AC1", "#FF4FBF", "#DDA0DD", "#EE82EE", "#DA70D6", "#C71585", "#BA55D3", "#FFFF00", "#FFFACD", "#FAFAD2", "#FFE135", "#FFD700", "#00FF00", "#32CD32", "#3CB371", "#2E8B57", "#00FA9A", "#FF1493", "#FF00FF", "#FF77FF", "#FF33CC", "#FF66CC", "#8A2BE2", "#9370DB", "#7B68EE", "#6A5ACD", "#663399"];
    const colors = labels.map((_, i) => palette[i % palette.length]);

    showResult(`<canvas id="authorChart" width="900" height="900" style="display:block; margin:0 auto;"></canvas>`);

    setTimeout(() => {
        const ctx = document.getElementById('authorChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ label: 'Quadrinhos', data, backgroundColor: colors, borderColor: '#000000', borderWidth: 2 }] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true, position: 'right' },
                }
            }
        });
    }, 50);
}

function mostrarFormularioCategoria() {
    const HQs = HQLibrary.loadHQs();
    const categorias = [...new Set(HQs.map(hq => hq.category))].filter(Boolean);
    const options = categorias.map(cat => `<option value="${cat}"></option>`).join('');

    showResult(`
        <form id="formCategoria">
            <label for="categoriaInput">Categoria:</label>
            <input type="text" id="categoriaInput" name="categoria" list="listaCategorias" required />
            <datalist id="listaCategorias">
                ${options}
            </datalist>
            <button type="submit">Listar</button>
        </form>
        <div style="font-size: 0.9em; color: #888; margin-top: 4px;">Categorias disponíveis: ${categorias.join(', ')}</div>
    `, true);

    document.getElementById('formCategoria').addEventListener('submit', function(e) {
        e.preventDefault();
        const categoria = document.getElementById('categoriaInput').value.trim();
        if (!categoria) {
            showResult('Categoria não informada.');
            return;
        }
        const filtrados = HQLibrary.listHQsByCategory(HQs, categoria);
        if (filtrados.length === 0) {
            showResult('Nenhum quadrinho encontrado para esta categoria.');
            return;
        }
        const lista = HQLibrary.formatHQs(filtrados, HQLibrary.fullFormat);
        showResult(lista);
    });
}

function showBacklogList() {
    const backlogList = HQLibrary.loadBacklog();
    const listHtml = backlogList.map(hq => `
        <div class="hq-item">
            <label>
                ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
                <img class="mark-read" data-id="${hq.id}" src="IconsRemover.webp" width="40" height="40" alt="Marcar como lido">
            </label>
        </div>
    `).join('');

    showResult(`
        <h3>Meu Backlog</h3>
        ${listHtml || '<p>Backlog vazio.</p>'}
    `);

    document.querySelectorAll('.mark-read').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const result = HQLibrary.moveToRead(backlog, readList, id);
            backlog = result.backlog;
            readList = result.readList;
            HQLibrary.saveBacklog(backlog);
            HQLibrary.saveRead(readList);
            showTemporaryAlert(`"${HQs.find(h => h.id === id)?.title}" marcado como lido!`);
            showBacklogList();
        });
    });
}

function showFavoritieslogList() {
    const favoritesList = HQLibrary.loadFavorites();
    const listHtml = favoritesList.map(hq => `
        <div class="hq-item">
            <label>
                ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
                <img class="remove-favorite" data-id="${hq.id}" src="IconsRemover.webp" width="40" height="40" alt="Remover dos favoritos">
            </label>
        </div>
    `).join('');

    showResult(`
        <h3>Meus Favoritos</h3>
        ${listHtml || '<p>Nenhum quadrinho favoritado.</p>'}
    `);

    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            favorites = HQLibrary.removeFromFavorites(favorites, id);
            HQLibrary.saveFavorites(favorites);
            showFavoritieslogList();
            showTemporaryAlert('Quadrinho removido dos favoritos!');
        });
    });
}

function showListByYearForm() {
    const HQs = HQLibrary.loadHQs();
    const anos = [...new Set(HQs.map(hq => hq.year))].sort((a, b) => a - b);
    const options = anos.map(ano => `<option value="${ano}"></option>`).join('');

    showResult(`
        <h3>Listar Quadrinhos por Ano</h3>
        <form id="yearForm">
            <label for="yearInput">Ano:</label>
            <input type="number" id="yearInput" name="year" list="listaAnos" required />
            <datalist id="listaAnos">
                ${options}
            </datalist>
            <button type="submit">Listar</button>
        </form>
        <div style="font-size: 0.9em; color: #fff700ff; margin-top: 4px;">
            Anos disponíveis: ${anos.join(', ')}
        </div>
    `, true);

    document.getElementById('yearForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const year = Number(document.getElementById('yearInput').value);
        if (!year) {
            showTemporaryAlert('Ano não informado!');
            return;
        }
        const filtrados = HQs.filter(hq => hq.year === year);
        if (filtrados.length === 0) {
            showResult(`Nenhum quadrinho encontrado para o ano ${year}.`);
            return;
        }
        showHQList(filtrados, `Quadrinhos do ano ${year}`);
    });
}

function showReadForm() {
    const readList = HQLibrary.loadRead();
    const listHtml = readList.map(hq => `
        <div class="hq-item">
            <label>
                ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
                <img class="add-to-favorites" data-id="${hq.id}" src="IconsFavoritar.webp" alt="Favoritos" width="40" height="40">
            </label>
        </div>
    `).join('');

    showResult(`
        <h3>Quadrinhos Lidos</h3>
        ${listHtml || '<p>Nenhum quadrinho lido ainda.</p>'}
    `);

    // Adiciona o listener para o botão de favoritar
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const hq = readList.find(h => h.id === id); // Procura na lista de lidos
            if (hq) {
                favorites = HQLibrary.addToFavorites(favorites, hq);
                HQLibrary.saveFavorites(favorites);
                showTemporaryAlert(`"${hq.title}" adicionado aos favoritos!`);
            }
        });
    });
}

// ===== Actions =====
const actions = {
    init: () => {
        HQs = HQLibrary.resetHQs();
        HQLibrary.saveHQs(HQs);
        showTemporaryAlert('Livraria iniciada com lista de Quadrinhos padrão!');
    },
    add: () => showAddForm(),
    list: () => showHQList(HQLibrary.loadHQs(), 'Catálogo Completo', true),
    listRead: () => showReadForm(),
    update: () => showUpdateForm(),
    delete: () => showDeleteForm(),
    clear: () => {
        HQLibrary.clearHQs();
        HQs = [];
        backlog = [];
        favorites = [];
        readList = [];
        showTemporaryAlert('Livraria esvaziada.');
    },
    showBacklog: () => showBacklogList(),
    showFavorites: () => showFavoritieslogList(),
    listByAuthor: () => showListByAuthorForm(),
    countByAuthor: () => showAuthorChart(),
    listByYear: () => showListByYearForm(),
    listByCategory: () => mostrarFormularioCategoria(),
    exit: () => showResult()
};
// ===== Event listener =====
buttons.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const action = e.target.dataset.action;
        if (action && actions[action]) actions[action]();
    }
});

document.addEventListener('DOMContentLoaded', showHome);