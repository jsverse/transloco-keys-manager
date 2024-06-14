import { Node, StringLiteral, NoSubstitutionTemplateLiteral } from 'typescript';
import ts from 'typescript';

import { TSExtractorResult } from './types';

export function buildKeysFromASTNodes(
  nodes: Node[],
  allowedMethods = ['translate', 'selectTranslate'],
<<<<<<< HEAD
  isMarker = false
=======
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
): TSExtractorResult {
  const result: TSExtractorResult = [];

  for (let node of nodes) {
    if (ts.isCallExpression(node.parent)) {
      const method = node.parent.expression;
      let methodName = '';
      if (ts.isIdentifier(method)) {
        methodName = method.text;
      } else if (ts.isPropertyAccessExpression(method)) {
        methodName = method.name.text;
      }
      if (!allowedMethods.includes(methodName)) {
        continue;
      }

<<<<<<< HEAD
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
=======
      const [keyNode, _, langNode] = node.parent.arguments;
      let lang = isStringNode(langNode) ? langNode.text : '';
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
      let keys: string[] = [];
      let defaultValue: string;

      if (isStringNode(keyNode)) {
        keys = [keyNode.text];
      } else if (ts.isArrayLiteralExpression(keyNode)) {
        keys = keyNode.elements.filter(isStringNode).map((node) => node.text);
      }
      
      if (isStringNode(defaultValueNode)) {
        defaultValue = defaultValueNode.text;
      }

      for (const key of keys) {
<<<<<<< HEAD
        const data = {
          key: key ?? null, 
          lang: lang ?? null,
          defaultLanguageValue: defaultValue ?? null
        };
        result.push(data);
=======
        result.push({ key, lang });
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
      }
    }
  }

  return result;
}

function isStringNode(
  node: Node,
): node is StringLiteral | NoSubstitutionTemplateLiteral {
  return (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
  );
}
