import React from 'react';
import AdminItem from '../adminItem/Item';
import './items.css';

interface ItemsProps {
  type?: 'standard' | 'special'; // Optional prop to specify the type
  isResponsive?: boolean; // Prop to control responsiveness
  admin?: boolean; // Prop to determine if admin view is enabled
  data: any[]; // The fetched items passed as a prop
}

const ItemContainer: React.FC<ItemsProps> = ({ 
  type = 'standard',
  data 
}) => {


  if (data.length === 0) {
    return <div>No items available</div>;
  }

  return (
    <div className={`item-container ${type}`}>
      <div className="items-grid">
        {data.map((item) => (
          <div className="grid-item" key={item._id}>
            <AdminItem item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemContainer;
