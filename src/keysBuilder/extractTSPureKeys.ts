import { tsquery } from '@phenomnomnominal/tsquery';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';

export function extractPureKeys(ast, identifier = 'translate'): { key: string; lang: string }[] {
  const fns = tsquery(ast, `CallExpression Identifier[text=${identifier}]`);

  return buildKeysFromASTNodes(fns, identifier);
}
