import React from 'react';

interface ChainOfThoughtSelectorProps {
  enabled: boolean;
  steps: number;
  onChange: (enabled: boolean, steps: number) => void;
}

const ChainOfThoughtSelector: React.FC<ChainOfThoughtSelectorProps> = ({
  enabled,
  steps,
  onChange
}) => {
  const handleToggle = () => {
    onChange(!enabled, steps);
  };

  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSteps = parseInt(e.target.value, 10);
    if (!isNaN(newSteps) && newSteps >= 2 && newSteps <= 6) {
      onChange(enabled, newSteps);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          Enable Chain-of-Thought
          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">ADVANCED</span>
        </label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id="chain-of-thought-toggle"
            checked={enabled}
            onChange={handleToggle}
            className="sr-only"
          />
          <label
            htmlFor="chain-of-thought-toggle"
            className={`
              block overflow-hidden h-6 rounded-full cursor-pointer
              ${enabled ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                ${enabled ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </label>
        </div>
      </div>
      
      {enabled && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Reasoning Steps: {steps}
          </label>
          <input
            type="range"
            min="2"
            max="6"
            step="1"
            value={steps}
            onChange={handleStepsChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Simple (2)</span>
            <span>Balanced (4)</span>
            <span>Complex (6)</span>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
            <p className="font-medium mb-1">What is Chain-of-Thought?</p>
            <p>Chain-of-Thought prompting guides AI to break down complex reasoning into explicit steps, resulting in more accurate, logical, and thorough content. It's particularly effective for:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Complex topic explanations</li>
              <li>Step-by-step tutorials</li>
              <li>Advanced analytical content</li>
              <li>Problem-solving scenarios</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChainOfThoughtSelector;