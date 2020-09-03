import { tsquery } from '@phenomnomnominal/tsquery';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractGetTextMarkerKeys(ast): { key: string; lang: string }[] {
  const fns = tsquery(ast, `CallExpression Identifier[text=getText]`);

  return buildKeysFromASTNodes(fns, ['getText']);
}
