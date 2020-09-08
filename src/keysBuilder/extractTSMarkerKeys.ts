import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractMarkerKeys(ast): { key: string; lang: string }[] {
  const [importNode] =
    tsquery(ast, `ImportDeclaration:has([text=@ngneat/transloco-keys-manager/marker])`) ||
    tsquery(ast, `ImportDeclaration:has([text=@ngneat/transloco-keys-manager])`);
  if (!importNode) {
    return [];
  }
  const markerName = getMarkerName(importNode);
  const fns = tsquery(ast, `CallExpression Identifier[text=${markerName}]`);
  return buildKeysFromASTNodes(fns, [markerName]);
}

function getMarkerName(importNode: ts.Node) {
  const [defaultName, alias] = tsquery(importNode, 'ImportSpecifier Identifier');
  return (alias || defaultName).getText();
}
