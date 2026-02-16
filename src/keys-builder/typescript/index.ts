import { tsquery, ScriptKind } from '@phenomnomnominal/tsquery';

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

import { inlineTemplateExtractor } from './inline-template';
import { markerExtractor } from './marker.extractor';
import { pureFunctionExtractor } from './pure-function.extractor';
import { serviceExtractor } from './service.extractor';
import { signalExtractor } from './signal.extractor';

export function extractTSKeys(config: Config): ExtractionResult {
  const serviceNames = config.serviceNames;
  return extractKeys(config, 'ts', (extractorConfig) =>
    TSExtractor(extractorConfig, serviceNames),
  );
}

const translocoImport = /@(jsverse|ngneat)\/transloco/;
const translocoKeysManagerImport = /@(jsverse|ngneat)\/transloco-keys-manager/;
function TSExtractor(
  config: ExtractorConfig,
  serviceNames?: string[],
): ScopeMap {
  const { file, scopes, defaultValue, scopeToKeys } = config;
  const content = readFile(file);
  const extractors = [];
  const hasTranslocoImport = translocoImport.test(content);
  const hasCustomService =
    serviceNames?.some((name) => content.includes(name)) ?? false;

  if (hasTranslocoImport) {
    extractors.push(
      (ast: Parameters<typeof serviceExtractor>[0]) =>
        serviceExtractor(ast, serviceNames),
      pureFunctionExtractor,
      signalExtractor,
    );
  } else if (hasCustomService) {
    extractors.push(
      (ast: Parameters<typeof serviceExtractor>[0]) =>
        serviceExtractor(ast, serviceNames),
    );
  }

  if (translocoKeysManagerImport.test(content)) {
    extractors.push(markerExtractor);
  }

  const ast = tsquery.ast(content, undefined, ScriptKind.TS);
  const baseParams = {
    scopeToKeys,
    scopes,
    defaultValue,
  };

  extractors
    .map((ex) => ex(ast))
    .flat()
    .forEach(({ key, lang, params }) => {
      const [keyWithoutScope, scopeAlias] = resolveAliasAndKeyFromService(
        key,
        lang,
        scopes,
      );
      addKey({
        scopeAlias,
        keyWithoutScope,
        params,
        ...baseParams,
      });
    });

  /** Check for dynamic markings */
  addCommentSectionKeys({
    content,
    regexFactory: regexFactoryMap.ts.comments,
    ...baseParams,
  });

  inlineTemplateExtractor(ast, config);

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
  scopes: Scopes,
): [string, string | null] {
  // It means that it's the global
  if (!scopePath) {
    return [key, null];
  }

  const scopeAlias = resolveScopeAlias({ scopePath, scopes });

  return [key, scopeAlias];
}
