// frontend/src/lib/api.ts

// Função auxiliar para fazer requisições à API
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}${endpoint}`; // O endpoint já deve conter a barra inicial, ex: '/products'

  // **CORREÇÃO:** Verifica se o código está rodando no navegador antes de acessar o localStorage
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("authToken");
  }

  // Usa a classe Headers para manipular os cabeçalhos de forma segura
  const headers = new Headers(options.headers);

  // Define um Content-Type padrão, mas apenas se nenhum outro já foi especificado
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Tratar erros de forma mais robusta aqui no futuro
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, errorData);
    throw new Error(errorData.detail || "Ocorreu um erro na requisição.");
  }

  // Se a resposta não tiver corpo (ex: status 204), retorna um objeto vazio
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

// Funções de Produtos
export const getProducts = () => apiFetch("/products/");
export const createProduct = (data: any) =>
  apiFetch("/products/", { method: "POST", body: JSON.stringify(data) });
export const getProductById = (id: number) => apiFetch(`/products/${id}`);
export const updateProduct = (id: number, data: any) =>
  apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id: number) =>
  apiFetch(`/products/${id}`, { method: "DELETE" });

// Funções de Autenticação
export const loginUser = (data: URLSearchParams) =>
  apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  });
export const registerUser = (data: any) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) });

// Funções do Carrinho
export const createCart = () => apiFetch("/cart/", { method: "POST" });
export const getCartInfo = (cartId: number) => apiFetch(`/cart/${cartId}`);
export const addItemToCart = (
  cartId: number,
  item: { produto_id: number; quantidade: number }
) =>
  apiFetch(`/cart/${cartId}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });
export const removeItemFromCart = (cartId: number, itemId: number) =>
  apiFetch(`/cart/${cartId}/items/${itemId}`, { method: "DELETE" });
export const getCartTotal = (cartId: number) =>
  apiFetch(`/cart/${cartId}/total`);

export const updateItemQuantity = (
  cartId: number,
  itemId: number,
  quantity: number
) =>
  apiFetch(`/cart/${cartId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantidade: quantity }),
  });
export const checkoutCart = (cartId: number) =>
  apiFetch(`/cart/${cartId}/checkout`, { method: "POST" });
