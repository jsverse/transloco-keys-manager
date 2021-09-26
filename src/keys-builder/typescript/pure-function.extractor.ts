import { tsquery } from '@phenomnomnominal/tsquery';

import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function pureFunctionExtractor(ast): TSExtractorResult {
  const fns = tsquery(ast, `CallExpression Identifier[text=translate]`);

  return buildKeysFromASTNodes(fns);
}
