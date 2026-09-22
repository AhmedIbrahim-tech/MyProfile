interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  isConfigured: boolean;
}

interface EnvConfig {
  emailJs: EmailJsConfig;
}

/**
 * Validated and typed environment configuration.
 * Reads existing Vite environment variables.
 */
export const env: EnvConfig = {
  emailJs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
    isConfigured: Boolean(
      import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ),
  },
};
