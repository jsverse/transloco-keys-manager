import { readFile } from '../helpers/readFile';
import { getStructuralDirectiveBasedKeys } from './getStructuralDirectiveBasedKeys';
import { regexs } from '../regexs';
import { TEMPLATE_TYPE } from './TEMPLATE_TYPE';
import * as cheerio from 'cheerio';
import { regexIterator } from './regexIterator';
import { insertValueToKeys } from './insertValueToKeys';
import { ExtractorConfig } from '../types';

export function templateExtraction({ file, scopes, defaultValue, scopeToKeys }: ExtractorConfig) {
  const str = readFile(file);
  if(!str.includes('transloco')) return scopeToKeys;

  const hasNgTemplate = str.match(/<ng-template[^>]*transloco[^>]*>/);
  const hasStructural = str.includes('*transloco');

  let containers = [];
  if(hasNgTemplate) containers.push('ng-template[transloco]');
  if(hasStructural) containers.push('[__transloco]');

  /** Structural directive and ng-template */
  if(containers.length > 0) {
    const fileTemplate = hasStructural ? str.replace(/\*transloco/g, '__transloco') : str;
    const $ = cheerio.load(fileTemplate, { decodeEntities: false });

    containers.forEach((query) => {
      $(query).each((_, element) => {
        const containerType = !!element.attribs.__transloco ? TEMPLATE_TYPE.STRUCTURAL : TEMPLATE_TYPE.NG_TEMPLATE;
        const { scopeKeys, read, varName } = getStructuralDirectiveBasedKeys(element, containerType, $(element).html());

        scopeKeys && scopeKeys.forEach(rawKey => {
          /** The raw key may contain square braces we need to align it to '.' */
          let [key, ...inner] = rawKey
            .trim()
            .replace(/\[/g, '.')
            .replace(/'|"|\]/g, '')
            .replace(`${varName}.`, '')
            .split('.');

          /** Set the read as the first key */
          if(read) {
            inner.unshift(key);
            const [scope, ...readRest] = read.split('.');

            if(scopes.aliasToScope[scope]) {
              key = scope;
              readRest.length && inner.unshift(...readRest);
            } else {
              key = read;
            }
          }

          insertValueToKeys({ inner, scopes, scopeToKeys, key, defaultValue });
        });
      });
    });
  }

  /** Directive & pipe */
  [regexs.directive(), regexs.directiveTernary(), regexs.pipe()].forEach(rgx => {
    scopeToKeys = regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue });
  });

  return scopeToKeys;
}
