import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Define the state as an array of item _id's
type CartState = string[]; // This will store only item _id's

// Define the possible actions for the cart
type CartAction =
  | { type: 'ADD_TO_CART'; _id: string } // Add by _id
  | { type: 'REMOVE_FROM_CART'; _id: string } // Remove by _id
  | { type: 'CLEAR_CART' }; // Clear the cart

const CartContext = createContext<{
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Helper function to load state from localStorage
const loadCartState = (): CartState => {
  const storedState = localStorage.getItem('cart');
  return storedState ? JSON.parse(storedState) : [];
};

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Prevent adding duplicate items to the cart
      if (state.includes(action._id)) {
        return state; // Item already exists, no change
      }
      return [...state, action._id]; // Add _id to the cart if it doesn't exist
    case 'REMOVE_FROM_CART':
      return state.filter((id) => id !== action._id); // Remove _id from the cart
    case 'CLEAR_CART':
      return []; // Clear the cart
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, loadCartState());

  // Save state to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const clearCart = () => {
    context.dispatch({ type: 'CLEAR_CART' });
  };

  return { ...context, clearCart };
};

