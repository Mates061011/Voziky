import React, { useEffect, useState } from 'react';
import Item from '../item/Item';
import './items.css';

export interface ItemData {
  _id: string;
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: string;
  img: string;
  kauce: string; // Added kauce field
}

const ItemContainer: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const itemsPerPage = 3; // Number of items shown at once

  useEffect(() => {
    // Use the base URL from the environment variable
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Fetch data from the API
    fetch(`${apiUrl}/api/items`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
            <Item {...item} />
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
