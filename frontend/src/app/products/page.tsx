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
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

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
                <button
                  onClick={() => addToCart(product.id, 1)}
                  className="text-green-600 hover:underline"
                >
                  Add to Cart
                </button>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
