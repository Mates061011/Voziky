import React from 'react';
import './item.css';
import { Link } from 'react-router-dom';

interface ItemProps {
  item: any; // Ensure `item` is passed as a prop
  type?: 'standard' | 'special';
}

const Item: React.FC<ItemProps> = ({ item, type = 'standard' }) => {

  if (!item) {
    return <div>Item not found.</div>;
  }

  const { _id, name, img, desc, hidden } = item; // Destructure necessary fields from the item
  const imagePath = img && img.length > 0 ? `/items-avif/${img[0]}` : ''; // Handle missing images gracefully


  // Truncate description to the first sentence
  const truncatedDesc = desc ? desc.split('.')[0] + '.' : '';

  const handleUpdateItem = async () => {
    const token = localStorage.getItem('token'); // Assuming you have the token stored in localStorage
  
    if (!token) {
      alert('You must be logged in to update an item');
      return;
    }
  
    try {
      console.log("Making PUT request to:", `http://localhost:5000/api/items/update/${_id}`);
      console.log("Authorization:", `Bearer ${token}`);
  
      const response = await fetch(`http://localhost:5000/api/items/update/${_id}`, {
        method: 'PUT', // PUT request to update the item
        headers: {
          'Authorization': `Bearer ${token}`, // Only include the Bearer token in the headers
        }
      });
  
      console.log("Response Status:", response.status); // Log the response status
  
      if (response.ok) {
        alert('Item updated successfully');
        window.location.reload(); // Refresh the page after successful update
      } else {
        const errorData = await response.json();
        console.error("Error Response Data:", errorData); // Log any error details from the response
        throw new Error(`Failed to update item: ${response.statusText}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error updating item: ' + error.message);
      } else {
        alert('An unknown error occurred');
      }
      console.error("Error Details:", error); // Log the full error for debugging
    }
  };
  

  return (
    <div className={`item-card ${type}`}>
      <Link to={`/Produkty/${_id}`}>
        <h2>{name}</h2>
      </Link>
      {imagePath && <img src={imagePath} alt={name} className="item-image" />}
      <div className="item-card-cont flexRow">
        {type === 'special' && truncatedDesc && (
          <p className="item-desc">
            {truncatedDesc}
          </p>
        )}

        {/* Update item button */}
        <button
          onClick={handleUpdateItem}
          className="update-button"
          style={{
            backgroundColor: hidden ? 'gray' : '', // Gray background if item is hidden
            color: hidden ? 'black' : '', // Change text color to black for better visibility when hidden
          }}
        >
          {hidden ? 'Zobrazit' : 'Schovat'} {/* Change button text based on hidden state */}
        </button>

      </div>
    </div>
  );
};

export default Item;
