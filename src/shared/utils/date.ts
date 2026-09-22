/**
 * Formats a date string using standard long format (e.g., "September 21, 2026").
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(
    'en-US',
    options ?? {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
}

/**
 * Formats a date string using short format (e.g., "Sep 2026").
 */
export function formatShortDate(dateString: string): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
