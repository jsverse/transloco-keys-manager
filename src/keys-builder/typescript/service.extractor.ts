import { tsquery } from '@phenomnomnominal/tsquery';
import { isParameter } from 'typescript';

import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function serviceExtractor(ast): TSExtractorResult {
  const serviceNameNodes = tsquery(
    ast,
    `Constructor Parameter:has(TypeReference Identifier[name=TranslocoService])`
  );

  let result = [];

  for (const serviceName of serviceNameNodes) {
    if (isParameter(serviceName)) {
      const propName = serviceName.name.getText();
      const methodNodes = tsquery(
        ast,
        `PropertyAccessExpression:has([name=${propName}])`
      );

      result = result.concat(buildKeysFromASTNodes(methodNodes));
    }
  }

  return result;
}
