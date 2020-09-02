import { Config, ExtractionResult, ExtractorConfig, ScopeMap } from '../types';
import { initExtraction } from './initExtraction';
import * as glob from 'glob';

export function extractKeys(
  { input, scopes, defaultValue, files, getTextMarker }: Config,
  fileType: 'ts' | 'html',
  extractor: (config: ExtractorConfig) => ScopeMap
): ExtractionResult {
  let { scopeToKeys } = initExtraction();

  const fileList = files || input.map(path => glob.sync(`${path}/**/*.${fileType}`)).flat();

  for (const file of fileList) {
    scopeToKeys = extractor({ file, defaultValue, scopes, scopeToKeys, getTextMarker });
  }

  return { scopeToKeys, fileCount: fileList.length };
}
