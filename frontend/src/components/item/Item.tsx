import React from 'react';
import './item.css';
import { useCart } from '../../context/CartContext';
import addIcon from '../../assets/addIcon.svg';
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
  const { cart, dispatch } = useCart();
  const imagePath = `/items/${img}`;

  // Check if the item exists in the cart
  const isInCart = cart.some((item) => item._id === _id);

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch({
        type: 'ADD_TO_CART',
        item: { _id, name, desc: '', pricePerDay, pricePerDays, type, img, kauce },
      });
    }
  };

  return (
    <div className="item-card">
      <h2>{name}</h2>
      <img src={imagePath} alt={name} className="item-image" />
      <div className="item-card-cont flexRow">
        <p>Cena: <br /> <strong>{pricePerDays}&nbsp;Kč<br />/ den</strong></p>
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          style={{ backgroundColor: isInCart ? 'gray' : '' }}
        >
          <img src={addIcon} alt="" />
          {isInCart ? 'V KOŠÍKU' : 'PŘIDAT K REZERVACI'}
        </button>
      </div>
    </div>
  );
};

export default Item;
