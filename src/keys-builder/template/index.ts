import { Config, ExtractionResult, ExtractorConfig } from '../../types';
import { readFile } from '../../utils/file.utils';
import { extractKeys } from '../utils/extract-keys';

import { templateCommentsExtractor } from './comments.extractor';
import { directiveExtractor } from './directive.extractor';
import { pipeExtractor } from './pipe.extractor';
import { structuralDirectiveExtractor } from './structural-directive.extractor';

export function extractTemplateKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'html', templateExtractor);
}

function templateExtractor(config: ExtractorConfig) {
  const { file, scopeToKeys } = config;
  let content = readFile(file);
  if (!content.includes('transloco')) return scopeToKeys;

  const resolvedConfig = { ...config, content };
  pipeExtractor(resolvedConfig);
  templateCommentsExtractor(resolvedConfig);
  directiveExtractor(resolvedConfig);
  structuralDirectiveExtractor(resolvedConfig);

  return scopeToKeys;
}
