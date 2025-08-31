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
  { id: 1, title: "Watchmen", author: "Alan Moore", year: 1986, publisher: "DC Comics", category: "História em quadrinhos" },
  { id: 2, title: "Maus", author: "Art Spiegelman", year: 1991, publisher: "Grupo Companhia das Letras", category: "História em quadrinhos" },
  { id: 3, title: "Sandman: Prelúdios e Noturnos", author: "Neil Gaiman", year: 1989, publisher: "DC Comics", category: "História em quadrinhos" },
  { id: 4, title: "Batman: The Dark Knight Returns", author: "Frank Miller", year: 1986, publisher: "DC Comics", category: "História em quadrinhos" },
  { id: 5, title: "V de Vingança", author: "Alan Moore", year: 1982, publisher: "DC Comics", category: "História em quadrinhos" },
  { id: 6, title: "Akira", author: "Katsuhiro Otomo", year: 1982, publisher: "Editora JBC", category: "Mangá" },
  { id: 7, title: "Tintim no Tibete", author: "Hergé", year: 1960, publisher: "Companhia das Letras", category: "História em quadrinhos" },
  { id: 8, title: "Asterix, o Gaulês", author: "René Goscinny e Albert Uderzo", year: 1961, publisher: "Editora Record", category: "História em quadrinhos" },
  { id: 9, title: "Homem-Aranha: A Última Caçada de Kraven", author: "J. M. DeMatteis", year: 1987, publisher: "Marvel Comics", category: "História em quadrinhos" },
  { id: 10, title: "X-Men: A Saga da Fênix Negra", author: "Chris Claremont", year: 1980, publisher: "Marvel Comics", category: "História em quadrinhos" },
  { id: 11, title: "Sin City: A Dama de Vermelho", author: "Frank Miller", year: 1993, publisher: "Dark Horse Comics", category: "História em quadrinhos" },
  { id: 12, title: "Calvin e Haroldo", author: "Bill Watterson", year: 1985, publisher: "Conrad Editora", category: "Tira de quadrinhos" },
  { id: 13, title: "Hellboy: Sementes da Destruição", author: "Mike Mignola", year: 1994, publisher: "Dark Horse Comics", category: "História em quadrinhos" },
  { id: 14, title: "Persepolis", author: "Marjane Satrapi", year: 2000, publisher: "Companhia das Letras", category: "História em quadrinhos" },
  { id: 15, title: "Bone", author: "Jeff Smith", year: 1991, publisher: "Image Comics", category: "História em quadrinhos" },
  { id: 16, title: "O Eternauta", author: "Héctor Germán Oesterheld e Francisco Solano López", year: 1957, publisher: "Editora Veneta", category: "História em quadrinhos" },
  { id: 17, title: "The Walking Dead: Days Gone Bye", author: "Robert Kirkman", year: 2003, publisher: "Image Comics", category: "História em quadrinhos" },
  { id: 18, title: "Scott Pilgrim Contra o Mundo", author: "Bryan Lee O'Malley", year: 2004, publisher: "Oni Press", category: "História em quadrinhos" },
  { id: 19, title: "Odisseia Espacial 2001", author: "Jack Kirby", year: 1976, publisher: "Marvel Comics", category: "História em quadrinhos" },
  { id: 20, title: "One Piece", author: "Eiichiro Oda", year: 1997, publisher: "Editora Panini", category: "Mangá" },
  { id: 21, title: "Berserk", author: "Kentaro Miura", year: 1989, publisher: "Editora Panini", category: "Mangá" },
  { id: 22, title: "Dragon Ball", author: "Akira Toriyama", year: 1984, publisher: "Editora Panini", category: "Mangá" },
  { id: 23, title: "Death Note", author: "Tsugumi Ohba e Takeshi Obata", year: 2003, publisher: "Editora JBC", category: "Mangá" },
  { id: 24, title: "Naruto", author: "Masashi Kishimoto", year: 1999, publisher: "Editora Panini", category: "Mangá" },
  { id: 25, title: "Fullmetal Alchemist", author: "Hiromu Arakawa", year: 2001, publisher: "Editora JBC", category: "Mangá" },
  { id: 26, title: "Ghost in the Shell", author: "Masamune Shirow", year: 1989, publisher: "Editora JBC", category: "Mangá" },
  { id: 27, title: "A Viagem de Chihiro", author: "Hayao Miyazaki", year: 2001, publisher: "Editora JBC", category: "Mangá" },
  { id: 28, title: "Monster", author: "Naoki Urasawa", year: 1994, publisher: "Editora Panini", category: "Mangá" },
  { id: 29, title: "Vagabond", author: "Takehiko Inoue", year: 1998, publisher: "Editora Panini", category: "Mangá" },
  { id: 30, title: "Blade of the Immortal", author: "Hiroaki Samura", year: 1993, publisher: "Editora Panini", category: "Mangá" },
  { id: 31, title: "One-Punch Man", author: "ONE e Yusuke Murata", year: 2009, publisher: "Editora Panini", category: "Mangá" },
  { id: 32, title: "My Hero Academia", author: "Kohei Horikoshi", year: 2014, publisher: "Editora JBC", category: "Mangá" },
  { id: 33, title: "Jujutsu Kaisen", author: "Gege Akutami", year: 2018, publisher: "Editora Panini", category: "Mangá" },
  { id: 34, title: "Kimetsu no Yaiba", author: "Koyoharu Gotoge", year: 2016, publisher: "Editora Panini", category: "Mangá" },
  { id: 35, title: "Vinland Saga", author: "Makoto Yukimura", year: 2005, publisher: "Editora Panini", category: "Mangá" },
  { id: 36, title: "Ataque dos Titãs", author: "Hajime Isayama", year: 2009, publisher: "Editora Panini", category: "Mangá" },
  { id: 37, title: "Chainsaw Man", author: "Tatsuki Fujimoto", year: 2018, publisher: "Editora Panini", category: "Mangá" },
  { id: 38, title: "Spy x Family", author: "Tatsuya Endo", year: 2019, publisher: "Editora Panini", category: "Mangá" },
  { id: 39, title: "Hajime no Ippo", author: "George Morikawa", year: 1989, publisher: "Editora Panini", category: "Mangá" },
  { id: 40, title: "Slam Dunk", author: "Takehiko Inoue", year: 1990, publisher: "Editora Panini", category: "Mangá" },
  { id: 41, title: "Magi: The Labyrinth of Magic", author: "Shinobu Ohtaka", year: 2009, publisher: "Editora JBC", category: "Mangá" },
  { id: 42, title: "Noragami", author: "Adachitoka", year: 2010, publisher: "Panini Comics", category: "Mangá" },
  { id: 43, title: "Tokyo Ghoul", author: "Sui Ishida", year: 2011, publisher: "Editora Panini", category: "Mangá" },
  { id: 44, title: "O Livro do Dragão", author: "Yasunari Kawabata e Hayao Miyazaki", year: 2006, publisher: "Panini Comics", category: "Mangá" },
  { id: 45, title: "Dr. Stone", author: "Riichiro Inagaki e Boichi", year: 2017, publisher: "Editora Panini", category: "Mangá" },
  { id: 46, title: "Gannibal", author: "Masaaki Ninomiya", year: 2018, publisher: "Panini Comics", category: "Mangá" },
  { id: 47, title: "Hell's Paradise: Jigokuraku", author: "Yuji Kaku", year: 2018, publisher: "Editora Panini", category: "Mangá" },
  { id: 48, title: "Black Clover", author: "Yuki Tabata", year: 2015, publisher: "Panini Comics", category: "Mangá" },
  { id: 49, title: "Blue Lock", author: "Muneyuki Kaneshiro e Yusuke Nomura", year: 2018, publisher: "Panini Comics", category: "Mangá" },
  { id: 50, title: "The Promised Neverland", author: "Kaiu Shirai e Posuka Demizu", year: 2016, publisher: "Editora Panini", category: "Mangá" }
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