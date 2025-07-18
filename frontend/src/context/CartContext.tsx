"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  createCart,
  addItemToCart as apiAddItemToCart,
  removeItemFromCart as apiRemoveItem,
  getCartInfo,
  getProductById,
  updateItemQuantity as apiUpdateQuantity,
  checkoutCart as apiCheckout,
} from "@/lib/api";
import { useAuth } from "./AuthContext";

// Tipos
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

// Contexto
interface CartContextType {
  cartId: number | null;
  enrichedItems: EnrichedCartItem[];
  total: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  checkout: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<number | null>(null);
  const [enrichedItems, setEnrichedItems] = useState<EnrichedCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuth, loading: authLoading } = useAuth();

  const loadCart = useCallback(async (currentCartId: number) => {
    try {
      setLoading(true);
      const cartData = await getCartInfo(currentCartId);
      const itemsWithDetails = await Promise.all(
        cartData.items.map(async (item: CartItem) => {
          const product = await getProductById(item.produto_id);
          return { item, product };
        })
      );
      const newTotal = itemsWithDetails.reduce(
        (acc, { item, product }) => acc + product.price * item.quantidade,
        0
      );
      setEnrichedItems(itemsWithDetails);
      setTotal(newTotal);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setEnrichedItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuth) {
      const initializeCart = async () => {
        let storedCartId = localStorage.getItem("cartId");
        let currentCartId = storedCartId ? Number(storedCartId) : null;

        if (!currentCartId) {
          try {
            currentCartId = await createCart();
            localStorage.setItem("cartId", String(currentCartId));
          } catch (error) {
            console.error("Failed to create cart:", error);
            return;
          }
        }
        setCartId(currentCartId);
        // CORREÇÃO: Adiciona uma verificação para garantir que currentCartId não é nulo
        if (currentCartId) {
          await loadCart(currentCartId);
        }
      };
      initializeCart();
    } else if (!authLoading && !isAuth) {
      setLoading(false);
    }
  }, [isAuth, authLoading, loadCart]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!cartId) return;
    try {
      await apiAddItemToCart(cartId, {
        produto_id: productId,
        quantidade: quantity,
      });
      await loadCart(cartId);
      alert("Item adicionado ao carrinho!");
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Falha ao adicionar item.");
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cartId) return;
    try {
      await apiRemoveItem(cartId, itemId);
      await loadCart(cartId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Falha ao remover item.");
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (!cartId || newQuantity < 1) return;
    try {
      await apiUpdateQuantity(cartId, itemId, newQuantity);
      await loadCart(cartId);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Falha ao atualizar quantidade.");
    }
  };

  const checkout = async () => {
    if (!cartId) return;
    try {
      await apiCheckout(cartId);
      await loadCart(cartId); // O carrinho estará vazio
      alert("Compra finalizada com sucesso!");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(`Falha no checkout: ${error}`);
    }
  };

  const clearCart = () => {
    setCartId(null);
    setEnrichedItems([]);
    setTotal(0);
    localStorage.removeItem("cartId");
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        enrichedItems,
        total,
        loading,
        addToCart,
        removeItem,
        updateQuantity,
        checkout,
        clearCart,
      }}
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
