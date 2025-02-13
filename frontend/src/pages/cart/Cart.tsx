import React, { useState, useEffect, useRef } from 'react';
import './cart.css';
import CartSteps from '../../components/cart/cart-steps/CartSteps';
import { useDateContext } from "../../context/DateContext";
import CartItems from '../../components/cart/cart-items/CartItems';
import CartForm from '../../components/cart/cart-form/CartForm';
import { useUserContext } from "../../context/userContext"; // Import User context
import Items from '../../components/item-container/Items';
import editIcon from "../../assets/edit.svg";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Alert } from 'antd'; // Import Alert component
import CartInfo from '../../components/cart/cart-info/CartInfo';
import CartCheckout from '../../components/cart/cart-checkout/CartCheckout';
import Calendar from '../../components/calendar/Calendar';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: number;
}

const Cart: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const { dates } = useDateContext(); // Get dates from context
  const { userData } = useUserContext(); // Get user data from context
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
  const [showCartContent, setShowCartContent] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const handleNavigate = () => {
    navigate("/", { state: { scrollTo: "section4" } });
  };

  const handleStepChange = (currentStep: number) => {
    // Check for missing data when transitioning to step3 (step 2)
    if (currentStep === 2) {
  
      // If dates or user data are missing, prevent transition to step 3
      if (!isStep3Clickable()) {
        return; // Prevent transition to step 3
      }      
    }
  
    // If no issues, proceed to change the current step
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
  const isUserDataComplete = () => {
    return userData.name && userData.surname && userData.email && userData.phone;
  };

  const isDatesComplete = () => {
    return dates[0] && dates[1]; // Check if both start and end dates are set
  };

  // Disable the "next" button in step 2 if required data is missing
  const isStep3Clickable = () => {
    return isUserDataComplete() && isDatesComplete();
  };
  const handleStepTransition = (direction: "next" | "previous") => {
    let newStep = currentStep;
    console.log(newStep)
    // Check for missing fields before moving to step 3
    if (direction === "next") {
      if(currentStep === 0) {
        newStep = Math.min(currentStep + 1, 2);
        handleStepChange(newStep);
        return;
      }
  
      if (!isStep3Clickable()) {
        // If dates or user data are missing, prevent moving to step 3
        alert('Please fill in all required fields before proceeding to step 3.');
        return; // Exit early without changing step
      }
    }
  
    // Move to the next step
    if (direction === "next") {
      newStep = Math.min(currentStep + 1, 2); // Ensure you don't exceed the last step
    } else if (direction === "previous") {
      newStep = Math.max(currentStep - 1, 0); // Ensure you don't go below the first step
    }
  
    handleStepChange(newStep); // Update the current step
  };
  
  const handleNextClickForm = () => {
    const missing = isFormComplete();
    setMissingFields(missing); // Update the missing fields state
  
    if (missing.length === 0) {
      handleStepTransition("next"); // Move to the next step if form is complete
    } else {
      // Handle missing fields error (optional)
    }
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
  const handleOrderSuccess = (message: string) => {
    if (message) {
      // Remove everything before and including the first colon
      const errorMessage = message.replace(/^[^:]+:\s*/, '').trim();
      setApiMessage(errorMessage);
    } else if (message = "Order placed successfully!") {
      setShowCartContent(false);
    }
  };
  
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  const handleNavigate2 = () => {
    if (isCooldownActive) return; // Prevent opening if cooldown is active
    setIsDialogOpen((prev) => !prev); // Toggle dialog visibility

    if (!isDialogOpen) {
      setIsCooldownActive(true); // Activate cooldown when opening
      setTimeout(() => {
        setIsCooldownActive(false); // Reset cooldown after 3 seconds
      }, 1500); // Set cooldown time (e.g., 3 seconds)
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsDialogOpen(false);
      }
    };

    if (isDialogOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDialogOpen]);
  return (
    <div className="cartCont">
      {showCartContent ? (
        <>
          <CartSteps
            current={currentStep}
            percent={percent}
            error={false}
            onStepChange={handleStepChange}
          />
          <div className="cartWrap" style={{ width: step1 ? 'fit-content' : 'auto' }}>
            {step1 && (
              <div className="cart-step cart-step1">
                <div className="cart-step1-wrapper">
                  <div className="flexRow">
                    <p>
                      Termín: &nbsp; <strong>{`${currentStartDate.getDate()}. ${currentStartDate.getMonth() + 1}. - ${currentEndDate.getDate()}. ${currentEndDate.getMonth() + 1}.`}</strong>
                      <button className="editIcon" onClick={handleNavigate2}><img src={editIcon} alt="" /></button>
                      {isDialogOpen && (
                        <div ref={popupRef} className="popup-calendar">
                          <Calendar showPopisky={false} />
                        </div>
                      )}
                    </p>
                    <p>
                      Počet dní: &nbsp; <strong>{Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1)}</strong>
                    </p>
                  </div>
                  <CartItems showKauce={false} showCloseButton={true} />
                </div>
                <div className="step1-button-cont">
                  <button onClick={handleNavigate} className='cart-previous-button'>Zpět</button>
                  <button onClick={() => handleStepTransition("next")} className="cart-next-button">Pokračovat</button>
                </div>
                <div className="nadpis-cart">
                  <h4>VÍC MOŽNOSTÍ</h4>
                  <h3>Příslušenství</h3>
                </div>
                <Items type='standard'/>
              </div>
            )}
            {step2 && (
              <div className="cart-step cart-step2">
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
                    <p>Pokračováním souhlasíte s pravidly zpracování <a href="#">osobních údajů</a> a <a href="#">obchodními podmínkami.</a></p>
                  </div>
                  <div className="step-button-cont">
                    <button onClick={() => handleStepTransition("previous")} className="cart-previous-button">Zpět</button>
                    <button onClick={handleNextClickForm} className="cart-next-button">Pokračovat</button>
                  </div>
                </div>
              </div>
            )}
            {step3 && (
              <div className="cart-step cart-step3">
                <CartInfo />
                <div className="flexRow cart-termin">
                  <p>
                    Termín: <strong>{`${currentStartDate.getDate()}. ${currentStartDate.getMonth() + 1}. - ${currentEndDate.getDate()}. ${currentEndDate.getMonth() + 1}.`}</strong>
                  </p>
                  <p>
                    Počet dní: <strong>{Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24) + 1)}</strong>
                  </p>
                </div>
                <CartItems showKauce={true} showCloseButton={false} />
                <p>Podmínkou pro zapůjčení rezervovaného zboží je složení vratné kauce (v hotovosti při převzetí) a předložení dvou dokladů totožnosti (např. občanský průkaz + cestovní pas/řidičský průkaz.)</p>
                {apiMessage.length > 0 && (
                  <Alert
                    message={apiMessage}
                    type="error"
                    showIcon
                  />
                )}
                <div className="step3-button-cont step1-button-cont">
                  <button onClick={() => handleStepTransition("previous")} className="cart-previous-button">Zpět</button>
                  <CartCheckout onOrderSuccess={handleOrderSuccess} />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="order-success">
          <h2>Objednávka byla úspěšně dokončena!</h2>
          <p>Děkujeme za vaši objednávku. Zkontrolujte si emailovou schránku.</p>
          <button onClick={handleBackToHome}>Zpět na hlavní stránku</button>
        </div>
      )}
    </div>
  );

};

export default Cart;
