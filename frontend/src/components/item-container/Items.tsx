import React, { useState, useEffect } from 'react';
import { useItemContext } from '../../context/ItemContext'; // Import the context
import Item from '../item/Item';
import './items.css';

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
            <svg fill="#000000" height="800px" width="800px" version="1.1" id="XMLID_54_" xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24">
            <g id="previous">
              <g>
                <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3 		"/>
              </g>
            </g>
            </svg>
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
            <svg fill="#000000" height="800px" width="800px" version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg"  
              viewBox="0 0 24 24">
            <g id="next">
              <g>
                <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 		"/>
              </g>
            </g>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ItemContainer;
