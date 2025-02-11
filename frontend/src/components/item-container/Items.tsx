import React, { useState } from 'react';
import { useItemContext } from '../../context/ItemContext'; // Import the context
import Item from '../item/Item';
import './items.css';

const ItemContainer: React.FC = () => {
  const { items, loading, error } = useItemContext(); // Access items, loading, and error from context
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const itemsPerPage = 3; // Number of items shown at once

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? 0 : prevIndex - itemsPerPage
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= items.length ? prevIndex : prevIndex + itemsPerPage
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="item-container">
      <button className="carousel-button left" onClick={handlePrevClick} disabled={currentIndex <= 0}>
        &#60;
      </button>
      <div className="items-wrapper">
        {items.slice(currentIndex, currentIndex + itemsPerPage).map((item) => (
          <div className="item" key={item._id}>
            <Item _id={item._id} />
          </div>
        ))}
      </div>
      <button className="carousel-button right" onClick={handleNextClick} disabled={currentIndex + itemsPerPage >= items.length}>
        &#62;
      </button>
    </div>
  );
};

export default ItemContainer;
