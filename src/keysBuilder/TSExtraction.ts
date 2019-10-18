import { readFile } from '../helpers/readFile';
import { regexs } from '../regexs';
import { regexIterator } from './regexIterator';
import { ExtractorConfig } from '../types';

export function TSExtraction({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig) {
  const str = readFile(file);
  if (!str.includes('@ngneat/transloco')) return scopeToKeys;

  const service = regexs.serviceInjection.exec(str);

  if (service) {
    /** service translationCalls regex */
    const rgx = regexs.translationCalls(service.groups.serviceName);
    scopeToKeys = regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue });
  } else {
    const directTranslate = regexs.directImport.exec(str);
    if (directTranslate) {
      const rgx = regexs.translationCalls();
      scopeToKeys = regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue });
    }
  }

  return scopeToKeys;
}
