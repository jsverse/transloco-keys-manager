import {
  isArrayLiteralExpression,
  isBinaryExpression,
  isCallExpression,
  isIdentifier,
  isNoSubstitutionTemplateLiteral,
  isPropertyAccessExpression,
  isStringLiteral,
  Node,
  NoSubstitutionTemplateLiteral,
  StringLiteral,
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

      const [keyNode, _, langNode] = node.parent.arguments;
      let lang: string;
      let keys: string[] = [];

      if (isStringNode(langNode)) {
        lang = langNode.text;
      }

      if (isStringNode(keyNode)) {
        keys = [keyNode.text];
      } else if (isArrayLiteralExpression(keyNode)) {
        keys = keyNode.elements.filter(isStringNode).map((node) => node.text);
      } else if (isBinaryExpression(keyNode)) {
        keys = [eval(keyNode.getText())];
      }

      for (const key of keys) {
        const data = lang ? { lang, key } : { key };
        result.push(data);
      }
    }
  }

  return result;
}

function isStringNode(
  node: Node
): node is StringLiteral | NoSubstitutionTemplateLiteral {
  return (
    node && (isStringLiteral(node) || isNoSubstitutionTemplateLiteral(node))
  );
}
