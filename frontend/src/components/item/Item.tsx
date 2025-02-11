import React from 'react';
import './item.css';
import { useCart } from '../../context/CartContext'; // For cart management
import addIcon from '../../assets/addIcon.svg';
import { useItemContext } from '../../context/ItemContext'; // To get the item details based on _id

interface ItemProps {
  _id: string;
}

const Item: React.FC<ItemProps> = ({ _id }) => {
  const { cart, dispatch } = useCart(); // Manage cart operations
  const { items } = useItemContext(); // Access items from ItemContext
  
  // Find the item using _id
  const item = items.find((item) => item._id === _id);
  
  // If the item doesn't exist in the context, return null or a loading message
  if (!item) {
    return <div>Item not found.</div>;
  }

  const { name, pricePerDays, img} = item; // Destructure item details
  const imagePath = `/items/${img}`; 
  
  // Check if the item exists in the cart (based on _id)
  const isInCart = cart.some((cartItem) => cartItem === _id);

  const handleAddToCart = () => {
    if (!isInCart) {
      // Add the item _id to the cart
      dispatch({
        type: 'ADD_TO_CART',
        _id, // Passing only the _id
      });
    }
  };

  return (
    <div className="item-card">
      <h2>{name}</h2>
      <img src={imagePath} alt={name} className="item-image" />
      <div className="item-card-cont flexRow">
        <p>
          Cena: <br /> <strong>{pricePerDays}&nbsp;Kč<br />/ den</strong>
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          style={{ backgroundColor: isInCart ? 'gray' : '' }}
        >
          <img src={addIcon} alt="Add icon" />
          {isInCart ? 'V KOŠÍKU' : 'PŘIDAT K REZERVACI'}
        </button>
      </div>
    </div>
  );
};

export default Item;
