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
  console.log("HQs removidas.")
}

// Restaura uma lista inicial de quadrinhos (pré-cadastrados)
// Útil para resetar o sistema com dados de exemplo
const resetHQs = () => {
const HQs = [
  { id: 1, title: "Watchmen", author: "Alan Moore", year: 1986 },
  { id: 2, title: "Maus", author: "Art Spiegelman", year: 1991 },
  { id: 3, title: "Sandman: Prelúdios e Noturnos", author: "Neil Gaiman", year: 1989 },
  { id: 4, title: "Batman: The Dark Knight Returns", author: "Frank Miller", year: 1986 },
  { id: 5, title: "V de Vingança", author: "Alan Moore", year: 1982 },
  { id: 6, title: "Akira", author: "Katsuhiro Otomo", year: 1982 },
  { id: 7, title: "Tintim no Tibete", author: "Hergé", year: 1960 },
  { id: 8, title: "Asterix, o Gaulês", author: "René Goscinny e Albert Uderzo", year: 1961 },
  { id: 9, title: "Homem-Aranha: A Última Caçada de Kraven", author: "J. M. DeMatteis", year: 1987 },
  { id: 10, title: "X-Men: A Saga da Fênix Negra", author: "Chris Claremont", year: 1980 }
];

  saveHQs(HQs) // salva os quadrinhos no localStorage
  console.log("Quadrinhos iniciais salvos.")
  return HQs              // retorna os quadrinhos
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

// Adiciona um novo quadrinho (retorna um novo array)
const addHQ = (HQs, newHQ => [...HQs, newHQ])

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

// Conta quantos quadrinhos cada autor possui
// Exemplo de retorno: { "Alan Moore": 2, "Neil Gaiman": 1 }
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
// Exporta todas as funções como um objeto Livraria
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================
export const Livraria = {
  // Persistência
  loadHQs, saveHQs, resetHQs, clearHQs,

  // CRUD
  addHQ, updateHQ, deleteHQ,

  // Exibição
  listHQs, listHQsByAuthor, countHQsByAuthor,
  formatHQs, shortFormat, fullFormat,

  // Transformações
  markOldHQs, addCategoryByAuthor, updateTitles, renameFields
}