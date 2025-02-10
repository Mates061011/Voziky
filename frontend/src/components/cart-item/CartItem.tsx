import React from 'react';
import './cartitem.css';
import { useDateContext } from '../../context/DateContext'; // Import DateContext to get the date range
import CloseImg from '../../assets/close.svg';
interface CartItemProps {
  item: {
    _id: string;
    name: string;
    desc: string;
    pricePerDay: number;
    pricePerDays: number; // Additional field for price per multiple days
    img: string;
  };
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const { dates } = useDateContext(); // Get the start and end date from context

  if (!dates[0] || !dates[1]) return null; // In case dates are undefined

  const currentStartDate = dates[0];
  const currentEndDate = dates[1];
  // Calculate the number of days
  const numOfDays = Math.ceil(
    (currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1
  );

  // Calculate the price based on the number of days and the price per day or per multiple days
  const totalPrice =
    numOfDays === 1
      ? item.pricePerDay
      : numOfDays * item.pricePerDays;

  return (
    <li key={item._id} className="cart-item">
      <div className="cart-item-info flexRow">
        <img src={`/items/${item.img}`} alt={item.name} className="cart-item-image" />
        <div className="cart-item-details">
          <h5 className="cart-item-name">{item.name}</h5>
        </div>
        <p className="cart-item-price">
          {totalPrice}Kč
        </p>
        <button
          className="cart-item-remove"
          onClick={() => onRemove(item._id)}
        >
          <img src={CloseImg} alt="" />
        </button>
      </div>
      
    </li>
  );
};

export default CartItem;
