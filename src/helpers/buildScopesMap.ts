import { toCamelCase } from './toCamelCase';
import { readFile } from './readFile';
import * as glob from 'glob';

function parse(str: string) {
  const sanitized = str.trim().replace(/'/g, '"').replace(/,\s*}/g, '}')
    .split(":").map((str) =>
      str.split(',')
        .map((_str) => !_str.includes('"') ? _str.replace(/(\w.*)/, `"$1"`) : _str)
        .join(',')
    ).join(':');

  return JSON.parse(sanitized);
}

export function buildScopesMap(input: string) {
  let scopeMap = {};
  const tsFiles = glob.sync(`${process.cwd()}/${input}/**/*.ts`);
  const componentScopeRegex = /provide:\s*TRANSLOCO_SCOPE\s*,\s*useValue:\s*(?<value>[^}]*)}/;

  for(const file of tsFiles) {
    const content = readFile(file);
    const match = componentScopeRegex.exec(content);
    if (!match) continue;
    const scopeVal = match.groups.value;
    const {scope, alias} = scopeVal.includes("{") ? parse(`${scopeVal}}`) : {
      scope: scopeVal.replace(/'|"|`/, ''),
      alias: toCamelCase(scopeVal.replace(/'|"|`/, ''))
    };
    scopeMap[scope] = alias;
  }

  const aliasMap = Object.keys(scopeMap).reduce((acc, key) => {
    const mappedScope = toCamelCase(scopeMap[key]);
    acc[mappedScope] = key;

    return acc;
  }, {});

  return { aliasMap, scopeMap };
}
