import { SourceFile } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function markerExtractor(ast: SourceFile): TSExtractorResult {
  // workaround from https://github.com/estools/esquery/issues/68
  const [importNode] = tsquery(
    ast,
    `ImportDeclaration:has([text=/^@ngneat\\x2Ftransloco-keys-manager/])`,
  );
  if (!importNode) {
    return [];
  }
  const markerName = getMarkerName(importNode);
  const fns = tsquery(ast, `CallExpression Identifier[text=${markerName}]`);

  return buildKeysFromASTNodes(fns, [markerName]);
}

function getMarkerName(importNode: ts.Node) {
  const [defaultName, alias] = tsquery(
    importNode,
    'ImportSpecifier Identifier',
  );
  return (alias || defaultName).getText();
}
