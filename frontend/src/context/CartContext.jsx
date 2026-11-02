import { createContext, useState, useContext } from "react";

// Shared cart (lab manual, step 16): any event card can add an event,
// the Navbar shows the count badge and the Cart page lists everything.
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(event) {
    // an event can be added only once
    if (!cart.some((item) => item.id === event.id)) {
      setCart([...cart, event]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const totalFee = cart.reduce((sum, item) => sum + item.fee, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalFee }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
