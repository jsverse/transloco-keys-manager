import { SourceFile, Node } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
<<<<<<< HEAD
import * as ts from 'typescript';
=======

>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function markerExtractor(ast: SourceFile): TSExtractorResult {
  // workaround from https://github.com/estools/esquery/issues/68
  const [importNode] = tsquery(
    ast,
<<<<<<< HEAD
    `ImportDeclaration:has([text=/^@nyffels\\x2Ftransloco-keys-manager/])`
=======
    `ImportDeclaration:has([text=/^@(jsverse|ngneat)\\x2Ftransloco-keys-manager/])`,
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
  );
  if (!importNode) {
    return [];
  }
  const markerName = getMarkerName(importNode);
  const fns = tsquery(ast, `CallExpression Identifier[text=${markerName}]`);

  return buildKeysFromASTNodes(fns, [markerName], true);
}

function getMarkerName(importNode: Node) {
  const [defaultName, alias] = tsquery(
    importNode,
    'ImportSpecifier Identifier',
  );
  return (alias || defaultName).getText();
}
