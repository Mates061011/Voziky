import React, { useEffect, useState } from 'react';
import { Steps } from 'antd';

interface Step {
  title: string;
  description: string;
  status?: 'error' | 'wait' | 'process' | 'finish';
}

interface CartStepsProps {
  current: number;
  percent: number;
  error: boolean;
  onStepChange: (currentStep: number) => void;
}

const CartSteps: React.FC<CartStepsProps> = ({ current, percent, error, onStepChange }) => {
  const [screenSize, setScreenSize] = useState<'small' | 'default'>('default');

  const items: Step[] = [
    {
      title: 'Košík',
      description: ' ',
    },
    {
      title: 'Osobní údaje',
      description: ' ',
    },
    {
      title: 'Rekapitulace',
      description: ' ',
    }
  ];

  // Add error status to the second step if necessary
  const stepsWithStatus: Step[] = items.map((item, index) => {
    if (error && index === 1) {
      return { ...item, status: 'error' }; // Add the error status to the step if needed
    }
    return item;
  });

  // Update screen size state when the window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setScreenSize('small');
      } else {
        setScreenSize('default');
      }
    };

    handleResize(); // Check the initial screen size
    window.addEventListener('resize', handleResize); // Listen for resize events

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Steps
      current={current}
      percent={percent}
      labelPlacement="vertical"
      items={stepsWithStatus}
      onChange={onStepChange}
      responsive={false}
      size={screenSize}
    />
  );
};

export default CartSteps;
