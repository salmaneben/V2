// src/features/blog-content-generator/components/StepIndicator.tsx

import React from 'react';
import { 
  Type, 
  FileText, 
  Sliders, // Changed from ListOrdered to Sliders
  Edit, 
  Utensils, 
  Code,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isRecipe: boolean;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  isRecipe,
  onStepClick,
  completedSteps 
}) => {
  // Define step icons and titles - Updated for Content Settings
  const steps = [
    { title: 'Meta Title', icon: Type, color: 'bg-amber-100 text-amber-600' },
    { title: 'Meta Description', icon: FileText, color: 'bg-orange-100 text-orange-600' },
    { title: 'Content Settings', icon: Sliders, color: 'bg-blue-100 text-blue-600' }, // Changed from Outline
    { title: isRecipe ? 'Recipe Content' : 'Blog Content', icon: isRecipe ? Utensils : Edit, color: isRecipe ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600' },
    ...(isRecipe ? [{ title: 'Schema Markup', icon: Code, color: 'bg-purple-100 text-purple-600' }] : [])
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      {steps.slice(0, totalSteps).map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === index;
        const isCompleted = completedSteps.includes(index);
        const isClickable = isCompleted || index < currentStep;
        
        return (
          <div 
            key={index}
            className={cn(
              "flex items-center gap-2 py-2 px-3 rounded-md flex-1 justify-center",
              isClickable ? "cursor-pointer" : "cursor-default",
              isActive ? "bg-gray-100 border border-gray-300" : "",
              isCompleted ? "text-gray-700" : "text-gray-500"
            )}
            onClick={() => isClickable && onStepClick && onStepClick(index)}
          >
            <div className={cn(
              "p-2 rounded-full",
              isActive ? step.color : (isCompleted ? "bg-green-100" : "bg-gray-100")
            )}>
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <StepIcon className={cn(
                  "h-5 w-5",
                  isActive ? step.color.split(' ')[1] : "text-gray-500"
                )} />
              )}
            </div>
            <span className={cn(
              "text-sm font-medium whitespace-nowrap sm:inline hidden",
              isActive ? "text-gray-800" : (isCompleted ? "text-gray-700" : "text-gray-500")
            )}>
              {step.title}
            </span>
            <span className="inline sm:hidden text-sm font-medium">
              {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};