const BASE_URL = "http://localhost:3000/api"; // ou outra URL válida que você esteja usando

export const MangaAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/mangaList`);
    if (!res.ok) throw new Error(`Erro ao buscar mangás (HTTP ${res.status})`);
    return res.json(); // vai retornar { mangaList: [...], metaData: {...} }
  },
  // outros métodos se quiser:
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/mangaList/${id}`);
    if (!res.ok) throw new Error(`Mangá não encontrado (HTTP ${res.status})`);
    return res.json();
  }
};
