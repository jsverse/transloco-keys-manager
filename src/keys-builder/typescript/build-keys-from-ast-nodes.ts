import { Node, StringLiteral, NoSubstitutionTemplateLiteral, CallExpression } from 'typescript';
import ts from 'typescript';

import { TSExtractorResult } from './types';

/**
 * It can be one of the following:
 *
 * translate('2', {}, 'some/nested');
 * translate('3', {}, 'some/nested/en');
 * translate(['2', '3'], {}, 'some/nested/en');
 * translate('globalKey');
 *
 *
 * selectTranslate('2', {}, 'some/nested');
 * selectTranslate('3', {}, 'some/nested/en');
 * selectTranslate(['2', '3'], {}, 'some/nested/en');
 * selectTranslate('globalKey');
 */
export function buildTranslateKeysFromASTNodes(nodes: Node[]): TSExtractorResult {
  const result: TSExtractorResult = [];

  for (let node of nodes) {
    if (!ts.isCallExpression(node.parent)) {
      continue;
    }

    const methodName = getMethodName(node.parent);
    if (!['translate', 'selectTranslate'].includes(methodName)) {
      continue;
    }

    const [keyNode, _, langNode] = node.parent.arguments;
    let scope = isStringNode(langNode) ? langNode.text : '';
    let keys: string[] = [];

    if (isStringNode(keyNode)) {
      keys = [keyNode.text];
    } else if (ts.isArrayLiteralExpression(keyNode)) {
      keys = keyNode.elements.filter(isStringNode).map((node) => node.text);
    }

    for (const key of keys) {
      result.push({ key, scope });
    }
  }

  return result;
}

/**
 * It can be one of the following:
 *
 * marker('globalKey');
 * marker('globalKey', 'some/nested/en');
 *
 * alias('globalKey');
 * alias('globalKey', 'some/nested/en');
 */
export function buildMarkerKeysFromASTNodes(nodes: Node[], markerName: string): TSExtractorResult {
  const result: TSExtractorResult = [];

  for (let node of nodes) {
    if (!ts.isCallExpression(node.parent)) {
      continue;
    }

    if (markerName !== getMethodName(node.parent)) {
      continue;
    }

    const [keyNode, scopeNode] = node.parent.arguments;
    result.push({
      key: isStringNode(keyNode) ? keyNode.text : '',
      scope: isStringNode(scopeNode) ? scopeNode.text : ''
    });
  }

  return result;
}

function getMethodName(node: CallExpression): string {
  const method = node.expression;

  let methodName = '';
  if (ts.isIdentifier(method)) {
    methodName = method.text;
  } else if (ts.isPropertyAccessExpression(method)) {
    methodName = method.name.text;
  }

  return methodName;
}


function isStringNode(
  node: Node,
): node is StringLiteral | NoSubstitutionTemplateLiteral {
  return (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
  );
}
