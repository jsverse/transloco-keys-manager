import { ScriptKind, tsquery } from '@phenomnomnominal/tsquery';
import {
  Node,
  NodeArray,
  ObjectLiteralExpression,
  PropertyAssignment,
  StringLiteral,
} from 'typescript';

import { addScope, hasScope } from '../keys-builder/utils/scope.utils';
import { Scopes } from '../types';

import { coerceArray } from './collection.utils';
import { readFile } from './file.utils';
import { toCamelCase } from './string.utils';
import { normalizedGlob } from './normalize-glob-path';

type Alias = string;
type Scope = string;

interface ScopeDef {
  scope?: Alias;
  alias?: Scope;
}

interface QueryDef {
  query: string;
  resolver: (node: Node[]) => ScopeDef | ScopeDef[];
}

// TODO add provideScope
const baseQuery = `ObjectLiteralExpression:has(PropertyAssignment > Identifier[name=TRANSLOCO_SCOPE]) PropertyAssignment:has(Identifier[name=/useValue|useFactory/])`;

const stringQueryDef: QueryDef = {
  query: `StringLiteral`,
  resolver: ([node]) => ({ scope: (node as StringLiteral).text }),
};

const objectQueryDef: QueryDef = {
  query: 'ObjectLiteralExpression',
  resolver: ([node]) => {
    let result: ScopeDef = {};

    for (const prop of (node as ObjectLiteralExpression)
      .properties as NodeArray<PropertyAssignment>) {
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

const arrayQueryDef: QueryDef = {
  query: 'ArrayLiteralExpression > StringLiteral',
  resolver: (nodes) =>
    (nodes as StringLiteral[]).map((node) => ({ scope: node.text })),
};

const scopeValueQueries: QueryDef[] = [
  stringQueryDef,
  objectQueryDef,
  arrayQueryDef,
];

type Options = { input?: string[]; files?: string[] };

export function updateScopesMap(
  options: Omit<Options, 'input'>,
): Scopes['aliasToScope'];
export function updateScopesMap(
  options: Omit<Options, 'files'>,
): Scopes['aliasToScope'];
export function updateScopesMap({
  input,
  files,
}: Options): Scopes['aliasToScope'] {
  const tsFiles =
    files || input!.map((path) => normalizedGlob(`${path}/**/*.ts`)).flat();
  // Return only the new scopes (for the plugin)
  const aliasToScope: Record<Alias, Scope> = {};

  for (const file of tsFiles) {
    const content = readFile(file);

    if (!content.includes('TRANSLOCO_SCOPE')) continue;

    let result: ScopeDef | ScopeDef[] | undefined;

    const ast = tsquery.ast(content, undefined, ScriptKind.TS);

    for (const { query, resolver } of scopeValueQueries) {
      const nodes = tsquery(ast, `${baseQuery} > ${query}`);
      if (nodes.length > 0) {
        result = resolver(nodes);
        break;
      }
    }

    for (let { scope, alias } of coerceArray(result)) {
      if (scope && !hasScope(scope)) {
        alias ??= toCamelCase(scope);
        addScope(scope, alias);
        aliasToScope[alias] = scope;
      }
    }
  }

  return aliasToScope;
}
