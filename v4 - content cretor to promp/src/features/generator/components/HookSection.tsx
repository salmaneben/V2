import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '../types';
import { hookTypes } from '../constants/hookTypes';

interface HookSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onHookTypeChange: (hookType: string) => void;
}

export const HookSection: React.FC<HookSectionProps> = ({
  formData,
  onInputChange,
  onHookTypeChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Introductory Hook Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {hookTypes.map((hook) => (
            <button
              key={hook.type}
              type="button"
              onClick={() => onHookTypeChange(hook.type)}
              className={`p-2 rounded-md text-sm transition-colors ${
                formData.hookType === hook.type
                  ? 'bg-blue-100 border-blue-500 border-2 text-blue-700'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {hook.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Hook Brief *
        </label>
        <div className="relative">
          <Textarea
            placeholder={hookTypes.find((hook) => hook.type === formData.hookType)?.placeholder}
            value={formData.hookBrief}
            onChange={(e) => onInputChange('hookBrief', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500 pr-16"
            maxLength={300}
            required
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-400">
            {formData.hookBrief.length}/300
          </div>
        </div>
      </div>
    </div>
  );
};