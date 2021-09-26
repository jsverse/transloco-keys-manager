import { sanitizeForRegex } from './string.utils';

export const regexFactoryMap = {
  ts: {
    comments: () => /\/\*\*[^]+?\*\//g,
  },
  template: {
    comments: () => /<!--[^]+?-->/g,
    validateComment: (marker) =>
      new RegExp(
        `<!--(\\s*${sanitizeForRegex(marker)}\\(([^)]+)\\)\\s*)+\\s*-->`
      ),
  },
  markerValues: (marker) =>
    new RegExp(`\\b${sanitizeForRegex(marker)}\\(([^)]+)\\)`, 'g'),
};
