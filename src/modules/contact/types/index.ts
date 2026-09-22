export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  customSubject: string;
  message: string;
}

export type ContactSubmissionStatus = 'idle' | 'success' | 'error' | 'sending';

export interface SendEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  toEmail: string;
}
