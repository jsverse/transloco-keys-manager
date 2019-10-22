import { toCamelCase } from './toCamelCase';
import { readFile } from './readFile';
import * as glob from 'glob';
import { addScope, hasScope } from '../keysBuilder/scopes';
import { Scopes } from '../types';

function parse(str: string) {
  const sanitized = str
    .trim()
    .replace(/,\s*}/g, '}')
    .split(':')
    .map(str =>
      str
        .split(',')
        .map(_str => (!_str.includes('"') ? _str.replace(/([\w-$]+)/, `"$1"`) : _str))
        .join(',')
    )
    .join(':');

  return JSON.parse(sanitized);
}

export function updateScopesMap({ input, files }: { input?: string, files?: string[] }): Scopes['aliasToScope'] {
  const tsFiles = files || glob.sync(`${process.cwd()}/${input}/**/*.ts`);
  const translocoScopeRegex = /provide:\s*TRANSLOCO_SCOPE\s*,\s*useValue:\s*(?<value>[^}]*)}/;
  // Return only the new scopes (for the plugin)
  const aliasToScope = {};

  for(const file of tsFiles) {
    const content = readFile(file);
    const match = translocoScopeRegex.exec(content);
    if(!match) continue;

    // Remove line breaks and white space
    const scopeVal = match.groups.value
      .trim()
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/'|"|`/g, '');

    const { scope, alias } = scopeVal.includes('{')
      ? parse(`${scopeVal}}`)
      : {
        scope: scopeVal,
        alias: toCamelCase(scopeVal)
      };

    if(hasScope(scope) === false) {
      addScope(scope, alias);
      aliasToScope[alias] = scope;
    }
  }

  return aliasToScope;
}
