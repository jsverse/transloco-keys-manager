import { tsquery } from '@phenomnomnominal/tsquery';
import { SourceFile } from 'typescript';
import ts from 'typescript';

import { buildKeysFromASTNodes } from './build-keys-from-ast-nodes';
import { TSExtractorResult } from './types';

function buildInjectFunctionQuery(nodeType: string, name: string) {
  return `${nodeType}:has(CallExpression:has(Identifier[name=inject]):has(Identifier[name=${name}]))`;
}

export function serviceExtractor(
  ast: SourceFile,
  serviceNames: string[] = [],
): TSExtractorResult {
  const allNames = ['TranslocoService', ...serviceNames];
  const constructorInjections = allNames.map(
    (name) =>
      `Constructor Parameter:has(TypeReference Identifier[name=${name}])`,
  );
  const injectFunctions = allNames.flatMap((name) =>
    ['PropertyDeclaration', 'VariableDeclaration'].map((nodeType) =>
      buildInjectFunctionQuery(nodeType, name),
    ),
  );
  const serviceNameQuery = [...constructorInjections, ...injectFunctions].join(
    ',',
  );
  const serviceNameNodes = tsquery(ast, serviceNameQuery);

  let result: TSExtractorResult = [];

  for (const serviceName of serviceNameNodes) {
    if (
      ts.isParameter(serviceName) ||
      ts.isPropertyDeclaration(serviceName) ||
      ts.isVariableDeclaration(serviceName)
    ) {
      const propName = serviceName.name.getText();
      const methodNodes = tsquery(
        ast,
        `PropertyAccessExpression:has([text="${propName}"])`,
      );

      result = result.concat(buildKeysFromASTNodes(methodNodes));
    }
  }

  return result;
}
