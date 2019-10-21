import { readFile } from '../helpers/readFile';
import { getStructuralDirectiveBasedKeys } from './getStructuralDirectiveBasedKeys';
import { regexs } from '../regexs';
import * as cheerio from 'cheerio';
import { ExtractorConfig, Scopes, TEMPLATE_TYPE } from '../types';
import { forEachKey } from './forEachKey';
import { addKey } from './addKey';
import { devlog } from '../helpers/logger';

function getNgTemplateContainers(content: string) {
  const hasNgTemplate = content.match(/<ng-template[^>]*transloco[^>]*>/);
  const hasStructural = content.includes('*transloco');

  const containers = [];
  if (hasNgTemplate) containers.push('ng-template[transloco]');
  if (hasStructural) containers.push('[__transloco]');

  return {
    containers,
    hasStructural
  };
}

export function templateExtractor({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig) {
  const content = readFile(file);
  if (!content.includes('transloco')) return scopeToKeys;

  const { containers, hasStructural } = getNgTemplateContainers(content);

  if (containers.length > 0) {
    const fileTemplate = hasStructural ? content.replace(/\*transloco/g, '__transloco') : content;
    const $ = cheerio.load(fileTemplate, { decodeEntities: false });

    for (const query of containers) {
      $(query).each((_, element) => {
        const containerType = !!element.attribs.__transloco ? TEMPLATE_TYPE.STRUCTURAL : TEMPLATE_TYPE.NG_TEMPLATE;
        const { translationKeys, read, varName } = getStructuralDirectiveBasedKeys(
          element,
          containerType,
          $(element).html()
        );

        if (Array.isArray(translationKeys)) {
          for (const currentKey of translationKeys) {
            /** The raw key may contain square braces we need to align it to '.' */
            let sanitizedKey = currentKey
              .trim()
              .replace(/\[/g, '.')
              .replace(/'|"|\]/g, '')
              .replace(`${varName}.`, '');

            const withRead = read ? `${read}.${sanitizedKey}` : sanitizedKey;

            let [translationKey, scopeAlias] = resolveAliasAndKeyFromTemplate(withRead, scopes);

            if (!scopeAlias) {
              // It means it is a global key
              translationKey = withRead;
            }

            addKey({
              defaultValue,
              scopes,
              scopeToKeys,
              keyWithoutScope: translationKey,
              scopeAlias
            });
          }
        }
      });
    }
  }

  /**
   *
   * Extract from Directives and Pipes
   *
   */
  [regexs.directive(), regexs.directiveTernary(), regexs.pipe()].forEach(regex => {
    forEachKey(content, regex, translationKey => {
      const [key, scopeAlias] = resolveAliasAndKeyFromTemplate(translationKey, scopes);
      addKey({
        defaultValue,
        scopes,
        scopeToKeys,
        keyWithoutScope: key,
        scopeAlias
      });
    });
  });

  return scopeToKeys;
}

function resolveAliasAndKeyFromTemplate(key: string, scopes: Scopes): [string, string] {
  /**
   *
   * It can be one of the following:
   *
   * {{ 'title' | transloco }}
   *
   * {{ 'scopeAlias.title' | transloco }}
   *
   */
  const [scopeAliasOrKey, ...actualKey] = key.split('.');
  const scopeAliasExists = scopes.aliasToScope.hasOwnProperty(scopeAliasOrKey);
  const translationKey = scopeAliasExists ? actualKey.join('.') : scopeAliasOrKey;

  return [translationKey, scopeAliasExists ? scopeAliasOrKey : null];
}
