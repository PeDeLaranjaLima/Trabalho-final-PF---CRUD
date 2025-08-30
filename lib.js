// Chave usada no localStorage para salvar os quadrinhos
const STORAGE_KEY = "livraria::HQs"

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
const addBook = (HQs, newBook) => [...HQs, newBook]

// Atualiza um quadrinho existente (caso encontre o id)
const updateBook = (HQs, id, updates) =>
  HQs.map(book => (book.id === id ? { ...book, ...updates } : book))

// Remove um quadrinho pelo id
const deleteBook = (HQs, id) =>
  HQs.filter(book => book.id !== id)

// ========================
// Listagem e formatação
// ========================

// Lista os quadrinhos em formato de texto simples
const listHQs = HQs =>
  HQs.map(book => `${book.id} - "${book.title}" (${book.author}, ${book.year})`).join('\n')

// Lista apenas os quadrinhos de um autor específico
const listHQsByAuthor = (HQs, authorName) =>
  HQs.filter(book => book.author === authorName)

// Lista apenas os quadrinhos de uma categoria específica
const listHQsByCategory = (HQs, categorySelec) =>
  HQs.filter(book => book.category === categorySelec)

// Lista apenas os quadrinhos de uma editora específica
const listHQsByPublisher = (HQs, publisherSelec) =>
  HQs.filter(book => book.publisher === publisherSelec)

// Lista apenas os quadrinhos de uma editora específica
const listHQsByYear = (HQs, yearSelec) =>
  HQs.filter(book => book.year === yearSelec)

// Conta quantos quadrinhos cada autor possui
// Exemplo de retorno: { "Machado de Assis": 5, "Jorge Amado": 8 }
const countHQsByAuthor = (HQs) =>
  HQs.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1
    return acc
  }, {})

// Permite formatar a lista de quadrinhos de forma flexível
// Recebe uma função "formatFn" que define como cada quadrinho deve aparecer
const formatHQs = (HQs, formatFn) =>
  HQs.map((book, index) => formatFn(book, index)).join('\n')

// Formatação curta: apenas o título com numeração
const shortFormat = (book, i) => `${i + 1}. ${book.title}`

// Formatação completa: id, título, autor e ano
const fullFormat = book =>
  `${book.id} - "${book.title}" (${book.author}, ${book.year})`

// ========================
// Transformações adicionais
// ========================

// Marca quadrinhos antigos com base em um ano de corte
// Adiciona a propriedade "old: true/false"
const markOldHQs = (HQs, cutoffYear) =>
  HQs.map(book => ({ ...book, old: book.year < cutoffYear }))

// Adiciona uma categoria com base no autor (função fornecida pelo usuário)
const addCategoryByAuthor = (HQs, classifyAuthorFn) =>
  HQs.map(book => ({ ...book, category: classifyAuthorFn(book.author) }))

// Aplica uma transformação nos títulos (ex: deixar tudo maiúsculo)
const updateTitles = (HQs, transformFn) =>
  HQs.map(book => ({ ...book, title: transformFn(book.title) }))

// Permite renomear os campos de cada quadrinho (ex: trocar "title" por "nome")
const renameFields = (HQs, renamerFn) =>
  HQs.map(book => renamerFn(book))

// ========================
// Exporta todas as funções como um objeto Livraria
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================
export const HQLibrary = {
  // Persistência
  loadHQs, saveHQs, resetHQs, clearHQs,

  // CRUD
  addBook, updateBook, deleteBook,

  // Exibição
  listHQs, listHQsByAuthor, listHQsByCategory, listHQsByPublisher,
  countHQsByAuthor,  formatHQs, shortFormat, fullFormat, listHQsByYear,

  // Transformações
  markOldHQs, addCategoryByAuthor, updateTitles, renameFields
}