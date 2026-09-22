import emailjs from '@emailjs/browser';
import { env } from '@/config/env';
import type { SendEmailPayload } from '@/modules/contact/types';

/**
 * Service that encapsulates EmailJS SDK integration.
 * Prevents UI components from having direct dependencies on external messaging SDKs.
 */
export const emailService = {
  /**
   * Initializes EmailJS with public key.
   */
  init: (): void => {
    if (env.emailJs.publicKey) {
      emailjs.init(env.emailJs.publicKey);
    }
  },

  /**
   * Sends an email message through EmailJS.
   */
  sendEmail: async (payload: SendEmailPayload): Promise<void> => {
    const { serviceId, templateId, publicKey, isConfigured } = env.emailJs;

    if (!isConfigured) {
      throw new Error('EmailJS configuration is missing. Please check your .env file.');
    }

    const templateParams = {
      from_name: payload.name,
      from_email: payload.email,
      subject: payload.subject,
      message: payload.message,
      to_email: payload.toEmail,
    };

    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });
  },
};
