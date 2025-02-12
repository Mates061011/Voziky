import React, { useState } from 'react';
import { useItemContext } from '../../context/ItemContext'; // Import the context
import Item from '../item/Item';
import './items.css';
import nextButton from '../../assets/next.svg';
import previousButton from '../../assets/previous-svgrepo-com.svg';
interface ItemsProps {
  type?: 'standard' | 'special'; // Optional prop to specify the type
}

const ItemContainer: React.FC<ItemsProps> = ({ type = 'standard' }) => {
  const { items, loading, error } = useItemContext(); // Access items, loading, and error from context
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const itemsPerPage = type === 'special' ? 4 : 3; // Show 4 items for 'special'

  // Filter out items with type 'kocarek'
  const filteredItems = items.filter((item) => item.type !== 'kocarek');

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? 0 : prevIndex - itemsPerPage
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= filteredItems.length ? prevIndex : prevIndex + itemsPerPage
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`item-container ${type}`}>
      {type === 'special' ? (
        // 2x2 Grid for 'special' type
        <div className="items-grid">
          {filteredItems.slice(currentIndex, currentIndex + itemsPerPage).map((item) => (
            <div className="grid-item" key={item._id}>
              <Item _id={item._id} type={type} />
            </div>
          ))}
        </div>
      ) : (
        // Carousel for 'standard' type
        <>
          <button
            className="carousel-button left"
            onClick={handlePrevClick}
            disabled={currentIndex <= 0}
          >
            <img src={previousButton} alt="" />
          </button>
          <div className="items-wrapper">
            {filteredItems.slice(currentIndex, currentIndex + itemsPerPage).map((item) => (
              <div className="item" key={item._id}>
                <Item _id={item._id} type={type} />
              </div>
            ))}
          </div>
          <button
            className="carousel-button right"
            onClick={handleNextClick}
            disabled={currentIndex + itemsPerPage >= filteredItems.length}
          >
            <img src={nextButton} alt="" />
          </button>
        </>
      )}
    </div>
  );
};

export default ItemContainer;
