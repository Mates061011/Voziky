import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'; 
import { ItemData } from '../components/item-container/Items'; // Ensure the correct path

interface CartItem extends ItemData {}

type CartState = CartItem[];

type CartAction =
  | { type: 'ADD_TO_CART'; item: ItemData }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CLEAR_CART' };

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
      const existingItem = state.find((item) => item._id === action.item._id);
      if (existingItem) {
        return state; // Item already exists, no change
      }
      return [...state, action.item]; // Add item to the cart if it doesn't exist
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item._id !== action.id); // Remove item by id
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
  return context;
};
