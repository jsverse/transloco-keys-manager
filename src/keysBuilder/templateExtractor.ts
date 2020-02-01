import { readFile } from '../helpers/readFile';
import { getStructuralDirectiveBasedKeys } from './getStructuralDirectiveBasedKeys';
import { regexs } from '../regexs';
import * as cheerio from 'cheerio';
import { ExtractorConfig, TEMPLATE_TYPE } from '../types';
import { forEachKey } from './forEachKey';
import { addKey } from './addKey';
import { extractCommentsValues } from './commentsSectionExtractor';
import { resolveAliasAndKey } from './resolveAliasAndKey';
import { getConfig } from '../config';

type ContainersMetadata = { containerContent: string; read: string };

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

function keepMarkingCommentsOnly(content: string) {
  const { marker } = getConfig();
  const validMarking = regexs.templateValidComment(marker);
  /* Search all comments, if they include anything but the markings remove them */
  return content.replace(regexs.templateCommentsSection(), comment => {
    return validMarking.test(comment) ? comment : '';
  });
}

function removeInnerContainers(content: string, allContainers: ContainersMetadata[]): string {
  return allContainers
    .filter(({ containerContent }) => content !== containerContent && content.includes(containerContent))
    .reduce((acc, { containerContent }) => acc.replace(containerContent, ''), content);
}

export function templateExtractor({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig) {
  let content = readFile(file);
  if (!content.includes('transloco')) return scopeToKeys;

  content = keepMarkingCommentsOnly(content);

  let templateContainers: ContainersMetadata[] = [];
  const baseParams = { defaultValue, scopes, scopeToKeys };

  const { containers, hasStructural } = getNgTemplateContainers(content);
  if (containers.length > 0) {
    const fileTemplate = hasStructural ? content.replace(/\*transloco/g, '__transloco') : content;
    const $ = cheerio.load(fileTemplate, { decodeEntities: false });

    for (const query of containers) {
      ($(query) as Cheerio).each((_, element) => {
        const containerType = !!element.attribs.__transloco ? TEMPLATE_TYPE.STRUCTURAL : TEMPLATE_TYPE.NG_TEMPLATE;
        const containerContent = $(element).html();
        const { translationKeys, read } = getStructuralDirectiveBasedKeys(element, containerType, containerContent);
        templateContainers.push({ containerContent, read });

        if (Array.isArray(translationKeys)) {
          for (const currentKey of translationKeys) {
            const withRead = read ? `${read}.${currentKey}` : currentKey;

            let [translationKey, scopeAlias] = resolveAliasAndKey(withRead, scopes);

            if (!scopeAlias) {
              // It means this is a global key
              translationKey = withRead;
            }

            addKey({
              ...baseParams,
              keyWithoutScope: translationKey,
              scopeAlias
            });
          }
        }
      });
    }
  }

  /**
   * Extract from Directives and Pipes
   */
  [regexs.directive(), regexs.directiveTernary(), regexs.pipe()].forEach(regex => {
    forEachKey(content, regex, translationKey => {
      const [key, scopeAlias] = resolveAliasAndKey(translationKey, scopes);
      addKey({
        ...baseParams,
        keyWithoutScope: key,
        scopeAlias
      });
    });
  });

  /**
   * Extract from Comments
   */
  const commentsExtractionConfig = { regex: regexs.templateCommentsSection, ...baseParams };
  /** Add the global content to the containers array */
  templateContainers.push({ containerContent: content, read: '' });
  /** Check for dynamic markings */
  templateContainers.forEach(({ containerContent, read }, index, arr) => {
    extractCommentsValues({
      read,
      content: removeInnerContainers(containerContent, arr),
      ...commentsExtractionConfig
    });
  });

  return scopeToKeys;
}
