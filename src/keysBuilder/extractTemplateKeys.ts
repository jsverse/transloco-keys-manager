import { templateExtractor } from './templateExtractor';
import { Config, ExtractionResult } from '../types';
import { extractKeys } from './extractKeys';

export function extractTemplateKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'html', templateExtractor);
}
