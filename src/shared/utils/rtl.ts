/**
 * Checks whether a given string contains Arabic unicode characters.
 * Used for dynamic bidirectional (RTL) styling.
 */
export const containsArabic = (text: string): boolean => /[\u0600-\u06FF]/.test(text);
