import React from 'react';
import './cartitem.css';
import { useDateContext } from '../../../context/DateContext'; // Import DateContext to get the date range
import CloseImg from '../../../assets/close.svg';

interface CartItemProps {
  item: {
    _id: string;
    name: string;
    desc: string;
    pricePerDay: number;
    pricePerDays: number;
    type: string;
    img: string[];
    kauce: string;
    __v: number;
  };
  onRemove: (id: string) => void;
  showKauce: boolean; // New prop to control whether to show kauce
  showCloseButton: boolean; // New prop to control whether to show the close button
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, showKauce, showCloseButton }) => {
  const { dates } = useDateContext(); // Get the start and end date from context

  if (!dates[0] || !dates[1]) return null; // In case dates are undefined

  const currentStartDate = dates[0];
  const currentEndDate = dates[1];
  // Calculate the number of days
  const numOfDays = Math.ceil(
    (currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1
  );
  const imagePath = item.img.length > 0 ? `/items/${item.img[0]}` : ''; 
  // Calculate the price based on the number of days and the price per day or per multiple days
  const totalPrice =
    numOfDays === 1
      ? item.pricePerDay
      : numOfDays * item.pricePerDays;

  return (
    <li key={item._id} className="cart-item">
      <div className="cart-item-info flexRow">
        <img src={imagePath} alt={item.name} className="cart-item-image" />
        <div className="cart-item-details">
          <h5 className="cart-item-name">{item.name}</h5>
          {/* Conditionally render kauce if showKauce is true */}
          {showKauce && item.kauce && (
            <p className="cart-item-kauce">Vratná kauce {item.kauce} Kč (v hotovosti při převzetí)</p>
          )}
        </div>
        <p className="cart-item-price">{totalPrice} Kč</p>
        {/* Conditionally render the close button with a class for opacity control */}
        <button
          className={`cart-item-remove ${showCloseButton ? '' : 'hidden'}`}
          onClick={() => onRemove(item._id)}
          disabled={!showCloseButton} // Disable the button if it's not visible
        >
          <img src={CloseImg} alt="Remove item" />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
