import { SourceFile } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

import { buildTranslateKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function pureFunctionExtractor(ast: SourceFile): TSExtractorResult {
  const fns = tsquery(ast, `CallExpression Identifier[text=translate]`);

  return buildTranslateKeysFromASTNodes(fns);
}
