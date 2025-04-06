import React from 'react';
import { FormData } from '../types';

interface LanguageAndSizeSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  sidebarState?: string;
}

export const LanguageAndSizeSection: React.FC<LanguageAndSizeSectionProps> = ({
  formData,
  onInputChange,
  sidebarState = 'collapsed'
}) => {
  return (
    <div className={`
      grid gap-6
      ${sidebarState === 'expanded' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}
      transition-all duration-300
    `}>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Language *
        </label>
        <select
          value={formData.language}
          onChange={(e) => onInputChange('language', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <optgroup label="Popular Languages">
            <option value="English (US)">English (US) 🇺🇸</option>
            <option value="English (UK)">English (UK) 🇬🇧</option>
            <option value="Spanish">Spanish (Español) 🇪🇸</option>
            <option value="Mandarin">Mandarin (中文) 🇨🇳</option>
            <option value="Hindi">Hindi (हिन्दी) 🇮🇳</option>
            <option value="Arabic">Arabic (العربية) 🇦🇪</option>
            <option value="French">French (Français) 🇫🇷</option>
            <option value="Russian">Russian (Русский) 🇷🇺</option>
            <option value="Portuguese">Portuguese (Português) 🇵🇹</option>
            <option value="Japanese">Japanese (日本語) 🇯🇵</option>
          </optgroup>
          <optgroup label="Additional Languages">
            <option value="German">German (Deutsch) 🇩🇪</option>
            <option value="Italian">Italian (Italiano) 🇮🇹</option>
            <option value="Korean">Korean (한국어) 🇰🇷</option>
            <option value="Turkish">Turkish (Türkçe) 🇹🇷</option>
            <option value="Vietnamese">Vietnamese (Tiếng Việt) 🇻🇳</option>
          </optgroup>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Article Size *
        </label>
        <select
          value={formData.wordCount}
          onChange={(e) => onInputChange('wordCount', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="mini">
            Mini Article (800-1200 words, 3-4 H2 sections)
          </option>
          <option value="small">
            Short Article (1200-2000 words, 4-6 H2 sections)
          </option>
          <option value="medium">
            Standard Article (2000-3000 words, 6-8 H2 sections)
          </option>
          <option value="large">
            Long Article (3000-4000 words, 8-10 H2 sections)
          </option>
          <option value="xlarge">
            Pillar Content (4000+ words, 10+ H2 sections)
          </option>
        </select>
      </div>
    </div>
  );
};