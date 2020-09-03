import { tsquery } from '@phenomnomnominal/tsquery';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractGetTextMarkerKeys(ast): { key: string; lang: string }[] {
  const importNodes = tsquery(ast, `ImportDeclaration:has([text=@ngneat/transloco-keys-manager])`);
  if (importNodes[0]) {
    const alias = getAlias(importNodes[0]);
    const fns = tsquery(importNodes[0].parent, `CallExpression Identifier[text=${alias || 'getText'}]`);
    return buildKeysFromASTNodes(fns, [alias || 'getText']);
  }
  return [];
}

function getAlias(nodes: any) {
  const importMethodNodes = tsquery(nodes, '[name=getText]');
  const [method, token, alias] =
    (importMethodNodes && importMethodNodes[0] && importMethodNodes[0].parent.getChildren()) || [];
  if (
    method &&
    method.kind === 75 &&
    method.getText() === 'getText' &&
    token &&
    token.kind === 122 &&
    alias &&
    alias.kind === 75
  ) {
    return alias.getText();
  }
  return null;
}
