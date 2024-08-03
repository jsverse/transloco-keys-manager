import {
  AST,
  ASTWithSource,
  BindingPipe,
  LiteralMap,
  LiteralPrimitive,
  TmplAstNode,
} from '@angular/compiler';

import { ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import {
  isBinaryExpression,
  isBindingPipe,
  isBoundText,
  isConditionalExpression,
  isElement,
  isInterpolation,
  isLiteralExpression,
  isLiteralMap,
  isCall,
  isPropertyRead,
  isTemplate,
  parseTemplate,
  isBlockNode,
  resolveBlockChildNodes,
} from './utils';
import { notNil } from '../../utils/validators.utils';

export function pipeExtractor(config: TemplateExtractorConfig) {
  const ast = parseTemplate(config);
  traverse(ast.nodes, config);
}

function traverse(nodes: TmplAstNode[], config: ExtractorConfig) {
  for (const node of nodes) {
    if (isBlockNode(node)) {
      traverse(resolveBlockChildNodes(node), config);
      continue;
    }

    let astTrees: AST[] = [];

    if (isElement(node) || isTemplate(node)) {
      astTrees = node.inputs.map((input) => (input.value as ASTWithSource).ast);
      traverse(node.children, config);
    } else if (isBoundText(node)) {
      astTrees = [(node.value as ASTWithSource).ast];
    }

    for (const ast of astTrees) {
      const pipes = getTranslocoPipeAst(ast) as BindingPipe[];
      const keysWithParams = pipes
        .map((p) => resolveKeyAndParam(p))
        .flat()
        .filter(notNil);
      addKeysFromAst(keysWithParams, config);
    }
  }
}

function isTranslocoPipe(ast: any): boolean {
  const isPipeChaining = isBindingPipe(ast.exp);
  const isTransloco =
    ast.name === 'transloco' &&
    (isPipeChaining ||
      isLiteralExpression(ast.exp) ||
      isConditionalExpression(ast.exp));

  return isTransloco || (isPipeChaining && isTranslocoPipe(ast.exp));
}

function getTranslocoPipeAst(ast: AST): AST[] {
  let exp = [];
  if (isBindingPipe(ast) && isTranslocoPipe(ast)) {
    return [ast];
  } else if (isBindingPipe(ast)) {
    exp = [...ast.args, ast.exp];
  } else if (isLiteralMap(ast)) {
    exp = ast.values;
  } else if (isInterpolation(ast)) {
    exp = ast.expressions;
  } else if (isConditionalExpression(ast)) {
    exp = [ast.condition, ast.trueExp, ast.falseExp];
  } else if (isBinaryExpression(ast)) {
    exp = [ast.left, ast.right];
  } else if (isCall(ast)) {
    exp = [...ast.args, ast.receiver];
  } else if (isPropertyRead(ast)) {
    exp = [ast.receiver];
  }

  return exp.map(getTranslocoPipeAst).flat();
}

interface KeyWithParam {
  keyNode: LiteralPrimitive;
  paramsNode: AST;
}

function resolveKeyAndParam(
  pipe: BindingPipe,
  paramsNode?: AST,
): KeyWithParam | KeyWithParam[] | null {
  const resolvedParams: AST = paramsNode ?? pipe.args[0];
  if (isConditionalExpression(pipe.exp)) {
    return [pipe.exp.trueExp, pipe.exp.falseExp]
      .filter(isLiteralExpression)
      .map((keyNode) => {
        return {
          keyNode,
          paramsNode: resolvedParams,
        };
      });
  } else if (isLiteralExpression(pipe.exp)) {
    return {
      keyNode: pipe.exp,
      paramsNode: resolvedParams,
    };
  } else if (isBindingPipe(pipe.exp)) {
    let nestedPipe = pipe;
    while (isBindingPipe(nestedPipe.exp)) {
      nestedPipe = nestedPipe.exp;
    }

    return resolveKeyAndParam(nestedPipe, resolvedParams);
  }

  return null;
}

function addKeysFromAst(keys: KeyWithParam[], config: ExtractorConfig): void {
  for (const { keyNode, paramsNode } of keys) {
    const [key, scopeAlias] = resolveAliasAndKey(keyNode.value, config.scopes);
    const params = isLiteralMap(paramsNode)
      ? paramsNode.keys.map((k) => k.key)
      : [];
    addKey({
      ...config,
      keyWithoutScope: key,
      scopeAlias,
      params,
    });
  }
}
