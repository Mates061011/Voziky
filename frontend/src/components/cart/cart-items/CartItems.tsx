import React from "react";
import { useCart } from "../../../context/CartContext"; // Ensure the correct path
import { useItemContext } from "../../../context/ItemContext"; // Import ItemContext
import { useDateContext } from "../../../context/DateContext"; // Import DateContext for date range
import CartItem from "../cart-item/CartItem"; // Import the CartItem component
import "./cartitems.css";

interface CartItemsContainerProps {
  showKauce: boolean; // Boolean prop to control if kauce should be shown
}

const CartItemsContainer: React.FC<CartItemsContainerProps> = ({ showKauce }) => {
  const { cart, dispatch } = useCart();
  const { dates } = useDateContext();
  const { items, loading, error } = useItemContext();
  console.log(cart);


  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", _id: id });
  };

  const getItemDetails = (id: string) => {
    const item = items.find((item) => item._id === id);
    console.log(item)
    if (!item) {
      console.warn(`Item with ID ${id} not found in items array.`);
    }
    return item;
  };

  const calculateTotalPrice = () => {
    if (!dates[0] || !dates[1]) return 0;

    const currentStartDate = dates[0];
    const currentEndDate = dates[1];
    const numOfDays = Math.ceil(
      (currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1
    );

    return cart.reduce((total, cartItemId) => {
      const itemDetails = getItemDetails(cartItemId);
      if (!itemDetails) {
        console.warn(`Item not found for ID: ${cartItemId}`);
        return total; // Skip this item
      }

      const totalPrice =
        numOfDays === 1
          ? itemDetails.pricePerDay
          : numOfDays * itemDetails.pricePerDays;
      return total + totalPrice;
    }, 0);
  };

  if (loading) {
    return <p>Loading items...</p>;
  }

  if (error) {
    return <p>Error loading items: {error}</p>;
  }

  return (
    <div>
      <ul className="cart-items-list">
        {cart.map((cartItemId) => {
          const itemDetails = getItemDetails(cartItemId);
          if (!itemDetails) {
            return (
              <li key={cartItemId} className="cart-item-error">
                Item not found (ID: {cartItemId})
              </li>
            );
          }

          return (
            <CartItem
              key={itemDetails._id}
              item={{
                ...itemDetails,
                name: String(itemDetails.name || "Unknown Name"),
                desc: String(itemDetails.desc || "Unknown Description"),
                kauce: String(itemDetails.kauce || 0),
              }}
              onRemove={handleRemoveItem}
              showKauce={showKauce}
            />
          );
        })}
      </ul>
      <div className="cart-total-price">
        <h4>Total Price: {calculateTotalPrice()} Kč</h4>
      </div>
    </div>
  );
};

export default CartItemsContainer;
