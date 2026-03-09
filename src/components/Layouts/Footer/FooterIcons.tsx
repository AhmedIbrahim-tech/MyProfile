import type { SVGProps } from 'react';

/** Brand logo mark for the footer. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="16" cy="16" r="16" fill="#7C3AED" />
      <path d="M12 10L20 16L12 22V10Z" fill="white" />
    </svg>
  );
}
