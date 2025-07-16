// src/app/products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api";
import Link from "next/link";

const sectors = ["Hortifruti", "Açougue", "Padaria", "Limpeza", "Bebidas"];

interface ProductData {
  name: string;
  quantity: number;
  price: number;
  setor: string;
}

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          setProduct(data);
        } catch (err) {
          setError("Falha ao carregar os dados do produto.");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError("");
    setSuccess("");

    try {
      const productData = {
        ...product,
        quantity: Number(product.quantity),
        price: Number(product.price),
      };
      await updateProduct(id, productData);
      setSuccess("Item atualizado com sucesso! Redirecionando...");

      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Falha ao atualizar o item.");
    }
  };

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">Carregando...</div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Item</h1>

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="setor"
            className="block text-sm font-medium text-gray-700"
          >
            Sector
          </label>
          <select
            id="setor"
            name="setor"
            value={product.setor}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/products"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
}
