import { ExtractionResult } from '../types';

export function initExtraction(): ExtractionResult {
  return { scopeToKeys: { __global: {} }, defaults: [] };
}