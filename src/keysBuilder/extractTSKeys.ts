import { TSExtraction } from './TSExtraction';
import { initExtraction } from './initExtraction';
import * as find from 'find';
import { Config, ExtractionResult } from '../types';

export function extractTSKeys({ input, scopes, defaultValue, files }: Config): Promise<ExtractionResult> {
  let { src, keys, fileCount } = initExtraction(input);

  return new Promise(resolve => {
    if(files) {
      for(const file of files) {
        fileCount++;
        keys = TSExtraction({ file, defaultValue, scopes, keys });
      }
      resolve({ keys, fileCount });
    } else {
      find.eachfile(/\.ts$/, src, file => {
        if(file.endsWith('.spec.ts')) return;
        fileCount++;
        keys = TSExtraction({ file, defaultValue, scopes, keys });
      }).end(() => {
        resolve({ keys, fileCount });
      });
    }
  });
}
