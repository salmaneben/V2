import React from 'react';

interface OptionsSelectorProps {
  options: {
    includeStructure: boolean;
    includeSEO: boolean;
    includeExamples: boolean;
  };
  onOptionChange: (option: string, value: boolean) => void;
}

interface OptionItem {
  id: string;
  label: string;
  description: string;
}

const OptionsSelector: React.FC<OptionsSelectorProps> = ({
  options,
  onOptionChange
}) => {
  // Define available options with descriptions
  const optionItems: OptionItem[] = [
    {
      id: 'includeStructure',
      label: 'Include content structure guidelines',
      description: 'Add detailed structure recommendations based on content type'
    },
    {
      id: 'includeSEO',
      label: 'Include SEO optimization instructions',
      description: 'Add search engine optimization guidelines based on selected level'
    },
    {
      id: 'includeExamples',
      label: 'Include examples in the prompt',
      description: 'Add example formats, openings, or structures for reference'
    }
  ];

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    onOptionChange(id, !options[id as keyof typeof options]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Additional Options:
      </label>
      
      <div className="space-y-3">
        {optionItems.map((item) => (
          <div 
            key={item.id}
            className="flex items-start border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleCheckboxChange(item.id)}
          >
            <div className="flex items-center h-5">
              <input
                id={item.id}
                type="checkbox"
                checked={options[item.id as keyof typeof options]}
                onChange={() => handleCheckboxChange(item.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={item.id} className="font-medium text-gray-700 cursor-pointer">
                {item.label}
              </label>
              <p className="text-gray-500 text-xs mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsSelector;