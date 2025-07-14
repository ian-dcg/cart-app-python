// src/app/products/page.tsx
import { getProducts } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default async function ProductsPage() {
  // Busca os dados no servidor, antes de renderizar a página
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Renderizar uma mensagem de erro aqui
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nossos Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 my-2">{product.description}</p>
            <p className="text-lg font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </p>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
