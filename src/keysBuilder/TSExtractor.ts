import { readFile } from '../helpers/readFile';
import { regexs } from '../regexs';
import { ExtractorConfig, ScopeMap, Scopes } from '../types';
import { resolveScopeAlias } from './resolveScopeAlias';
import { addKey } from './addKey';
import { extractCommentsValues } from './commentsSectionExtractor';
import { tsquery } from '@phenomnomnominal/tsquery';
import { extractPureKeys } from './extractTSPureKeys';
import { extractServiceKeys } from './extractTsServiceKeys';
import { extractGetTextMarkerKeys } from './extractTSGetTextMarkerKeys';

export function TSExtractor({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig): ScopeMap {
  const content = readFile(file);
  const extractTranslocoKeys = content.includes('@ngneat/transloco');
  const extractTranslocoKeysManagerKeys = content.includes('@ngneat/transloco-keys-manager');
  if (!extractTranslocoKeys && !extractTranslocoKeysManagerKeys) return scopeToKeys;

  const ast = tsquery.ast(content);

  const serviceCalls = extractTranslocoKeys ? extractServiceKeys(ast) : [];
  const pureCalls = extractTranslocoKeys ? extractPureKeys(ast) : [];
  const pureGetTextMarkerCalls = extractTranslocoKeysManagerKeys ? extractGetTextMarkerKeys(ast) : [];
  const baseParams = {
    scopeToKeys,
    scopes,
    defaultValue
  };
  serviceCalls.concat(pureCalls, pureGetTextMarkerCalls).forEach(({ key, lang }) => {
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
