import { TSExtraction } from './TSExtraction';
import { Config, ExtractionResult } from '../types';
import { extractKeys } from './extractKeys';

export function extractTSKeys(config: Config): Promise<ExtractionResult> {
  return extractKeys(config, 'ts', TSExtraction);
}
