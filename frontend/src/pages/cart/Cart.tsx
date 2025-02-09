import React, { useState, useEffect } from 'react';
import './cart.css';
import CartSteps from '../../components/cart-steps/CartSteps';
import { useDateContext } from "../../context/DateContext";
import CartItems from '../../components/cart-items/CartItems';
import CartForm from '../../components/cart-form/CartForm';
import { useUserContext } from "../../context/userContext"; // Import User context

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

  const { dates, setDates } = useDateContext(); // Get dates from context
  const { userData, setUserData } = useUserContext(); // Get user data from context
  console.log("Cart Dates from context:", dates);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step3, setStep3] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [percent, setPercent] = useState(0);
  const [step1, setStep1] = useState(true); // Default step1 is true
  const [step2, setStep2] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [currentStartDate, setCurrentStartDate] = useState<Date>(dates[0] || new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(dates[1] || new Date());

  const [startTime, setStartTime] = useState<string>(currentStartDate.toISOString().substring(11, 16));
  const [endTime, setEndTime] = useState<string>(currentEndDate.toISOString().substring(11, 16));

  const handleStepChange = (currentStep: number) => {
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

    // Save the current step to localStorage
    localStorage.setItem('currentStep', currentStep.toString());
  };

  const setProgress = (data: UserData) => {
    const fieldsFilled = Object.values(data).filter((field) => field !== '').length;
    const totalFields = Object.keys(data).length;
    const progress = (fieldsFilled / totalFields) * 100;
    setPercent(progress);
  };

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
  
      // After successful submission, move to the next step
      setStep2(false); // Hide step 2
      setStep3(true);  // Show step 3
      setCurrentStep(2);  // Update the current step to 2
  
      setSubmitted(true);
      setDates([undefined, undefined]); // Reset dates after submission
  
      handleStepChange(2); // This changes the step to 2
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
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      const step = parseInt(savedStep, 10);
      handleStepChange(step); // Set the saved step
    }
  }, []);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.indexOf('@') === -1 || value.length < userData.email.length) {
      setUserData({ ...userData, email: value });
    } else {
      const [localPart, domainPart] = value.split('@');
      setUserData({ ...userData, email: `${localPart}@${domainPart || ''}` });
    }
  };

  const isFormComplete = () => {
    // Check if all user data fields are filled
    return userData.name && userData.surname && userData.email && userData.phone;
  };

  const handleNextClick = () => {
    // Only move to the next step if the form is complete
    if (isFormComplete()) {
      handleStepChange(2); // Move to the next step
    } else {
      alert('Please fill in all the required fields.');
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
          <div className='cart-step2'>
            <div className="flexRow">
              <p>
                Termín: <strong>{`${currentStartDate.getDate()}. ${currentStartDate.getMonth() + 1}. - ${currentEndDate.getDate()}. ${currentEndDate.getMonth() + 1}.`}</strong>
              </p>
              <p>
                Počet dní: <strong>{Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1)}</strong>
              </p>
            </div>
            <CartItems />
          </div>
        )}
        {step2 && (
          <div>
            <CartForm />
            <button onClick={handleNextClick}>Další</button>
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
