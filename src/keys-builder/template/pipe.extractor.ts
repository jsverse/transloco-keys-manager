import { AST, ASTWithSource, TmplAstNode } from '@angular/compiler';

import { ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import {
  isBindingPipe,
  isBoundText,
  isConditionalExpression,
  isElement,
  isInterpolation,
  isLiteralExpression,
  isLiteralMap,
  isTemplate,
  parseTemplate,
} from './utils';

export function pipeExtractor(config: TemplateExtractorConfig) {
  const ast = parseTemplate(config);
  traverse(ast.nodes, config);
}

function traverse(nodes: TmplAstNode[], config: ExtractorConfig) {
  for (const node of nodes) {
    let astTrees: AST[] = [];

    if (isElement(node) || isTemplate(node)) {
      astTrees = node.inputs.map((input) => (input.value as ASTWithSource).ast);
      traverse(node.children, config);
    } else if (isBoundText(node)) {
      astTrees = [(node.value as ASTWithSource).ast];
    }

    for (const ast of astTrees) {
      addKeysFromAst(getPipeValuesFromAst(ast), config);
    }
  }
}

function isTranslocoPipe(ast: any) {
  const isPipeChaining = isBindingPipe(ast.exp);
  const isTransloco =
    ast.name === 'transloco' &&
    (isPipeChaining ||
      isLiteralExpression(ast.exp) ||
      isConditionalExpression(ast.exp));

  return isTransloco || (isPipeChaining && isTranslocoPipe(ast.exp));
}

function getPipeValuesFromAst(ast: AST): AST[] {
  let exp = [];
  if (isBindingPipe(ast) && isTranslocoPipe(ast)) {
    if (isLiteralExpression(ast.exp)) {
      return [ast.exp];
    } else if (isConditionalExpression(ast.exp)) {
      return [ast.exp.trueExp, ast.exp.falseExp];
    } else {
      let pipe = ast;
      while (isBindingPipe(pipe.exp)) {
        pipe = pipe.exp;
      }

      return [pipe.exp];
    }
  } else if (isBindingPipe(ast)) {
    exp = [...ast.args, ast.exp];
  } else if (isLiteralMap(ast)) {
    exp = ast.values;
  } else if (isInterpolation(ast)) {
    exp = ast.expressions;
  } else if (isConditionalExpression(ast)) {
    exp = [ast.trueExp, ast.falseExp];
  }

  return exp.map(getPipeValuesFromAst).flat();
}

function addKeysFromAst(expressions: AST[], config: ExtractorConfig): void {
  for (const exp of expressions) {
    if (isConditionalExpression(exp)) {
      addKeysFromAst([exp.trueExp, exp.falseExp], config);
    } else if (isLiteralExpression(exp)) {
      const [key, scopeAlias] = resolveAliasAndKey(exp.value, config.scopes);
      addKey({
        ...config,
        keyWithoutScope: key,
        scopeAlias,
      });
    }
  }
}
