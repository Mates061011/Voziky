import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './cart.css';
import CartSteps from '../../components/CartSteps/CartSteps';
import Section4 from '../mainpage/Mainpage_section4/Mainpage-section4';
import { DateProvider } from '../../context/DateContext';
import { useDateContext } from "../../context/DateContext";
import { ScrollProvider } from '../../context/ScrollContext';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const Cart: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const { state } = useLocation();
  const { startDate, endDate } = state || {}; // Destructure startDate and endDate from state

  const { dates, setDates } = useDateContext(); // Use context to get dates

  const [userData, setUserData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step3, setStep3] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [percent, setPercent] = useState(0);
  const [step1, setStep1] = useState(true); // Default step1 is true
  const [step2, setStep2] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Initialize states with passed dates or default values
  const [currentStartDate, setCurrentStartDate] = useState<Date>(startDate ? new Date(startDate) : new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(endDate ? new Date(endDate) : new Date());

  const [startTime, setStartTime] = useState<string>(startDate ? new Date(startDate).toISOString().substring(11, 16) : '');
  const [endTime, setEndTime] = useState<string>(endDate ? new Date(endDate).toISOString().substring(11, 16) : '');

  // Handle step change
  const handleStepChange = (currentStep: number) => {
    if (currentStep === 2 && submitted === false) {
      return;
    }
    setCurrentStep(currentStep);
    setStep1(false);
    setStep2(false);
    setStep3(false);
  
    if (currentStep === 0) {
      setStep1(true);
    } else if (currentStep === 1) {
      setStep2(true);
    } else if (currentStep === 2) {
      setStep3(true);
    }
  };
  

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setProgress(updatedData);
      return updatedData;
    });
  };

  // Calculate progress based on filled fields
  const setProgress = (data: UserData) => {
    const fieldsFilled = Object.values(data).filter((field) => field !== '').length;
    const totalFields = Object.keys(data).length;
    const progress = (fieldsFilled / totalFields) * 100;
    setPercent(progress);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: currentStartDate,
          endDate: currentEndDate,
          user: userData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the appointment');
      }

      const data = await response.json();
      console.log('Appointment successfully created:', data);

      setStep2(false);
      setStep3(true);
      setCurrentStep(2);
      setSubmitted(true)
    } catch (error: unknown) {
      console.error('Error creating appointment:', error);
  
      if (error instanceof Error) {
        setError(error.message); // Set the error message
      } else {
        setError('There was an error submitting your data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update dates in context when startDate and endDate change
  useEffect(() => {
    // If dates are passed from Section4, update the states and context
    if (startDate && endDate) {
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      setCurrentStartDate(newStartDate);
      setCurrentEndDate(newEndDate);
      setStartTime(newStartDate.toISOString().substring(11, 16));
      setEndTime(newEndDate.toISOString().substring(11, 16));

      // Update context with new dates
      setDates([newStartDate, newEndDate]);

      // Set the step to step 2 and update percent to 100%
      setStep1(false); // Hide step 1
      setStep2(true); // Show step 2
      handleStepChange(1); // Move to step 2
    }
  }, [startDate, endDate, setDates]); // Add setDates to the dependency array

  // Update the dates in context whenever start or end date changes
  useEffect(() => {
    console.log('Updating context with dates:', currentStartDate, currentEndDate); // Debug log
    setDates([currentStartDate, currentEndDate]);
  }, [currentStartDate, currentEndDate, setDates]);
  

  // Effect for updating percent based on dates when step1 is true
  useEffect(() => {
    if (step1) {
      // Calculate percent based on the dates in step 1
      const [start, end] = dates;
      if (start && end) {
        setPercent(100);
      } else if (start || end) {
        setPercent(50);
      } else {
        setPercent(0);
      }
    }
  }, [dates, step1]); // This effect runs when step1 is true or when dates change

  // Effect for updating percent based on the form data when step1 is false
  useEffect(() => {
    if (!step1) {
      setProgress(userData); // Calculate percent based on form data
    }
  }, [step1, userData]); // This effect runs when step1 changes or form data changes

  return (
    <DateProvider>
      <ScrollProvider>
        <div className="cartCont">
          <CartSteps
            current={currentStep}
            percent={percent}
            error={false}
            onStepChange={handleStepChange}
          />
          <div className="cartWrap" style={{ width: step1 ? 'fit-content' : 'auto' }}>
            {step1 && <Section4 />}
            {step2 && (
              <div>
                <p>
                  Datum vyzvednutí: {currentStartDate.toLocaleDateString()}
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="time"
                  />
                </p>
                <p>
                  Datum vrácení: {currentEndDate.toLocaleDateString()}
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="time"
                  />
                </p>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Jméno:
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
                      Příjmení:
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
                      Telefon:
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
                    {loading ? 'Odesílání...' : 'Odeslat'}
                  </button>
                  {error && <div>{error}</div>}
                </form>
              </div>
            )}
            {step3 && (
              <div>
                <h2>Potvrďte rezervaci v emailu!</h2>
              </div>
            )}
          </div>
        </div>
      </ScrollProvider>
    </DateProvider>
  );
};

export default Cart;
