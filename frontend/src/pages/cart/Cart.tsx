import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const Cart: React.FC = () => {
  const { state } = useLocation();
  const { startDate, endDate } = state || {};

  const [userData, setUserData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);  // Track if the form has been submitted successfully

  const formattedStartDate = startDate ? new Date(startDate).toISOString() : '';
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null); // Reset error message before starting the request

    try {
      const response = await fetch('http://localhost:5000/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          user: userData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the appointment');
      }

      const data = await response.json();
      console.log('Appointment successfully created:', data);

      // Set form as submitted
      setSubmitted(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('There was an error submitting your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Appointment Details</h1>

      {/* Display selected dates */}
      <p>Start Date: {startDate ? new Date(startDate).toLocaleString() : 'Not selected'}</p>
      <p>End Date: {endDate ? new Date(endDate).toLocaleString() : 'Not selected'}</p>

      {/* Show confirmation or form based on submission status */}
      {submitted ? (
        <div>
          <h2>Zkontrolujte si email a dokončete rezervaci potvrzením</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Surname:
              <input
                type="text"
                name="surname"
                value={userData.surname}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Appointment'}
          </button>
        </form>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Cart;
