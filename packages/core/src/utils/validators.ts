export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateField(
  value: string,
  rules: ValidationRule
): ValidationResult {
  const errors: string[] = [];

  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push('This field is required');
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  if (value && rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push('Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const commonValidators = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Must contain @ symbol';
      return true;
    },
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    minLength: 10,
  },
  url: {
    pattern: /^https?:\/\/.+/,
  },
};
