/**
 * Generates URL-friendly slug from text, handling Arabic, Unicode letters/numbers, and Latin chars.
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}
