import React, { useState } from 'react';
import { useUserContext } from '../../../context/userContext'; // Import UserContext
import { useCart } from '../../../context/CartContext'; // Import CartContext
import { useDateContext } from '../../../context/DateContext'; // Import DateContext

interface CheckoutPageProps {
  onOrderSuccess: (message: string) => void; // The callback function to signal success with a message
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

    // Ensure the phone number is a number and validate
    const phone = Number(userData.phone);
    if (isNaN(phone)) {
      alert('Invalid phone number. Please check and try again.');
      return;
    }

    const orderData = {
      startDate: startDate.toISOString(), // Convert to ISO string
      endDate: endDate.toISOString(), // Convert to ISO string
      user: {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone, // Send the phone as a number
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

      const responseData = await response.json(); // Parse the response JSON

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

        // Notify the parent component with the success message
        onOrderSuccess('');
      } else {
        // Handle the error message from the API
        onOrderSuccess(responseData.message || 'Failed to place the order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      onOrderSuccess('An error occurred while placing the order');
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
