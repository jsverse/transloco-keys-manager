import { toCamelCase } from './toCamelCase';
import { readFile } from './readFile';
import * as glob from 'glob';
import { addScope, hasScope } from '../keysBuilder/scopes';
import { Scopes } from '../types';
import { tsquery } from '@phenomnomnominal/tsquery';

const base = `ObjectLiteralExpression:has(PropertyAssignment > Identifier[name=TRANSLOCO_SCOPE]) PropertyAssignment:has(Identifier[name=/useValue|useFactory/])`;
const useStringQuery = `${base} > StringLiteral`;
const useObjectQuery = `${base} > ObjectLiteralExpression`;

export function updateScopesMap({ input, files }: { input?: string; files?: string[] }): Scopes['aliasToScope'] {
  const tsFiles = files || glob.sync(`${process.cwd()}/${input}/**/*.ts`);
  // Return only the new scopes (for the plugin)
  const aliasToScope = {};

  for (const file of tsFiles) {
    const content = readFile(file);

    if (content.includes('TRANSLOCO_SCOPE') === false) continue;

    let result: { scope?: string; alias?: string } = {};

    const ast = tsquery.ast(content);
    const scopeByString: any = tsquery(ast, useStringQuery);
    if (scopeByString.length === 0) {
      const scopeByObject: any = tsquery(ast, useObjectQuery);
      for (const identifier of scopeByObject) {
        for (const prop of identifier.properties) {
          if (prop.initializer) {
            if (prop.name.text === 'scope' || prop.name.text === 'alias') {
              result[prop.name.text] = prop.initializer.text;
            }
          }
        }
      }
    } else {
      result.scope = scopeByString[0].text;
    }

    let { scope, alias } = result;

    if (scope && hasScope(scope) === false) {
      if (!alias) {
        alias = toCamelCase(scope);
      }
      addScope(scope, alias);
      aliasToScope[alias] = scope;
    }
  }

  return aliasToScope;
}
