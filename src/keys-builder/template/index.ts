import {
  Config,
  DefaultLanguageValue,
  ExtractionResult,
  ScopeMap,
} from '../../types';
import { readFile } from '../../utils/file.utils';
import { extractKeys } from '../utils/extract-keys';
import { TemplateExtractorConfig } from './types';
import { templateCommentsExtractor } from './comments.extractor';
import { directiveExtractor } from './directive.extractor';
import { pipeExtractor } from './pipe.extractor';
import { structuralDirectiveExtractor } from './structural-directive.extractor';

export function extractTemplateKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'html', templateExtractor);
}

export function templateExtractor(config: TemplateExtractorConfig): {
  scopeMap: ScopeMap;
  defaults: DefaultLanguageValue[];
} {
  const { file, scopeToKeys } = config;
  const defaults: DefaultLanguageValue[] = [];
  let content = config.content || readFile(file);
  if (!content.includes('transloco')) {
    return { scopeMap: scopeToKeys, defaults: defaults };
  }

  const resolvedConfig = { ...config, content };
  pipeExtractor(resolvedConfig);
  templateCommentsExtractor(resolvedConfig);
  directiveExtractor(resolvedConfig);
  structuralDirectiveExtractor(resolvedConfig);

  return { scopeMap: scopeToKeys, defaults: defaults };
}
