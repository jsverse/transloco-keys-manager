import { readFile } from '../helpers/readFile';
import { regexs } from '../regexs';
import { regexIterator } from './regexIterator';
import { ExtractorConfig } from '../types';

export function TSExtraction({ file, scopes, defaultValue, keys }: ExtractorConfig) {
  const str = readFile(file);
  if(!str.includes('@ngneat/transloco')) return keys;

  const service = regexs.serviceInjection.exec(str);

  if(service) {
    /** service translationCalls regex */
    const rgx = regexs.translationCalls(service.groups.serviceName);
    keys = regexIterator({ rgx, keys, str, scopes, defaultValue });
  } else {
    const directTranslate = regexs.directImport.exec(str);
    if(directTranslate) {
      const rgx = regexs.translationCalls();
      keys = regexIterator({ rgx, keys, str, scopes, defaultValue });
    }
  }

  return keys;
}
