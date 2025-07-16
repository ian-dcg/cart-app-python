// src/context/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createCart,
  addItemToCart as apiAddItemToCart,
  removeItemFromCart as apiRemoveItem,
} from "@/lib/api";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: number;
  produto_id: number;
  quantidade: number;
}

interface CartContextType {
  cartId: number | null;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuth, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuth) {
      const initializeCart = async () => {
        let storedCartId = localStorage.getItem("cartId");
        if (!storedCartId) {
          try {
            const newCartId = await createCart();
            localStorage.setItem("cartId", String(newCartId));
            setCartId(newCartId);
          } catch (error) {
            console.error("Failed to create cart:", error);
          }
        } else {
          setCartId(Number(storedCartId));
        }
      };
      initializeCart();
    }
  }, [isAuth, authLoading]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!cartId) {
      alert("Carrinho ainda não foi inicializado.");
      return;
    }
    try {
      const newItem = await apiAddItemToCart(cartId, {
        produto_id: productId,
        quantidade: quantity,
      });
      setItems((currentItems) => [...currentItems, newItem]);
      alert("Item adicionado ao carrinho!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Falha ao adicionar item ao carrinho.");
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cartId) return;
    try {
      await apiRemoveItem(cartId, itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Falha ao remover item do carrinho.");
    }
  };

  const clearCart = () => {
    setCartId(null);
    setItems([]);
    localStorage.removeItem("cartId");
  };

  return (
    <CartContext.Provider
      value={{ cartId, items, setItems, addToCart, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
