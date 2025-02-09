import React from 'react';
import { useCart } from '../../context/CartContext'; // Ensure the correct path
import CartItem from '../cart-item/CartItem'; // Import the CartItem component
import { useDateContext } from '../../context/DateContext'; // Import DateContext for date range
import './cartitems.css';
const CartItemsContainer: React.FC = () => {
  const { cart, dispatch } = useCart();
  const { dates } = useDateContext(); // Get the start and end date from context

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  // Function to calculate the total price of all cart items
  const calculateTotalPrice = () => {
    if (!dates[0] || !dates[1]) return 0; // In case dates are undefined

    const currentStartDate = dates[0];
    const currentEndDate = dates[1];
    // Calculate the number of days
    const numOfDays = Math.ceil(
      (currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1
    );

    return cart.reduce((total, item) => {
      const totalPrice =
        numOfDays === 1
          ? item.pricePerDay
          : numOfDays * item.pricePerDays;
      return total + totalPrice;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div>
      <ul className="cart-items-list">
        {cart.map((item) => (
          <CartItem key={item._id} item={item} onRemove={handleRemoveItem} />
        ))}
      </ul>
      <div className="cart-total-price">
        <h4>{totalPrice}Kč</h4>
      </div>
    </div>
  );
};

export default CartItemsContainer;
