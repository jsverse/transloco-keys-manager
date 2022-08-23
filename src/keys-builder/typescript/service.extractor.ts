import { tsquery } from '@phenomnomnominal/tsquery';
import { isParameter, isPropertyDeclaration, SourceFile } from 'typescript';

import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

export function serviceExtractor(ast: SourceFile): TSExtractorResult {
  const constrcutorParameterQuery = 'Constructor Parameter:has(TypeReference Identifier[name=TranslocoService])'
  const injectPropertyQuery = 'PropertyDeclaration:has(CallExpression:has(Identifier[name=TranslocoService],Identifier[name=inject]))'
  const serviceNameNodes = tsquery(
    ast,
    `${constrcutorParameterQuery},${injectPropertyQuery}`
  );

  let result = [];

  for (const serviceName of serviceNameNodes) {
    if (isParameter(serviceName) || isPropertyDeclaration(serviceName)) {
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
