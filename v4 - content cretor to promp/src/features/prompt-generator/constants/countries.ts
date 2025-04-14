import { CountryType, LanguageType } from '../../article-generator/types';

/**
 * List of countries for content localization
 */
export const COUNTRIES: { value: CountryType; label: string }[] = [
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Japan', label: 'Japan' },
  { value: 'India', label: 'India' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'China', label: 'China' },
  { value: 'Russia', label: 'Russia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Other', label: 'Other (Global)' }
];

/**
 * List of languages for content
 */
export const LANGUAGES: { value: LanguageType; label: string }[] = [
  { value: 'English (US)', label: 'English (US)' },
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Other', label: 'Other' }
];

/**
 * Default language for each country
 */
export const DEFAULT_LANGUAGE_BY_COUNTRY: Record<CountryType, LanguageType> = {
  'United States': 'English (US)',
  'United Kingdom': 'English (UK)',
  'Canada': 'English (US)',
  'Australia': 'English (UK)',
  'Germany': 'German',
  'France': 'French',
  'Spain': 'Spanish',
  'Italy': 'Italian',
  'Japan': 'Japanese',
  'India': 'English (UK)',
  'Brazil': 'Portuguese',
  'Mexico': 'Spanish',
  'China': 'Chinese',
  'Russia': 'Russian',
  'South Africa': 'English (UK)',
  'Other': 'English (US)'
};

/**
 * Get the default language for a country
 * @param country Country identifier
 * @returns Default language for the country
 */
export const getDefaultLanguage = (country: CountryType): LanguageType => {
  return DEFAULT_LANGUAGE_BY_COUNTRY[country] || 'English (US)';
};