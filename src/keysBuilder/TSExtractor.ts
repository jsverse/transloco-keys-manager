import { tsquery } from '@phenomnomnominal/tsquery';
import { readFile } from '../helpers/readFile';
import { regexs } from '../regexs';
import { ExtractorConfig, ScopeMap, Scopes } from '../types';
import { addKey } from './addKey';
import { extractCommentsValues } from './commentsSectionExtractor';
import { extractMarkerKeys } from './extractTSMarkerKeys';
import { extractPureKeys } from './extractTSPureKeys';
import { extractServiceKeys } from './extractTsServiceKeys';
import { resolveScopeAlias } from './resolveScopeAlias';

export function TSExtractor({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig): ScopeMap {
  const content = readFile(file);
  const extractors = [];
  if (content.includes('@ngneat/transloco')) {
    extractors.push(extractServiceKeys, extractPureKeys);
  }
  if (content.includes('@ngneat/transloco-keys-manager/marker') || content.includes('@ngneat/transloco-keys-manager')) {
    extractors.push(extractMarkerKeys);
  }
  if (extractors.length === 0) {
    return scopeToKeys;
  }

  const ast = tsquery.ast(content);
  const baseParams = {
    scopeToKeys,
    scopes,
    defaultValue
  };
  extractors
    .map(ex => ex(ast))
    .flat()
    .forEach(({ key, lang }) => {
      const [keyWithoutScope, scopeAlias] = resolveAliasAndKeyFromService(key, lang, scopes);
      addKey({
        scopeAlias,
        keyWithoutScope,
        ...baseParams
      });
    });

  /** Check for dynamic markings */
  extractCommentsValues({
    content,
    regex: regexs.tsCommentsSection,
    ...baseParams
  });

  return scopeToKeys;
}

/**
 *
 * It can be one of the following:
 *
 * translate('2', {}, 'some/nested');
 * translate('3', {}, 'some/nested/en');
 * translate('globalKey');
 *
 */
function resolveAliasAndKeyFromService(key: string, scopePath: string, scopes: Scopes): [string, string] {
  // It means that it's the global
  if (!scopePath) {
    return [key, null];
  }

  const scopeAlias = resolveScopeAlias({ scopePath, scopes });
  return [key, scopeAlias];
}
