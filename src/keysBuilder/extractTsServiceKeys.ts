import { tsquery } from '@phenomnomnominal/tsquery';
import { buildKeysFromASTNodes } from './buildKeysFromASTNodes';
import { isParameter } from 'typescript';

export function extractServiceKeys(ast): { key: string; lang: string }[] {
  const serviceNameNodes = tsquery(ast, `Constructor Parameter:has(TypeReference Identifier[name=TranslocoService])`);

  let result = [];

  for (const serviceName of serviceNameNodes) {
    if (isParameter(serviceName)) {
      const propName = serviceName.name.getText();
      const methodNodes = tsquery(ast, `PropertyAccessExpression:has([name=${propName}])`);

      result = result.concat(buildKeysFromASTNodes(methodNodes, ['translate', 'selectTranslate']));
    }
  }

  return result;
}
