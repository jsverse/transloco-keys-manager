import { Config, ExtractionResult } from '../types';

import { extractKeys } from './extractKeys';
import { templateExtractor } from './templateExtractor';

export function extractTemplateKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'html', templateExtractor);
}
