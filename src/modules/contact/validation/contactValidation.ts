import type { ContactFormData } from '@/modules/contact/types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates the contact form fields.
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  if (!data.name.trim()) {
    return { isValid: false, errorMessage: 'Please enter your full name.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim() || !emailRegex.test(data.email.trim())) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

  if (data.subject === 'Other' && !data.customSubject.trim()) {
    return { isValid: false, errorMessage: 'Please enter a custom subject.' };
  }

  if (!data.message.trim()) {
    return { isValid: false, errorMessage: 'Please enter your message.' };
  }

  return { isValid: true };
}
