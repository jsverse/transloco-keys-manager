import {
  isArrayLiteralExpression,
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
  allowedMethods = ['translate', 'selectTranslate'],
  isMarker = false
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

      let keyNode;
      let _;
      let langNode;
      let defaultValueNode;
      
      if (isMarker) {
        [keyNode, defaultValueNode] = node.parent.arguments;
      } else {
        [keyNode, _, langNode] = node.parent.arguments;
      }

      let lang: string;
      let keys: string[] = [];
      let defaultValue: string;

      if (isStringNode(langNode)) {
        lang = langNode.text;
      }

      if (isStringNode(keyNode)) {
        keys = [keyNode.text];
      } else if (isArrayLiteralExpression(keyNode)) {
        keys = keyNode.elements.filter(isStringNode).map((node) => node.text);
      }
      
      if (isStringNode(defaultValueNode)) {
        defaultValue = defaultValueNode.text;
      }

      for (const key of keys) {
        const data = {
          key: key ?? null, 
          lang: lang ?? null,
          defaultLanguageValue: defaultValue ?? null
        };
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
