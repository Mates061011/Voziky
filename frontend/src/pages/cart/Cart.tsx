import React, { useState, useEffect } from 'react';
import './cart.css';
import CartSteps from '../../components/cart-steps/CartSteps';
import { useDateContext } from "../../context/DateContext";
import CartItems from '../../components/cart-items/CartItems';
import CartForm from '../../components/cart-form/CartForm';
import { useUserContext } from "../../context/userContext"; // Import User context
import Items from '../../components/item-container/Items';
import editIcon from "../../assets/edit2.png";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Alert } from 'antd'; // Import Alert component

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

  const { dates } = useDateContext(); // Get dates from context
  const { userData } = useUserContext(); // Get user data from context
  console.log("Cart Dates from context:", dates);

  const [step3, setStep3] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [percent, setPercent] = useState(0);
  const [step1, setStep1] = useState(true); // Default step1 is true
  const [step2, setStep2] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false); 
  const [missingFields, setMissingFields] = useState<string[]>([]); // To track missing fields
  const currentStartDate = dates[0] || new Date();
  const currentEndDate = dates[1] || new Date();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/", { state: { scrollTo: "section4" } });
  };

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

    // Scroll to the top of the page after DOM updates
    setTimeout(() => {
      document.querySelector('.App')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const setProgress = (data: UserData) => {
    const fieldsFilled = Object.values(data).filter((field) => field !== '').length;
    const totalFields = Object.keys(data).length;
    const progress = (fieldsFilled / totalFields) * 100;
    setPercent(progress);
  };

  const isFormComplete = () => {
    const missing: string[] = [];
    // Check for missing fields in user data
    if (!userData.name) missing.push('Jméno');
    if (!userData.surname) missing.push('Příjmení');
    if (!userData.email) missing.push('E-mail');
    if (!userData.phone) missing.push('Telefon');
    if (!checkboxChecked) missing.push('Souhlas s podmínkami');
    return missing;
  };

  const handleNextClick = () => {
    const missing = isFormComplete();
    setMissingFields(missing); // Update the missing fields state

    if (missing.length === 0) {
      handleStepChange(2); // Move to the next step
    } else {
      
    }
  };

  const handleNextClick2 = () => {
    handleStepChange(1); // Move to the next step
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setCheckboxChecked(e.target.checked); // Update checkbox state
  };

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
          <div className='cart-step1'>
            <div className="cart-step1-wrapper">
              <div className="flexRow">
                <p>
                  Termín: <strong>{`${currentStartDate.getDate()}. ${currentStartDate.getMonth() + 1}. - ${currentEndDate.getDate()}. ${currentEndDate.getMonth() + 1}.`}</strong>
                  <button className='editIcon' onClick={handleNavigate}><img src={editIcon} alt=""/></button>
                </p>
                
                <p>
                  Počet dní: <strong>{Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1)}</strong>
                </p>
              </div>
              <CartItems />
            </div>
            <div className="nadpis-cart">
                <h4>VÍC MOŽNOSTÍ</h4>
                <h3>Příslušenství</h3>
            </div>
            <Items/>
            <div className="step1-button-cont"><button onClick={handleNextClick2} className='cart-next-button'>Pokračovat</button></div>
          </div>
        )}
        {step2 && (
          <div className='cart-step2'>
            <CartForm />
            {missingFields.length > 0 && (
              <Alert
                message="Chybně zadané nebo chybející údaje"
                description={<ul>{missingFields.map((field, index) => <li key={index}>{field === 'checkbox' ? 'Checkbox agreement' : `${field}`}</li>)}</ul>}
                type="error"
                showIcon
                closable
              />
            )}
            <div className="cart-step2-button">
              <div className="flexRow">
                <Checkbox 
                  checked={checkboxChecked} 
                  onChange={handleCheckboxChange}
                  style={{ color: '#FF6832' }} 
                />
                <p>Pokračováním souhlasíte s pravidly zpracování <a href='#'>osobních údajů</a> a <a href='#'>obchodními podmínkami.</a></p>
              </div>
              <button onClick={handleNextClick}>Pokračovat</button>
            </div>
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
