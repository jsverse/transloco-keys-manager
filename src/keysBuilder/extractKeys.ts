import { Config, ExtractionResult, ExtractorConfig, ScopeMap } from '../types';
import { initExtraction } from './initExtraction';
import * as glob from 'glob';

export function extractKeys(
  { input, scopes, defaultValue, files }: Config,
  fileType: 'ts' | 'html',
  extractor: (config: ExtractorConfig) => ScopeMap
): ExtractionResult {
  let { scopeToKeys } = initExtraction();

  const fileList = files || glob.sync(`${process.cwd()}/${input}/**/*.${fileType}`);

  for (const file of fileList) {
    scopeToKeys = extractor({ file, defaultValue, scopes, scopeToKeys });
  }

  return { scopeToKeys, fileCount: fileList.length };
}
