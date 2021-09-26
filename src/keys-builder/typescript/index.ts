import { tsquery } from '@phenomnomnominal/tsquery';

import {
  Config,
  ExtractionResult,
  ExtractorConfig,
  ScopeMap,
  Scopes,
} from '../../types';
import { readFile } from '../../utils/file.utils';
import { regexFactoryMap } from '../../utils/regexs.utils';
import { addCommentSectionKeys } from '../add-comment-section-keys';
import { addKey } from '../add-key';
import { extractKeys } from '../utils/extract-keys';
import { resolveScopeAlias } from '../utils/resolvers.utils';

import { markerExtractor } from './marker.extractor';
import { pureFunctionExtractor } from './pure-function.extractor';
import { serviceExtractor } from './service.extractor';

export function extractTSKeys(config: Config): ExtractionResult {
  return extractKeys(config, 'ts', TSExtractor);
}

function TSExtractor({
  file,
  scopes,
  defaultValue,
  scopeToKeys,
}: ExtractorConfig): ScopeMap {
  const content = readFile(file);
  const extractors = [];

  if (content.includes('@ngneat/transloco')) {
    extractors.push(serviceExtractor, pureFunctionExtractor);
  }

  if (content.includes('@ngneat/transloco-keys-manager')) {
    extractors.push(markerExtractor);
  }

  if (extractors.length === 0) {
    return scopeToKeys;
  }

  const ast = tsquery.ast(content);
  const baseParams = {
    scopeToKeys,
    scopes,
    defaultValue,
  };
  extractors
    .map((ex) => ex(ast))
    .flat()
    .forEach(({ key, lang }) => {
      const [keyWithoutScope, scopeAlias] = resolveAliasAndKeyFromService(
        key,
        lang,
        scopes
      );
      addKey({
        scopeAlias,
        keyWithoutScope,
        ...baseParams,
      });
    });

  /** Check for dynamic markings */
  addCommentSectionKeys({
    content,
    regexFactory: regexFactoryMap.ts.comments,
    ...baseParams,
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
function resolveAliasAndKeyFromService(
  key: string,
  scopePath: string,
  scopes: Scopes
): [string, string] {
  // It means that it's the global
  if (!scopePath) {
    return [key, null];
  }

  const scopeAlias = resolveScopeAlias({ scopePath, scopes });

  return [key, scopeAlias];
}
