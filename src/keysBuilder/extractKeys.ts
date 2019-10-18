import { Config, ExtractionResult } from '../types';
import { initExtraction } from './initExtraction';
import * as glob from 'glob';

export function extractKeys(
  { input, scopes, defaultValue, files: specificFiles }: Config,
  fileType: 'ts' | 'html',
  extractor
): Promise<ExtractionResult> {
  let { src, scopeToKeys, fileCount } = initExtraction(input);

  return new Promise(resolve => {
    const files = specificFiles || glob.sync(`${src}/**/*.${fileType}`);
    for (const file of files) {
      fileCount++;
      scopeToKeys = extractor({ file, defaultValue, scopes, scopeToKeys });
    }
    resolve({ scopeToKeys, fileCount });
  });
}
