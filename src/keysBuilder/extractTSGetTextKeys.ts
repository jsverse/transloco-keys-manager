import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractGetTextKeys(ast): { key: string; lang: string }[] {
  const [importNode] = tsquery(ast, `ImportDeclaration:has([text=@ngneat/transloco-keys-manager])`);
  if (!importNode) {
    return [];
  }
  const getTextName = getGetTextName(importNode);
  const fns = tsquery(ast, `CallExpression Identifier[text=${getTextName}]`);
  return buildKeysFromASTNodes(fns, [getTextName]);
}

function getGetTextName(importNode: ts.Node) {
  const [defaultName, alias] = tsquery(importNode, 'ImportSpecifier Identifier');
  return (alias || defaultName).getText();
}
