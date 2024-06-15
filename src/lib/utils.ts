import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A function that normalizes a path by removing leading slashes.
 *
 * @param {string} path - The path to be normalized.
 * @return {string} The normalized path.
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};
