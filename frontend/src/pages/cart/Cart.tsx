import React, { useState, useEffect } from 'react';
import './cart.css';
import CartSteps from '../../components/CartSteps/CartSteps';
import Section4 from '../mainpage/Mainpage_section4/Mainpage-section4';
import { useDateContext } from "../../context/DateContext";
import InputMask from 'react-input-mask';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const Cart: React.FC = () => {
  useEffect(() => {
  window.scrollTo(0, 0); // Scroll to the top of the page
}, []);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const { dates } = useDateContext(); // Get dates from context
  console.log("Cart Dates from context:", dates);

  const [userData, setUserData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step3, setStep3] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [percent, setPercent] = useState(0);
  const [step1, setStep1] = useState(true); // Default step1 is true
  const [step2, setStep2] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Use dates directly from context instead of state
  const [currentStartDate, setCurrentStartDate] = useState<Date>(dates[0] || new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(dates[1] || new Date());

  const [startTime, setStartTime] = useState<string>(currentStartDate.toISOString().substring(11, 16));
  const [endTime, setEndTime] = useState<string>(currentEndDate.toISOString().substring(11, 16));

  const handleStepChange = (currentStep: number) => {
    // Prevent going to step 1 or step 2 if both startDate and endDate are not available
    if (currentStep === 1 || currentStep === 2) {
      if (!currentStartDate || !currentEndDate || isNaN(currentStartDate.getTime()) || isNaN(currentEndDate.getTime())) {
        setError("Both start date and end date are required.");
        return;
      }
    }

    // Prevent going to step 1 if percent is not 100 (step 0 not complete)
    if (currentStep === 1 && percent !== 100) {
      return;
    }

    // Allow the user to proceed if the conditions are met
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

    // Clean up the phone number by removing spaces
    const cleanPhone = userData.phone.replace(/\s+/g, '');

    try {
      const response = await fetch(`${baseUrl}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: currentStartDate,
          endDate: currentEndDate,
          user: { ...userData, phone: cleanPhone }, // Use cleaned phone number
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
      setSubmitted(true);
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

  useEffect(() => {
    if (dates && dates.length === 2) {
      setCurrentStartDate(dates[0] || new Date());
      setCurrentEndDate(dates[1] || new Date());
      if (dates[0]) {
        setStartTime(dates[0].toISOString().substring(11, 16));
      }
      if (dates[1]) {
        setEndTime(dates[1].toISOString().substring(11, 16));
      }
    }
  }, [dates]);

  useEffect(() => {
    if (step1) {
      const [start, end] = dates;
      if (start && end) {
        setPercent(100);
      } else if (start || end) {
        setPercent(50);
      } else {
        setPercent(0);
      }
    }
  }, [dates, step1]);

  useEffect(() => {
    if (!step1) {
      setProgress(userData);
    }
  }, [step1, userData]);

  // Email input mask logic
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Make sure '@' stays in place and users can type before and after it
    if (value.indexOf('@') === -1 || value.length < userData.email.length) {
      // No @ found or backspace was pressed
      setUserData({ ...userData, email: value });
    } else {
      // The user is typing after '@'
      const [localPart, domainPart] = value.split('@');
      setUserData({ ...userData, email: `${localPart}@${domainPart || ''}` });
    }
  };

  return (
      <div className="cartCont">
        <CartSteps
          current={currentStep}
          percent={percent}
          error={false}
          onStepChange={handleStepChange}
        />
        <div className="cartWrap" style={{ width: step1 ? 'fit-content' : 'auto' }}>
          {step1 && (
            <>
              <Section4 />
              <button onClick={() => handleStepChange(1)}>Další</button>
            </>
          )}
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
                      type="text"
                      name="email"
                      value={userData.email}
                      onChange={handleEmailChange}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Telefon:
                    <InputMask
                      mask="999 999 999"
                      maskChar="_"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      required
                    >
                      {(inputProps: any) => (
                        <input
                          {...inputProps}
                          type="tel"
                        />
                      )}
                    </InputMask>
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
  );
};

export default Cart;
