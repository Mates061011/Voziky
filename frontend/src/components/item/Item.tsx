import React from 'react';
import './item.css';
import { useCart } from '../../context/CartContext'; // For cart management
import addIcon from '../../assets/addIcon.svg';
import deleteIcon from '../../assets/deleteIcon.svg'; // Corrected icon
import { useItemContext } from '../../context/ItemContext'; // To get the item details based on _id

interface ItemProps {
  _id: string;
  type?: 'standard' | 'special'; // Optional prop to specify the type
}

const Item: React.FC<ItemProps> = ({ _id, type = 'standard' }) => {
  const { cart, dispatch } = useCart(); // Manage cart operations
  const { items } = useItemContext(); // Access items from ItemContext

  const item = items.find((item) => item._id === _id);

  if (!item) {
    return <div>Item not found.</div>;
  }

  const { name, pricePerDays, img, desc } = item; // Access `desc` from item
  const imagePath = `/items/${img}`;

  const isInCart = cart.some((cartItem) => cartItem === _id);

  const handleCartAction = () => {
    if (isInCart) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        _id,
      });
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        _id,
      });
    }
  };

  // Truncate description to the first sentence
  const truncatedDesc = desc ? desc.split('.')[0] + '.' : '';

  return (
    <div className={`item-card ${type}`}>
      <h2>{name}</h2>
      <img src={imagePath} alt={name} className="item-image" />
      <div className="item-card-cont flexRow">
        {type === 'special' && truncatedDesc && (
          <p className="item-desc">
            {truncatedDesc}
          </p>
        )}
        <p>
          Cena:&nbsp;{type === 'special' ? (
            <strong>{pricePerDays}Kč / den</strong>
          ) : (
            <>
              <br />
              <strong>{pricePerDays}&nbsp;Kč<br />/ den</strong>
            </>
          )}
        </p>

        <button
          onClick={handleCartAction}
          className="item-button"
          style={{ backgroundColor: isInCart ? 'gray' : '' }}
        >
          <img src={isInCart ? deleteIcon : addIcon} alt={isInCart ? "Delete icon" : "Add icon"} />
          {isInCart ? 'ODEBRAT' : 'PŘIDAT K REZERVACI'}
        </button>
      </div>
    </div>
  );
};

export default Item;
