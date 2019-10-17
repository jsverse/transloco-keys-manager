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

  const modulesMatch = `${process.cwd()}/${input}/**/*.module.ts`;
  const configModule = glob.sync(modulesMatch).find((module) => readFile(module).includes('TRANSLOCO_CONFIG'));

  if(configModule) {
    const scopeMapping = /scopeMapping[\s\r\t\n]*:[\s\r\t\n]*(?<scopes>{[^}]*})/.exec(readFile(configModule));
    if(scopeMapping) {
      scopeMap = parse(scopeMapping.groups.scopes);
    }
  }

  const tsFiles = glob.sync(`${process.cwd()}/${input}/**/*.ts`);
  const scopeProviderRegex = /provide:\s*TRANSLOCO_SCOPE\s*,\s*useValue:(?=\s*{)\s*(?<value>{[^}]*})/;

  for(const file of tsFiles) {
    const content = readFile(file);
    const match = scopeProviderRegex.exec(content);
    if(!match) continue;
    const { scope, alias } = parse(match.groups.value);
    scopeMap[scope] = alias;
  }

  const aliasMap = Object.keys(scopeMap).reduce((acc, key) => {
    const mappedScope = toCamelCase(scopeMap[key]);
    acc[mappedScope] = key;

    return acc;
  }, {});

  return { aliasMap, scopeMap };
}
