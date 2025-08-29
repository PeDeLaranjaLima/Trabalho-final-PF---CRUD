// Importa a classe/módulo principal que contém as funções de manipulação da livraria
import { Livraria } from './lib.js';

// ===== Dados e elementos =====

// Carrega os Quadrinhos salvos no localStorage.
// Se não houver nada salvo, reinicia com os Quadrinhos padrão (resetHQs).
let HQs = Livraria.loadHQs();

// Garante que o estado atual seja salvo no localStorage
Livraria.saveHQs(HQs);

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
    backButton.textContent = 'Autodestruição';
    backButton.id = 'backButton';
    backButton.className = 'back-button'; // Opcional: para estilização

    // Adiciona o botão de voltar ao contêiner de formulários ou de saída
    const targetElement = isForm ? forms : output;
    targetElement.insertBefore(backButton, targetElement.firstChild);
    
    // Adiciona o listener para o botão de voltar
    backButton.addEventListener('click', showHome);
}

/**
 * Retorna à tela inicial, mostrando os botões e limpando o resto.
 */
function showHome() {
    buttons.style.display = 'grid';
    forms.innerHTML = '';
    output.innerHTML = '<img src="nave.png" alt="nave" style="width:24px; vertical-align:middle;"> Bem-vindo(a) à Livraria de Quadrinhos!';
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
        HQs = Livraria.addHQs(HQs, newHQs); // Chama a função da lib
        Livraria.saveHQs(HQs); // Salva no localStorage
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
        HQs = Livraria.updateHQs(HQs, id, updates); // Atualiza dados
        Livraria.saveHQs(HQs);
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
        HQs = Livraria.deleteHQs(HQs, id); // Remove
        Livraria.saveHQs(HQs);
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
        const filtered = Livraria.listHQsByAuthor(HQs, author);
        const resultText = filtered.length === 0 ? 'Nenhum Quadrinho encontrado.' : Livraria.listHQs(filtered);
        showResult(resultText);
    });
}

// ===== Gráfico de Quadrinhos por autor =====
function showAuthorChart() {
    const counts = Livraria.countHQsByAuthor(HQs);
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
    showResult(`<canvas id="authorChart" style="max-width:400px; max-height:400px; display:block; margin:0 auto;"></canvas>`);

    const ctx = document.getElementById('authorChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Quadrinhos',
                data,
                backgroundColor: colors,
                borderColor: '#000000ff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, position: 'right' },
                title: {
                    display: true,
                    text: 'Quantidade de Quadrinhos por Autor', // título agora aparece
                    font: { size: 18 },
                    color: '#fb0cebff', 
                    padding: { top: 10, bottom: 20 }
                }
            }
        }
    });
}


// Listar quadrinhos por categoria
function mostrarFormularioCategoria() {
    const HQs = Livraria.loadHQs();
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
        const filtrados = Livraria.listHQsByCategory(HQs, categoria);
        if (filtrados.length === 0) {
            showResult('Nenhum quadrinho encontrado para esta categoria.');
            return;
        }
        const lista = Livraria.formatHQs(filtrados, Livraria.fullFormat);
        showResult(lista);
    });
}

// ===== Actions =====
// Dicionário que associa cada ação a uma função
const actions = {
    init: () => {
        HQs = Livraria.resetHQs();
        Livraria.saveHQs(HQs);
        showResult('Livraria iniciada com lista de Quadrinhos padrão!');
    },
    list: () => showResult(Livraria.listHQs(HQs)),
    add: () => showAddForm(),
    update: () => showUpdateForm(),
    delete: () => showDeleteForm(),
    clear: () => { 
        Livraria.clearHQs(); 
        HQs=[]; 
        showResult('Livraria esvaziada.');
    },
    listByAuthor: () => showListByAuthorForm(),
    countByAuthor: () => showAuthorChart(),
    listByYear: () => {
        const HQs = Livraria.loadHQs();
        // Agrupa por ano
        const anos = {};
        HQs.forEach(hq => {
            if (!anos[hq.year]) anos[hq.year] = [];
            anos[hq.year].push(hq);
        });
        // Monta a string de saída
        let resultado = '';
        const anosOrdenados = Object.keys(anos).sort((a, b) => a - b);
        anosOrdenados.forEach(ano => {
            resultado += `Ano ${ano}:\n`;
            resultado += Livraria.formatHQs(anos[ano], Livraria.fullFormat) + '\n\n';
        });
        showResult(resultado.trim());
    },
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