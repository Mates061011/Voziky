import React, { useState, useEffect } from 'react';
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
  const [itemsPerPage, setItemsPerPage] = useState<number>(3); // Default value for 'standard'

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 800) {
        setItemsPerPage(1);
      } else if (width < 1200) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(type === 'special' ? 4 : 3);
      }
    };

    updateItemsPerPage(); // Set initial value
    window.addEventListener('resize', updateItemsPerPage); // Listen for resize events

    return () => window.removeEventListener('resize', updateItemsPerPage); // Cleanup
  }, [type]);

  // Filter out items with type 'kocarek'
  const filteredItems = items.filter((item) => item.type !== 'kocarek');

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Prevent negative index
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, filteredItems.length - itemsPerPage)
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
          <div className="carousel-container">
            <div
              className="items-wrapper"
              style={{
                transform: `translateX(-${currentIndex * 320}px)`,
              }}
            >
              {filteredItems.map((item) => (
                <div className="item" key={item._id}>
                  <Item _id={item._id} type={type} />
                </div>
              ))}
            </div>
          </div>
          <button
            className="carousel-button right"
            onClick={handleNextClick}
            disabled={currentIndex >= filteredItems.length - itemsPerPage}
          >
            <img src={nextButton} alt="" />
          </button>
        </>
      )}
    </div>
  );
};

export default ItemContainer;
