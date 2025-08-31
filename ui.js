// Importa a classe/módulo principal que contém as funções de manipulação da livraria
import { HQLibrary } from './lib.js';

// ===== Dados e elementos =====

// Carrega os Quadrinhos salvos no localStorage.
// Se não houver nada salvo, reinicia com os Quadrinhos padrão (resetHQs).
let HQs = HQLibrary.loadHQs();
let backlog = HQLibrary.loadBacklog();
let favorites = HQLibrary.loadFavorites();

// Garante que o estado atual seja salvo no localStorage
HQLibrary.saveHQs(HQs);

// Seleciona elementos HTML que serão manipulados pelo JavaScript
const output = document.getElementById('output');    // Área de exibição de resultados
const forms = document.getElementById('forms');      // Área onde formulários aparecem dinamicamente
const buttons = document.getElementById('buttons');  // Div que contém os botões de ações

// ===== Funções de exibição e controle =====

/**
 * Exibe o botão de voltar e gerencia a visibilidade dos contêineres.
 * @param {string} content O conteúdo a ser exibido (HTML ou texto).
 * @param {boolean} isForm Se o conteúdo é um formulário (para ser inserido em `forms`).
 */
function showResult(content, isForm = false) {
    buttons.style.display = 'none'; // Esconde os botões do menu
    output.innerHTML = '';
    forms.innerHTML = '';

    const container = isForm ? forms : output;
    container.innerHTML = content;

    const backButton = document.createElement('button');
    backButton.textContent = 'voltar';
    backButton.id = 'backButton';
    backButton.className = 'back-button'; // Opcional: para estilização

    // Adiciona o botão de voltar ao contêiner de formulários ou de saída
    const targetElement = isForm ? forms : output;
    targetElement.insertBefore(backButton, targetElement.firstChild);
    
    // Adiciona o listener para o botão de voltar
    backButton.addEventListener('click', showHome);
}

// Função para mostrar alerta temporário em formato de pop up
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

    // Remove após 3000 segundos
    setTimeout(() => {
        alertBox.remove();
    }, duration);
}

function loadPage(content, isForm = false, duration = 2000) {
    createLoaderOverlay(); // mostra tela inteira de loading
    setTimeout(() => {
        removeLoaderOverlay(); // remove loader
        showResult(content, isForm); // mostra conteúdo real
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

/*
 * Retorna à tela inicial, mostrando os botões e limpando o resto.
 */
function showHome() {
    buttons.style.display = 'grid';
    forms.innerHTML = '';
    output.innerHTML = '<img src="nave.png" alt="nave" style="width:24px; vertical-align:middle;"> Bem-vindo(a) à Livraria de Quadrinhos!';
}

// ========================
// Função de listagem aprimorada
// ========================
function showHQList(list, title, showButtons = false) {
    const listHtml = list.map(hq => `
        <div class="hq-item">
            <span>${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})</span>
            ${showButtons ? `
                <div class="action-buttons">
                    <button class="add-to-backlog" data-id="${hq.id}">📚 Backlog</button>
                    <button class="add-to-favorites" data-id="${hq.id}">⭐ Favoritos</button>
                </div>
            ` : ''}
        </div>
    `).join('');

    showResult(`
        <h3>${title}</h3>
        ${listHtml || '<p>Nenhum quadrinho encontrado.</p>'}
    `);

    // Adiciona os event listeners aos botões
    if (showButtons) {
        document.querySelectorAll('.add-to-backlog').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                const hq = HQs.find(h => h.id === id);
                if (hq) {
                    backlog = HQLibrary.addToBacklog(backlog, hq);
                    HQLibrary.saveBacklog(backlog);
                    showTemporaryAlert(`"${hq.title}" adicionado ao backlog!`); // Envia a mensagem para a função de alerta
                    // o tempo está definido na própria função
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
                    //showResult();
                    showTemporaryAlert(`"${hq.title}" adicionado aos favoritos!`) // Envia a mensagem para a função de alerta
                    // o tempo está definido na própria função
                }
            });
        });
    }
}

// ===== Forms =====
// Cada função abaixo cria dinamicamente um formulário e adiciona
// eventos de "submit" para executar a ação correspondente na livraria.

// --- Formulário de adicionar Quadrinho ---
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
    
    // Quando o formulário é enviado
    document.getElementById('addForm').addEventListener('submit', e => {
        e.preventDefault(); // Evita recarregar a página
        const newHQs = {
            id: Number(document.getElementById('addId').value),
            title: document.getElementById('addTitle').value,
            author: document.getElementById('addAuthor').value,
            year: Number(document.getElementById('addYear').value),
            publisher: document.getElementById('addPublisher').value,
            category: document.getElementById('addCategory').value
        };
        HQs = HQLibrary.addHQ(HQs, newHQs); // Chama a função da lib
        HQLibrary.saveHQs(HQs); // Salva no localStorage
        showResult('Quadrinho adicionado!');
    });
}

// --- Formulário de atualizar Quadrinho ---
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
        if(title) updates.title = title;
        if(author) updates.author = author;
        if(year) updates.year = Number(year);
        if(publisher) updates.publisher = publisher;
        if(category) updates.category = category;
        HQs = HQLibrary.updateHQ(HQs, id, updates); // Atualiza dados
        HQLibrary.saveHQs(HQs);
        showResult('Quadrinho atualizado!');
    });
}

// --- Formulário de remover Quadrinho ---
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
        HQs = HQLibrary.deleteHQ(HQs, id); // Remove
        HQLibrary.saveHQs(HQs);
        showResult('Quadrinho removido!');
    });
}

// --- Formulário para listar Quadrinhos por autor ---
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

// ===== Gráfico de Quadrinhos por autor =====
function showAuthorChart() {
    const counts = HQLibrary.countHQsByAuthor(HQs);
    const sorted = Object.entries(counts).sort((a,b) => a[1]-b[1]);
    const labels = sorted.map(([autor]) => autor);
    const data = sorted.map(([_, qtd]) => qtd);
   
     // Array de cores limitado aos tons que usamos no nosso site
    const palette = [
        "#FFB6C1","#FF69B4","#FF1493","#FFC0CB","#DB7093",
        "#DA70D6","#BA55D3","#9932CC","#8A2BE2","#9400D3",
        "#FFD700","#FFC300","#FFB300","#FFAA00","#FF9900",
        "#32CD32","#228B22","#00FF7F","#00FA9A","#7CFC00",
        "#FF69B4","#FF6EB4","#FF6ABF","#FF5AC1","#FF4FBF",
        "#DDA0DD","#EE82EE","#DA70D6","#C71585","#BA55D3",
        "#FFFF00","#FFFACD","#FAFAD2","#FFE135","#FFD700",
        "#00FF00","#32CD32","#3CB371","#2E8B57","#00FA9A",
        "#FF1493","#FF00FF","#FF77FF","#FF33CC","#FF66CC",
        "#8A2BE2","#9370DB","#7B68EE","#6A5ACD","#663399"
    ];

    // Aplica as cores do array repetindo se necessário
    const colors = labels.map((_, i) => palette[i % palette.length]);

    // Apenas um canvas
   showResult(`<canvas id="authorChart" width="900" height="900" style="display:block; margin:0 auto;"></canvas>`);

    // Use setTimeout para garantir que o DOM tenha atualizado
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
                    /*title: {
                        display: true,
                        text: 'Quantidade de Quadrinhos por Autor',
                        font: { size: 18 },
                        color: '#fb0ceb',
                        padding: { top: 10, bottom: 20 }
                    }*/
                }
            }
        });
    }, 50); // 50ms é suficiente

}


// Listar quadrinhos por categoria
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

// Mostrar a tela de backlog
// Mostrar a tela de backlog e permitir marcar como lido
function showBacklogList(backlog, readList) {
    const listHtml = backlog.map(hq => `
        <div class="hq-item">
            <label>
                <input type="checkbox" class="mark-read" data-id="${hq.id}">
                ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
            </label>
        </div>
    `).join('');

    showResult(`
        <h3>Meu Backlog</h3>
        ${listHtml || '<p>Backlog vazio.</p>'}
    `);

    // Adiciona evento para marcar como lido
    document.querySelectorAll('.mark-read').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = Number(e.target.dataset.id);
            // Move o quadrinho para lidos
            const result = HQLibrary.moveToRead(backlog, readList, id);
            backlog = result.backlog;
            readList = result.readList;

            // Salva as alterações
            HQLibrary.saveBacklog(backlog);
            HQLibrary.saveRead(readList);

            // Mostra mensagem de confirmação
            showTemporaryAlert(`"${HQs.find(h => h.id === id)?.title}" marcado como lido!`);

            // Recarrega a lista para refletir a mudança
            showBacklogList(backlog, readList);
        });
    });
}


// Mostra a tela de favoritos
function showFavoritieslogList(favorites) {
    const listHtml = favorites.map(hq => `
        <div class="hq-item">
            <input type="checkbox" class="remove-favorite" data-id="${hq.id}">
            ${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})
        </div>
    `).join('');

    showResult(`
        <h3>Meus Favoritos</h3>
        ${listHtml || '<p>Nenhum quadrinho favoritado.</p>'}
    `);

    // Marck boox de remover dos favoritos
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            favorites = favorites.filter(hq => hq.id !== id);
            HQLibrary.saveFavorites(favorites);
            showFavoritieslogList(favorites); // recarrega a lista, atualizando a página
            showTemporaryAlert('Quadrinho removido dos favoritos!');
        });
    });
}

// --- Formulário para listar Quadrinhos por ano ---
function showListByYearForm() {
    const HQs = HQLibrary.loadHQs();
    // Cria lista de anos disponíveis
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
        <div style="font-size: 0.9em; color: #888; margin-top: 4px;">
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

// Formulário com a opção de remover da lista de lidos e voltar para o backlog - acho que é algo legal de ter
function showReadForm() {
    const listHtml = readList.map(hq => `
        <div class="hq-item">
            <span>${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})</span>
            <button class="remove-read" data-id="${hq.id}">❌ Remover</button>
        </div>
    `).join('');

    showResult(`
        <h3>Quadrinhos Lidos</h3>
        ${listHtml || '<p>Nenhum quadrinho lido ainda.</p>'}
    `);

    // Botão de remover da lista de lidos
    document.querySelectorAll('.remove-read').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            readList = readList.filter(hq => hq.id !== id);
            HQLibrary.saveRead(readList);
            showReadForm(); // Atualiza tela
        });
    });
}


let readList = HQLibrary.loadRead();

// ===== Actions =====
// Dicionário que associa cada ação a uma função
const actions = {
    init: () => {
        HQs = HQLibrary.resetHQs();
        HQLibrary.saveHQs(HQs);
        showTemporaryAlert('Livraria iniciada com lista de Quadrinhos padrão!');
    },
    list: () => showResult(HQLibrary.listHQs(HQs)),
    listRead: () => showReadForm(),
    add: () => showAddForm(),
    update: () => showUpdateForm(),
    delete: () => showDeleteForm(),
    clear: () => { 
        HQLibrary.clearHQs(); 
        HQs=[]; 
        showTemporaryAlert('Livraria esvaziada.');
    },

    showBacklog: () => showBacklogList(backlog, readList),
    showRead: () => showHQList(readList, 'Já Lidos'),
    listRead: () => showHQList(readList, 'Quadrinhos Lidos'),
    list: () => showHQList(HQs, 'Catálogo Completo', true),
    showFavorites: () => showFavoritieslogList(favorites),
    listByAuthor: () => showListByAuthorForm(),
    countByAuthor: () => showAuthorChart(),
    listByYear : () => showListByYearForm(),
    listByCategory: () => mostrarFormularioCategoria(),
    exit: () => showResult()
};

// ===== Event listener =====
// Captura cliques nos botões do menu e chama a ação correspondente
buttons.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON') {
        const action = e.target.dataset.action; // Lê o "data-action" do botão
        if(action && actions[action]) actions[action](); // Executa a função correspondente
    }
});

// Inicializa a tela quando a página carrega
document.addEventListener('DOMContentLoaded', showHome);