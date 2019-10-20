import { Config, ExtractionResult, ExtractorConfig, ScopeMap } from '../types';
import { initExtraction } from './initExtraction';
import * as glob from 'glob';

export function extractKeys(
  { input, scopes, defaultValue, files }: Config,
  fileType: 'ts' | 'html',
  extractor: (config: ExtractorConfig) => ScopeMap
): ExtractionResult {
  let { src, scopeToKeys, fileCount } = initExtraction(input);

  const fileList = files || glob.sync(`${src}/**/*.${fileType}`);

  for (const file of fileList) {
    fileCount++;
    scopeToKeys = extractor({ file, defaultValue, scopes, scopeToKeys });
  }

  return { scopeToKeys, fileCount };
}
