import { toCamelCase } from './toCamelCase';
import { readFile } from './readFile';
import * as glob from 'glob';

function parse(str: string) {
  const sanitized = str.trim().replace(/,\s*}/g, '}')
    .split(":").map((str) =>
      str.split(',')
        .map((_str) => !_str.includes('"') ? _str.replace(/([\w-$]+)/, `"$1"`) : _str)
        .join(',')
    ).join(':');

  return JSON.parse(sanitized);
}

export function buildScopesMap(input: string) {
  let scopeToAlias = {};
  const tsFiles = glob.sync(`${process.cwd()}/${input}/**/*.ts`);
  const componentScopeRegex = /provide:\s*TRANSLOCO_SCOPE\s*,\s*useValue:\s*(?<value>[^}]*)}/;

  for(const file of tsFiles) {
    const content = readFile(file);
    const match = componentScopeRegex.exec(content);
    if(!match) continue;

    // remove line breaks and white space
    const scopeVal = match.groups.value
      .trim()
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/'|"|`/g, '');

    const { scope, alias } = scopeVal.includes("{") ? parse(`${scopeVal}}`) : {
      scope: scopeVal,
      alias: toCamelCase(scopeVal)
    };

    scopeToAlias[scope] = alias;
  }

  const aliasToScope = Object.keys(scopeToAlias).reduce((acc, key) => {
    const mappedScope = scopeToAlias[key];
    acc[mappedScope] = key;

    return acc;
  }, {});

  return { aliasToScope, scopeToAlias };
}
