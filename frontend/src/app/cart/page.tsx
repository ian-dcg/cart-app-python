// src/app/cart/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { getCartInfo, getProductById, getCartTotal } from "@/lib/api";
import {
  FaShoppingCart,
  FaUserCircle,
  FaRegCreditCard,
  FaRegUser,
  FaHeadphones,
} from "react-icons/fa";

interface CartItem {
  id: number;
  produto_id: number;
  quantidade: number;
}

interface ProductDetails {
  id: number;
  name: string;
  price: number;
}

interface EnrichedCartItem {
  item: CartItem;
  product: ProductDetails;
}

export default function ShoppingCartPage() {
  const { cartId, items, setItems, removeItem } = useCart();
  const [enrichedItems, setEnrichedItems] = useState<EnrichedCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCartDetails = useCallback(async () => {
    if (cartId) {
      try {
        setLoading(true);
        const cartData = await getCartInfo(cartId);
        setItems(cartData.items); // Sincroniza o contexto com os dados do backend
      } catch (error) {
        console.error("Failed to fetch cart details:", error);
        setItems([]); // Limpa os itens em caso de erro
      } finally {
        setLoading(false);
      }
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [cartId, setItems]);

  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  useEffect(() => {
    const enrichAndCalculateTotal = async () => {
      if (items.length > 0) {
        const itemsWithDetails = await Promise.all(
          items.map(async (item: CartItem) => {
            const product = await getProductById(item.produto_id);
            return { item, product };
          })
        );
        setEnrichedItems(itemsWithDetails);

        const newTotal = itemsWithDetails.reduce((acc, { item, product }) => {
          return acc + product.price * item.quantidade;
        }, 0);
        setTotal(newTotal);
      } else {
        setEnrichedItems([]);
        setTotal(0);
      }
    };
    enrichAndCalculateTotal();
  }, [items]);

  const handleRemoveItem = async (itemId: number) => {
    try {
      // A função removeItem no contexto agora gerencia a chamada da API e a atualização do estado 'items'.
      // A UI irá reagir automaticamente à mudança no estado 'items' através do useEffect acima.
      await removeItem(itemId);
    } catch (error) {
      // O alerta de erro já é tratado no contexto, mas podemos adicionar feedback adicional aqui se necessário.
      console.error("Could not remove item from page.", error);
    }
  };

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("notebook"))
      return <FaRegCreditCard className="text-gray-500" size={24} />;
    if (name.toLowerCase().includes("smartphone"))
      return <FaRegUser className="text-gray-500" size={24} />;
    if (name.toLowerCase().includes("headphones"))
      return <FaHeadphones className="text-gray-500" size={24} />;
    return <FaShoppingCart className="text-gray-500" size={24} />;
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        Carregando carrinho...
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FaShoppingCart /> Shopping Cart
        </h1>
        <FaUserCircle size={28} className="text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4 px-4 pb-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500">
          <div className="col-span-3">Item</div>
          <div className="col-span-1 text-right">Price</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1"></div>
        </div>

        {enrichedItems.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Seu carrinho está vazio.
          </p>
        ) : (
          enrichedItems.map(({ item, product }) => (
            <div key={item.id} className="grid grid-cols-6 gap-4 items-center">
              <div className="col-span-3 flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {getIcon(product.name)}
                </div>
                <span className="font-semibold text-gray-800">
                  {product.name}
                </span>
              </div>
              <div className="col-span-1 text-right text-gray-600">
                ${product.price.toFixed(2)}
              </div>
              <div className="col-span-1 text-center">
                <div className="w-16 p-2 inline-block text-center bg-gray-100 rounded-md text-gray-600">
                  {item.quantidade}
                </div>
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-gray-800">
            ${total.toFixed(2)}
          </span>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
