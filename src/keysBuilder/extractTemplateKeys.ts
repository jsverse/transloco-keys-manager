import { templateExtraction } from './templateExtraction';
import { initExtraction } from './initExtraction';
import * as find from 'find';
import { Config, ExtractionResult } from '../types';

export function extractTemplateKeys({ input, scopes, defaultValue, files }: Config): Promise<ExtractionResult> {
  let { src, keys, fileCount } = initExtraction(input);

  return new Promise(resolve => {
    if(files) {
      for(const file of files) {
        fileCount++;
        keys = templateExtraction({ file, defaultValue, scopes, keys });
      }
      resolve({ keys, fileCount });
    } else {
      find.eachfile(/\.html$/, src, file => {
        fileCount++;
        keys = templateExtraction({ file, defaultValue, scopes, keys });
      }).end(() => {
        resolve({ keys, fileCount });
      });
    }
  });
}
