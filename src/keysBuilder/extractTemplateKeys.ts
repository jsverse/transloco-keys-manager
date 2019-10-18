import { templateExtraction } from './templateExtraction';
import { Config, ExtractionResult } from '../types';
import {extractKeys} from "./extractKeys";

export function extractTemplateKeys(config: Config): Promise<ExtractionResult> {
  return extractKeys(config, 'html', templateExtraction);
}
