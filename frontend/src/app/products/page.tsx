// src/app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/api";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  quantity: number;
  setor: string;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchSetor, setSearchSetor] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { addToCart } = useCart();

  // Debounce para evitar muitas requisições durante a digitação
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchName, searchSetor]);

  const fetchProducts = async () => {
    setSearchLoading(true);
    try {
      // Constrói parâmetros de busca
      const params = new URLSearchParams();
      if (searchName.trim()) {
        params.append("nome", searchName.trim());
      }
      if (searchSetor.trim()) {
        params.append("setor", searchSetor.trim());
      }

      const data = await getProducts(params.toString());
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      try {
        await deleteProduct(productId);
        setProducts((currentProducts) =>
          currentProducts.filter((p) => p.id !== productId)
        );
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Falha ao deletar o item.");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping List</h1>
        <Link
          href="/products/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Add Item
        </Link>
      </div>

      {/* Search Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Search Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="searchName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Search by Name
            </label>
            <input
              id="searchName"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter product name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="searchSetor"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Search by Sector
            </label>
            <select
              id="searchSetor"
              value={searchSetor}
              onChange={(e) => setSearchSetor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">All sectors</option>
              <option value="Hortifruti">Hortifruti</option>
              <option value="Açougue">Açougue</option>
              <option value="Padaria">Padaria</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Bebidas">Bebidas</option>
            </select>
          </div>
        </div>
        {(searchName || searchSetor) && (
          <div className="mt-3">
            <button
              onClick={() => {
                setSearchName("");
                setSearchSetor("");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4 px-4 text-left text-sm font-medium text-gray-500">
          <div className="col-span-2">Name</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Sector</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <p>Carregando produtos...</p>
        ) : searchLoading ? (
          <p>Buscando...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchName || searchSetor
              ? "Nenhum produto encontrado com os filtros aplicados."
              : "Nenhum produto cadastrado."}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-6 gap-4 items-center bg-gray-50 p-4 rounded-lg"
            >
              <div className="col-span-2 font-medium text-gray-800">
                {product.name}
              </div>
              <div className="text-gray-600">${product.price.toFixed(2)}</div>
              <div className="text-gray-600">{product.quantity}</div>
              <div className="text-gray-600">{product.setor}</div>
              <div className="space-x-2">
                <Link
                  href={`/products/edit/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => addToCart(product.id, 1)}
                  className="text-green-600 hover:underline"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
