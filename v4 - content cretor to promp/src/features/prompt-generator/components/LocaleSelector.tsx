import React, { useEffect } from 'react';
import { CountryType, LanguageType } from '../types';
import { COUNTRIES, LANGUAGES, getDefaultLanguage } from '../constants/countries';

interface LocaleSelectorProps {
  selectedCountry: CountryType;
  selectedLanguage: LanguageType;
  onCountryChange: (country: CountryType) => void;
  onLanguageChange: (language: LanguageType) => void;
}

const LocaleSelector: React.FC<LocaleSelectorProps> = ({
  selectedCountry,
  selectedLanguage,
  onCountryChange,
  onLanguageChange
}) => {
  // Update language when country changes
  useEffect(() => {
    const defaultLanguage = getDefaultLanguage(selectedCountry);
    if (defaultLanguage !== selectedLanguage) {
      onLanguageChange(defaultLanguage);
    }
  }, [selectedCountry]);
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value as CountryType);
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value as LanguageType);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="countrySelect" className="block text-sm font-medium text-gray-700 mb-1">
          Target Country:
        </label>
        <select
          id="countrySelect"
          value={selectedCountry}
          onChange={handleCountryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {COUNTRIES.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select the primary country your content targets to improve localization
        </p>
      </div>
      
      <div>
        <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Content Language:
        </label>
        <select
          id="languageSelect"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          The default language is automatically set based on the selected country
        </p>
      </div>
    </div>
  );
};

export default LocaleSelector;