// Chave usada no localStorage para salvar os quadrinhos
const STORAGE_KEY = "livraria::HQs"
const STORAGE_KEY_BACKLOG = "livraria::backlog";
const STORAGE_KEY_FAVORITES = "livraria::favorites";

const STORAGE_KEY_READ = "livraria::read"; // Chamada para salvar em uma lista separada de lidos e não lidos
// Poderia ter  o status lido na lista também, mas acho que assim fica mais interessante para fazermos operações em listas separadas

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de quadrinhos do localStorage
// Se não existir nada salvo, retorna um array vazio
const loadHQs = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Salva a lista de quadrinhos no localStorage (convertendo para texto JSON)
const saveHQs = HQs =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(HQs))

// Remove todos os quadrinhos do localStorage
const clearHQs = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log("Livraria limpa.")
}

// Move os quadrinhos para a lista de lidos
const moveToRead = (backlog, readList, id) => {
  const hq = backlog.find(item => item.id === id);
  if (!hq) return { backlog, readList };

  return {
    backlog: backlog.filter(item => item.id !== id),
    readList: [...readList, hq]
  };
};


// Restaura uma lista inicial de quadrinhos (pré-cadastrados)
// Útil para resetar o sistema com dados de exemplo
const resetHQs = () => {
const HQs = [
  { id: 1, title: "Watchmen", author: "Alan Moore", year: 1986, publisher: "DC comics", category: "História em quadrinhos" },
  { id: 2, title: "Maus", author: "Art Spiegelman", year: 1991, publisher: " Grupo Companhia das Letras", category: "História em quadrinhos"  },
  { id: 3, title: "Sandman: Prelúdios e Noturnos", author: "Neil Gaiman", year: 1989, publisher: "DC comics", category: "História em quadrinhos"  },
  { id: 4, title: "Batman: The Dark Knight Returns", author: "Frank Miller", year: 1986, publisher: "DC comics", category: "História em quadrinhos"  },
  { id: 5, title: "V de Vingança", author: "Alan Moore", year: 1982, publisher: "DC comics", category: "História em quadrinhos"  },
  { id: 6, title: "Akira", author: "Katsuhiro Otomo", year: 1982, publisher: "Editora JBC", category: "Mangá"  },
  { id: 7, title: "Tintim no Tibete", author: "Hergé", year: 1960, publisher: "Companhia das letras", category: "História em quadrinhos"  },
  { id: 8, title: "Asterix, o Gaulês", author: "René Goscinny e Albert Uderzo", year: 1961, publisher: "Editora Record", category: "História em quadrinhos"  },
  { id: 9, title: "Homem-Aranha: A Última Caçada de Kraven", author: "J. M. DeMatteis", year: 1987, publisher: "Marvel comics", category: "História em quadrinhos"  },
  { id: 10, title: "X-Men: A Saga da Fênix Negra", author: "Chris Claremont", year: 1980, publisher: "Marvel comics", category: "História em quadrinhos"  }
];

  saveHQs(HQs) // salva os quadrinhos no localStorage
  console.log("quadrinhos iniciais salvos.")
  return HQs              // retorna os quadrinhos
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

// Adiciona um novo quadrinho (retorna um novo array)
const addHQ = (HQs, newHQ) => [...HQs, newHQ]

// Atualiza um quadrinho existente (caso encontre o id)
const updateHQ = (HQs, id, updates) =>
  HQs.map(hq => (hq.id === id ? { ...hq, ...updates } : hq))

// Remove um quadrinho pelo id
const deleteHQ = (HQs, id) =>
  HQs.filter(hq => hq.id !== id)

// ========================
// Listagem e formatação
// ========================

// Lista os quadrinhos em formato de texto simples
const listHQs = HQs =>
  HQs.map(hq => `${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})`).join('\n')

// Lista apenas os quadrinhos de um autor específico
const listHQsByAuthor = (HQs, authorName) =>
  HQs.filter(hq => hq.author === authorName)

// Lista apenas os quadrinhos de uma categoria específica
const listHQsByCategory = (HQs, categorySelec) =>
  HQs.filter(hq => hq.category === categorySelec)

// Lista apenas os quadrinhos de uma editora específica
const listHQsByPublisher = (HQs, publisherSelec) =>
  HQs.filter(hq => hq.publisher === publisherSelec)

// Lista apenas os quadrinhos de uma editora específica
const listHQsByYear = (HQs, yearSelec) =>
  HQs.filter(hq => hq.year === yearSelec)

// Conta quantos quadrinhos cada autor possui
// Exemplo de retorno: { "Machado de Assis": 5, "Jorge Amado": 8 }
const countHQsByAuthor = (HQs) =>
  HQs.reduce((acc, hq) => {
    acc[hq.author] = (acc[hq.author] || 0) + 1
    return acc
  }, {})

// Permite formatar a lista de quadrinhos de forma flexível
// Recebe uma função "formatFn" que define como cada quadrinho deve aparecer
const formatHQs = (HQs, formatFn) =>
  HQs.map((hq, index) => formatFn(hq, index)).join('\n')

// Formatação curta: apenas o título com numeração
const shortFormat = (hq, i) => `${i + 1}. ${hq.title}`

// Formatação completa: id, título, autor e ano
const fullFormat = hq =>
  `${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})`

// ========================
// Transformações adicionais
// ========================

// Marca quadrinhos antigos com base em um ano de corte
// Adiciona a propriedade "old: true/false"
const markOldHQs = (HQs, cutoffYear) =>
  HQs.map(hq => ({ ...hq, old: hq.year < cutoffYear }))

// Adiciona uma categoria com base no autor (função fornecida pelo usuário)
const addCategoryByAuthor = (HQs, classifyAuthorFn) =>
  HQs.map(hq => ({ ...hq, category: classifyAuthorFn(hq.author) }))

// Aplica uma transformação nos títulos (ex: deixar tudo maiúsculo)
const updateTitles = (HQs, transformFn) =>
  HQs.map(hq => ({ ...hq, title: transformFn(hq.title) }))

// Permite renomear os campos de cada quadrinho (ex: trocar "title" por "nome")
const renameFields = (HQs, renamerFn) =>
  HQs.map(hq => renamerFn(hq))

// ========================
// Gerenciamento de listas personalizadas
// ========================

// Carrega uma lista específica do localStorage
const loadList = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Salva uma lista específica no localStorage
const saveList = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
};

// Adiciona um quadrinho a uma lista, se ele ainda não estiver lá
const addToList = (list, hq) => {
  // Evita duplicatas na lista
  if (list.some((item) => item.id === hq.id)) {
    console.log("Quadrinho já está na lista.");
    return list;
  }
  return [...list, hq];
};

// Remove um quadrinho de uma lista pelo id
const removeFromList = (list, id) => {
  return list.filter((hq) => hq.id !== id);
};

const listRead = (list) => {
  return list.map(hq => listHQs(hq))
}

// ========================
// Exporta todas as funções como um objeto Livraria
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================
export const HQLibrary = {
  // Persistência
  loadHQs, saveHQs, resetHQs, clearHQs, listRead,

  // CRUD
  addHQ, updateHQ, deleteHQ,

  // Exibição
  listHQs, listHQsByAuthor, listHQsByCategory, listHQsByPublisher,
  countHQsByAuthor,  formatHQs, shortFormat, fullFormat, listHQsByYear,

  // Transformações
  markOldHQs, addCategoryByAuthor, updateTitles, renameFields,

  // Listas personalizadas
  loadBacklog: () => loadList(STORAGE_KEY_BACKLOG),
  saveBacklog: (backlog) => saveList(STORAGE_KEY_BACKLOG, backlog),
  addToBacklog: (backlog, hq) => addToList(backlog, hq),
  removeFromBacklog: (backlog, id) => removeFromList(backlog, id),
  loadRead: () => loadList(STORAGE_KEY_READ),
  saveRead: (read) => saveList(STORAGE_KEY_READ, read),
  moveToRead,


  loadFavorites: () => loadList(STORAGE_KEY_FAVORITES),
  saveFavorites: (favorites) => saveList(STORAGE_KEY_FAVORITES, favorites),
  addToFavorites: (favorites, hq) => addToList(favorites, hq),
  removeFromFavorites: (favorites, id) => removeFromList(favorites, id),
}