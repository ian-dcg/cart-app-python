"use client";

import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaUserCircle, FaPlus, FaMinus } from "react-icons/fa";

export default function ShoppingCartPage() {
  const {
    enrichedItems,
    total,
    loading,
    removeItem,
    updateQuantity,
    checkout,
  } = useCart();

  const handleQuantityChange = (
    itemId: number,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
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
                  <FaShoppingCart className="text-gray-500" size={24} />
                </div>
                <span className="font-semibold text-gray-800">
                  {product.name}
                </span>
              </div>
              <div className="col-span-1 text-right text-gray-600">
                ${product.price.toFixed(2)}
              </div>
              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantidade, -1)
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-10 text-center text-gray-900 font-medium">
                    {item.quantidade}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantidade, 1)
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => removeItem(item.id)}
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
        <button
          onClick={checkout}
          disabled={enrichedItems.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
