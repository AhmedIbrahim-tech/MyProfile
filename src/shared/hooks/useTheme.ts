import { useContext } from 'react';
import { ThemeContext, type Theme, type ThemeContextType } from '@/shared/providers/ThemeProvider';

export type { Theme, ThemeContextType };

/**
 * Hook to access the current theme and toggle function.
 * Must be used within a ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
