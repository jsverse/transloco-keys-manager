import { Config, ExtractionResult } from '../types';

import { TSExtractor } from './TSExtractor';
import { extractKeys } from './extractKeys';

export function extractTSKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'ts', TSExtractor);
}
