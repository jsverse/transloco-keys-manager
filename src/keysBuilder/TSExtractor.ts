import { readFile } from '../helpers/readFile';
import { regexs } from '../regexs';
import { ExtractorConfig, ScopeMap, Scopes } from '../types';
import { resolveScopeAlias } from './resolveScopeAlias';
import { addKey } from './addKey';
import { extractCommentsValues } from './commentsSectionExtractor';
import { tsquery } from '@phenomnomnominal/tsquery';
import { extractPureKeys } from './extractTSPureKeys';
import { extractServiceKeys } from './extractTsServiceKeys';

export function TSExtractor({ file, scopes, defaultValue, scopeToKeys, getTextMarker }: ExtractorConfig): ScopeMap {
  const content = readFile(file);
  if (
    !content.includes('@ngneat/transloco') &&
    !(
      // todo: need create dummy function in @ngneat/transloco-utils
      (content.includes('ngx-translate-extract-marker') && content.includes(`${getTextMarker}(`))
    )
  )
    return scopeToKeys;

  const ast = tsquery.ast(content);

  const serviceCalls = extractServiceKeys(ast);
  const pureCalls = extractPureKeys(ast);
  const pureGetTextMarkerCalls = extractPureKeys(ast, getTextMarker);
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
