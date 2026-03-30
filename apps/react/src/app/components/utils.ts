// Utility function for merging Tailwind CSS class names safely.
// Combines clsx (conditional class logic) with tailwind-merge (conflict resolution).
// Example: cn('px-4', condition && 'py-2', 'px-6') → 'py-2 px-6'
// tailwind-merge ensures later conflicting classes (px-6) override earlier ones (px-4).

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
