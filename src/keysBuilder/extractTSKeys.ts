import { TSExtractor } from './TSExtractor';
import { Config, ExtractionResult } from '../types';
import { extractKeys } from './extractKeys';

export function extractTSKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'ts', TSExtractor);
}
