import { tsquery } from '@phenomnomnominal/tsquery';
import {
  StringLiteral,
  ObjectLiteralExpression,
  PropertyAssignment,
  NodeArray,
  Node,
} from 'typescript';

import { addScope, hasScope } from '../keys-builder/utils/scope.utils';
import { Scopes } from '../types';

import { coerceArray } from './collection.utils';
import { readFile } from './file.utils';
import { toCamelCase } from './string.utils';
import { normalizedGlob } from './normalize-glob-path';

type Scope = string;
type Alias = string;

interface ScopeDef {
  scope?: Scope;
  alias?: Alias;
}

interface QueryDef {
  query: string;
  resolver: (node: Node[]) => ScopeDef;
}

const tokenProviderQuery = `ObjectLiteralExpression:has(PropertyAssignment > Identifier[name=TRANSLOCO_SCOPE]) > PropertyAssignment > Identifier[name=/useValue|useFactory/]`;
const functionProviderQuery = `CallExpression > Identifier[name=provideTranslocoScope]`;

const stringQueryDef: QueryDef = {
  query: `StringLiteral`,
  resolver: ([node]) => ({ scope: (node as StringLiteral).text }),
};

const objectQueryDef: QueryDef = {
  query: 'ObjectLiteralExpression:has(Identifier[name=scope])',
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

// Order is important, we check is is object first, then string
const scopeValueQueries: QueryDef[] = [objectQueryDef, stringQueryDef];

type Options = { input?: string[]; files?: string[] };

const translocoProvider = /(TRANSLOCO_SCOPE|provideTranslocoScope)/;

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

    if (!translocoProvider.test(content)) continue;

    let result: ScopeDef[] = [];

    const ast = tsquery.ast(content);

    // :has(> child) is not supported ... So we need to use a workaround, select child and make second query for parent
    const tokenAndProviderNodes = tsquery(
      ast,
      `${tokenProviderQuery}, ${functionProviderQuery}`,
    );

    for (const node of tokenAndProviderNodes) {
      // Order is important, we check is is object first, then string
      for (const { query, resolver } of scopeValueQueries) {
        const nodes = tsquery(node.parent, query);
        if (nodes.length > 0) {
          result.push(resolver(nodes));
          break;
        }
      }
    }

    for (let { scope, alias } of result) {
      if (scope && !hasScope(scope)) {
        alias ??= toCamelCase(scope);
        addScope(scope, alias);
        aliasToScope[alias] = scope;
      }
    }
  }

  return aliasToScope;
}
