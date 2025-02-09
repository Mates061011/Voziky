import React from 'react';
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
  const items: Step[] = [
    {
      title: 'Košík',
      description: ' ',
    },
    {
      title: 'Vyplň údaje',
      description: ' ',
    },
    {
      title: 'Rekapitulace',
      description: ' ',
    },
    {
      title: 'Potvrď v emailu',
      description: ' ',
    },
  ];

  // Add error status to the second step if necessary
  const stepsWithStatus: Step[] = items.map((item, index) => {
    if (error && index === 1) {
      return { ...item, status: 'error' }; // Add the error status to the step if needed
    }
    return item;
  });

  return (
    <>
      <Steps
        current={current}
        percent={percent}
        labelPlacement="vertical"
        items={stepsWithStatus}
        onChange={onStepChange}
      />
    </> 
  );
};

export default CartSteps;
