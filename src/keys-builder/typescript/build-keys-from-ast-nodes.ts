import {
  isCallExpression,
  isNoSubstitutionTemplateLiteral,
  isStringLiteral,
  isIdentifier,
  isPropertyAccessExpression,
  Node,
} from 'typescript';

import { TSExtractorResult } from './types';

export function buildKeysFromASTNodes(
  nodes: Node[],
  allowedMethods = ['translate', 'selectTranslate']
): TSExtractorResult {
  const result = [];

  for (let node of nodes) {
    if (isCallExpression(node.parent)) {
      const method = node.parent.expression;
      let methodName = '';
      if (isIdentifier(method)) {
        methodName = method.text;
      } else if (isPropertyAccessExpression(method)) {
        methodName = method.name.text;
      }
      if (allowedMethods.includes(methodName) === false) {
        continue;
      }
      const data = {};

      const [key, _, lang] = node.parent.arguments;
      if (isStringLiteral(key) || isNoSubstitutionTemplateLiteral(key)) {
        data['key'] = key.text;
      }

      if (!data['key']) continue;

      if (
        lang &&
        (isStringLiteral(lang) || isNoSubstitutionTemplateLiteral(lang))
      ) {
        data['lang'] = lang.text;
      }

      result.push(data);
    }
  }

  return result;
}
