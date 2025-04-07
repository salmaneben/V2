// src/features/blog-content-generator/components/StepIndicator.tsx

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[]; // Make this optional with a default empty array
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [] // Provide a default empty array
}) => {
  // Function to determine if a step is clickable
  const isClickable = (stepNumber: number) => {
    // Only steps that are completed or the current step + 1 are clickable
    // This prevents jumping ahead more than one step
    return completedSteps.includes(stepNumber) || stepNumber === currentStep || stepNumber === currentStep - 1 || stepNumber === currentStep + 1;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = completedSteps.includes(stepNumber);
          const isClickableStep = onStepClick && isClickable(stepNumber);
          
          return (
            <div 
              key={stepNumber}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Step Line (except for the last step) */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-4 w-full h-0.5 ${
                    isCompleted ? 'bg-indigo-500' : 'bg-gray-200'
                  }`}
                  style={{ 
                    right: '-50%',
                    width: '100%',
                    zIndex: 0
                  }}
                />
              )}
              
              {/* Step Circle */}
              <div 
                onClick={() => isClickableStep && onStepClick(stepNumber)}
                className={`
                  relative z-10 flex items-center justify-center w-8 h-8 rounded-full 
                  ${isActive ? 'bg-indigo-600 text-white' : ''}
                  ${isCompleted ? 'bg-indigo-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200' : ''}
                  ${isClickableStep ? 'cursor-pointer hover:bg-indigo-700' : 'cursor-default'}
                  mb-2
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              {/* Step Label */}
              <span 
                className={`
                  text-xs text-center
                  ${isActive ? 'font-semibold text-indigo-600' : ''}
                  ${isCompleted ? 'font-medium text-indigo-500' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};