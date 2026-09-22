import { useState, useEffect } from 'react';
import { profileData } from '@/data/profileData';
import Loading from '@/shared/components/feedback/Loading';
import { emailService } from '@/modules/contact/services/emailService';
import { validateContactForm } from '@/modules/contact/validation/contactValidation';
import type { ContactFormData, ContactSubmissionStatus } from '@/modules/contact/types';
import {
  EmailIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  WhatsAppIcon,
  SendIcon,
} from '@/shared/components/icons';
import '@/assets/styles/components/Contact.css';

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General',
    customSubject: '',
    message: '',
  });

  const [status, setStatus] = useState<ContactSubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [emailCopied, setEmailCopied] = useState(false);

  // Initialize EmailJS via service on mount
  useEffect(() => {
    emailService.init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      await emailService.sendEmail({
        name: formData.name,
        email: formData.email,
        subject: formData.subject === 'Other' ? formData.customSubject : formData.subject,
        message: formData.message,
        toEmail: profileData.email,
      });

      setStatus('success');

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: 'General',
          customSubject: '',
          message: '',
        });
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Email sending failed:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Clear custom subject if switching away from "Other"
    if (e.target.name === 'subject' && e.target.value !== 'Other') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        customSubject: '',
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General',
      customSubject: '',
      message: '',
    });
    setStatus('idle');
    setErrorMessage('');
  };

  const handleCopyEmail = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      await navigator.clipboard.writeText(profileData.email);
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Contact Me</h1>
          <p className="contact-subtitle">
            Have a question or want to work together? Send a message and I’ll get back to you.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>You can also email me directly:</p>
            <div className="contact-email-wrapper">
              <a
                href={`mailto:${profileData.email}`}
                className="contact-email"
                onClick={handleCopyEmail}
                title="Click to copy email"
              >
                <EmailIcon />
                {profileData.email}
              </a>
              <button
                className={`btn-copy-email ${emailCopied ? 'copied' : ''}`}
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                aria-label="Copy email"
              >
                <CopyIcon />
              </button>
              {emailCopied && <span className="copy-feedback">Copied!</span>}
            </div>

            <div className="contact-social">
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href={profileData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={profileData.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject*</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="General">General</option>
                <option value="Project Inquiry">Project Inquiry</option>
                <option value="Job Opportunity">Job Opportunity</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.subject === 'Other' && (
              <div className="form-group custom-subject-group">
                <label htmlFor="customSubject">Custom Subject*</label>
                <input
                  type="text"
                  id="customSubject"
                  name="customSubject"
                  placeholder="Enter your custom subject"
                  value={formData.customSubject}
                  onChange={handleChange}
                  required={formData.subject === 'Other'}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Message*</label>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {status === 'success' && (
              <div className="form-message success">
                Message sent successfully! Thank you for reaching out.
              </div>
            )}

            {status === 'error' && (
              <div className="form-message error">
                {errorMessage ||
                  (formData.subject === 'Other' && !formData.customSubject.trim()
                    ? 'Please enter a custom subject.'
                    : 'Something went wrong. Please try again.')}
              </div>
            )}

            {status === 'sending' && (
              <div className="form-message sending">
                <Loading message="Sending your message..." size="sm" />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn-reset"
                disabled={status === 'sending'}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={status === 'sending'}
              >
                <SendIcon />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
