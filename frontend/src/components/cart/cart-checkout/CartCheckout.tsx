import React, { useState } from 'react';
import { useUserContext } from '../../../context/userContext';  // Import UserContext
import { useCart } from '../../../context/CartContext'; // Import CartContext
import { useDateContext } from '../../../context/DateContext';  // Import DateContext

interface CheckoutPageProps {
  onOrderSuccess: () => void; // The callback function to signal success
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess }) => {
  const { userData, clearUserData } = useUserContext(); // Get the user data and clear function from UserContext
  const { cart, clearCart } = useCart(); // Get the cart and clear function from CartContext
  const { dates, clearDates } = useDateContext(); // Get the dates and clear function from DateContext
  const [loading, setLoading] = useState(false); // To handle the loading state

  const sendOrderData = async () => {
    if (!userData || cart.length === 0 || !dates[0] || !dates[1]) return;

    const startDate = dates[0]; // Use the start date from context
    const endDate = dates[1]; // Use the end date from context

    const orderData = {
      startDate: startDate.toISOString(), // Convert to ISO string
      endDate: endDate.toISOString(), // Convert to ISO string
      user: {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone: userData.phone,
      },
      items: cart, // The items array (only the item _id's)
    };

    // Log the order data to the console before sending
    console.log('Order Data:', orderData);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        
        // Clear contexts
        clearUserData();
        clearCart();
        clearDates();

        // Clear local storage
        localStorage.removeItem('cart');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('dates');
        localStorage.removeItem('userData');

        // Notify the parent component that the order was placed successfully
        onOrderSuccess(); // Call the callback function passed from the parent
      } else {
        alert('Failed to place the order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={sendOrderData} disabled={loading}>
        {loading ? 'Odesílání...' : 'Závazně rezervovat'}
      </button>
    </>
  );
};

export default CheckoutPage;
