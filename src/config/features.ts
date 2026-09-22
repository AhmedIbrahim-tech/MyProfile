import { sectionConfig } from '@/data/sectionConfig';

export interface AppFeatures {
  hero: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  blog: boolean;
  contact: boolean;
}

/**
 * Application feature flags.
 * Preserves existing section configuration behavior without breaking changes.
 */
export const features: AppFeatures = {
  ...sectionConfig,
};

export { sectionConfig };
