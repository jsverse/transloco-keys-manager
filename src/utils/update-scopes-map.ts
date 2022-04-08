import {
  StringLiteral,
  ObjectLiteralExpression,
  PropertyAssignment,
  NodeArray,
  ArrayLiteralExpression,
  Node,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as glob from 'glob';

import { addScope, hasScope } from '../keys-builder/utils/scope.utils';
import { Scopes } from '../types';

import { coerceArray } from './collection.utils';
import { readFile } from './file.utils';
import { toCamelCase } from './string.utils';

interface ScopeDef {
  scope?: string;
  alias?: string;
}

interface QueryDef<TSNode extends Node = Node> {
  query: string;
  resolver: (node: TSNode[]) => ScopeDef | ScopeDef[];
}

const baseQuery = `ObjectLiteralExpression:has(PropertyAssignment > Identifier[name=TRANSLOCO_SCOPE]) PropertyAssignment:has(Identifier[name=/useValue|useFactory/])`;
const stringQueryDef: QueryDef<StringLiteral> = {
  query: `StringLiteral`,
  resolver: ([node]) => ({ scope: node.text }),
};
const objectQueryDef: QueryDef<ObjectLiteralExpression> = {
  query: 'ObjectLiteralExpression',
  resolver: ([node]) => {
    let result: ScopeDef = {};

    for (const prop of node.properties as NodeArray<PropertyAssignment>) {
      if (prop.initializer) {
        const key = prop.name.getText();
        if (key === 'scope' || key === 'alias') {
          result[key] = prop.initializer.getText().replace(/['"]/g, '');
        }
      }
    }

    return result;
  },
};
const arrayQueryDef: QueryDef<StringLiteral> = {
  query: 'ArrayLiteralExpression > StringLiteral',
  resolver: (nodes) => nodes.map((node) => ({ scope: node.text })),
};
const scopeValueQueries: QueryDef[] = [
  stringQueryDef,
  objectQueryDef,
  arrayQueryDef,
];

export function updateScopesMap({
  input,
  files,
}: {
  input?: string[];
  files?: string[];
}): Scopes['aliasToScope'] {
  const tsFiles =
    files || input.map((path) => glob.sync(`${path}/**/*.ts`)).flat();
  // Return only the new scopes (for the plugin)
  const aliasToScope = {};

  for (const file of tsFiles) {
    const content = readFile(file);

    if (!content.includes('TRANSLOCO_SCOPE')) continue;

    let result: ScopeDef | ScopeDef[];

    const ast = tsquery.ast(content);

    for (const { query, resolver } of scopeValueQueries) {
      const nodes = tsquery(ast, `${baseQuery} > ${query}`);
      if (nodes.length > 0) {
        result = resolver(nodes);
        break;
      }
    }

    for (let { scope, alias } of coerceArray(result)) {
      if (scope && hasScope(scope) === false) {
        if (!alias) {
          alias = toCamelCase(scope);
        }
        addScope(scope, alias);
        aliasToScope[alias] = scope;
      }
    }
  }

  return aliasToScope;
}
