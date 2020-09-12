import { tsquery } from '@phenomnomnominal/tsquery';

import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractPureKeys(ast): { key: string; lang: string }[] {
  const fns = tsquery(ast, `CallExpression Identifier[text=translate]`);

  return buildKeysFromASTNodes(fns);
}
