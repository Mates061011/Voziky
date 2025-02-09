import React from 'react';
import './item.css';
import { useCart } from '../../context/CartContext'; // Ensure correct path

interface ItemProps {
  _id: string;
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: string;
  img: string;
  kauce: string;
}

const Item: React.FC<ItemProps> = ({ _id, name, pricePerDay, pricePerDays, type, img, kauce }) => {
  const { dispatch } = useCart();
  const imagePath = `/items/${img}`; // Path to public/assets/

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      item: { _id, name, desc: '', pricePerDay, pricePerDays, type, img, kauce }, // Include kauce field
    });
  };

  return (
    <div className="item-card">
      <h2>{name}</h2>
      <img src={imagePath} alt={name} className="item-image" />
      <p>Type: {type}</p>
      <p>Price per day: {pricePerDay} CZK</p>
      <p>Price for multiple days: {pricePerDays} CZK</p>
      <p>Kauce: {kauce} CZK</p> {/* Display kauce field */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default Item;
