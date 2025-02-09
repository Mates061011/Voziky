// components/Item.tsx
import React from 'react';
import './item.css';
interface ItemProps {
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: string;
  img: string;
}

const Item: React.FC<ItemProps> = ({ name, desc, pricePerDay, pricePerDays, type, img }) => {
    const imagePath = `/items/${img}`; // Path to public/assets/
  
    return (
      <div className="item-card">    
        <h2>{name}</h2>
        <img src={imagePath} alt={name} className="item-image" />
        <p>Type: {type}</p>
        <p>Price per day: {pricePerDay} CZK</p>
        <p>Price for multiple days: {pricePerDays} CZK</p>
      </div>
    );
  };
  
  

export default Item;
