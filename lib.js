// Chave usada no localStorage para salvar os quadrinhos
const STORAGE_KEY = "livraria::HQs"
const STORAGE_KEY_BACKLOG = "livraria::backlog";
const STORAGE_KEY_FAVORITES = "livraria::favorites";
const STORAGE_KEY_READ = "livraria::read";

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de quadrinhos do localStorage
const loadHQs = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

// Salva a lista de quadrinhos no localStorage
const saveHQs = HQs =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(HQs))

// Remove todos os quadrinhos do localStorage
const clearHQs = () => {
    localStorage.removeItem(STORAGE_KEY)
    console.log("Livraria limpa.")
}

const moveToRead = (backlog, readList, id) => {
    const hq = backlog.find(item => item.id === id);
    if (!hq) return { backlog, readList };

    return {
        backlog: backlog.filter(item => item.id !== id),
        readList: [...readList, hq]
    };
};

const resetHQs = () => {
    const HQs = [
        { id: 1, title: "Watchmen", author: "Alan Moore", year: 1986, publisher: "DC Comics", category: "História em quadrinhos", critic: 0 },
        { id: 2, title: "Maus", author: "Art Spiegelman", year: 1991, publisher: "Grupo Companhia das Letras", category: "História em quadrinhos", critic: 0 },
        { id: 3, title: "Sandman: Prelúdios e Noturnos", author: "Neil Gaiman", year: 1989, publisher: "DC Comics", category: "História em quadrinhos", critic: 0 },
        { id: 4, title: "Batman: The Dark Knight Returns", author: "Frank Miller", year: 1986, publisher: "DC Comics", category: "História em quadrinhos", critic: 0 },
        { id: 5, title: "V de Vingança", author: "Alan Moore", year: 1982, publisher: "DC Comics", category: "História em quadrinhos", critic: 0 },
        { id: 6, title: "Akira", author: "Katsuhiro Otomo", year: 1982, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 7, title: "Tintim no Tibete", author: "Hergé", year: 1960, publisher: "Companhia das Letras", category: "História em quadrinhos", critic: 0 },
        { id: 8, title: "Asterix, o Gaulês", author: "René Goscinny e Albert Uderzo", year: 1961, publisher: "Editora Record", category: "História em quadrinhos", critic: 0 },
        { id: 9, title: "Homem-Aranha: A Última Caçada de Kraven", author: "J. M. DeMatteis", year: 1987, publisher: "Marvel Comics", category: "História em quadrinhos", critic: 0 },
        { id: 10, title: "X-Men: A Saga da Fênix Negra", author: "Chris Claremont", year: 1980, publisher: "Marvel Comics", category: "História em quadrinhos", critic: 0 },
        { id: 11, title: "Sin City: A Dama de Vermelho", author: "Frank Miller", year: 1993, publisher: "Dark Horse Comics", category: "História em quadrinhos", critic: 0 },
        { id: 12, title: "Calvin e Haroldo", author: "Bill Watterson", year: 1985, publisher: "Conrad Editora", category: "Tira de quadrinhos", critic: 0 },
        { id: 13, title: "Hellboy: Sementes da Destruição", author: "Mike Mignola", year: 1994, publisher: "Dark Horse Comics", category: "História em quadrinhos", critic: 0 },
        { id: 14, title: "Persepolis", author: "Marjane Satrapi", year: 2000, publisher: "Companhia das Letras", category: "História em quadrinhos", critic: 0 },
        { id: 15, title: "Bone", author: "Jeff Smith", year: 1991, publisher: "Image Comics", category: "História em quadrinhos", critic: 0 },
        { id: 16, title: "O Eternauta", author: "Héctor Germán Oesterheld e Francisco Solano López", year: 1957, publisher: "Editora Veneta", category: "História em quadrinhos", critic: 0 },
        { id: 17, title: "The Walking Dead: Days Gone Bye", author: "Robert Kirkman", year: 2003, publisher: "Image Comics", category: "História em quadrinhos", critic: 0 },
        { id: 18, title: "Scott Pilgrim Contra o Mundo", author: "Bryan Lee O'Malley", year: 2004, publisher: "Oni Press", category: "História em quadrinhos", critic: 0 },
        { id: 19, title: "Odisseia Espacial 2001", author: "Jack Kirby", year: 1976, publisher: "Marvel Comics", category: "História em quadrinhos", critic: 0 },
        { id: 20, title: "One Piece", author: "Eiichiro Oda", year: 1997, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 21, title: "Berserk", author: "Kentaro Miura", year: 1989, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 22, title: "Dragon Ball", author: "Akira Toriyama", year: 1984, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 23, title: "Death Note", author: "Tsugumi Ohba e Takeshi Obata", year: 2003, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 24, title: "Naruto", author: "Masashi Kishimoto", year: 1999, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 25, title: "Fullmetal Alchemist", author: "Hiromu Arakawa", year: 2001, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 26, title: "Ghost in the Shell", author: "Masamune Shirow", year: 1989, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 27, title: "A Viagem de Chihiro", author: "Hayao Miyazaki", year: 2001, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 28, title: "Monster", author: "Naoki Urasawa", year: 1994, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 29, title: "Vagabond", author: "Takehiko Inoue", year: 1998, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 30, title: "Blade of the Immortal", author: "Hiroaki Samura", year: 1993, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 31, title: "One-Punch Man", author: "ONE e Yusuke Murata", year: 2009, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 32, title: "My Hero Academia", author: "Kohei Horikoshi", year: 2014, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 33, title: "Jujutsu Kaisen", author: "Gege Akutami", year: 2018, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 34, title: "Kimetsu no Yaiba", author: "Koyoharu Gotoge", year: 2016, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 35, title: "Vinland Saga", author: "Makoto Yukimura", year: 2005, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 36, title: "Ataque dos Titãs", author: "Hajime Isayama", year: 2009, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 37, title: "Chainsaw Man", author: "Tatsuki Fujimoto", year: 2018, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 38, title: "Spy x Family", author: "Tatsuya Endo", year: 2019, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 39, title: "Hajime no Ippo", author: "George Morikawa", year: 1989, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 40, title: "Slam Dunk", author: "Takehiko Inoue", year: 1990, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 41, title: "Magi: The Labyrinth of Magic", author: "Shinobu Ohtaka", year: 2009, publisher: "Editora JBC", category: "Mangá", critic: 0 },
        { id: 42, title: "Noragami", author: "Adachitoka", year: 2010, publisher: "Panini Comics", category: "Mangá", critic: 0 },
        { id: 43, title: "Tokyo Ghoul", author: "Sui Ishida", year: 2011, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 44, title: "O Livro do Dragão", author: "Yasunari Kawabata e Hayao Miyazaki", year: 2006, publisher: "Panini Comics", category: "Mangá", critic: 0 },
        { id: 45, title: "Dr. Stone", author: "Riichiro Inagaki e Boichi", year: 2017, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 46, title: "Gannibal", author: "Masaaki Ninomiya", year: 2018, publisher: "Panini Comics", category: "Mangá", critic: 0 },
        { id: 47, title: "Hell's Paradise: Jigokuraku", author: "Yuji Kaku", year: 2018, publisher: "Editora Panini", category: "Mangá", critic: 0 },
        { id: 48, title: "Black Clover", author: "Yuki Tabata", year: 2015, publisher: "Panini Comics", category: "Mangá", critic: 0 },
        { id: 49, title: "Blue Lock", author: "Muneyuki Kaneshiro e Yusuke Nomura", year: 2018, publisher: "Panini Comics", category: "Mangá", critic: 0 },
        { id: 50, title: "The Promised Neverland", author: "Kaiu Shirai e Posuka Demizu", year: 2016, publisher: "Editora Panini", category: "Mangá", critic: 0 }
    ];

    saveHQs(HQs)
    console.log("quadrinhos iniciais salvos.")
    return HQs
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

const addHQ = (HQs, newHQ) => [...HQs, newHQ]
const updateHQ = (HQs, id, updates) =>
    HQs.map(hq => (hq.id === id ? { ...hq, ...updates } : hq))
const critic = (HQs, id, note) =>
    HQs.map(hq => (hq.id === id ? { ...hq, critic: note } : hq));
const deleteHQ = (HQs, id) =>
    HQs.filter(hq => hq.id !== id)

// ========================
// Listagem e formatação
// ========================

const listHQs = HQs =>
    HQs.map(hq => `${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})`).join('\n')
const listHQsByAuthor = (HQs, authorName) =>
    HQs.filter(hq => hq.author === authorName)
const listHQsByCategory = (HQs, categorySelec) =>
    HQs.filter(hq => hq.category === categorySelec)
const listHQsByPublisher = (HQs, publisherSelec) =>
    HQs.filter(hq => hq.publisher === publisherSelec)
const listHQsByYear = (HQs, yearSelec) =>
    HQs.filter(hq => hq.year === yearSelec)
const countHQsByAuthor = (HQs) =>
    HQs.reduce((acc, hq) => {
        acc[hq.author] = (acc[hq.author] || 0) + 1
        return acc
    }, {})
const formatHQs = (HQs, formatFn) =>
    HQs.map((hq, index) => formatFn(hq, index)).join('\n')
const shortFormat = (hq, i) => `${i + 1}. ${hq.title}`
const fullFormat = hq =>
    `${hq.id} - "${hq.title}" (${hq.author}, ${hq.year})`

// ========================
// Transformações adicionais
// ========================

const markOldHQs = (HQs, cutoffYear) =>
    HQs.map(hq => ({ ...hq, old: hq.year < cutoffYear }))
const addCategoryByAuthor = (HQs, classifyAuthorFn) =>
    HQs.map(hq => ({ ...hq, category: classifyAuthorFn(hq.author) }))
const updateTitles = (HQs, transformFn) =>
    HQs.map(hq => ({ ...hq, title: transformFn(hq.title) }))
const renameFields = (HQs, renamerFn) =>
    HQs.map(hq => renamerFn(hq))

// ========================
// Gerenciamento de listas personalizadas
// ========================

const loadList = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};
const saveList = (key, list) => {
    localStorage.setItem(key, JSON.stringify(list));
};
const addToList = (list, hq) => {
    if (list.some((item) => item.id === hq.id)) {
        console.log("Quadrinho já está na lista.");
        return list;
    }
    return [...list, hq];
};
const removeFromList = (list, id) => {
    return list.filter((hq) => hq.id !== id);
};

// ========================
// Exporta todas as funções como um objeto Livraria
// ========================
export const HQLibrary = {
    // Persistência
    loadHQs, saveHQs, resetHQs, clearHQs,

    // CRUD
    addHQ, updateHQ, deleteHQ, critic,

    // Exibição
    listHQs, listHQsByAuthor, listHQsByCategory, listHQsByPublisher,
    countHQsByAuthor, formatHQs, shortFormat, fullFormat, listHQsByYear,

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
    removeFromRead: (read, id) => removeFromList(read, id),
    
    loadFavorites: () => loadList(STORAGE_KEY_FAVORITES),
    saveFavorites: (favorites) => saveList(STORAGE_KEY_FAVORITES, favorites),
    addToFavorites: (favorites, hq) => addToList(favorites, hq),
    removeFromFavorites: (favorites, id) => removeFromList(favorites, id),
}