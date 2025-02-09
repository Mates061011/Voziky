// components/ItemContainer.tsx
import React, { useEffect, useState } from 'react';
import Item from '../item/Item';
import './items.css';
interface ItemData {
  _id: string;
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: string;
  img: string;
}

const ItemContainer: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/api/items') // Adjust this URL based on your API
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch items');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="item-container">
      {items.map((item) => (
        <Item key={item._id} {...item} />
      ))}
    </div>
  );
};

export default ItemContainer;
