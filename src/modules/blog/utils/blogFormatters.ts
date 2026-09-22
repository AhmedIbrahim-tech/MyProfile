/**
 * Checks if the text contains Arabic characters.
 */
export const containsArabic = (text: string): boolean => /[\u0600-\u06FF]/.test(text);

/**
 * Formats date string into human-readable format.
 */
export function formatBlogDate(
  dateString: string,
  variant: 'short' | 'long' = 'short',
  locale = 'en-US'
): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: variant === 'short' ? 'short' : 'long',
    day: 'numeric',
  });
}

/**
 * Generates placeholder fallback image URL for blog posts.
 */
export function getBlogPlaceholderImage(title: string): string {
  return (
    'https://via.placeholder.com/800x400/1e293b/94a3b8?text=' +
    encodeURIComponent(title.substring(0, 30))
  );
}
