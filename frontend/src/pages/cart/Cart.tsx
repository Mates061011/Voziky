import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const Cart: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const [submitted, setSubmitted] = useState(false);

  // Format the selected start and end dates
  const initialStartDate = startDate ? new Date(startDate) : new Date();
  const initialEndDate = endDate ? new Date(endDate) : new Date();

  const [startTime, setStartTime] = useState<string>(
    initialStartDate.toISOString().substring(11, 16) // Extract time in HH:mm format
  );
  const [endTime, setEndTime] = useState<string>(
    initialEndDate.toISOString().substring(11, 16) // Extract time in HH:mm format
  );

  const [currentStartDate, setCurrentStartDate] = useState<Date>(initialStartDate);
  const [currentEndDate, setCurrentEndDate] = useState<Date>(initialEndDate);

  useEffect(() => {
    // Update start date when time is changed
    const updatedStartDate = new Date(currentStartDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    updatedStartDate.setHours(startHour, startMinute);
    setCurrentStartDate(updatedStartDate);

    // Update end date when time is changed
    const updatedEndDate = new Date(currentEndDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    updatedEndDate.setHours(endHour, endMinute);
    setCurrentEndDate(updatedEndDate);
  }, [startTime, endTime]);

  const formattedStartDate = currentStartDate.toLocaleDateString() + ' ' + currentStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedEndDate = currentEndDate.toLocaleDateString() + ' ' + currentEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    setError(null);
  
    // Use the current Date objects for start and end date
    const updatedStartDate = new Date(currentStartDate);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    updatedStartDate.setHours(startHour, startMinute, 0, 0); // Set the start time correctly
  
    // Add 1 hour to the start date
    updatedStartDate.setHours(updatedStartDate.getHours() + 1);
  
    const updatedEndDate = new Date(currentEndDate);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    updatedEndDate.setHours(endHour, endMinute, 0, 0); // Set the end time correctly
  
    // Add 1 hour to the end date
    updatedEndDate.setHours(updatedEndDate.getHours() + 1);
  
    try {
      const response = await fetch(`${baseUrl}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: updatedStartDate, // Send updated startDate
          endDate: updatedEndDate,     // Send updated endDate
          user: userData,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the appointment');
      }
  
      const data = await response.json();
      console.log('Appointment successfully created:', data);
  
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

      <p>Start Date: {formattedStartDate ? formattedStartDate : 'Not selected'}</p>
      <p>End Date: {formattedEndDate ? formattedEndDate : 'Not selected'}</p>

      <div>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
      </div>

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
